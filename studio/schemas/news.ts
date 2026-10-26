import {defineField,defineType} from 'sanity';
import {pillarField} from './common';
export const news=defineType({name:'news',title:'Berita & Cerita Budaya',type:'document',fields:[
 defineField({name:'title',title:'Judul Artikel',type:'string',validation:r=>r.required().min(6)}),
 defineField({name:'slug',title:'Alamat Artikel',type:'slug',options:{source:'title',maxLength:90},validation:r=>r.required()}),
 defineField({name:'excerpt',title:'Ringkasan (maks. 240 karakter)',type:'text',rows:3,validation:r=>r.required().max(240)}),
 defineField({name:'publishedAt',title:'Tanggal Publikasi',type:'datetime',validation:r=>r.required()}),
 pillarField(),
 defineField({name:'cover',title:'Foto Utama',type:'image',options:{hotspot:true},fields:[defineField({name:'alt',title:'Deskripsi Foto',type:'string',validation:r=>r.required()})]}),
 defineField({name:'body',title:'Isi Artikel',type:'array',of:[{type:'block'}],validation:r=>r.required().min(1)})
],preview:{select:{title:'title',subtitle:'publishedAt',media:'cover'}}});
