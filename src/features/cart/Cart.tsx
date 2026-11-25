import {assetUrl} from '../../utils/assets'
import {Action,Heading} from '../../components/ui'
import {Link} from 'react-router-dom'
import {cartItems,subtotal,useShop} from '../../stores/useShop'
import {business} from '../../config/business'
import {rupees} from '../../utils/format'
export default function Cart(){
 const cart=useShop(s=>s.cart),quantity=useShop(s=>s.quantity)
 return <div className="content"><Heading label="YOUR ORDER" title="Shopping cart.">Demo prices and product availability are subject to shop confirmation.</Heading>
 {cart.length?<div className="cart-grid"><div>{cartItems(cart).map(l=><article className="cart-line" key={l.id+l.variant}><Link to={'/product/'+l.id}><img src={assetUrl(l.product.images[0])} alt=""/></Link><div><Link to={'/product/'+l.id}><h3>{l.product.name}</h3></Link><p>{l.selection.label} · {rupees(l.selection.price)} each</p><div className="quantity"><button aria-label={'Decrease '+l.product.name+' quantity'} onClick={()=>quantity(l.id,l.variant,l.quantity-1)}>−</button><output aria-label="Quantity">{l.quantity}</output><button aria-label={'Increase '+l.product.name+' quantity'} disabled={l.quantity>=l.selection.limit} onClick={()=>quantity(l.id,l.variant,l.quantity+1)}>+</button></div></div><div className="cart-total"><strong>{rupees(l.total)}</strong><button className="text-link" onClick={()=>quantity(l.id,l.variant,0)}>Remove</button></div></article>)}</div>
 <aside className="panel stack"><h2>Order estimate</h2><div className="row"><span>Subtotal</span><strong>{rupees(subtotal(cart))}</strong></div>{business.delivery&&<p className="muted">{business.deliveryPaise===null?'Delivery charges, if applicable, are confirmed by the shop.':'Delivery option: '+rupees(business.deliveryPaise)}</p>}<div className="row"><span>Estimated pickup total</span><strong>{rupees(subtotal(cart))}</strong></div><Action to="/checkout">Prepare WhatsApp order</Action></aside></div>:<div className="panel stack"><h2>Your cart is empty.</h2><Action to="/shop">Explore the store</Action></div>}</div>
}
