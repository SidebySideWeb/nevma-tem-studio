import type { StructureResolver } from 'sanity/structure';

const single = (S: any, type: string, title: string) =>
  S.listItem().title(title).id(type).child(S.document().schemaType(type).documentId(type).title(title));

export const structure: StructureResolver = (S) =>
  S.list()
    .title('TEMS')
    .items([
      S.listItem().title('Pages').child(
        S.list().title('Pages').items([
          single(S, 'homePage', 'Home'),
          S.documentTypeListItem('room').title('Rooms (The Studio)'),
          single(S, 'roomsPage', 'Room pages (shared labels)'),
          single(S, 'aboutPage', 'About'),
          single(S, 'clientsPage', 'Clients'),
          single(S, 'sessionsPage', 'Sessions'),
          single(S, 'enquirePage', 'Register interest'),
          single(S, 'contactPage', 'Contact'),
          single(S, 'notFoundPage', 'Page not found (404)'),
          S.documentTypeListItem('legalPage').title('Legal pages'),
        ]),
      ),
      S.divider(),
      S.documentTypeListItem('client').title('Clients A–Z'),
      S.documentTypeListItem('testimonial').title('Quotes'),
      S.documentTypeListItem('teamMember').title('Team'),
      S.documentTypeListItem('faq').title('Questions'),
      S.divider(),
      S.listItem().title('Enquiries').child(
        S.list().title('Enquiries').items([
          ...['new', 'replied', 'booked', 'closed', 'spam'].map((st) =>
            S.listItem().title(st[0].toUpperCase() + st.slice(1)).id(`sub-${st}`).child(
              S.documentList().title(st).schemaType('formSubmission').filter('_type == "formSubmission" && coalesce(status, "new") == $st').params({ st })
                .defaultOrdering([{ field: 'submittedAt', direction: 'desc' }]),
            ),
          ),
          S.divider(),
          S.documentTypeListItem('formSubmission').title('All submissions'),
          S.documentTypeListItem('form').title('Form settings'),
        ]),
      ),
      S.divider(),
      single(S, 'siteSettings', 'Site settings'),
    ]);
