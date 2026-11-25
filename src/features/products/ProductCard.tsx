import {assetUrl} from '../../utils/assets'
import {useState} from 'react'
import {ArrowUpRight,Heart} from 'lucide-react'
import {Link} from 'react-router-dom'
import {isPhone,type Product} from '../../data/products'
import {useShop} from '../../stores/useShop'
import {rupees} from '../../utils/format'
export function Save({p}:{p:Product}){
 const active=useShop(s=>s.wishlist.includes(p.id)),wish=useShop(s=>s.wish)
 return <button className="icon save" aria-pressed={active} aria-label={(active?'Remove ':'Save ')+p.name} onClick={()=>wish(p.id)}><Heart size={19} fill={active?'currentColor':'none'}/></button>
}
export default function ProductCard({p,move=false}:{p:Product;move?:boolean}){
 const add=useShop(s=>s.add),wish=useShop(s=>s.wish),compare=useShop(s=>s.compare),toggle=useShop(s=>s.comparePhone)
 const v=useShop(s=>s.variants[p.id]),select=useShop(s=>s.select),cart=useShop(s=>s.cart),[notice,setNotice]=useState('')
 const variant=p.variants.find(x=>x.id===v)??p.variants[0]
 const atLimit=(cart.find(x=>x.id===p.id&&x.variant===variant.id)?.quantity??0)>=variant.limit
 const selected=compare.includes(p.id)
 return <article className="product-card">
 <div className="product-photo"><Link to={'/product/'+p.slug}><img src={assetUrl(p.images[0])} loading="lazy" alt={p.category+' illustration for '+p.name}/></Link><Save p={p}/></div>
 <div className="product-description"><span className="technical">{p.brand} / {p.condition}</span><Link className="product-name" to={'/product/'+p.slug}>{p.name}<ArrowUpRight size={18}/></Link><strong className="price">{rupees(variant.price)}</strong>
 {p.variants.length>1&&<label>Configuration<select aria-label={p.name+' configuration'} value={variant.id} onChange={e=>{select(p.id,e.target.value);setNotice('')}}>{p.variants.map(option=><option value={option.id} key={option.id}>{option.label}</option>)}</select></label>}
 <div className="card-actions"><button className="small-button" disabled={atLimit} onClick={()=>{add(p.id,variant.id);if(move)wish(p.id);setNotice('Added to cart')}}>{atLimit?'Limit reached':move?'Move to cart':'Add to cart'}</button>
 {isPhone(p)&&<button className="small-button" aria-pressed={selected} disabled={!selected&&compare.length>=3} onClick={()=>toggle(p.id)}>{selected?'In comparison':'Compare'}</button>}</div><span className="sr-only" role="status">{notice}</span></div></article>
}
