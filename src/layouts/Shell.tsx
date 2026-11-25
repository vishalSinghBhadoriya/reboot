import {useEffect,useState,Suspense} from 'react'
import {ArrowDown,ArrowUpRight,Heart,Menu,Search,ShoppingBag,MessageCircle} from 'lucide-react'
import {Link,NavLink,Outlet,useLocation,useNavigate} from 'react-router-dom'
import {motion,useReducedMotion} from 'motion/react'
import Lenis from 'lenis'
import {Brand,Modal,Action} from '../components/ui'
import {business} from '../config/business'
import {cartItems,useShop} from '../stores/useShop'
import {rupees,whatsappUrl} from '../utils/format'
const nav=[['Repairs','/repairs'],['Smartphones','/shop/smartphones'],['Accessories','/shop/accessories'],['Repair estimator','/repair-estimator']]
const extra=[['Audio','/shop/audio'],['Refurbished','/shop/refurbished'],['Compare phones','/compare'],['About','/about'],['Contact','/contact']]
export function LoadingScreen(){return <div className="loading" role="status"><Brand/><span className="loading-track"/><span>Loading REBOOT</span></div>}
export default function Shell(){
 const {pathname}=useLocation(),navigate=useNavigate(),reduce=useReducedMotion()
 const [dialog,setDialog]=useState(''),[query,setQuery]=useState('')
 const [landing]=useState(pathname==='/')
 const cart=useShop(s=>s.cart),count=cart.reduce((sum,l)=>sum+l.quantity,0)
 const url=whatsappUrl(business.whatsapp,'Hi REBOOT, I have an enquiry.')
 useEffect(()=>{if(reduce||window.matchMedia('(pointer: coarse)').matches)return;const lenis=new Lenis({autoRaf:true});return ()=>lenis.destroy()},[reduce])
 useEffect(()=>{window.scrollTo(0,0)},[pathname])
 const openRoute=(to:string)=>{setDialog('');navigate(to)}
 return <>
 <a className="skip" href="#main">Skip to content</a>
 <header className={'site-header'+(/^\/(shop|product|wishlist)(\/|$)/.test(pathname)?' light-header':'')}><Brand/><nav aria-label="Primary navigation">{nav.map(([name,to])=><NavLink key={to} to={to}>{name}</NavLink>)}</nav>
 <div className="header-tools"><button className="icon" onClick={()=>setDialog('Search')} aria-label="Search"><Search size={19}/></button><Link to="/wishlist" className="icon" aria-label="Wishlist"><Heart size={19}/></Link>
 <button className="icon bag" onClick={()=>setDialog('Cart')} aria-label={'Cart, '+count+' items'}><ShoppingBag size={19}/>{count>0&&<i>{count}</i>}</button>
 <Link className="header-book" to="/book-repair">Book a repair <ArrowUpRight size={15}/></Link><button className="icon menu" onClick={()=>setDialog('Menu')} aria-label="Open menu"><Menu size={20}/></button></div></header>
 <main id="main" tabIndex={-1}><Suspense fallback={landing&&pathname==='/'?<LoadingScreen/>:<div className="route-loading" role="status">Loading page…</div>}><motion.div key={pathname} initial={reduce?false:{opacity:0,y:4}} animate={{opacity:1,y:0}} transition={{duration:reduce?0:.2}}><Outlet/></motion.div></Suspense></main>
 <footer className="site-footer"><div><Brand/><p>Repair. Upgrade. Reconnect.</p></div><nav aria-label="Footer navigation">{[...nav,...extra].map(([name,to])=><Link key={to} to={to}>{name}</Link>)}</nav><a href="#main" className="top-link" aria-label="Back to top"><ArrowDown size={20}/></a></footer>
 {url&&<a className="floating" target="_blank" rel="noreferrer" href={url} aria-label="Chat on WhatsApp"><MessageCircle/></a>}
 {dialog&&<Modal title={dialog} close={()=>setDialog('')}>
 {dialog==='Menu'&&<nav className="dialog-nav" aria-label="Site menu">{[...nav,...extra,['Book a repair','/book-repair']].map(([name,to])=><Link key={to} to={to} onClick={()=>setDialog('')}>{name}<ArrowUpRight/></Link>)}</nav>}
 {dialog==='Search'&&<form className="stack" onSubmit={e=>{e.preventDefault();openRoute('/shop?q='+encodeURIComponent(query.trim()))}}><label>Search the demo catalogue<input autoFocus value={query} onChange={e=>setQuery(e.target.value)} type="search" placeholder="Try earbuds or USB-C"/></label><button className="action">Search <Search size={16}/></button></form>}
 {dialog==='Cart'&&<div className="stack">{cart.length?cartItems(cart).map(l=><div className="row" key={l.id+l.variant}><span>{l.product.name}<small>{l.selection.label} × {l.quantity}</small></span><strong>{rupees(l.total)}</strong></div>):<p>Your cart is empty.</p>}<button className="action" onClick={()=>openRoute(cart.length?'/cart':'/shop')}>{cart.length?'View cart':'Explore store'}<ArrowUpRight size={17}/></button></div>}
 </Modal>}
 </>
}
export function NotFound(){return <div className="content"><h1>Page unavailable.</h1><Action to="/">Back to REBOOT</Action></div>}
