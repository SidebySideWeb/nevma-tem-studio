# Backups

Weekly encrypted export of the Sanity dataset (including form submissions with personal details), uploaded to Cloudflare R2. Workflow: [`.github/workflows/backup.yml`](../.github/workflows/backup.yml). Related: [ARCHITECTURE](./ARCHITECTURE.md), [DEPLOY](./DEPLOY.md).

This repository may be **public**. Backups are never uploaded as GitHub Actions artifacts and never written into the repo or cache.

## What, when, where, retention

| Item | Detail |
| --- | --- |
| Sanity | Full dataset export (assets + drafts) → `sanity-YYYYMMDD.tar.gz.age` |
| Database | None — TEMS has no Postgres/Supabase |
| Schedule | Mondays `02:00` UTC (`cron: 0 2 * * 1`) plus manual `workflow_dispatch`. Runs **before** `retention.yml` (Monday `02:30`), which may delete old `formSubmission` documents |
| Encryption | [`age`](https://age-encryption.org/) to `AGE_RECIPIENT` (public key). Private key stays in the owner’s password manager |
| Destination | Cloudflare R2 via AWS CLI (`BACKUP_S3_ENDPOINT`) |
| Layout | `s3://$BACKUP_S3_BUCKET/$BACKUP_PREFIX/weekly/YYYY-Www/` and, on day-of-month 1–7 (first Monday of the month), also `…/monthly/YYYY-MM/` |
| Prefix | Repository variable `BACKUP_PREFIX` = `tems` |
| Retention | Newest **8** weekly folders and **12** monthly folders; older folders deleted best-effort (`\|\| true` on delete only, in case of object lock) |

## Secrets and variables

Never put values in the repo. Configure in GitHub → Settings → Secrets and variables → Actions (**Repository** secrets / variables).

| Name | Kind | Meaning |
| --- | --- | --- |
| `SANITY_AUTH_TOKEN` | secret | Sanity Viewer (or higher) token that can export the dataset |
| `SANITY_PROJECT_ID` | secret | Sanity project id |
| `SANITY_DATASET` | secret | Dataset name (usually `production`) |
| `AGE_RECIPIENT` | secret | `age` public key used to encrypt backups |
| `BACKUP_S3_BUCKET` | secret | R2 bucket name |
| `BACKUP_S3_ENDPOINT` | secret | R2 S3 API endpoint, `https://<ACCOUNT_ID>.r2.cloudflarestorage.com` |
| `BACKUP_AWS_ACCESS_KEY_ID` | secret | R2 API token access key id |
| `BACKUP_AWS_SECRET_ACCESS_KEY` | secret | R2 API token secret access key |
| `HEALTHCHECK_URL` | secret | Success ping URL (failure posts to `$HEALTHCHECK_URL/fail`) |
| `BACKUP_PREFIX` | variable | Folder prefix inside the bucket (`tems`) |

Do **not** confuse with `retention.yml` secrets (`PUBLIC_SANITY_PROJECT_ID`, `SANITY_WRITE_TOKEN`) or CI’s `SANITY_VIEWER_TOKEN`.

## Run by hand

1. GitHub → **Actions** → **Backups**.
2. **Run workflow** → choose branch (usually `main`) → Run.
3. Open the run log. Confirm Export, Upload (object size &gt; 0), and Healthcheck success.
4. In R2, confirm objects under `tems/weekly/<ISO-week>/`.

## Restore

The **age private key** lives in the owner’s password manager (never in GitHub).

```bash
# Decrypt
age -d -i backup.key -o sanity-YYYYMMDD.tar.gz sanity-YYYYMMDD.tar.gz.age

# Import into a throwaway dataset first (safer than overwriting production)
npx --yes sanity@6.22.0 dataset import sanity-YYYYMMDD.tar.gz <scratch-dataset> \
  --project <SANITY_PROJECT_ID>
```

## Restore-test checklist

Use a throwaway Sanity dataset. Never restore over production for a drill.

- [ ] Download the latest `.age` file from R2 (`tems/weekly/…`)
- [ ] Decrypt with the private key from the password manager
- [ ] Import into a scratch dataset; compare document counts and open a few images
- [ ] Delete the scratch dataset when finished
- [ ] Record the test date below

**Last restore test:** _not yet run — fill in after the first drill (YYYY-MM-DD)._
