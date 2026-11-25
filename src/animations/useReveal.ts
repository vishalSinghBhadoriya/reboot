import {useLayoutEffect,useRef} from 'react'
import gsap from 'gsap'
import {ScrollTrigger} from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)
export function useReveal(){
 const ref=useRef<HTMLDivElement>(null)
 useLayoutEffect(()=>{
  const root=ref.current
  if(!root)return
  const media=gsap.matchMedia()
  media.add('(prefers-reduced-motion: no-preference)',()=>{
   const hero = root.querySelector('.orbital-hero')
   if (hero) {
    const arrival = gsap.timeline({defaults:{ease:'power4.out',clearProps:'all'}})
    arrival.from(hero.querySelectorAll('h1 > span, h1 > em'), {
     clipPath:'inset(0 0 100% 0)', yPercent:28, duration:1.12, stagger:.14,
    }, 0)
    arrival.from(hero.querySelectorAll('.hero-copy > .eyebrow, .hero-copy > p, .hero-copy > .actions'), {
     opacity:0, y:18, stagger:.10, duration:.66,
    }, .12)
    arrival.from(hero.querySelector('.orbital-panel'), {
     opacity:.24, scale:.9, filter:'blur(8px)', duration:1.25,
    }, 0)
    gsap.to(hero.querySelector('.orbit-grid'), {
     yPercent:18, opacity:.25, ease:'none',
     scrollTrigger:{trigger:hero,start:'top top',end:'bottom top',scrub:.6},
    })
   }
   root.querySelectorAll<HTMLElement>('.section-title h2, .estimator-band h2, .editorial h2, .final-cta h2').forEach(el => {
    gsap.from(el, {
     scrollTrigger:{trigger:el,start:'top 91%',once:true},
     clipPath:'inset(0 100% 0 0)', x:-22, duration:.9, ease:'expo.out',clearProps:'all',
    })
   })
   root.querySelectorAll<HTMLElement>('.reveal, .repair-figure').forEach(el=>gsap.from(el,{
    scrollTrigger:{trigger:el,start:'top 91%',once:true},
    clipPath:'inset(12% 4% 12% 4%)',opacity:.45,y:18,duration:.85,clearProps:'all',
   }))
   gsap.from(root.querySelectorAll('.timeline li'),{opacity:.3,y:12,stagger:.09,scrollTrigger:{trigger:'.timeline',start:'top 90%',once:true},clearProps:'all'})
  })
  return ()=>media.revert()
 },[])
 return ref
}
