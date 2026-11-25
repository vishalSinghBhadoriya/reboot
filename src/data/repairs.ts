export const services = [
 ['screen','Screen replacement','Cracked glass, flicker or unresponsive touch',1499],['battery','Battery replacement','Fast drain or unexpected shutdowns',999],['port','Charging port repair','Loose cable or intermittent charging',699],['camera','Camera repair','Blur, focus issues or a blank view',1299],['audio','Speaker & microphone repair','Distorted sound or muffled calls',699],['water','Water damage inspection','Liquid exposure or moisture warnings',499],['software','Software troubleshooting','Boot loops, crashes or slow performance',499],['board','Motherboard diagnosis','No power or intermittent faults',799],['glass','Back glass replacement','Chipped or cracked rear glass',999],
] as const
export type Issue = (typeof services)[number][0]
export type Quality = 'compatible'|'premium'
export type Repair = {brand:string;model:string;issues:Issue[];quality:Quality}
export const initialRepair:Repair={brand:'',model:'',issues:[],quality:'compatible'}
type DeviceRow = [string,string,number,number,number,number?]
const rows:DeviceRow[]=[
 ['Apple','iPhone 13',6499,2999,2499,3699],['Apple','iPhone 14',7999,3499,2799,4499],['Samsung','Galaxy A35',4299,1799,1299,2099],['Samsung','Galaxy S23',8999,2599,2299],['OnePlus','Nord CE 4',3699,1599,1099],['Xiaomi','Xiaomi 14',7599,2499,1799],['Redmi','Note 13',2799,1299,899],['Realme','Realme 12',2899,1299,899],['Vivo','V30',4599,1799,1199],['Oppo','Reno 11',4299,1699,1099],['Nothing','Phone (2a)',4599,1899,1499],['Motorola','Edge 50 Fusion',3999,1599,1199],['Google Pixel','Pixel 8a',6799,2499,1799],
]
type Prices=Partial<Record<Issue,Partial<Record<Quality,number>>>>
export const models=rows.map(([brand,name,screen,battery,port,camera])=>{
 const prices:Prices={screen:{compatible:screen*100,premium:Math.round(screen*1.48)*100},battery:{compatible:battery*100,premium:Math.round(battery*1.35)*100},port:{compatible:port*100},...(camera?{camera:{compatible:camera*100}}:{})}
 return {brand,name,prices}
})
export const brands=[...new Set(models.map(m=>m.brand))]
export const modelsFor=(brand:string)=>models.filter(m=>m.brand===brand)
export const validRepair=(r:Repair)=>Boolean(r.brand&&r.model.trim()&&r.model!=='Other model'&&r.issues.length)
export function estimate(r:Repair){
 const device=models.find(m=>m.brand===r.brand&&m.name===r.model)
 const lines=services.filter(s=>r.issues.includes(s[0])).map(([id,name])=>({name,amount:device?.prices[id]?.[id==='screen'||id==='battery'?r.quality:'compatible']??null}))
 return {lines,total:lines.reduce((sum,l)=>sum+(l.amount??0),0),incomplete:lines.some(l=>l.amount===null)}
}
