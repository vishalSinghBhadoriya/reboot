import {Action,Heading,WhatsApp} from '../components/ui'
import {business} from '../config/business'
export const process=['Device inspection','Problem diagnosis','Customer approval','Professional repair','Quality testing','Device collection']
export default function Info({contact=false}:{contact?:boolean}){
 const {name,address,phone,email,hours,maps,whatsapp,socials}=business
 const contactReady=address||phone||email||hours||maps||whatsapp||socials.length>0
 if(!contact)return <div className="content narrow"><Heading label="ABOUT REBOOT" title="Tech deserves a second life.">REBOOT is a mobile repair and electronics store concept built around keeping useful technology in service.</Heading><p className="intro">An inspection can help you weigh repair costs against the cost of a replacement. A clear diagnosis makes it easier to choose what happens next.</p><ol className="timeline">{process.map(item=><li key={item}>{item}</li>)}</ol><Action to="/contact">Contact REBOOT</Action></div>
 const schema=address&&phone?{'@context':'https://schema.org','@type':'LocalBusiness',name,address,telephone:phone,...(business.siteUrl?{url:business.siteUrl}:{})}:null
 return <div className="content narrow"><Heading label="CONTACT" title="Connect with REBOOT.">For device repairs, shop visits and product enquiries.</Heading>
 {schema&&<script type="application/ld+json">{JSON.stringify(schema).replaceAll('<','\\u003c')}</script>}
 <section className="panel stack">{!contactReady&&<p>Shop contact details and visiting hours are pending verification.</p>}{address&&<address>{address}</address>}{hours&&<p>{hours}</p>}{phone&&<a href={'tel:'+phone}>{phone}</a>}{email&&<a href={'mailto:'+email}>{email}</a>}{maps&&<a href={maps} target="_blank" rel="noreferrer">Get directions</a>}{socials.map(s=><a href={s.url} key={s.url}>{s.name}</a>)}{whatsapp&&<WhatsApp message={'Hi '+name+', I have an enquiry.'}/>}<Action to="/book-repair">Prepare a repair enquiry</Action></section></div>
}
