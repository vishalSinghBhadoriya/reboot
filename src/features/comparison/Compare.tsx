import {Action,Heading} from '../../components/ui'
import {comparisonValue,getProduct,isPhone,products,specKeys} from '../../data/products'
import {useShop} from '../../stores/useShop'
import {rupees} from '../../utils/format'
import {Link} from 'react-router-dom'
export default function Compare(){
 const ids=useShop(s=>s.compare),toggle=useShop(s=>s.comparePhone)
 const phones=ids.map(id=>getProduct(id)!)
 const keys=['Price',...specKeys,'Condition']
 const value=(p:typeof phones[number],key:string)=>key==='Price'?rupees(p.variants[0].price):comparisonValue(p,key)
 return <div className="content"><Heading label="DEVICE COMPARISON" title="Side by side.">Compare up to three demo smartphones and see where their specifications differ.</Heading>
 {ids.length<3&&<label className="compare-select">Add a smartphone<select value="" onChange={e=>{if(e.target.value)toggle(e.target.value)}}><option value="">Choose a device</option>{products.filter(p=>isPhone(p)&&!ids.includes(p.id)).map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></label>}
 {phones.length?<div className="table-wrap" tabIndex={0} aria-label="Scrollable smartphone comparison"><table><thead><tr><th scope="col">Specification</th>{phones.map(p=><th scope="col" key={p.id}><Link to={'/product/'+p.slug}>{p.name}</Link><button className="small-button" onClick={()=>toggle(p.id)} aria-label={'Remove '+p.name}>Remove</button></th>)}</tr></thead><tbody>{keys.map(key=><tr className={new Set(phones.map(p=>value(p,key))).size>1?'difference':''} key={key}><th scope="row">{key}</th>{phones.map(p=><td key={p.id}>{value(p,key)}</td>)}</tr>)}</tbody></table></div>:<div className="panel stack"><h2>No phones selected</h2><Action to="/shop/smartphones">Browse smartphones</Action></div>}</div>
}
