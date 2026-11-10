/**
 * One GROQ query per page. Explicit projections; references resolved;
 * images expanded to asset + hotspot/crop/alt (CONTENT-MODEL.md).
 */

const image = `{
  asset->{_id, url, metadata{dimensions{width, height, aspectRatio}, lqip}},
  hotspot,
  crop,
  alt
}`;

const imagePlain = `{
  asset->{_id, url, metadata{dimensions{width, height, aspectRatio}, lqip}},
  hotspot,
  crop
}`;

const cta = `{
  label,
  page,
  url,
  room->{"slug": slug.current, order, name}
}`;

const ctaBand = `{title, text, primary${cta}, secondary${cta}}`;

const chapter = `{chapter, title, intro}`;

const seo = `{title, description, noindex, image${imagePlain}}`;

const roomCard = `{
  _id,
  name,
  "slug": slug.current,
  order,
  cardImage${image},
  cardLabel,
  wideImage${image}
}`;

const roomFull = `{
  _id,
  name,
  "slug": slug.current,
  order,
  cardImage${image},
  cardLabel,
  wideImage${image},
  heroImage${image},
  heroIntro,
  askLabel,
  facts[]{label, value},
  storyChapter,
  headline,
  story,
  notable,
  tasks,
  clientsLine,
  floorPlan${image},
  floorPlanCaption,
  galleryChapter,
  gallery[]${image},
  equipmentChapter,
  equipmentIntro,
  equipment[]{title, items},
  cta${ctaBand},
  seo${seo},
  "shared": *[_id == "roomsPage"][0]{
    galleryTitle,
    equipmentTitle,
    contactLabel,
    otherRoomsTitle,
    cta${ctaBand}
  }
}`;

export const settingsQuery = `*[_id == "siteSettings"][0]{
  studioName,
  street,
  area,
  city,
  postcode,
  country,
  email,
  "emailDisplay": coalesce(emailDisplay, email),
  phone,
  "phoneDisplay": coalesce(phoneDisplay, phone),
  replyTime,
  mapUrl,
  geo,
  logoWhite${imagePlain},
  logoBlack${imagePlain},
  headerCta,
  footerText,
  socials[]{label, url},
  partnerName,
  partnerLogo${imagePlain},
  partnerUrl,
  partnerLinkLabel,
  partnerFooterLabel,
  seoTitleSuffix,
  seoDescription,
  seoImage${imagePlain}
}`;

export const homeQuery = `*[_id == "homePage"][0]{
  heroImage${image},
  heroLabel,
  heroIntro,
  heroPrimary${cta},
  heroSecondary${cta},
  rooms${chapter},
  roomCards[]->${roomCard},
  records${chapter},
  recordsCta${cta},
  recordCovers[]${image},
  partnerLabel,
  partnerText,
  partnerReleases[]{title, cover${image}, label, url},
  gear${chapter},
  gearImage${image},
  gearStats[]{value, label},
  gearCta${cta},
  quotes${chapter},
  quoteItems[]->{quote, name, role},
  cta${ctaBand},
  seo${seo}
}`;

export const roomsQuery = `*[_type == "room"]|order(order asc)${roomCard}`;

export const roomQuery = `*[_type == "room" && slug.current == $slug][0]${roomFull}`;

export const aboutQuery = `*[_id == "aboutPage"][0]{
  heroImage${image},
  title,
  captionTitle,
  captionText,
  estLabel,
  year,
  locationLabel,
  location,
  lead,
  paragraphs,
  teamTitle,
  teamSummary,
  teamGroups[]{
    title,
    members[]->{name, role, photo${image}}
  },
  faqTitle,
  faqIntro,
  faqItems[]->{question, answer},
  partnerLabel,
  partnerText,
  panorama${image},
  seo${seo}
}`;

export const clientsQuery = `{
  "page": *[_id == "clientsPage"][0]{
    title,
    heroCaption,
    heroCovers[]${image},
    azLabel,
    intro,
    cta${ctaBand},
    seo${seo}
  },
  "clients": *[_type == "client"]{_id, name, sortName, partner, url}
}`;

export const sessionsQuery = `*[_id == "sessionsPage"][0]{
  heroImage${image},
  title,
  heroCta${cta},
  introItems[]{title, text},
  introImages[]${image},
  stepsTitle,
  steps[]{title, text},
  faqTitle,
  faqIntro,
  faqItems[]->{question, answer},
  cta${ctaBand},
  seo${seo}
}`;

export const enquireQuery = `*[_id == "enquirePage"][0]{
  image${image},
  label,
  title,
  intro,
  form->{
    _id,
    title,
    key,
    projectTypes,
    defaultProjectType,
    notify,
    autoReplySubject,
    autoReplyBody,
    retentionMonths
  },
  labels,
  thanksTitle,
  thanksText,
  againLabel,
  errorText,
  faqTitle,
  faqIntro,
  faqItems[]->{question, answer},
  seo${seo}
}`;

export const contactQuery = `*[_id == "contactPage"][0]{
  heroImage${image},
  title,
  intro,
  channels[]{label, value, note, href},
  mapImage${image},
  ctaTitle,
  ctaText,
  ctaButton${cta},
  seo${seo}
}`;

export const legalSlugsQuery = `*[_type == "legalPage" && defined(slug.current)]{"slug": slug.current}`;

export const legalQuery = `*[_type == "legalPage" && slug.current == $slug][0]{
  title,
  "slug": slug.current,
  updated,
  body,
  seo${seo}
}`;

export const notFoundQuery = `*[_id == "notFoundPage"][0]{
  title,
  text,
  cta${cta}
}`;
