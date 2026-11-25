import {useState,type FormEvent} from 'react'
import {Action,Heading,WhatsApp} from '../../components/ui'
import {business} from '../../config/business'
import {subtotal,useShop} from '../../stores/useShop'
import {rupees,validMobile} from '../../utils/format'
import {orderMessage} from '../../utils/messages'
export default function Checkout(){
 const cart=useShop(s=>s.cart),[method,setMethod]=useState('Pickup'),[review,setReview]=useState<{message:string;cart:typeof cart}|null>(null),[error,setError]=useState('')
 const fee=method==='Delivery'?business.deliveryPaise:0
 function submit(e:FormEvent<HTMLFormElement>){
  e.preventDefault()
  const c=Object.fromEntries([...new FormData(e.currentTarget)].map(([k,v])=>[k,String(v).trim()]))
  if(!c.name||!validMobile(c.mobile)||(method==='Delivery'&&!c.address)){setError('Enter your name, an Indian mobile number and an address for delivery.');setReview(null);return}
  setError('');setReview({message:orderMessage(cart,c,fee,business.name),cart})
 }
 return <div className="content narrow"><Heading label="WHATSAPP CHECKOUT" title="Prepare your order.">The shop confirms product availability, delivery charges and the final order after receiving your message.</Heading>
 {cart.length?<><form className="panel stack" onSubmit={submit} onChange={()=>{if(review)setReview(null)}}><div className="fields"><label>Customer name<input name="name" autoComplete="name" required/></label><label>Indian mobile number<input name="mobile" type="tel" autoComplete="tel" required/></label></div>
 <label>Fulfilment<select name="method" value={method} onChange={e=>setMethod(e.target.value)}><option>Pickup</option>{business.delivery&&<option>Delivery</option>}</select></label>
 {method==='Delivery'&&<label>Delivery address<textarea name="address" autoComplete="street-address" required/></label>}
 <label>Order notes<textarea name="notes"/></label>
 <div className="row"><span>Estimated total{fee===null?' before delivery':''}</span><strong>{rupees(subtotal(cart)+(fee??0))}</strong></div>
 {error&&<p role="alert">{error}</p>}<button className="action">Review order message</button></form>
 {review&&review.cart===cart&&<section className="panel stack" aria-live="polite"><h2>Review your order enquiry</h2><p className="message">{review.message}</p><WhatsApp message={review.message} label="Continue in WhatsApp"/><small>Review and send the order enquiry manually from WhatsApp.</small></section>}</>:<div className="panel stack"><h2>Your cart is empty.</h2><Action to="/shop">Browse products</Action></div>}</div>
}
