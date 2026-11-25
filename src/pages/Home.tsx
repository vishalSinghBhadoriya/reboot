import {assetUrl} from '../utils/assets'
import {ArrowUpRight,AudioLines,BatteryCharging,Smartphone,Wrench} from 'lucide-react'
import {Link} from 'react-router-dom'
import DeviceHero from '../features/repairs/DeviceHero'
import {Action,WhatsApp} from '../components/ui'
import {useReveal} from '../animations/useReveal'
import {Anatomy} from '../features/repairs/Anatomy'
import BeforeAfter from '../features/repairs/BeforeAfter'
import {EstimatePreview} from '../features/estimator/Estimator'
import {ServiceList} from '../features/repairs/Repairs'
import {Save} from '../features/products/ProductCard'
import {getProduct} from '../data/products'
import {rupees} from '../utils/format'
import {process} from './Info'
const categories=[['Smartphones','/shop/smartphones',Smartphone],['Audio','/shop/audio',AudioLines],['Accessories','/shop/accessories',BatteryCharging],['Repair services','/repairs',Wrench]] as const
export default function Home(){
 const ref=useReveal()
 const featured=['axis-1','axis-one-renewed'].map(id=>getProduct(id)!)
 return <div ref={ref}><DeviceHero/><nav className="quick-nav" aria-label="Explore REBOOT">{categories.map(([label,url,Icon])=><Link key={url} to={url}><Icon size={19}/><span>{label}</span><ArrowUpRight size={15}/></Link>)}</nav>
 <Anatomy/><BeforeAfter/>
 <section className="section"><div className="section-kicker"><span>03 / REPAIR SERVICES</span><span>DEMO STARTING PRICES</span></div><div className="section-title"><h2>Fix what failed.</h2><p>Get a starting price, then bring your device in for a confirmed quote.</p></div><ServiceList/></section>
 <section className="section estimator-band"><div><div className="eyebrow"><b/> REPAIR ESTIMATOR</div><h2>What will it cost?</h2><p>Choose your device and the issue for an indicative price.</p></div><EstimatePreview/></section>
 <section className="section light"><div className="section-kicker"><span>04 / SMARTPHONES</span><span>DEMO CATALOGUE</span></div><div className="section-title"><h2>Your next device.</h2><Action to="/shop/smartphones" secondary>Shop smartphones</Action></div>
 <div className="feature-products">{featured.map(p=><article key={p.id} className="feature-product reveal"><div className="feature-photo"><Link to={'/product/'+p.slug}><img src={assetUrl(p.images[0])} alt={'Illustrative '+p.name+' concept phone'} loading="lazy"/></Link><Save p={p}/></div><div className="feature-copy"><span className="technical">{p.condition}</span><h3>{p.name}</h3><p>{p.specs.Display} / {p.specs.Storage}</p><strong className="price">{rupees(p.variants[0].price)}</strong><Action to={'/product/'+p.slug} secondary>View device</Action></div></article>)}</div></section>
 <section className="section gear"><div className="section-kicker"><span>05 / AUDIO & ACCESSORIES</span><span>DEMO CATALOGUE</span></div><div className="section-title"><h2>Gear for the everyday.</h2></div><div className="gear-grid">
 <Link className="gear-item reveal" to="/shop/audio"><img src={assetUrl('/images/headphones.webp')} loading="lazy" alt="Graphite over-ear headphones"/><div><h3>Listen.</h3><p>Earbuds, wired earphones and headphones</p><ArrowUpRight/></div></Link>
 <Link className="gear-item reveal" to="/shop/accessories"><img src={assetUrl('/images/power.webp')} loading="lazy" alt="Slim metallic power bank"/><div><h3>Power & protect.</h3><p>Chargers, cables, power banks, cases and glass</p><ArrowUpRight/></div></Link>
 </div></section>
 <section className="section lab"><div className="section-kicker"><span>06 / INSIDE THE LAB</span></div><div className="section-title"><h2>From fault to fix.</h2><p>See the steps your device goes through after you bring it in.</p></div><ol className="timeline">{process.map(item=><li key={item}>{item}</li>)}</ol></section>
 <section className="section light editorial"><div className="eyebrow"><b/> REPAIR OR REPLACE?</div><h2>Tech deserves<br/>a second life.</h2><div><p>A repair can cost less than replacing a device and keep it useful for longer.</p><p>Replacing a worn part can also keep the rest of the device out of the e-waste stream. Ask for an inspection and use the quote to decide what makes sense.</p><Action to="/about" secondary>About REBOOT</Action></div></section>
 <section className="section final-cta"><div className="eyebrow"><b/> READY WHEN YOU ARE</div><h2>YOUR TECH.<br/>BACK TO LIFE.</h2><div className="actions"><Action to="/book-repair">Book a repair</Action><WhatsApp message="Hi REBOOT, I’d like to ask about a repair." label="Chat on WhatsApp"/><Action to="/shop" secondary>Explore store</Action></div></section>
 </div>
}
