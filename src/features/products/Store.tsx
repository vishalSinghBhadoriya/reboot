import {useEffect,useState} from 'react'
import {Link,useParams,useSearchParams} from 'react-router-dom'
import {Heading} from '../../components/ui'
import {NotFound} from '../../layouts/Shell'
import {categories,filterProducts,groups,products} from '../../data/products'
import {useShop} from '../../stores/useShop'
import ProductCard from './ProductCard'
const tabs=[['All products','/shop'],['Smartphones','/shop/smartphones'],['Refurbished','/shop/refurbished'],['Audio','/shop/audio'],['Accessories','/shop/accessories']]
export default function Store(){
 const {group}=useParams(),[params,setParams]=useSearchParams(),compare=useShop(s=>s.compare.length)
 const query=params.get('q')??''
 const [debounced,setDebounced]=useState(query),[category,setCategory]=useState(''),[brand,setBrand]=useState(''),[condition,setCondition]=useState(''),[max,setMax]=useState(''),[sort,setSort]=useState('')
 useEffect(()=>{const t=setTimeout(()=>setDebounced(query),220);return ()=>clearTimeout(t)},[query])
 if(group&&!Object.hasOwn(groups,group))return <NotFound/>
 const allowed=group?groups[group]:categories
 const base=products.filter(p=>allowed.includes(p.category))
 const results=filterProducts(base,{query:debounced,category,brand,condition,max:max?Number(max):Infinity,sort})
 const title=tabs.find(([,url])=>url==='/shop/'+group)?.[0]??'The REBOOT store'
 return <div className="light"><div className="content"><Heading label="THE STORE" title={title}>Demo catalogue. Prices, configurations and imagery are illustrative. Availability is confirmed by the shop.</Heading>
 <nav className="tabs" aria-label="Catalogue categories">{tabs.map(([label,url])=><Link key={url} to={url} aria-current={url===(group?'/shop/'+group:'/shop')?'page':undefined}>{label}</Link>)}</nav>
 <div className="filters"><label>Search<input value={query} type="search" onChange={e=>setParams(e.target.value?{q:e.target.value}:{},{replace:true})} placeholder="Search products"/></label>
 <label>Category<select value={category} onChange={e=>setCategory(e.target.value)}><option value="">All categories</option>{allowed.map(c=><option key={c}>{c}</option>)}</select></label>
 <label>Brand<select value={brand} onChange={e=>setBrand(e.target.value)}><option value="">All brands</option>{[...new Set(base.map(p=>p.brand))].sort().map(b=><option key={b}>{b}</option>)}</select></label>
 <label>Condition<select value={condition} onChange={e=>setCondition(e.target.value)}><option value="">Any condition</option><option>New</option><option>Refurbished</option></select></label>
 <label>Maximum price (₹)<input type="number" min="0" value={max} onChange={e=>setMax(e.target.value)} placeholder="Any price"/></label>
 <label>Sort by<select value={sort} onChange={e=>setSort(e.target.value)}><option value="">Featured</option><option value="low">Price low to high</option><option value="high">Price high to low</option></select></label></div>
 <div className="row result-count"><p role="status">{results.length} {results.length===1?'product':'products'}</p><Link to="/compare">Compare phones ({compare}/3)</Link></div>
 {results.length?<div className="product-grid">{results.map(p=><ProductCard p={p} key={p.id}/>)}</div>:<div className="panel stack"><h2>No matching products</h2><button className="action" onClick={()=>{setParams({});setCategory('');setBrand('');setCondition('');setMax('');setSort('')}}>Clear filters</button></div>}</div></div>
}
