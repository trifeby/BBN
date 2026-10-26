import {defineField,defineType} from 'sanity';
export const siteSettings=defineType({name:'siteSettings',title:'Identitas & Kontak Resmi',type:'document',fields:[
  defineField({name:'organizationName',title:'Nama lembaga',type:'string',initialValue:'Yayasan Bakul Budaya Nusantara',validation:r=>r.required()}),
  defineField({name:'tagline',title:'Tagline',type:'string',initialValue:'Budaya Menyatukan Kita.'}),
  defineField({name:'logo',title:'Logo BBN (hanya ganti dengan file resmi yang disetujui)',description:'Website sudah memakai logo vektor resmi dari Manual Logo BBN. Isi hanya jika yayasan menerbitkan versi resmi pengganti.',type:'image',options:{hotspot:true}}),
  defineField({name:'email',title:'Email resmi',type:'string',validation:r=>r.email()}),
  defineField({name:'phone',title:'Nomor telepon resmi',type:'string'}),
  defineField({name:'instagram',title:'Alamat/username Instagram',type:'string'}),
  defineField({name:'address',title:'Alamat resmi (jika boleh dipublikasi)',type:'text',rows:2}),
  defineField({name:'collaborationPdf',title:'PDF profil BBN yang telah disetujui',type:'file',options:{accept:'.pdf'}})
],preview:{prepare(){return{title:'Identitas & Kontak Website BBN'}}}});
