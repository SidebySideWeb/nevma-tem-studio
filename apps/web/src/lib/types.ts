/** Hand-written types matching schema + query projections. */

export type SanityImageAsset = {
  _id: string;
  url: string;
  metadata?: {
    dimensions?: { width: number; height: number; aspectRatio: number };
    lqip?: string;
  };
};

export type SanityImage = {
  asset?: SanityImageAsset | null;
  hotspot?: { x: number; y: number; height?: number; width?: number } | null;
  crop?: { top: number; bottom: number; left: number; right: number } | null;
  alt?: string | null;
};

export type Cta = {
  label?: string | null;
  page?: string | null;
  url?: string | null;
  room?: { slug?: string | null; order?: number | null; name?: string | null } | null;
};

export type CtaBand = {
  title?: string | null;
  text?: string | null;
  primary?: Cta | null;
  secondary?: Cta | null;
};

export type ChapterHeading = {
  chapter?: string | null;
  title?: string | null;
  intro?: string | null;
};

export type Seo = {
  title?: string | null;
  description?: string | null;
  noindex?: boolean | null;
  image?: SanityImage | null;
};

export type StatItem = { value?: string | null; label?: string | null };
export type LabelValue = { label?: string | null; value?: string | null };
export type NumberedText = { title?: string | null; text?: string | null };

export type Settings = {
  studioName: string;
  street?: string | null;
  area?: string | null;
  city?: string | null;
  postcode?: string | null;
  country?: string | null;
  email?: string | null;
  emailDisplay?: string | null;
  phone?: string | null;
  phoneDisplay?: string | null;
  replyTime?: string | null;
  mapUrl?: string | null;
  geo?: { lat?: number; lng?: number; alt?: number } | null;
  logoWhite?: SanityImage | null;
  logoBlack?: SanityImage | null;
  headerCta?: string | null;
  footerText?: string | null;
  socials?: { label?: string | null; url?: string | null }[] | null;
  partnerName?: string | null;
  partnerLogo?: SanityImage | null;
  partnerUrl?: string | null;
  partnerLinkLabel?: string | null;
  partnerFooterLabel?: string | null;
  seoTitleSuffix?: string | null;
  seoDescription?: string | null;
  seoImage?: SanityImage | null;
};

export type RoomCard = {
  _id: string;
  name: string;
  slug: string;
  order: number;
  cardImage?: SanityImage | null;
  cardLabel?: string | null;
  wideImage?: SanityImage | null;
};

export type RoomsPage = {
  galleryTitle?: string | null;
  equipmentTitle?: string | null;
  contactLabel?: string | null;
  otherRoomsTitle?: string | null;
  cta?: CtaBand | null;
};

export type Room = RoomCard & {
  heroImage?: SanityImage | null;
  heroIntro?: string | null;
  askLabel?: string | null;
  facts?: LabelValue[] | null;
  storyChapter?: string | null;
  headline?: string | null;
  story?: string[] | null;
  notable?: string | null;
  tasks?: string | null;
  clientsLine?: string | null;
  floorPlan?: SanityImage | null;
  floorPlanCaption?: string | null;
  galleryChapter?: string | null;
  gallery?: SanityImage[] | null;
  equipmentChapter?: string | null;
  equipmentIntro?: string | null;
  equipment?: { title?: string | null; items?: string[] | null }[] | null;
  cta?: CtaBand | null;
  seo?: Seo | null;
  shared?: RoomsPage | null;
};

export type Testimonial = {
  quote: string;
  name: string;
  role?: string | null;
};

export type PartnerRelease = {
  title: string;
  cover?: SanityImage | null;
  label?: string | null;
  url?: string | null;
};

export type HomePage = {
  heroImage?: SanityImage | null;
  heroLabel?: string | null;
  heroIntro?: string | null;
  heroPrimary?: Cta | null;
  heroSecondary?: Cta | null;
  rooms?: ChapterHeading | null;
  roomCards?: RoomCard[] | null;
  records?: ChapterHeading | null;
  recordsCta?: Cta | null;
  recordCovers?: SanityImage[] | null;
  partnerLabel?: string | null;
  partnerText?: string | null;
  partnerReleases?: PartnerRelease[] | null;
  gear?: ChapterHeading | null;
  gearImage?: SanityImage | null;
  gearStats?: StatItem[] | null;
  gearCta?: Cta | null;
  quotes?: ChapterHeading | null;
  quoteItems?: Testimonial[] | null;
  cta?: CtaBand | null;
  seo?: Seo | null;
};

export type TeamMember = {
  name: string;
  role: string;
  photo?: SanityImage | null;
};

export type Faq = {
  question: string;
  answer: string;
};

export type AboutPage = {
  heroImage?: SanityImage | null;
  title?: string | null;
  captionTitle?: string | null;
  captionText?: string | null;
  estLabel?: string | null;
  year?: string | null;
  locationLabel?: string | null;
  location?: string | null;
  lead?: string | null;
  paragraphs?: string[] | null;
  teamTitle?: string | null;
  teamSummary?: string | null;
  teamGroups?: { title: string; members?: TeamMember[] | null }[] | null;
  faqTitle?: string | null;
  faqIntro?: string | null;
  faqItems?: Faq[] | null;
  partnerLabel?: string | null;
  partnerText?: string | null;
  panorama?: SanityImage | null;
  seo?: Seo | null;
};

export type Client = {
  _id: string;
  name: string;
  sortName?: string | null;
  partner?: boolean | null;
  url?: string | null;
};

export type ClientsPage = {
  title?: string | null;
  heroCaption?: string | null;
  heroCovers?: SanityImage[] | null;
  azLabel?: string | null;
  intro?: string | null;
  cta?: CtaBand | null;
  seo?: Seo | null;
};

export type ClientsQueryResult = {
  page: ClientsPage | null;
  clients: Client[];
};

export type SessionsPage = {
  heroImage?: SanityImage | null;
  title?: string | null;
  heroCta?: Cta | null;
  introItems?: NumberedText[] | null;
  introImages?: SanityImage[] | null;
  stepsTitle?: string | null;
  steps?: NumberedText[] | null;
  faqTitle?: string | null;
  faqIntro?: string | null;
  faqItems?: Faq[] | null;
  cta?: CtaBand | null;
  seo?: Seo | null;
};

export type EnquireForm = {
  _id?: string;
  title?: string | null;
  key?: string | null;
  projectTypes?: string[] | null;
  defaultProjectType?: string | null;
  notify?: string[] | null;
  autoReplySubject?: string | null;
  autoReplyBody?: string | null;
  retentionMonths?: number | null;
};

export type EnquireLabels = {
  name?: string | null;
  namePlaceholder?: string | null;
  artist?: string | null;
  artistPlaceholder?: string | null;
  email?: string | null;
  emailPlaceholder?: string | null;
  phone?: string | null;
  phonePlaceholder?: string | null;
  projectType?: string | null;
  start?: string | null;
  days?: string | null;
  daysPlaceholder?: string | null;
  message?: string | null;
  messagePlaceholder?: string | null;
  consent?: string | null;
  privacyLink?: string | null;
  submit?: string | null;
  protectedBy?: string | null;
};

export type EnquirePage = {
  image?: SanityImage | null;
  label?: string | null;
  title?: string | null;
  intro?: string | null;
  form?: EnquireForm | null;
  labels?: EnquireLabels | null;
  thanksTitle?: string | null;
  thanksText?: string | null;
  againLabel?: string | null;
  errorText?: string | null;
  faqTitle?: string | null;
  faqIntro?: string | null;
  faqItems?: Faq[] | null;
  seo?: Seo | null;
};

export type ContactChannel = {
  label?: string | null;
  value?: string | null;
  note?: string | null;
  href?: string | null;
};

export type ContactPage = {
  heroImage?: SanityImage | null;
  title?: string | null;
  intro?: string | null;
  channels?: ContactChannel[] | null;
  mapImage?: SanityImage | null;
  ctaTitle?: string | null;
  ctaText?: string | null;
  ctaButton?: Cta | null;
  seo?: Seo | null;
};

/** Portable Text block as returned by GROQ (minimal). */
export type PortableTextBlock = {
  _type: string;
  _key?: string;
  style?: string;
  children?: { _type: string; text?: string; marks?: string[] }[];
  markDefs?: { _type: string; _key: string; href?: string }[];
};

export type LegalPage = {
  title?: string | null;
  slug?: string | null;
  updated?: string | null;
  body?: PortableTextBlock[] | null;
  seo?: Seo | null;
};

export type NotFoundPage = {
  title?: string | null;
  text?: string | null;
  cta?: Cta | null;
};

export type ClientGroup = {
  letter: string;
  clients: Client[];
};
