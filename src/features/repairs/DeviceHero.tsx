import {assetUrl} from '../../utils/assets'
import {lazy, Suspense, useCallback, useRef, useState, type PointerEvent} from 'react'
import {ArrowDown, Minus, Pause, Play, Plus, RotateCcw, RotateCw, ScanLine} from 'lucide-react'
import {Action} from '../../components/ui'
import type {PhonePose} from './PhoneScene'

const PhoneScene = lazy(() => import('./PhoneScene'))
const fallbackImage = {desktop: '/images/hero.webp', mobile: '/images/hero-small.webp'}

export default function DeviceHero() {
  const [status, setStatus] = useState<'loading' | 'ready' | 'fallback'>('loading')
  const [separation, setSeparation] = useState(78)
  const [paused, setPaused] = useState(false)
  const stage = useRef<HTMLDivElement>(null)
  const pose = useRef<PhonePose>({separation: .78, turn: 0, tilt: 0, reset: 0, paused: false, engaged: false})
  const pointer = useRef<{id: number; x: number; y: number} | null>(null)
  const ready = useCallback(() => setStatus('ready'), [])
  const unavailable = useCallback(() => setStatus('fallback'), [])

  function redraw() {
    pose.current.engaged = true
    stage.current?.querySelector('.orbital-render')?.dispatchEvent(new Event('phone-pose'))
  }

  function spread(value: number) {
    setSeparation(value)
    pose.current.separation = value / 100
    redraw()
  }

  function rotate(amount: number) {
    pose.current.turn += amount
    redraw()
  }

  function reset() {
    pose.current.turn = 0
    pose.current.tilt = 0
    pose.current.reset++
    spread(78)
  }

  function toggleMotion() {
    pose.current.paused = !pose.current.paused
    setPaused(pose.current.paused)
    redraw()
  }

  function dragStart(event: PointerEvent<HTMLDivElement>) {
    if (status !== 'ready' || event.button !== 0) return
    event.currentTarget.setPointerCapture(event.pointerId)
    pointer.current = {id: event.pointerId, x: event.clientX, y: event.clientY}
  }

  function dragMove(event: PointerEvent<HTMLDivElement>) {
    const point = pointer.current
    if (point?.id !== event.pointerId) return
    pose.current.turn += (event.clientX - point.x) * .014
    pose.current.tilt = Math.max(-.65, Math.min(.65, pose.current.tilt + (event.clientY - point.y) * .009))
    point.x = event.clientX
    point.y = event.clientY
    redraw()
  }

  function dragEnd(event: PointerEvent<HTMLDivElement>) {
    if (pointer.current?.id === event.pointerId) pointer.current = null
  }

  return (
    <section className="hero orbital-hero">
      <div className="orbit-grid" aria-hidden="true"/>
      <div className="orbit-horizon" aria-hidden="true"/>
      <div className="hero-inner">
        <div className="hero-copy">
          <span className="eyebrow"><b/> THE REPAIR LAB &amp; TECH STORE</span>
          <h1><span>BROKEN?</span><br/><em>NOT FOR<br className="hero-break"/> LONG.</em></h1>
          <p>Expert repairs. Premium technology.<br/>A second life for your devices.</p>
          <div className="actions">
            <Action to="/book-repair">Book a repair</Action>
            <Action to="/shop" secondary>Explore store</Action>
          </div>
        </div>

        <div className={'orbital-panel '+status} ref={stage}>
          <div className="orbital-viewport" role={status === 'ready' ? 'img' : undefined}
            aria-label={status === 'ready' ? 'Interactive phone model with its display, battery, circuit board and chassis separated' : undefined}
            onPointerDown={dragStart} onPointerMove={dragMove}
            onPointerUp={dragEnd} onPointerCancel={dragEnd} onLostPointerCapture={dragEnd}>
            <picture className="orbital-fallback" aria-hidden={status === 'ready'}>
              <source media="(max-width: 740px)" srcSet={assetUrl(fallbackImage.mobile)}/>
              <img src={assetUrl(fallbackImage.desktop)} width="1536" height="1024" fetchPriority="high" alt="Exploded smartphone with illuminated internal components"/>
            </picture>
            {status !== 'fallback' && <Suspense fallback={null}>
              <PhoneScene pose={pose} onReady={ready} onUnavailable={unavailable}/>
            </Suspense>}
            <div className="orbital-crosshair" aria-hidden="true"/>
            <div className="orbital-coordinates technical" aria-hidden="true"><ScanLine size={15}/> DEVICE ASSEMBLY</div>
          </div>
          {status === 'ready' && (
            <div className="orbital-controls">
              <label htmlFor="device-separation">Disassembly <output htmlFor="device-separation">{separation}%</output></label>
              <div className="orbital-range">
                <Minus size={13} aria-hidden="true"/>
                <input id="device-separation" type="range" min="0" max="100" value={separation}
                  onChange={event => spread(Number(event.target.value))}/>
                <Plus size={13} aria-hidden="true"/>
              </div>
              <div className="orbital-buttons">
                <button type="button" aria-label="Rotate model left" onClick={() => rotate(-Math.PI / 4)}><RotateCcw size={16}/></button>
                <button type="button" aria-label="Rotate model right" onClick={() => rotate(Math.PI / 4)}><RotateCw size={16}/></button>
                <button type="button" onClick={reset}>Reset</button>
                <button type="button" aria-label={paused ? 'Resume model animation' : 'Pause model animation'} onClick={toggleMotion}>
                  {paused ? <Play size={16}/> : <Pause size={16}/>}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="hero-foot technical">
          <a href="#anatomy"><ArrowDown size={15}/> EXPLORE THE REPAIR LAB</a>
          {status === 'ready' && <span>DRAG TO ROTATE</span>}
        </div>
      </div>
    </section>
  )
}
