import {defineConfig} from 'sanity';
import {structureTool} from 'sanity/structure';
import {schemaTypes} from './schemas';

const projectId=process.env.SANITY_STUDIO_PROJECT_ID || '';
const dataset=process.env.SANITY_STUDIO_DATASET || 'production';

export default defineConfig({
  name:'bakul-budaya-nusantara',
  title:'BBN • Pengelola Konten',
  projectId, dataset,
  plugins:[structureTool({structure:(S)=>S.list().title('Kelola Website BBN').items([
    S.listItem().title('Identitas & Kontak Resmi').id('siteSettings').child(S.document().schemaType('siteSettings').documentId('siteSettings')),
    S.divider(),
    S.documentTypeListItem('news').title('Berita & Cerita Budaya'),
    S.documentTypeListItem('agenda').title('Agenda Kegiatan'),
    S.documentTypeListItem('program').title('Program BBN'),
    S.documentTypeListItem('gallery').title('Galeri / Jejak Karya')
  ])})],
  schema:{types:schemaTypes},
  document:{newDocumentOptions:(prev)=>prev.filter(item=>item.templateId!=='siteSettings')}
});
