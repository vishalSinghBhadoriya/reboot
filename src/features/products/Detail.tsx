import {assetUrl} from '../../utils/assets'
import {useState} from 'react'
import {Link,useParams} from 'react-router-dom'
import {motion,useReducedMotion} from 'motion/react'
import {ZoomIn} from 'lucide-react'
import {Heading,Modal,WhatsApp} from '../../components/ui'
import {getProduct,isPhone,type Product} from '../../data/products'
import {useShop} from '../../stores/useShop'
import {business} from '../../config/business'
import {rupees} from '../../utils/format'
import ProductCard,{Save} from './ProductCard'
import {NotFound} from '../../layouts/Shell'
function Gallery({p}:{p:Product}){
 const [index,setIndex]=useState(0),[zoom,setZoom]=useState(false),reduce=useReducedMotion()
 const alt=p.category+' concept image for '+p.name
 return <div className="gallery"><button className="gallery-main" onClick={()=>setZoom(true)} aria-label="Zoom product image"><motion.img key={index} initial={reduce?false:{opacity:.5}} animate={{opacity:1}} src={assetUrl(p.images[index])} alt={alt}/><ZoomIn size={23}/></button>
 {p.images.length>1&&<div className="thumbs">{p.images.map((src,i)=><button key={src} aria-label={'View product image '+(i+1)} aria-pressed={i===index} onClick={()=>setIndex(i)}><img src={assetUrl(src)} alt=""/></button>)}</div>}
 {zoom&&<Modal title={p.name} close={()=>setZoom(false)}><img className="zoom-picture" src={assetUrl(p.images[index])} alt={alt}/></Modal>}</div>
}
function Detail({p}:{p:Product}){
 const selected=useShop(s=>s.variants[p.id]),select=useShop(s=>s.select),add=useShop(s=>s.add),cart=useShop(s=>s.cart)
 const compare=useShop(s=>s.compare),toggle=useShop(s=>s.comparePhone)
 const v=p.variants.find(x=>x.id===selected)??p.variants[0]
 const [n,setN]=useState(1),[notice,setNotice]=useState('')
 const remaining=v.limit-(cart.find(l=>l.id===p.id&&l.variant===v.id)?.quantity??0)
 const quantity=Math.min(n,v.limit)
 const message='Hi '+business.name+', I’d like to enquire about '+p.name+' / '+v.label+' × '+quantity+' at the demo price of '+rupees(v.price)+' each.'
 return <div className="light"><div className="content"><Link className="text-link" to="/shop">← Store</Link><div className="detail-grid"><Gallery p={p}/><div className="stack">
 <Heading label={p.brand+' / '+p.condition} title={p.name}>{p.description}</Heading>
 <div className="row"><strong className="price large-price" aria-live="polite">{rupees(v.price)}</strong><Save p={p}/></div>
 <label>Configuration<select value={v.id} onChange={e=>{select(p.id,e.target.value);setN(1);setNotice('')}}>{p.variants.map(x=><option value={x.id} key={x.id}>{x.label}</option>)}</select></label>
 <label>Quantity<select value={quantity} onChange={e=>setN(Number(e.target.value))}>{Array.from({length:v.limit},(_,i)=><option key={i}>{i+1}</option>)}</select></label>
 <p className="muted">{remaining>0?'Availability confirmed by the shop.':'Demo cart limit reached for this configuration.'}</p>
 <div className="actions"><button className="action" disabled={remaining<quantity} onClick={()=>{add(p.id,v.id,quantity);setNotice(quantity+' added to cart')}}>Add to cart</button>
 {isPhone(p)&&<button className="action secondary" aria-pressed={compare.includes(p.id)} disabled={compare.length>=3&&!compare.includes(p.id)} onClick={()=>toggle(p.id)}>{compare.includes(p.id)?'Remove from comparison':'Compare'}</button>}</div>
 <p role="status">{notice}</p><WhatsApp message={message} label="Enquire on WhatsApp"/></div></div>
 <section className="spec-section"><h2>Specifications</h2><dl>{Object.entries(p.specs).map(([k,value])=><div className="row" key={k}><dt>{k}</dt><dd>{k==='Storage'?v.label.split(' / ')[1]??value:value}</dd></div>)}{p.warranty&&<div className="row"><dt>Warranty</dt><dd>{p.warranty}</dd></div>}</dl></section>
 <h2>Related products</h2><div className="product-grid">{p.related.map(getProduct).map(item=>item?<ProductCard p={item} key={item.id}/>:null)}</div></div></div>
}
export default function ProductDetail(){const p=getProduct(useParams().slug??'');return p?<Detail key={p.id} p={p}/>:<NotFound/>}
