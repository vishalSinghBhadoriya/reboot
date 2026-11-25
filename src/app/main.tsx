import {assetUrl} from '../utils/assets'
import {Component,type ReactNode,lazy,useEffect} from 'react'
import {createRoot} from 'react-dom/client'
import {BrowserRouter,Route,Routes,useLocation} from 'react-router-dom'
import Shell,{NotFound} from '../layouts/Shell'
import {getProduct} from '../data/products'
import {business} from '../config/business'
import '@fontsource/space-grotesk/700.css'
import '@fontsource/sora/400.css'
import '@fontsource/sora/600.css'
import '@fontsource/ibm-plex-mono/500.css'
import '../styles/main.css'
import '../styles/flows.css'
import '../styles/orbital.css'
const Home=lazy(()=>import('../pages/Home')),Repairs=lazy(()=>import('../features/repairs/Repairs')),Estimator=lazy(()=>import('../features/estimator/Estimator')),Booking=lazy(()=>import('../features/booking/Booking'))
const Store=lazy(()=>import('../features/products/Store')),Detail=lazy(()=>import('../features/products/Detail')),Compare=lazy(()=>import('../features/comparison/Compare')),Cart=lazy(()=>import('../features/cart/Cart')),Checkout=lazy(()=>import('../features/checkout/Checkout')),Wishlist=lazy(()=>import('../features/wishlist/Wishlist')),Info=lazy(()=>import('../pages/Info'))
const pages:Record<string,string>={'/repairs':'Repair services','/repair-estimator':'Repair estimator','/book-repair':'Book a repair','/shop':'Store','/shop/smartphones':'Smartphones','/shop/accessories':'Accessories','/shop/audio':'Audio','/shop/refurbished':'Refurbished phones','/compare':'Compare smartphones','/cart':'Cart','/checkout':'WhatsApp checkout','/wishlist':'Wishlist','/about':'About','/contact':'Contact'}
function Metadata(){
 const {pathname:rawPath}=useLocation()
 const pathname=rawPath.replace(/\/+$/,'')||'/'
 useEffect(()=>{
  const product=pathname.startsWith('/product/')?getProduct(pathname.split('/')[2]):undefined
  const page=product?.name??pages[pathname]??(pathname==='/'?'Repair. Upgrade. Reconnect.':'Page unavailable')
  const title=page+' | '+business.name
  const description=product?.description??(pathname==='/'?'Expert repairs. Premium technology. A second life for your devices.':page+' at REBOOT. Explore repair and electronics services in India.')
  document.title=title
  document.querySelector('meta[name="description"]')?.setAttribute('content',description)
  document.querySelector('meta[property="og:title"]')?.setAttribute('content',title)
  document.querySelector('meta[property="og:description"]')?.setAttribute('content',description)
  document.querySelector('meta[property="og:image"]')?.setAttribute('content',new URL(assetUrl(product?.images[0]??'/images/hero.webp'),business.siteUrl||location.origin).href)
 },[pathname])
 return null
}
class ErrorBoundary extends Component<{children:ReactNode},{failed:boolean}>{
 state={failed:false}
 static getDerivedStateFromError(){return {failed:true}}
 render(){return this.state.failed?<div className="content"><h1>REBOOT couldn’t load this page.</h1><a href={import.meta.env.BASE_URL}>Return to the homepage</a></div>:this.props.children}
}
createRoot(document.getElementById('root')!).render(<ErrorBoundary><BrowserRouter basename={import.meta.env.BASE_URL}><Metadata/><Routes><Route element={<Shell/>}>
<Route index element={<Home/>}/><Route path="repairs" element={<Repairs/>}/><Route path="repair-estimator" element={<Estimator/>}/><Route path="book-repair" element={<Booking/>}/>
<Route path="shop" element={<Store/>}/><Route path="shop/:group" element={<Store/>}/><Route path="product/:slug" element={<Detail/>}/><Route path="compare" element={<Compare/>}/>
<Route path="cart" element={<Cart/>}/><Route path="checkout" element={<Checkout/>}/><Route path="wishlist" element={<Wishlist/>}/><Route path="about" element={<Info/>}/><Route path="contact" element={<Info contact/>}/><Route path="*" element={<NotFound/>}/>
</Route></Routes></BrowserRouter></ErrorBoundary>)
