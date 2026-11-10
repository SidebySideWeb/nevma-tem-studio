import { defineCliConfig } from 'sanity/cli';

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'your-project-id',
    dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  },
  studioHost: process.env.SANITY_STUDIO_HOST || 'tems',
  deployment: {
    autoUpdates: true,
    // Assigned on first deploy to https://tems.sanity.studio (10 Nov 2026).
    appId: 'vklkk4xvl3s2y3rrkaiisaob',
  },
});
