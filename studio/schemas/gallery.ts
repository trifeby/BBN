import {defineField,defineType} from 'sanity';
import {pillarField} from './common';
export const gallery=defineType({name:'gallery',title:'Galeri / Jejak Karya',type:'document',fields:[
 defineField({name:'title',title:'Judul Dokumentasi',type:'string',validation:r=>r.required()}),
 defineField({name:'description',title:'Keterangan Singkat',type:'text',rows:3}),
 defineField({name:'activityDate',title:'Tanggal Kegiatan',type:'date'}),
 defineField({name:'place',title:'Lokasi Kegiatan',type:'string'}),
 pillarField(),
 defineField({name:'photo',title:'Foto Kegiatan BBN',type:'image',options:{hotspot:true},validation:r=>r.required(),fields:[defineField({name:'alt',title:'Deskripsi foto (wajib)',type:'string',validation:r=>r.required()})]})
],preview:{select:{title:'title',subtitle:'place',media:'photo'}}});
