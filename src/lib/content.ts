import { createClient } from '@sanity/client';

export type PillarId = 'budaya'|'bumi'|'kebhinekaan'|'kemanusiaan';
export type Program = { _id: string; title: string; slug: string; description: string; pillar: PillarId; imageUrl?: string; imageAlt?: string; featured?: boolean };
export type Story = { _id: string; title: string; slug: string; excerpt: string; publishedAt?: string; pillar?: PillarId; imageUrl?: string; imageAlt?: string; body?: unknown[] };
export type Activity = { _id: string; title: string; description?: string; date?: string; place?: string; status?: 'upcoming'|'past'; registrationUrl?: string };
export type Gallery = { _id: string; title: string; description?: string; activityDate?: string; pillar?: PillarId; imageUrl?: string; imageAlt?: string; place?: string };
export type SiteSettings = { organizationName?: string; tagline?: string; email?: string; phone?: string; instagram?: string; address?: string; collaborationPdf?: string; logoUrl?: string };

export const pillarDetails: Record<PillarId,{title:string; description:string; count:string; icon:string}> = {
  budaya: {title:'Melestarikan Budaya',description:'Mengenal, mempraktikkan, dan meneruskan pengetahuan budaya.',count:'01',icon:'✳'},
  bumi: {title:'Merawat Bumi',description:'Mempertemukan tradisi dengan kepedulian pada lingkungan.',count:'02',icon:'❧'},
  kebhinekaan: {title:'Merajut Kebhinekaan',description:'Membuka perjumpaan dan dialog lintas komunitas.',count:'03',icon:'✦'},
  kemanusiaan: {title:'Membangun Nilai-nilai Kemanusiaan',description:'Merawat empati dan kebersamaan melalui aksi.',count:'04',icon:'◌'},
};

// Program ini berasal dari bahan internal BBN. Nama/deskripsi harus mendapat persetujuan editorial sebelum publikasi resmi.
const localPrograms: Program[] = [
  {_id:'local-sabtu',title:'Sabtu Sebakul',slug:'sabtu-sebakul',description:'Ruang belajar tari Nusantara, mengenal wastra, dan bertemu dalam kebersamaan.',pillar:'budaya',featured:true},
  {_id:'local-hutan',title:'Sedekah Hutan',slug:'sedekah-hutan',description:'Menghubungkan praktik budaya, kepedulian lingkungan, dan tindakan bersama.',pillar:'bumi',featured:true},
  {_id:'local-anak',title:'Gerak Anak',slug:'gerak-anak',description:'Pengalaman budaya dan seni yang menyenangkan dan bermakna bagi anak-anak.',pillar:'kemanusiaan',featured:true},
  {_id:'local-bincang',title:'Bincang-bincang Budaya',slug:'bincang-bincang-budaya',description:'Percakapan tentang sejarah, wastra, seni, dan pengetahuan di balik tradisi.',pillar:'kebhinekaan',featured:true}
];
const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID?.trim();
const dataset = import.meta.env.PUBLIC_SANITY_DATASET?.trim() || 'production';
export const cmsConfigured = Boolean(projectId);
const client = projectId ? createClient({projectId,dataset,apiVersion:'2026-03-01',useCdn:false,perspective:'published'}) : null;

async function query<T>(groq: string): Promise<T|null> {
  if (!client) return null;
  try { return await client.fetch<T>(groq); }
  catch (error) { console.warn('[BBN] Query Sanity gagal; gunakan konten aman bawaan jika tersedia.', error instanceof Error ? error.message : 'unknown'); return null; }
}

export async function getSettings(): Promise<SiteSettings> {
  return await query<SiteSettings>(`*[_type == 'siteSettings'][0]{ organizationName, tagline, email, phone, instagram, address, 'logoUrl': logo.asset->url, 'collaborationPdf': collaborationPdf.asset->url }`) || {};
}
export async function getPrograms(): Promise<Program[]> {
  const fetched = await query<Program[]>(`*[_type == 'program' && defined(slug.current)] | order(sortOrder asc, title asc) { _id, title, 'slug': slug.current, description, pillar, featured, 'imageUrl': cover.asset->url, 'imageAlt': cover.alt }`);
  return fetched?.length ? fetched : localPrograms;
}
export async function getStories(): Promise<Story[]> {
  return await query<Story[]>(`*[_type == 'news' && defined(slug.current)] | order(publishedAt desc) { _id, title, 'slug': slug.current, excerpt, publishedAt, pillar, 'imageUrl': cover.asset->url, 'imageAlt': cover.alt, body }`) || [];
}
export async function getActivities(): Promise<Activity[]> {
  return await query<Activity[]>(`*[_type == 'agenda'] | order(date asc) { _id, title, description, date, place, status, registrationUrl }`) || [];
}
export async function getGallery(): Promise<Gallery[]> {
  return await query<Gallery[]>(`*[_type == 'gallery'] | order(activityDate desc) { _id, title, description, activityDate, pillar, place, 'imageUrl': photo.asset->url, 'imageAlt': photo.alt }`) || [];
}
export function prettyDate(value?:string):string {
  if(!value)return '';
  const date = new Date(value);
  return isNaN(date.getTime()) ? '' : new Intl.DateTimeFormat('id-ID',{day:'numeric',month:'long',year:'numeric',timeZone:'Asia/Jakarta'}).format(date);
}
