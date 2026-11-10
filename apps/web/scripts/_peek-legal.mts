import { createClient } from '@sanity/client';

const c = createClient({
  projectId: process.env.PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2025-10-01',
  useCdn: false,
  token: process.env.SANITY_VIEWER_TOKEN,
});

const pages = await c.fetch(
  `*[_type=="legalPage"]{title,"slug":slug.current,updated,body}`,
);
const nf = await c.fetch(`*[_id=="notFoundPage"][0]{title,text,cta}`);
console.log(JSON.stringify({ pages, nf }, null, 2));
