import {defineField} from 'sanity';
export const pillarField=()=>defineField({name:'pillar',title:'Pilar Misi',type:'string',options:{list:[
{title:'Melestarikan Budaya',value:'budaya'},
{title:'Merawat Bumi',value:'bumi'},
{title:'Merajut Kebhinekaan',value:'kebhinekaan'},
{title:'Membangun Nilai-nilai Kemanusiaan',value:'kemanusiaan'}
],layout:'dropdown'},validation:rule=>rule.required()});
