import {useState} from 'react'
import {Link,useSearchParams} from 'react-router-dom'
import {ArrowRight} from 'lucide-react'
import {motion,useReducedMotion} from 'motion/react'
import {Action,Heading,WhatsApp} from '../../components/ui'
import {brands,estimate,modelsFor,services,validRepair,type Issue,type Repair,type Quality} from '../../data/repairs'
import {useShop} from '../../stores/useShop'
import {rupees} from '../../utils/format'
export function DeviceSelector({r,update,prefix}:{r:Repair;update:(c:Partial<Repair>)=>void;prefix:string}){
 const options=modelsFor(r.brand)
 const custom=r.brand==='Other'||Boolean(r.model&&!options.some(m=>m.name===r.model))
 return <div className="fields"><label htmlFor={prefix+'brand'}>Brand<select id={prefix+'brand'} value={r.brand} onChange={e=>update({brand:e.target.value,model:''})}><option value="">Select brand</option>{[...brands,'Other'].map(b=><option key={b}>{b}</option>)}</select></label>
 <label htmlFor={prefix+'device'}>Model{custom?<input id={prefix+'device'} value={r.model==='Other model'?'':r.model} onChange={e=>update({model:e.target.value||'Other model'})} placeholder="Enter device model"/>:<select id={prefix+'device'} value={r.model} disabled={!r.brand} onChange={e=>update({model:e.target.value})}><option value="">Select model</option>{options.map(m=><option key={m.name}>{m.name}</option>)}<option>Other model</option></select>}</label></div>
}
export function EstimatePreview(){
 const repair=useShop(s=>s.repair),update=useShop(s=>s.updateRepair)
 const result=estimate(repair),ready=validRepair(repair)
 return <div className="estimate-panel"><DeviceSelector r={repair} update={update} prefix="preview"/><label>What needs fixing?<select value={repair.issues[0]??''} onChange={e=>update({issues:e.target.value?[e.target.value as Issue]:[]})}><option value="">Select an issue</option>{services.map(([id,name])=><option key={id} value={id}>{name}</option>)}</select></label>
 <div className="row estimate-result" aria-live="polite"><span>Demo estimate</span><strong>{ready?(result.incomplete?'Request a quote':rupees(result.total)):'—'}</strong></div>
 <Action to={ready?'/book-repair?from=estimate':'/repair-estimator'}>{ready?'Continue to booking':'Open estimator'}</Action></div>
}
export default function Estimator(){
 const [params]=useSearchParams()
 const stored=useShop(s=>s.repair),update=useShop(s=>s.updateRepair),reduce=useReducedMotion()
 const prefill=services.find(s=>s[0]===params.get('issue'))?.[0]
 const [usePrefill,setPrefill]=useState(Boolean(prefill)),[step,setStep]=useState(0)
 const r=usePrefill&&prefill?{...stored,issues:[prefill]}:stored
 const change=(value:Partial<Repair>)=>{setPrefill(false);update({...r,...value})}
 const result=estimate(r)
 const modelReady=Boolean(r.brand&&r.model.trim()&&r.model!=='Other model')
 const canContinue=step===0?modelReady:step===1?r.issues.length>0:validRepair(r)
 const message='Hi REBOOT, please confirm a repair quote for '+r.brand+' '+r.model+'. '+result.lines.map(l=>l.name).join(', ')+'.'
 const qualityApplicable=r.issues.includes('screen')||r.issues.includes('battery')
 function advance(){
  if(step===1&&!qualityApplicable){change({quality:'compatible'});setStep(3);return}
  change({});setStep(step+1)
 }
 return <div className="content narrow"><Heading label="REPAIR ESTIMATOR" title="Find your repair price.">Demo prices for supported devices. Inspection is required for a confirmed quote.</Heading>
 <div className="step-nav" aria-label="Estimator steps">{['Device','Problems','Part option','Estimate'].map((label,i)=><button key={label} className={i===step?'active':''} disabled={i>step} aria-current={i===step?'step':undefined} onClick={()=>setStep(i)}>{i+1}. {label}</button>)}</div>
 <motion.section className="panel stack" key={step} initial={reduce?false:{opacity:0,x:8}} animate={{opacity:1,x:0}}>
 {step===0&&<><h2>Your device</h2><DeviceSelector r={r} update={change} prefix="estimate"/></>}
 {step===1&&<><h2>Select one or more problems</h2><fieldset className="checks"><legend className="sr-only">Repair requirements</legend>{services.map(([id,name])=><label key={id}><input type="checkbox" checked={r.issues.includes(id)} onChange={e=>change({issues:e.target.checked?[...r.issues,id]:r.issues.filter(x=>x!==id)})}/>{name}</label>)}</fieldset></>}
 {step===2&&<><h2>Replacement part option</h2><label>Part grade<select value={r.quality} onChange={e=>change({quality:e.target.value as Quality})}><option value="compatible">Compatible</option><option value="premium">Premium</option></select></label><p className="muted">Premium prices are listed for supported screens and batteries. Other combinations may require a quote.</p></>}
 {step===3&&<><h2>{r.brand} {r.model}</h2>{result.lines.map(l=><div className="row" key={l.name}><span>{l.name}</span><strong>{l.amount===null?'Request a quote':rupees(l.amount)}</strong></div>)}<div className="row"><strong>{result.incomplete?'Priced repairs subtotal':'Estimated total'}</strong><strong>{result.total||!result.incomplete?rupees(result.total):'Request a quote'}</strong></div><p>Subject to inspection, part availability and shop approval.</p><div className="actions"><Action to="/book-repair?from=estimate">Continue to booking</Action><WhatsApp message={message} label="Ask on WhatsApp"/></div></>}
 {step<3&&<div className="actions">{step>0&&<button className="action secondary" onClick={()=>setStep(step-1)}>Back</button>}<button className="action" disabled={!canContinue} onClick={advance}>Continue<ArrowRight size={17}/></button></div>}
 </motion.section><Link className="text-link" to="/repairs">Browse repair services</Link></div>
}
