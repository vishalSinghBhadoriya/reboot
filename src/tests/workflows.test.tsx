import {afterEach,beforeEach,describe,expect,it} from 'vitest'
import {cleanup,fireEvent,render,screen} from '@testing-library/react'
import {MemoryRouter} from 'react-router-dom'
import {estimate,initialRepair,modelsFor,validRepair} from '../data/repairs'
import {comparisonValue,filterProducts,getProduct,products} from '../data/products'
import {subtotal,useShop} from '../stores/useShop'
import {rupees,validMobile,whatsappUrl} from '../utils/format'
import {orderMessage,repairMessage} from '../utils/messages'
import Estimator from '../features/estimator/Estimator'
import Compare from '../features/comparison/Compare'
beforeEach(()=>{localStorage.clear();useShop.setState({cart:[],wishlist:[],compare:[],variants:{},repair:initialRepair})})
afterEach(cleanup)
describe('Repair enquiry',()=>{
 it('formats integer paise with Indian currency grouping',()=>{expect(rupees(12499900)).toBe('₹1,24,999');expect(rupees(125)).toBe('₹1.25')})
 it('lists only models from the selected brand',()=>{expect(modelsFor('Apple').map(m=>m.name)).toEqual(['iPhone 13','iPhone 14']);expect(modelsFor('Other')).toEqual([])})
 it('uses model and grade-specific prices and flags unknown prices',()=>{
  const r={brand:'Apple',model:'iPhone 13',issues:['screen','battery','water'] as const,quality:'compatible' as const}
  const selections={...r,issues:[...r.issues]}
  expect(estimate(selections)).toMatchObject({total:949800,incomplete:true})
  expect(estimate({...selections,quality:'premium'}).total).toBeGreaterThan(949800)
  expect(estimate({...selections,model:'Unknown'}).total).toBe(0)
  expect(validRepair(initialRepair)).toBe(false)
 })
 it('requires a device and a repair problem before showing a price',()=>{
  render(<MemoryRouter><Estimator/></MemoryRouter>)
  const next=()=>screen.getByRole('button',{name:/^Continue$/}) as HTMLButtonElement
  expect(next().disabled).toBe(true)
  fireEvent.change(screen.getByLabelText('Brand'),{target:{value:'Apple'}})
  fireEvent.change(screen.getByLabelText('Model'),{target:{value:'iPhone 13'}})
  fireEvent.click(next())
  expect(next().disabled).toBe(true)
  fireEvent.click(screen.getByLabelText('Screen replacement'))
  fireEvent.click(next())
  fireEvent.click(next())
  expect(screen.getAllByText('₹6,499').length).toBeGreaterThan(0)
 })
 it('validates and encodes the WhatsApp target and details',()=>{
  expect(validMobile('0987654321')).toBe(false)
  const message=repairMessage({name:'A & B',mobile:'9876543210',brand:'Apple',model:'iPhone 13',issue:'Screen',date:'2027-01-02',time:'12:30'})
  const url=new URL(whatsappUrl('+91 98765 43210',message)!)
  expect(url.pathname).toBe('/919876543210')
  expect(url.searchParams.get('text')).toContain('A & B')
  expect(whatsappUrl('',message)).toBeNull()
 })
})
describe('Retail workflows',()=>{
 it('combines search, category, brand, condition, price and sorting',()=>{
  const filters={query:'usb-c',category:'Chargers',brand:'Volt',condition:'New',max:1800,sort:'high'}
  const filtered=filterProducts(products,filters)
  expect(filtered.map(p=>p.name)).toEqual(['Volt 45','Volt 20'])
  expect(filterProducts(products,{...filters,sort:'low'}).map(p=>p.name)).toEqual(['Volt 20','Volt 45'])
 })
 it('uses variant prices, caps quantities and calculates the right totals',()=>{
  const s=useShop.getState()
  s.select('axis-1','upgrade');s.add('axis-1','upgrade',10);s.add('volt-20','standard')
  expect(useShop.getState().variants['axis-1']).toBe('upgrade')
  expect(useShop.getState().cart[0].quantity).toBe(2)
  expect(subtotal(useShop.getState().cart)).toBe(5889700)
  const message=orderMessage(useShop.getState().cart,{name:'Test',mobile:'9876543210',method:'Delivery',address:'Test address'},10000)
  expect(message).toContain('₹58,997')
  expect(message).toContain('Graphite / 256 GB')
 })
 it('rehydrates wishlist and rejects stale identifiers',async()=>{
  useShop.getState().wish('axis-1')
  const raw=localStorage.getItem('reboot-shop-v1')!
  useShop.setState({wishlist:[]})
  localStorage.setItem('reboot-shop-v1',raw.replace('["axis-1"]','["axis-1","gone"]'))
  await useShop.persist.rehydrate()
  expect(useShop.getState().wishlist).toEqual(['axis-1'])
 })
 it('compares phone specifications and enforces the three-phone limit',()=>{
  const {comparePhone}=useShop.getState()
  for(const id of ['axis-1','axis-pro','forma-mini','forma-5','volt-20'])comparePhone(id)
  expect(useShop.getState().compare).toEqual(['axis-1','axis-pro','forma-mini'])
  expect(comparisonValue(getProduct('axis-1')!,'RAM')).toBe('8 GB')
  render(<MemoryRouter><Compare/></MemoryRouter>)
  expect(screen.getByRole('rowheader',{name:'RAM'})).toBeTruthy()
  expect(screen.getByText('12 GB')).toBeTruthy()
 })
})
