import {assetUrl} from '../utils/assets'
import {useEffect,useRef,type PointerEvent,type ReactNode} from 'react'
import {ArrowUpRight,X} from 'lucide-react'
import {Link} from 'react-router-dom'
import {business} from '../config/business'
import {whatsappUrl} from '../utils/format'
export function Brand(){return <Link className="brand" to="/" aria-label={business.name+' home'}>{business.logo?<img src={assetUrl(business.logo)} alt={business.name}/>:<><span className="brand-mark" aria-hidden="true"><i/><i/><i/></span>{business.name}</>}</Link>}
function pullAction(event:PointerEvent<HTMLAnchorElement>){
 if(event.pointerType!=='mouse'||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return
 const link=event.currentTarget
 const rect=link.getBoundingClientRect()
 link.style.setProperty('--action-x',((event.clientX-rect.left)/rect.width-.5)*7+'px')
}
export function Action({to,children,secondary=false}:{to:string;children:ReactNode;secondary?:boolean}){
 return <Link className={'action '+(secondary?'secondary':'')} to={to} onPointerMove={pullAction} onPointerLeave={e=>e.currentTarget.style.removeProperty('--action-x')}>{children}<ArrowUpRight size={17}/></Link>
}
export function Heading({label,title,children}:{label:string;title:string;children?:ReactNode}){return <header className="page-heading"><span className="eyebrow"><b/> {label}</span><h1>{title}</h1>{children&&<p>{children}</p>}</header>}
export function WhatsApp({message,label='Open WhatsApp'}:{message:string;label?:string}){
 const url=whatsappUrl(business.whatsapp,message)
 return url?<a className="action" href={url} target="_blank" rel="noreferrer">{label}<ArrowUpRight size={17}/></a>:<p className="muted">WhatsApp enquiries will be available once the shop number is configured.</p>
}
export function Modal({title,children,close}:{title:string;children:ReactNode;close:()=>void}){
 const ref=useRef<HTMLDialogElement>(null)
 useEffect(()=>{const dialog=ref.current;dialog?.showModal();return ()=>{dialog?.close()}},[])
 return <dialog ref={ref} className="modal" aria-label={title} onCancel={e=>{e.preventDefault();close()}}><div className="modal-title"><h2>{title}</h2><button className="icon" aria-label="Close dialog" onClick={close}><X/></button></div>{children}</dialog>
}
