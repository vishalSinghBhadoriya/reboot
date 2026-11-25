import {Action,Heading} from '../../components/ui'
import {services} from '../../data/repairs'
import {rupees} from '../../utils/format'
export function ServiceList(){return <div className="service-list">{services.map(([id,name,symptom,price],i)=><div className="service" key={id}><span className="technical">{String(i+1).padStart(2,'0')}</span><div><h3>{name}</h3><p>{symptom}</p></div><strong>From {rupees(price*100)}</strong><Action secondary to={'/repair-estimator?issue='+id}>Estimate</Action></div>)}</div>}
export default function Repairs(){return <div className="content"><Heading label="REPAIR SERVICES" title="Fault found. Fix in sight.">Starting prices are demonstration values. The final quote follows inspection.</Heading><ServiceList/><Action to="/book-repair">Book a repair</Action></div>}
