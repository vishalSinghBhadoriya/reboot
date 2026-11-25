import {lazy, Suspense, useCallback, useEffect, useRef, useState} from 'react'
import {Battery, Camera, ArrowUpRight, CircuitBoard, Layers3, Pause, Play, RectangleVertical, Usb} from 'lucide-react'
import {AnimatePresence, motion, useReducedMotion} from 'motion/react'
import {ScrollTrigger} from 'gsap/ScrollTrigger'
import {Action} from '../../components/ui'
import {services} from '../../data/repairs'
import {rupees} from '../../utils/format'
import type {PhonePose} from './PhoneScene'
import type {InspectionPart} from './inspectionPose'

const PhoneScene = lazy(() => import('./PhoneScene'))
const parts = [
  ['screen', 'Display', RectangleVertical],
  ['board', 'Motherboard', CircuitBoard],
  ['battery', 'Battery', Battery],
  ['camera', 'Camera', Camera],
  ['port', 'Charging port', Usb],
  ['glass', 'Back panel', Layers3],
] as const

export function Anatomy() {
  const stage = useRef<HTMLDivElement>(null)
  const pose = useRef<PhonePose>({separation: .2, turn: 0, tilt: 0, reset: 0, paused: false, engaged: true})
  const [active, setActive] = useState<InspectionPart | null>(null)
  const [mounted, setMounted] = useState(false)
  const [status, setStatus] = useState<'loading' | 'ready' | 'fallback'>('loading')
  const [paused, setPaused] = useState(false)
  const reduced = useReducedMotion()
  const ready = useCallback(() => setStatus('ready'), [])
  const unavailable = useCallback(() => setStatus('fallback'), [])
  const part = parts.find(([id]) => id === active)
  const service = services.find(([id]) => id === active)

  const redraw = useCallback(() => {
    stage.current?.querySelector('.orbital-render')?.dispatchEvent(new Event('phone-pose'))
  }, [])

  useEffect(() => {
    if (!stage.current) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setMounted(true)
        observer.disconnect()
      }
    }, {rootMargin: '220px'})
    observer.observe(stage.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    pose.current.separation = reduced ? 1 : .2
    redraw()
    if (reduced || !stage.current) return
    const trigger = ScrollTrigger.create({
      trigger: stage.current,
      start: 'top bottom',
      end: 'center 60%',
      onUpdate: ({progress}) => {
        pose.current.separation = .2 + progress * .8
        redraw()
      },
    })
    pose.current.separation = .2 + trigger.progress * .8
    redraw()
    return () => trigger.kill()
  }, [redraw, reduced])

  function select(id: InspectionPart | null) {
    setActive(id)
    pose.current.selected = id
    redraw()
  }

  function toggleMotion() {
    pose.current.paused = !pose.current.paused
    setPaused(pose.current.paused)
    redraw()
  }

  const SchematicIcon = part?.[2]

  return (
    <section className="section anatomy" id="anatomy" aria-labelledby="anatomy-title">
      <div className="section-kicker"><span>01 / DEVICE ANATOMY</span><span>REPAIR INDEX</span></div>
      <div className="section-title">
        <h2 id="anatomy-title">Under the surface.</h2>
        <p>Select a component to bring it into focus and see the repair options.</p>
      </div>
      <div className="anatomy-grid anatomy-console">
        <div className="anatomy-workbench">
          <div className={'anatomy-stage ' + status} ref={stage} role="img"
            aria-label={part ? part[1] + ' isolated from the smartphone assembly' : 'Exploded smartphone assembly'}>
            <div className="anatomy-reticle" aria-hidden="true"/>
            <div className="anatomy-schematic" aria-hidden="true">
              {SchematicIcon ? <SchematicIcon key={active} className="anatomy-schematic-part" strokeWidth={.85}/> :
                <div className="anatomy-plates"><i/><i/><i/><i/></div>}
            </div>
            {mounted && status !== 'fallback' && <Suspense fallback={null}>
              <PhoneScene pose={pose} onReady={ready} onUnavailable={unavailable} inspection/>
            </Suspense>}
            <span className="anatomy-stage-label technical" aria-hidden="true">
              {status === 'ready' ? 'LIVE 3D' : 'ASSEMBLY SCHEMATIC'} / {part?.[1] ?? 'FULL DEVICE'}
            </span>
          </div>
          <div className="anatomy-controls">
            <button type="button" aria-pressed={active === null} onClick={() => select(null)}>Full assembly</button>
            {status === 'ready' && !reduced && <button type="button" onClick={toggleMotion}>
              {paused ? <Play size={15}/> : <Pause size={15}/>} {paused ? 'Resume motion' : 'Pause motion'}
            </button>}
          </div>
        </div>
        <div className="anatomy-readout">
          <div className="component-list" role="group" aria-label="Inspect a component">
            {parts.map(([id, name, Icon], index) => (
              <button type="button" key={id} aria-pressed={active === id} onClick={() => select(id)}>
                <span className="technical">{String(index + 1).padStart(2, '0')}</span><Icon size={16} aria-hidden="true"/>
                <span>{name}</span><ArrowUpRight size={15} aria-hidden="true"/>
              </button>
            ))}
          </div>
          <div className="component-copy" aria-live="polite">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={active ?? 'overview'} initial={reduced ? false : {opacity:0, y:8}} animate={{opacity:1, y:0}}
                exit={reduced ? undefined : {opacity:0, y:-5}} transition={{duration:reduced ? 0 : .18}}>
                <h3>{part?.[1] ?? 'Full assembly'}</h3>
                {service ? <>
                  <p>{service[2]}</p><p>{service[1]}</p>
                  <strong>Demo from {rupees(service[3] * 100)}</strong>
                  <Action to={'/repair-estimator?issue=' + active}>Estimate this repair</Action>
                </> : <p>Pick a component to isolate it and see common faults, repair services and starting prices.</p>}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
