import * as THREE from 'three'
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js'
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js'

const metal = (color: string, metalness = .65, roughness = .3) =>
  new THREE.MeshStandardMaterial({color, metalness, roughness})

export function createPhone(renderer: THREE.WebGLRenderer, inspection = false) {
  const room = new RoomEnvironment()
  const pmrem = new THREE.PMREMGenerator(renderer)
  const environment = pmrem.fromScene(room, .04)
  room.dispose()
  pmrem.dispose()

  const scene = new THREE.Scene()
  scene.environment = environment.texture
  scene.environmentIntensity = .78
  scene.add(new THREE.HemisphereLight(0xbacde9, 0x14150c, 2))
  for (const [color, intensity, x, y, z] of [
    [0xffffff, 3, -3, 4, 5], [0xbefa43, 5, 3, 1, -2], [0x6daeff, 4, 0, -4, 2],
  ]) {
    const light = new THREE.DirectionalLight(color, intensity)
    light.position.set(x, y, z)
    scene.add(light)
  }

  const phone = new THREE.Group()
  scene.add(phone)
  const silver = metal('#6d747b', .96, .23)
  const bevel = metal('#a8afb2', .86, .18)
  const black = metal('#14191c')
  const graphite = metal('#343f46', .71, .33)
  const board = metal('#122b24', .34, .46)
  const chip = metal('#252c31', .55, .54)
  const copper = metal('#bc8b4f', .84, .31)
  const lens = new THREE.MeshPhysicalMaterial({
    color: '#071620', metalness: .75, roughness: .09, clearcoat: 1, iridescence: .67,
  })
  const signal = new THREE.MeshBasicMaterial({color: '#d0fa45'})
  const parts = Array.from({length: 4}, () => {
    const part = new THREE.Group()
    phone.add(part)
    return part
  })
  const [chassis, internals, battery, display] = parts

  function add(group: THREE.Group, geometry: THREE.BufferGeometry, material: THREE.Material, x = 0, y = 0, z = 0) {
    const mesh = new THREE.Mesh(geometry, material)
    mesh.position.set(x, y, z)
    group.add(mesh)
    return mesh
  }

  function plate(group: THREE.Group, w: number, h: number, d: number, radius: number, material: THREE.Material, x = 0, y = 0, z = 0) {
    const shape = new THREE.Shape()
    const left = -w / 2, bottom = -h / 2, right = w / 2, top = h / 2
    shape.moveTo(left + radius, bottom)
    shape.lineTo(right - radius, bottom)
    shape.quadraticCurveTo(right, bottom, right, bottom + radius)
    shape.lineTo(right, top - radius)
    shape.quadraticCurveTo(right, top, right - radius, top)
    shape.lineTo(left + radius, top)
    shape.quadraticCurveTo(left, top, left, top - radius)
    shape.lineTo(left, bottom + radius)
    shape.quadraticCurveTo(left, bottom, left + radius, bottom)
    const geometry = new THREE.ExtrudeGeometry(shape, {
      depth: d, steps: 1, curveSegments: 8, bevelEnabled: true, bevelThickness: .014, bevelSize: .014, bevelSegments: 2,
    })
    geometry.translate(0, 0, -d / 2)
    return add(group, geometry, material, x, y, z)
  }

  const fastenerGeometry = new THREE.CylinderGeometry(.028, .028, .017, 12)
  const contactGeometry = new THREE.BoxGeometry(.016, .054, .015)
  const portGeometry = new THREE.CylinderGeometry(.012, .012, .012, 10)
  const screenUniforms = {time: {value: 0}}
  const screen = new THREE.ShaderMaterial({
    uniforms: screenUniforms,
    vertexShader: `
      varying vec2 panel;
      void main(){panel=position.xy;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}
    `,
    fragmentShader: `
      varying vec2 panel;
      uniform float time;
      void main(){
        vec2 p=panel;
        float curve=.44*sin(p.y*2.35+.4)+.14*sin(p.y*4.);
        float sh=abs(p.x-curve);
        float ribbon=exp(-sh*7.)*.53+exp(-sh*93.)*.83;
        float bars=(.5+.5*sin(p.y*145.))*.045;
        float pulse=exp(-abs(p.y-mod(time*.42,3.85)+1.93)*24.)*.23;
        vec3 ink=vec3(.018,.027,.038);
        vec3 lime=vec3(.55,.93,.055);
        vec3 blue=vec3(.015,.35,.43);
        vec3 col=ink+ribbon*mix(blue,lime,smoothstep(-1.4,1.4,p.y))+bars*blue+pulse*lime;
        gl_FragColor=vec4(col,1.);
        #include <colorspace_fragment>
      }
    `,
  })

  plate(chassis, 1.76, 3.62, .19, .22, silver)
  plate(chassis, 1.72, 3.59, .023, .21, graphite, 0, 0, -.107)
  plate(chassis, 1.65, 3.48, .025, .19, black, 0, 0, .111)
  const cameraModule = new THREE.Group()
  chassis.add(cameraModule)
  plate(cameraModule, .74, .89, .1, .16, black, -.39, 1.22, -.158)
  for (const [x, y] of [[-.57, 1.41], [-.24, 1.41], [-.57, 1.05]]) {
    const housing = new THREE.CylinderGeometry(.145, .15, .072, 32)
    const glass = new THREE.CylinderGeometry(.103, .103, .015, 32)
    add(cameraModule, housing, bevel, x, y, -.232).rotation.x = Math.PI / 2
    add(cameraModule, glass, lens, x, y, -.275).rotation.x = Math.PI / 2
    add(cameraModule, new THREE.TorusGeometry(.107, .011, 6, 32), black, x, y, -.283)
  }
  add(chassis, new THREE.BoxGeometry(.22, .013, .052), black, .02, -1.815, 0)
  for (let i = 0; i < 12; i++) {
    const x = (i < 6 ? -.57 : .23) + (i % 6) * .062
    add(chassis, portGeometry, black, x, -1.821, .004)
  }
  for (const [x,y,h] of [[.893,.62,.37],[-.893,.77,.23],[-.893,.45,.23]]) {
    add(chassis, new RoundedBoxGeometry(.045,h,.077,2,.018), bevel, x,y,0)
  }

  plate(internals, 1.56, 3.38, .045, .15, board)
  plate(internals, .97, .75, .09, .065, graphite, -.22, 1.12, .045)
  plate(internals, .52, .47, .075, .045, chip, -.31, 1.14, .11)
  const tinyChip = new THREE.BoxGeometry(.102,.078,.034)
  for (let i = 0; i < 38; i++) {
    const x = i < 19 ? .57 - (i % 3) * .115 : -.62 + (i % 9) * .154
    const y = i < 19 ? 1.53 - i * .104 : -.87 - (i % 4) * .166
    add(internals, tinyChip, i % 5 === 0 ? graphite : chip, x, y, .043)
    add(internals, contactGeometry, copper, x + .05, y, .059)
  }
  for (let i = 0; i < 7; i++) {
    const x = -.63 + i * .043
    const points = [
      new THREE.Vector3(x, .08, .027), new THREE.Vector3(x, -.41 + i * .03, .027),
      new THREE.Vector3(x + .2, -.57 + i * .03, .027), new THREE.Vector3(.58, -.57 + i * .03, .027),
    ]
    add(internals, new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), 20, .006, 4), copper)
  }
  for (const x of [-.69,.69]) for (const y of [-1.55,1.5]) {
    add(internals, fastenerGeometry, bevel, x, y, .058).rotation.x = Math.PI / 2
  }
  const chargingModule = new THREE.Group()
  internals.add(chargingModule)
  plate(chargingModule, .34, .21, .057, .03, silver, .02, -1.56, .042)
  plate(chargingModule, .22, .067, .026, .017, black, .02, -1.59, .08)
  if (inspection) {
    for (let i = 0; i < 7; i++) add(chargingModule, contactGeometry, copper, -.1 + i * .04, -1.46, .021)
    phone.add(cameraModule, chargingModule)
  }

  plate(battery, 1.16, 2.08, .115, .11, graphite, -.12, -.28)
  plate(battery, 1.08, 1.99, .025, .09, black, -.12, -.28, .072)
  plate(battery, .065, 1.83, .018, .024, signal, .393, -.28, .086)
  plate(battery, .31, .19, .019, .026, copper, -.23, .77, .04)
  for (let i = 0; i < 5; i++) {
    add(battery, new THREE.BoxGeometry(.21 + i * .067, .009, .01), graphite, -.32 + i * .035, -.76 - i * .053, .095)
  }

  plate(display, 1.74, 3.59, .059, .22, silver)
  plate(display, 1.70, 3.55, .052, .21, black, 0, 0, .038)
  plate(display, 1.58, 3.42, .018, .17, screen, 0, 0, .078)
  plate(display, .31, .067, .014, .032, black, 0, 1.53, .11)
  add(display, new THREE.SphereGeometry(.021, 12, 8), lens, .086, 1.53, .117)

  const scanner = new THREE.Group()
  scene.add(scanner)
  const scanLine = new THREE.LineBasicMaterial({color: '#d0fa45', transparent: true, opacity: .36, depthWrite: false})
  for (let i = 0; i < 3; i++) {
    const radius = 2.26 + i * .21
    const points = Array.from({length: 109}, (_, n) => {
      const a = n / 108 * Math.PI * (i === 1 ? 1.42 : 1.86) + i * 1.14
      return new THREE.Vector3(Math.cos(a) * radius, Math.sin(a) * radius, 0)
    })
    scanner.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), scanLine))
  }
  const sparks: number[] = []
  for (let i = 0; i < 132; i++) {
    const a = i * 2.39996
    const radius = 2.09 + (i % 19) * .088
    sparks.push(Math.cos(a) * radius, Math.sin(a) * radius, Math.sin(i * 1.2) * 1.2)
  }
  const specks = new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(sparks, 3))
  const points = new THREE.Points(specks, new THREE.PointsMaterial({
    color: '#d1ff64', size: .027, opacity: .63, transparent: true, depthWrite: false,
  }))
  scanner.add(points)

  function dispose() {
    const geometries = new Set<THREE.BufferGeometry>()
    const materials = new Set<THREE.Material>()
    scene.traverse(object => {
      if (object instanceof THREE.Mesh || object instanceof THREE.Line || object instanceof THREE.Points) {
        geometries.add(object.geometry)
        materials.add(object.material as THREE.Material)
      }
    })
    geometries.forEach(geometry => geometry.dispose())
    materials.forEach(material => material.dispose())
    environment.dispose()
  }
  return {scene, phone, parts, scanner, screenUniforms, dispose, cameraModule, chargingModule}
}
