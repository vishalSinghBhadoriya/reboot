import {cartItems,subtotal,type CartLine} from '../stores/useShop'
import {rupees} from './format'
export function orderMessage(cart:CartLine[],c:Record<string,string>,fee:number|null,name='REBOOT'){
 return [name+' order enquiry',...cartItems(cart).map(l=>l.product.name+' / '+l.selection.label+' · '+l.quantity+' × '+rupees(l.selection.price)+' = '+rupees(l.total)),
 'Estimated total: '+rupees(subtotal(cart)+(fee??0)), 'Name: '+c.name,'Mobile: '+c.mobile,'Fulfilment: '+c.method,
 ...(c.method==='Delivery'?['Delivery: '+(fee===null?'Charge to be confirmed':rupees(fee)),'Address: '+c.address]:[]),...(c.notes?['Notes: '+c.notes]:[])].join('\n')
}
export function repairMessage(c:Record<string,string>,name='REBOOT'){
 return [name+' repair appointment enquiry','Name: '+c.name,'Mobile: '+c.mobile,'Device: '+c.brand+' '+c.model,'Repair: '+c.issue,'Preferred appointment: '+c.date+' at '+c.time,...(c.notes?['Details: '+c.notes]:[]),...(c.pickup?['Pickup requested']:[])].join('\n')
}
