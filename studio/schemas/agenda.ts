import {defineField,defineType} from 'sanity';
export const agenda=defineType({name:'agenda',title:'Agenda Kegiatan',type:'document',fields:[
 defineField({name:'title',title:'Nama Kegiatan',type:'string',validation:r=>r.required()}),
 defineField({name:'description',title:'Ringkasan',type:'text',rows:3}),
 defineField({name:'date',title:'Tanggal dan Jam',type:'datetime',validation:r=>r.required()}),
 defineField({name:'place',title:'Lokasi (isi jika terkonfirmasi)',type:'string'}),
 defineField({name:'status',title:'Status',type:'string',options:{list:[{title:'Akan Datang',value:'upcoming'},{title:'Selesai',value:'past'}]},initialValue:'upcoming'}),
 defineField({name:'registrationUrl',title:'Link Pendaftaran (opsional)',type:'url',validation:r=>r.uri({scheme:['https']})})
],preview:{select:{title:'title',subtitle:'date'}}});
