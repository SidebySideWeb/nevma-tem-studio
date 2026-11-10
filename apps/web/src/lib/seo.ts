/** Page meta, Open Graph, Twitter, LocalBusiness JSON-LD (AC-12). */
import { createImageUrlBuilder } from '@sanity/image-url';
import type { SanityImage, Seo, Settings } from './types';

const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID;
const dataset = import.meta.env.PUBLIC_SANITY_DATASET || 'production';
const builder = createImageUrlBuilder({ projectId, dataset });

export type PageSeo = {
  title: string;
  description: string;
  canonical: string;
  image: string;
  noindex: boolean;
};

function siteOrigin(): string {
  const raw =
    import.meta.env.PUBLIC_SITE_URL ||
    process.env.PUBLIC_SITE_URL ||
    'http://localhost:4321';
  return raw.replace(/\/$/, '');
}

/** Canonical = origin + path, no trailing slash (home = origin). */
export function canonicalUrl(path: string): string {
  const origin = siteOrigin();
  const clean = (path || '/').split('?')[0].split('#')[0] || '/';
  if (clean === '/' || clean === '') return origin;
  return origin + (clean.startsWith('/') ? clean : `/${clean}`).replace(/\/$/, '');
}

export function isProduction(): boolean {
  const env = import.meta.env.VERCEL_ENV || process.env.VERCEL_ENV;
  return env === 'production';
}

/** Share image at 1200×630 from Sanity CDN. */
export function shareImageUrl(image: SanityImage | null | undefined): string {
  if (!image?.asset) return '';
  return builder.image(image).width(1200).height(630).fit('crop').auto('format').quality(80).url();
}

export function buildPageSeo(opts: {
  path: string;
  /** Used when `seo.title` is empty: `{pageTitle}{seoTitleSuffix}`. */
  pageTitle: string;
  seo?: Seo | null;
  settings: Settings;
  /** Prefer page seo.image, else this (usually the hero), else settings.seoImage. */
  heroImage?: SanityImage | null;
  forceNoindex?: boolean;
}): PageSeo {
  const { path, pageTitle, seo, settings, heroImage, forceNoindex = false } = opts;
  const suffix = settings.seoTitleSuffix ?? '';
  const title = (seo?.title?.trim() || `${pageTitle}${suffix}`).trim();
  const description = (
    seo?.description?.trim() ||
    [pageTitle, settings.seoDescription?.trim()].filter(Boolean).join(' — ') ||
    settings.studioName
  ).trim();

  const image =
    shareImageUrl(seo?.image) ||
    shareImageUrl(heroImage) ||
    shareImageUrl(settings.seoImage) ||
    '';

  const noindex =
    forceNoindex ||
    Boolean(seo?.noindex) ||
    path.replace(/\/$/, '') === '/enquire/thanks' ||
    !isProduction();

  return {
    title,
    description,
    canonical: canonicalUrl(path),
    image,
    noindex,
  };
}

/** LocalBusiness for Home and Contact (PAGES / AC-12). */
export function localBusinessJsonLd(settings: Settings, imageUrl?: string): Record<string, unknown> {
  const sameAs = (settings.socials || []).map((s) => s.url).filter(Boolean) as string[];
  if (settings.partnerUrl) sameAs.push(settings.partnerUrl);

  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: settings.studioName,
    url: siteOrigin(),
    telephone: settings.phone || undefined,
    email: settings.email || undefined,
    address: {
      '@type': 'PostalAddress',
      streetAddress: settings.street || undefined,
      addressLocality: 'Ellinikon',
      addressRegion: 'Attica',
      postalCode: settings.postcode || undefined,
      addressCountry: 'GR',
    },
  };

  if (imageUrl) data.image = imageUrl;
  else {
    const fallback = shareImageUrl(settings.seoImage) || shareImageUrl(settings.logoBlack);
    if (fallback) data.image = fallback;
  }

  if (settings.geo?.lat != null && settings.geo?.lng != null) {
    data.geo = {
      '@type': 'GeoCoordinates',
      latitude: settings.geo.lat,
      longitude: settings.geo.lng,
    };
  }

  if (sameAs.length) data.sameAs = sameAs;

  return data;
}
