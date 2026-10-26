import {defineField,defineType} from 'sanity';
import {pillarField} from './common';
export const program=defineType({name:'program',title:'Program BBN',type:'document',fields:[
 defineField({name:'title',title:'Nama Program',type:'string',validation:r=>r.required().min(4)}),
 defineField({name:'slug',title:'Alamat halaman',type:'slug',options:{source:'title',maxLength:90},validation:r=>r.required()}),
 defineField({name:'description',title:'Penjelasan Program',type:'text',rows:4,validation:r=>r.required().min(30)}),
 pillarField(),
 defineField({name:'cover',title:'Foto Resmi Program',type:'image',options:{hotspot:true},fields:[defineField({name:'alt',title:'Deskripsi foto untuk aksesibilitas',type:'string',validation:r=>r.required()})]}),
 defineField({name:'featured',title:'Sorot di beranda',type:'boolean',initialValue:false}),
 defineField({name:'sortOrder',title:'Urutan tampilan',type:'number',initialValue:100})
],preview:{select:{title:'title',subtitle:'pillar',media:'cover'}}});
