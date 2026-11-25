import {create} from 'zustand'
import {persist} from 'zustand/middleware'
import {getProduct,isPhone} from '../data/products'
import {brands,initialRepair,services,type Repair} from '../data/repairs'
export type CartLine={id:string;variant:string;quantity:number}
type State={cart:CartLine[];wishlist:string[];compare:string[];variants:Record<string,string>;repair:Repair;
 quantity:(id:string,v:string,n:number)=>void;add:(id:string,v:string,n?:number)=>void;wish:(id:string)=>void;comparePhone:(id:string)=>void;select:(id:string,v:string)=>void;updateRepair:(change:Partial<Repair>)=>void}
const exists=(id:unknown):id is string=>typeof id==='string'&&Boolean(getProduct(id))
const limit=(id:string,v:string)=>getProduct(id)?.variants.find(x=>x.id===v)?.limit??0
const clamp=(id:string,v:string,n:number)=>Number.isFinite(n)?Math.min(limit(id,v),Math.max(0,Math.floor(n))):0
export const useShop=create<State>()(persist((set,get)=>({
 cart:[],wishlist:[],compare:[],variants:{},repair:initialRepair,
 quantity:(id,variant,n)=>set(s=>{
  const quantity=clamp(id,variant,n)
  const matches=(l:CartLine)=>l.id===id&&l.variant===variant
  if(!quantity)return {cart:s.cart.filter(l=>!matches(l))}
  return {cart:s.cart.some(matches)?s.cart.map(l=>matches(l)?{...l,quantity}:l):[...s.cart,{id,variant,quantity}]}
 }),
 add:(id,v,n=1)=>{if(Number.isFinite(n)&&n>=1)get().quantity(id,v,(get().cart.find(l=>l.id===id&&l.variant===v)?.quantity??0)+n)},
 wish:id=>set(s=>({wishlist:s.wishlist.includes(id)?s.wishlist.filter(x=>x!==id):exists(id)?[...s.wishlist,id]:s.wishlist})),
 comparePhone:id=>set(s=>({compare:s.compare.includes(id)?s.compare.filter(x=>x!==id):exists(id)&&isPhone(getProduct(id)!)&&s.compare.length<3?[...s.compare,id]:s.compare})),
 select:(id,v)=>{if(limit(id,v))set(s=>({variants:{...s.variants,[id]:v}}))},
 updateRepair:change=>set(s=>({repair:{...s.repair,...change}})),
}),{name:'reboot-shop-v1',partialize:({cart,wishlist,compare,variants,repair})=>({cart,wishlist,compare,variants,repair}),
 merge:(stored,current)=>{
  const saved=stored&&typeof stored==='object'?stored as Partial<State>:{}
  const list=(value:unknown)=>Array.isArray(value)?[...new Set(value.filter(exists))]:[]
  const cart=Array.isArray(saved.cart)?saved.cart.flatMap(l=>{
   if(!l||!exists(l.id)||typeof l.variant!=='string')return []
   const quantity=clamp(l.id,l.variant,l.quantity)
   return quantity?[{id:l.id,variant:l.variant,quantity}]:[]
  }):[]
  const r=saved.repair
  return {...current,cart:cart.filter((l,i)=>cart.findIndex(x=>x.id===l.id&&x.variant===l.variant)===i),
   wishlist:list(saved.wishlist),compare:list(saved.compare).filter(id=>isPhone(getProduct(id)!)).slice(0,3),
   variants:saved.variants&&typeof saved.variants==='object'?Object.fromEntries(Object.entries(saved.variants).filter(([id,v])=>limit(id,v))):{},
   repair:r&&(brands.includes(r.brand)||r.brand==='Other')?{brand:r.brand,model:typeof r.model==='string'?r.model:'',quality:r.quality==='premium'?'premium':'compatible',issues:Array.isArray(r.issues)?services.filter(s=>r.issues.includes(s[0])).map(s=>s[0]):[]}:initialRepair}
 }}))
export const cartItems=(cart:CartLine[])=>cart.flatMap(line=>{
 const product=getProduct(line.id)
 const selection=product?.variants.find(v=>v.id===line.variant)
 return product&&selection?[{...line,product,selection,total:line.quantity*selection.price}]:[]
})
export const subtotal=(cart:CartLine[])=>cartItems(cart).reduce((sum,l)=>sum+l.total,0)
