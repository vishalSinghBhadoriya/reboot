import {useEffect, useRef, type RefObject} from 'react'
import * as THREE from 'three'
import {createPhone} from './phoneModel'
import {createInspection, type InspectionPart} from './inspectionPose'

export type PhonePose = {separation: number; turn: number; tilt: number; reset: number; paused: boolean; engaged: boolean; selected?: InspectionPart | null}

interface PhoneSceneProps {
  pose: RefObject<PhonePose>
  onReady: () => void
  onUnavailable: () => void
  inspection?: boolean
}

export default function PhoneScene({pose, onReady, onUnavailable, inspection = false}: PhoneSceneProps) {
  const container = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const host = container.current
    if (!host) return
    let renderer: THREE.WebGLRenderer | undefined
    let model: ReturnType<typeof createPhone>
    try {
      renderer = new THREE.WebGLRenderer({alpha: true, antialias: true, powerPreference: 'high-performance'})
      renderer.setClearColor(0x000000, 0)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5))
      renderer.toneMapping = THREE.ACESFilmicToneMapping
      renderer.toneMappingExposure = 1.12
      model = createPhone(renderer, inspection)
    } catch {
      renderer?.dispose()
      onUnavailable()
      return
    }

    const gl = renderer
    const inspect = inspection ? createInspection(model) : null
    const canvas = gl.domElement
    canvas.setAttribute('aria-hidden', 'true')
    host.append(canvas)
    const camera = new THREE.PerspectiveCamera(34, 1, .1, 35)
    camera.position.set(0, 0, 9.4)
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const ease = THREE.MathUtils.lerp
    let visible = true
    let lost = false
    let frame = 0
    let last = 0
    let elapsed = 0
    let separation = 0
    let reset = -1
    let ready = false

    function schedule() {
      if (!frame && visible && !document.hidden && !lost) frame = requestAnimationFrame(render)
    }

    function render(timestamp: number) {
      frame = 0
      if (!visible || document.hidden || lost) return
      const dt = last ? Math.min((timestamp - last) / 1000, .06) : .016
      last = timestamp
      const target = pose.current
      const animate = !motion.matches && !target.paused
      if (animate) elapsed += dt
      const interpolation = animate ? 1 - Math.exp(-dt * 5) : 1
      const arrival = animate && !target.engaged ? THREE.MathUtils.smoothstep(elapsed, 0, 1.8) : 1
      separation = ease(separation, target.separation, interpolation)
      if (inspect) {
        inspect(target.selected ?? null, separation, elapsed, interpolation)
      } else {
        if (reset !== target.reset) {
          reset = target.reset
          model.phone.rotation.y = .56 + THREE.MathUtils.euclideanModulo(model.phone.rotation.y - .56 + Math.PI, Math.PI * 2) - Math.PI
        }
        model.phone.rotation.x = ease(model.phone.rotation.x, -.18 + target.tilt, interpolation)
        const orbit = Math.sin(elapsed * .52) * .15
        model.phone.rotation.y = ease(model.phone.rotation.y, .7 + target.turn + orbit - (1 - arrival) * 1.2, interpolation)
        model.phone.rotation.z = -.29 - (1 - arrival) * .43
        model.phone.position.y = Math.sin(elapsed * 1.22) * .10

        model.parts.forEach((part, i) => {
          const stage = animate && !target.engaged
            ? THREE.MathUtils.smoothstep(elapsed, .18 + i * .13, 1.44 + i * .13) : 1
          const extension = (i - 1.5) * stage * separation
          part.position.set(extension * .55, extension * .105, [-.27, -.11, .055, .20][i] + extension * .62)
        })
      }
      model.scanner.rotation.set(-.18 + Math.sin(elapsed * .72) * .13, .30, elapsed * .18)
      model.screenUniforms.time.value = elapsed
      gl.render(model.scene, camera)
      if (!ready) {
        ready = true
        onReady()
      }

      if (animate) schedule()
    }

    function resize() {
      if (!host) return
      const width = host.clientWidth
      const height = host.clientHeight
      if (!width || !height) return
      camera.aspect = width / height
      camera.position.z = Math.max(8.5, 8.1 / camera.aspect)
      camera.updateProjectionMatrix()
      gl.setSize(width, height, false)
      schedule()
    }

    function visibility() {
      if (!visible || document.hidden) {
        cancelAnimationFrame(frame)
        frame = 0
        last = 0
      } else schedule()
    }

    function contextLost(event: Event) {
      event.preventDefault()
      lost = true
      onUnavailable()
    }

    const observer = new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting
      visibility()
    })
    const sizeObserver = new ResizeObserver(resize)
    observer.observe(host)
    sizeObserver.observe(host)
    document.addEventListener('visibilitychange', visibility)
    canvas.addEventListener('webglcontextlost', contextLost)
    motion.addEventListener('change', schedule)
    host.addEventListener('phone-pose', schedule)
    resize()

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      sizeObserver.disconnect()
      document.removeEventListener('visibilitychange', visibility)
      canvas.removeEventListener('webglcontextlost', contextLost)
      motion.removeEventListener('change', schedule)
      host.removeEventListener('phone-pose', schedule)
      model.dispose()
      gl.dispose()
      gl.forceContextLoss()
      canvas.remove()
    }
  }, [inspection, onReady, onUnavailable, pose])

  return <div className="orbital-render" ref={container} />
}
