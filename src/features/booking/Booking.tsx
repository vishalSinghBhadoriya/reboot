import {useState,type FormEvent} from 'react'
import {useSearchParams} from 'react-router-dom'
import {Heading,WhatsApp} from '../../components/ui'
import {business} from '../../config/business'
import {brands,services,modelsFor} from '../../data/repairs'
import {useShop} from '../../stores/useShop'
import {localDate,validMobile} from '../../utils/format'
import {repairMessage} from '../../utils/messages'
export default function Booking(){
 const [params]=useSearchParams(),repair=useShop(s=>s.repair),prefill=params.get('from')==='estimate'
 const [brand,setBrand]=useState(prefill?repair.brand:''),[model,setModel]=useState(prefill?repair.model:'')
 const [summary,setSummary]=useState(''),[error,setError]=useState('')
 function submit(e:FormEvent<HTMLFormElement>){
  e.preventDefault()
  const c=Object.fromEntries([...new FormData(e.currentTarget)].map(([k,v])=>[k,String(v).trim()]))
  if(!c.name||!validMobile(c.mobile)||!c.model||!c.issue||c.date<localDate()){setError('Enter a name, an Indian mobile number, device and repair details, and a current or future date.');setSummary('');return}
  setError('');setSummary(repairMessage(c,business.name))
 }
 return <div className="content narrow"><Heading label="APPOINTMENT ENQUIRY" title="Book a repair.">Tell us what happened and when you’d like to visit. The shop confirms appointment availability.</Heading>
 <form className="panel stack" onSubmit={submit} onChange={()=>{if(summary)setSummary('')}}>
 <div className="fields"><label>Customer name<input name="name" autoComplete="name" required/></label><label>Indian mobile number<input name="mobile" type="tel" autoComplete="tel" required placeholder="+91"/></label>
 <label>Device brand<select name="brand" required value={brand} onChange={e=>{setBrand(e.target.value);setModel('')}}><option value="">Choose brand</option>{[...brands,'Other'].map(b=><option key={b}>{b}</option>)}</select></label>
 <label>Device model<input name="model" list="booking-models" value={model} onChange={e=>setModel(e.target.value)} required/><datalist id="booking-models">{modelsFor(brand).map(x=><option key={x.name} value={x.name}/>)}</datalist></label></div>
 <label>Repair requirement<input name="issue" required defaultValue={prefill?services.filter(s=>repair.issues.includes(s[0])).map(s=>s[1]).join(', '):''} placeholder="e.g. Screen replacement"/></label><label>Additional details<textarea name="notes"/></label>
 <div className="fields"><label>Preferred date<input name="date" type="date" min={localDate()} required/></label><label>Preferred time (IST)<input name="time" type="time" required/></label></div>
 {business.pickupRepair&&<label className="check"><input type="checkbox" name="pickup"/> Request pickup</label>}
 {error&&<p role="alert">{error}</p>}<button className="action">Review enquiry</button></form>
 {summary&&<section className="panel stack" aria-live="polite"><h2>Review your enquiry</h2><p className="message">{summary}</p><WhatsApp message={summary} label="Continue in WhatsApp"/><small>Review and send the message in WhatsApp to request your appointment.</small></section>}</div>
}
