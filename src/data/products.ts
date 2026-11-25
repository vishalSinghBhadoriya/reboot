export const categories=['Smartphones','Refurbished','Earbuds','Wired earphones','Headphones','Chargers','Charging cables','Power banks','Mobile cases','Screen protectors'] as const
export type Category=(typeof categories)[number]
export type Variant={id:string;label:string;price:number;limit:number}
export type Product={id:string;slug:string;name:string;brand:string;category:Category;condition:'New'|'Refurbished';description:string;images:string[];variants:Variant[];specs:Record<string,string>;related:string[];warranty?:string;originalPrice?:number}
export const specKeys=['Display','Processor','RAM','Storage','Battery','Camera','Charging','OS']
const artwork=['phone','phone','earbuds','wired','headphones','charger','cable','power','case','protector']
const phoneArt:Record<string,string>={
 'axis-1':'phone','axis-pro':'axis-pro','forma-mini':'forma-mini','forma-5':'forma-5',
 'axis-one-renewed':'axis-renewed','forma-mini-renewed':'forma-mini',
}
type Row=[string,string,Category,number,string|string[]]
const rows:Row[]=[
 ['Axis 1','Axis','Smartphones',24999,['6.5″ OLED · 120 Hz','Octa-core','8 GB','128 GB','5,000 mAh','50 MP + 8 MP','45 W','Android']],
 ['Axis Pro','Axis','Smartphones',38999,['6.7″ OLED · 120 Hz','Octa-core Plus','12 GB','256 GB','5,300 mAh','50 MP + 12 MP','65 W','Android']],
 ['Forma Mini','Forma','Smartphones',19999,['6.1″ OLED · 90 Hz','Octa-core','6 GB','128 GB','4,200 mAh','48 MP','30 W','Android']],
 ['Forma 5','Forma','Smartphones',29999,['6.6″ OLED · 120 Hz','Octa-core','8 GB','256 GB','5,100 mAh','50 MP + 8 MP','45 W','Android']],
 ['Axis One Renewed','Axis','Refurbished',14999,['6.5″ OLED · 120 Hz','Octa-core','8 GB','128 GB','5,000 mAh nominal','50 MP + 8 MP','45 W','Android']],
 ['Forma Mini Renewed','Forma','Refurbished',11999,['6.1″ OLED · 90 Hz','Octa-core','6 GB','128 GB','4,200 mAh nominal','48 MP','30 W','Android']],
 ['Field Buds','Field','Earbuds',2499,'USB-C case'],['Field Buds NC','Field','Earbuds',3999,'Active noise cancellation'],['Pulse Buds','Pulse','Earbuds',1699,'Touch controls'],
 ['Field Wired','Field','Wired earphones',599,'3.5 mm connector'],['Pulse Type C','Pulse','Wired earphones',899,'USB-C connector'],['Field Monitor','Field','Wired earphones',1199,'In-line microphone'],
 ['Field Over-Ear','Field','Headphones',4499,'Wireless over-ear'],['Pulse Studio','Pulse','Headphones',5999,'Wireless noise cancellation'],['Field Fold','Field','Headphones',2799,'Foldable earcups'],
 ['Volt 20','Volt','Chargers',899,'20 W · USB-C'],['Volt 45','Volt','Chargers',1699,'45 W · USB-C'],['Volt Duo','Volt','Chargers',2299,'65 W · dual USB-C'],
 ['Link 1 m','Link','Charging cables',399,'USB-C to USB-C · 1 m'],['Link 2 m','Link','Charging cables',599,'USB-C to USB-C · 2 m'],['Link 100','Link','Charging cables',899,'USB-C to USB-C · 100 W'],
 ['Volt Pocket','Volt','Power banks',1299,'5,000 mAh'],['Volt Travel','Volt','Power banks',1999,'10,000 mAh'],['Volt Reserve','Volt','Power banks',2999,'20,000 mAh'],
 ['Forma Mini Shell','Forma','Mobile cases',499,'Forma Mini'],['Axis One Shell','Axis','Mobile cases',699,'Axis 1'],['Axis Pro Shell','Axis','Mobile cases',799,'Axis Pro'],
 ['Forma Mini Glass','Forma','Screen protectors',399,'Forma Mini'],['Axis One Glass','Axis','Screen protectors',499,'Axis 1'],['Axis Pro Glass','Axis','Screen protectors',599,'Axis Pro'],
]
export const products:Product[]=rows.map(([name,brand,category,price,detail])=>{
 const id=name.toLowerCase().replaceAll(' ','-')
 const phone=Array.isArray(detail)
 const image=phoneArt[id]??artwork[categories.indexOf(category)]
 const photo='/images/'+image+'.webp'
 return {id,slug:id,name,brand,category,condition:category==='Refurbished'?'Refurbished':'New',
  description:(phone?'Sample smartphone configuration.':detail+'.')+' Demo catalogue with illustrative imagery.',
  images:phone?[photo,'/images/'+image+'-detail.webp']:[photo],related:[],
  specs:phone?Object.fromEntries(specKeys.map((key,i)=>[key,detail[i]])):{Configuration:detail},
  variants:[{id:'standard',label:phone?'Graphite / '+detail[3]:'Standard',price:price*100,limit:5},
    ...(phone&&category==='Smartphones'?[{id:'upgrade',label:'Graphite / '+(detail[3]==='128 GB'?'256 GB':'512 GB'),price:(price+4000)*100,limit:2}]:[])],
 }
})
products.forEach(p=>{p.related=products.filter(x=>x.category===p.category&&x.id!==p.id).slice(0,3).map(x=>x.id)})
export const getProduct=(id:string)=>products.find(p=>p.id===id)
export const isPhone=(p:Product)=>p.category==='Smartphones'||p.category==='Refurbished'
export const groups:Record<string,readonly Category[]>={smartphones:['Smartphones'],refurbished:['Refurbished'],audio:['Earbuds','Wired earphones','Headphones'],accessories:['Chargers','Charging cables','Power banks','Mobile cases','Screen protectors']}
export function filterProducts(input:Product[],f:{query:string;category:string;brand:string;condition:string;max:number;sort:string}){
 const matches=input.filter(p=>[p.name,p.brand,p.category,...Object.values(p.specs)].join(' ').toLowerCase().includes(f.query.trim().toLowerCase())&&(!f.category||p.category===f.category)&&(!f.brand||p.brand===f.brand)&&(!f.condition||p.condition===f.condition)&&p.variants[0].price<=f.max*100)
 if(f.sort==='low')return matches.sort((a,b)=>a.variants[0].price-b.variants[0].price)
 if(f.sort==='high')return matches.sort((a,b)=>b.variants[0].price-a.variants[0].price)
 return matches
}
export const comparisonValue=(p:Product,key:string)=>key==='Condition'?p.condition:p.specs[key]??'—'
