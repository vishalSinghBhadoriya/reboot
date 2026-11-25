import {Box3, MathUtils, Vector3} from 'three'
import type {createPhone} from './phoneModel'

export type InspectionPart = 'screen' | 'board' | 'battery' | 'camera' | 'port' | 'glass'

export function createInspection(model: ReturnType<typeof createPhone>) {
  const [chassis, board, battery, display] = model.parts
  const modules = [
    {id:'glass', group:chassis, layer:0, turn:Math.PI + .32},
    {id:'board', group:board, layer:1, turn:.33},
    {id:'battery', group:battery, layer:2, turn:.36},
    {id:'screen', group:display, layer:3, turn:.5},
    {id:'camera', group:model.cameraModule, layer:0, turn:Math.PI + .32},
    {id:'port', group:model.chargingModule, layer:1, turn:.36},
  ] as const
  const indexed = modules.map(part => {
    const bounds = new Box3().setFromObject(part.group)
    const center = bounds.getCenter(new Vector3())
    const size = bounds.getSize(new Vector3())
    const zoom = 3.55 / Math.max(size.x, size.y)
    return {...part, center, zoom}
  })
  model.phone.rotation.set(-.12, .78, -.23)

  return (selected: InspectionPart | null, spread: number, time: number, blend: number) => {
    const focus = indexed.find(part => part.id === selected)
    const rotation = model.phone.rotation
    const angle = (focus?.turn ?? .78) + Math.sin(time * .72) * .13
    const delta = MathUtils.euclideanModulo(angle - rotation.y + Math.PI, Math.PI * 2) - Math.PI
    rotation.y += delta * blend
    rotation.x = MathUtils.lerp(rotation.x, -.12 + Math.sin(time * .52) * .065, blend)
    rotation.z = MathUtils.lerp(rotation.z, focus ? -.12 : -.26, blend)

    for (const part of indexed) {
      const extension = (part.layer - 1.5) * spread
      const isFocus = focus === part
      const scale = isFocus ? part.zoom : focus ? .001 : 1
      const x = isFocus ? -part.center.x * scale : extension * .68
      const y = isFocus ? -part.center.y * scale : extension * .105
      const z = isFocus ? -part.center.z * scale : [-.27,-.11,.055,.20][part.layer] + extension * .61
      part.group.scale.setScalar(MathUtils.lerp(part.group.scale.x, scale, blend))
      part.group.position.set(
        MathUtils.lerp(part.group.position.x, x, blend),
        MathUtils.lerp(part.group.position.y, y, blend),
        MathUtils.lerp(part.group.position.z, z, blend),
      )
      part.group.visible = part.group.scale.x > .008
    }
  }
}
