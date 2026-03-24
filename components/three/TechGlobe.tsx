'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Sphere, Stars, Html, OrbitControls, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'

const TECH_ICONS = [
  { name:'GitHub',     color:'#e2e8f0', bg:'#161b22', svg:`<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>` },
  { name:'Docker',     color:'#2496ED', bg:'#0d1b2a', svg:`<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13.983 11.078h2.119a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.119a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185m-2.954-5.43h2.118a.186.186 0 00.186-.186V3.574a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m0 2.716h2.118a.187.187 0 00.186-.186V6.29a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.887c0 .102.082.185.185.186m-2.93 0h2.12a.186.186 0 00.184-.186V6.29a.185.185 0 00-.185-.185H8.1a.185.185 0 00-.185.185v1.887c0 .102.083.185.185.186m-2.964 0h2.119a.186.186 0 00.185-.186V6.29a.185.185 0 00-.185-.185H5.136a.186.186 0 00-.186.185v1.887c0 .102.084.185.186.186m5.893 2.715h2.118a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m-2.93 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.185.185 0 00-.184.185v1.888c0 .102.082.185.185.185m-2.964 0h2.119a.185.185 0 00.185-.185V9.006a.185.185 0 00-.184-.186h-2.12a.186.186 0 00-.186.186v1.887c0 .102.084.185.186.185m-2.92 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.185.185 0 00-.184.185v1.888c0 .102.082.185.185.185M23.763 9.89c-.065-.051-.672-.51-1.954-.51-.338.001-.676.031-1.01.092-.242-1.655-1.612-2.471-1.674-2.51l-.33-.194-.235.322a4.25 4.25 0 00-.727 2.17c-.095.768.083 1.424.268 1.926-.516.179-1.356.438-2.675.438H.609a.185.185 0 00-.186.186 10.97 10.97 0 00.692 3.939c.53 1.388 1.316 2.412 2.339 3.044C4.537 20.93 6.249 21.5 8.36 21.5c1.016-.002 2.03-.127 3.017-.373a12.306 12.306 0 003.494-1.624 10.004 10.004 0 002.44-2.341c1.17-1.537 1.865-3.25 2.37-4.768h.207c1.282 0 2.072-.51 2.512-1.038a3.894 3.894 0 00.694-1.553l.046-.244-.23-.18z"/></svg>` },
  { name:'Python',     color:'#FFD43B', bg:'#1a1505', svg:`<svg viewBox="0 0 24 24" fill="currentColor"><path d="M14.25.18l.9.2.73.26.59.3.45.32.34.34.25.34.16.33.1.3.04.26.02.2-.01.13V8.5l-.05.63-.13.55-.21.46-.26.38-.3.31-.33.25-.35.19-.35.14-.33.1-.3.07-.26.04-.21.02H8.77l-.69.05-.59.14-.5.22-.41.27-.33.32-.27.35-.2.36-.15.37-.1.35-.07.32-.04.27-.02.21v3.06H3.17l-.21-.03-.28-.07-.32-.12-.35-.18-.36-.26-.36-.36-.35-.46-.32-.59-.28-.73-.21-.88-.14-1.05L0 11.97l.06-1.22.16-1.04.24-.87.32-.71.36-.57.4-.44.42-.33.42-.24.4-.16.36-.1.32-.05.24-.01h.16l.06.01h8.16v-.83H6.18l-.01-2.75-.02-.37.05-.34.11-.31.17-.28.25-.26.31-.23.38-.2.44-.18.51-.15.58-.12.64-.1.71-.06.77-.04.84-.02 1.27.05zm-6.3 1.98l-.23.33-.08.41.08.41.23.34.33.22.41.09.41-.09.33-.22.23-.34.08-.41-.08-.41-.23-.33-.33-.22-.41-.09-.41.09zm13.09 3.95l.28.06.32.12.35.18.36.27.36.35.35.47.32.59.28.73.21.88.14 1.04.05 1.23-.06 1.23-.16 1.04-.24.86-.32.71-.36.57-.4.45-.42.33-.42.24-.4.16-.36.09-.32.05-.24.02-.16-.01h-8.22v.82h5.84l.01 2.76.02.36-.05.34-.11.31-.17.29-.25.25-.31.24-.38.2-.44.17-.51.15-.58.13-.64.09-.71.07-.77.04-.84.01-1.27-.04-1.07-.14-.9-.2-.73-.25-.59-.3-.45-.33-.34-.34-.25-.34-.16-.33-.1-.3-.04-.25-.02-.2.01-.13v-5.34l.05-.64.13-.54.21-.46.26-.38.3-.31.33-.25.35-.19.35-.14.33-.1.3-.06.26-.04.21-.02.13-.01h5.84l.69-.05.59-.14.5-.21.41-.28.33-.32.27-.35.2-.36.15-.36.1-.35.07-.32.04-.28.02-.21V6.07h2.09l.14.01zm-6.47 14.25l-.23.33-.08.41.08.41.23.33.33.23.41.08.41-.08.33-.23.23-.33.08-.41-.08-.41-.23-.33-.33-.23-.41-.08-.41.08z"/></svg>` },
  { name:'React',      color:'#61DAFB', bg:'#0a1a20', svg:`<svg viewBox="0 0 24 24" fill="currentColor"><path d="M14.23 12.004a2.236 2.236 0 01-2.235 2.236 2.236 2.236 0 01-2.236-2.236 2.236 2.236 0 012.235-2.236 2.236 2.236 0 012.236 2.236zm2.648-10.69c-1.346 0-3.107.96-4.888 2.622-1.78-1.653-3.542-2.602-4.887-2.602-.41 0-.783.093-1.106.278-1.375.793-1.683 3.264-.973 6.365C1.98 8.917 0 10.42 0 12.004c0 1.59 1.99 3.097 5.043 4.03-.704 3.113-.39 5.588.988 6.38.32.187.69.275 1.102.275 1.345 0 3.107-.96 4.888-2.624 1.78 1.654 3.542 2.603 4.887 2.603.41 0 .783-.09 1.106-.275 1.374-.792 1.683-3.263.973-6.365C22.02 15.096 24 13.59 24 12.004c0-1.59-1.99-3.097-5.043-4.032.704-3.11.39-5.587-.988-6.38a2.167 2.167 0 00-1.092-.278z"/></svg>` },
  { name:'Node.js',    color:'#68A063', bg:'#091509', svg:`<svg viewBox="0 0 24 24" fill="currentColor"><path d="M11.998 24c-.321 0-.641-.084-.922-.247l-2.936-1.737c-.438-.245-.224-.332-.08-.383.585-.203.703-.249 1.328-.602.065-.037.151-.023.218.016l2.256 1.339c.082.045.198.045.275 0l8.795-5.076c.082-.047.134-.141.134-.238V6.921c0-.099-.053-.192-.137-.242l-8.791-5.072c-.081-.047-.189-.047-.271 0L3.075 6.68c-.084.05-.139.145-.139.243v10.148c0 .097.055.189.137.236l2.409 1.392c1.307.654 2.108-.116 2.108-.891V7.007c0-.142.114-.253.256-.253h1.115c.139 0 .255.112.255.253v10.801c0 1.745-.95 2.745-2.604 2.745-.508 0-.909 0-2.026-.551L2.28 18.675c-.57-.329-.922-.943-.922-1.604V6.921c0-.661.352-1.275.922-1.603l8.795-5.082c.557-.315 1.296-.315 1.848 0l8.794 5.082c.57.329.924.943.924 1.603v10.15c0 .661-.354 1.275-.924 1.604l-8.794 5.076c-.282.164-.6.247-.925.247z"/></svg>` },
  { name:'TensorFlow', color:'#FF6F00', bg:'#150800', svg:`<svg viewBox="0 0 24 24" fill="currentColor"><path d="M1.292 5.856L11.54 0v24l-4.095-2.378V7.88l-6.168 3.453.015-5.477zm21.43 5.522l-.014-5.478L12.46 0v24l4.095-2.378V7.88l6.168 3.453v5.477l-6.168 3.478v4.734L24 22.534V8.867l-1.278-.739v3.25z"/></svg>` },
  { name:'FastAPI',    color:'#05998B', bg:'#001a18', svg:`<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.376 0 0 5.376 0 12s5.376 12 12 12 12-5.376 12-12S18.624 0 12 0zm-.624 21.624v-7.248H6.0l6.624-11.999v7.247h5.376z"/></svg>` },
  { name:'TypeScript', color:'#3178C6', bg:'#050d18', svg:`<svg viewBox="0 0 24 24" fill="currentColor"><path d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 011.306.34v2.458a3.95 3.95 0 00-.643-.361 5.093 5.093 0 00-.717-.26 5.453 5.453 0 00-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 00-.623.242c-.17.104-.3.229-.393.374a.888.888 0 00-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 01-1.012 1.085 4.38 4.38 0 01-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 01-1.84-.164 5.544 5.544 0 01-1.512-.493v-2.63a5.033 5.033 0 003.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 00-.074-1.089 2.12 2.12 0 00-.537-.5 5.597 5.597 0 00-.807-.444 27.72 27.72 0 00-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 011.47-.629 7.536 7.536 0 011.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z"/></svg>` },
  { name:'AWS',        color:'#FF9900', bg:'#150800', svg:`<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6.763 10.036c0 .296.032.535.088.71.064.176.144.368.256.576.04.063.056.127.056.183 0 .08-.048.16-.152.24l-.503.335a.383.383 0 01-.208.072c-.08 0-.16-.04-.239-.112a2.47 2.47 0 01-.287-.375 6.18 6.18 0 01-.248-.471c-.622.734-1.405 1.101-2.347 1.101-.67 0-1.205-.191-1.596-.574-.391-.384-.59-.894-.59-1.533 0-.678.239-1.23.726-1.644.487-.415 1.133-.623 1.955-.623.272 0 .551.024.846.064.296.04.6.104.918.176v-.583c0-.607-.127-1.03-.375-1.277-.255-.248-.686-.367-1.3-.367-.28 0-.568.031-.863.103-.295.072-.583.16-.862.272a2.287 2.287 0 01-.28.104.488.488 0 01-.127.023c-.112 0-.168-.08-.168-.247v-.391c0-.128.016-.224.056-.28a.597.597 0 01.224-.167c.279-.144.614-.264 1.005-.36a4.84 4.84 0 011.246-.151c.95 0 1.644.216 2.091.647.439.43.662 1.085.662 1.963v2.586zm10.692 2.01c-.144 0-.24-.024-.304-.08-.064-.048-.12-.16-.168-.311L14.97 5.55a1.398 1.398 0 01-.072-.32c0-.128.064-.2.191-.2h.783c.151 0 .255.025.31.08.065.048.113.16.16.312l1.342 5.284 1.245-5.284c.04-.16.088-.264.151-.312a.549.549 0 01.32-.08h.638c.152 0 .256.025.32.08.063.048.12.16.151.312l1.261 5.348 1.381-5.348c.048-.16.104-.264.16-.312a.52.52 0 01.311-.08h.743c.127 0 .2.065.2.2 0 .04-.009.08-.017.128a1.137 1.137 0 01-.056.2l-1.923 6.17c-.048.16-.104.263-.168.311a.51.51 0 01-.303.08h-.687c-.151 0-.255-.024-.32-.08-.063-.056-.119-.16-.15-.32l-1.238-5.148-1.23 5.14c-.04.16-.087.264-.15.32-.065.056-.177.08-.32.08h-.687z"/></svg>` },
  { name:'MongoDB',    color:'#47A248', bg:'#061206', svg:`<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.193 9.555c-1.264-5.58-4.252-7.414-4.573-8.115-.28-.394-.53-.954-.735-1.44-.036.495-.055.685-.523 1.184-.723.566-4.438 3.682-4.74 10.02-.282 5.912 4.27 9.435 4.888 9.884l.07.05A73.49 73.49 0 0111.91 24h.481c.114-1.032.284-2.056.51-3.07.417-.296.604-.463.85-.693a11.342 11.342 0 003.639-8.464c.01-.814-.103-1.662-.197-2.218zm-5.336 8.195s0-8.291.275-8.29c.213 0 .49 10.695.49 10.695-.381-.045-.765-1.76-.765-2.405z"/></svg>` },
  { name:'Redis',      color:'#DC382D', bg:'#150202', svg:`<svg viewBox="0 0 24 24" fill="currentColor"><path d="M10.612 13.32c-.696.312-4.44 1.901-5.232 2.305-.792.403-1.236.403-1.86.108-.624-.295-5.052-2.089-5.748-2.425-.348-.168-.528-.312-.528-.444v-1.44s5.616-1.22 6.504-1.548c.888-.33 1.196-.342 1.956-.06.762.28 5.304 1.1 6.072 1.392v1.706c0 .12-.156.264-.456.408h.004zm.456-3.984c-.756.324-4.74 1.968-5.544 2.304-.804.336-1.176.348-1.872.072-.696-.276-5.208-2.064-5.916-2.424-.708-.36-.72-.588-.024-.852l5.808-2.22c.696-.264 1.008-.264 1.716-.012l5.832 2.244c.708.252.756.564 0 .888z"/></svg>` },
  { name:'PostgreSQL', color:'#4169E1', bg:'#050818', svg:`<svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.5454 11.8954c-.3099-.2415-1.8338-1.2981-5.0073-.3378-.0378-1.0108-.1101-1.8701-.2168-2.6099.3622-.0266.716-.0752 1.0516-.1498 2.3929-.5343 3.3826-1.8289 3.3826-1.8289s-.1135 2.3357-.5445 3.1956c.4319.0024.8625.0043 1.3684.0043.3357 0 .6617-.009.9779-.0237.0264.5766.0272 1.2023-.0339 1.7502zM12 1.2009c.3279 0 .8203.5617 1.2854 2.3388.3035 1.0999.5178 2.5154.5887 4.1827a15.9248 15.9248 0 01-3.7482 0c.0709-1.667.2852-3.0826.5887-4.1827C11.1797 1.7626 11.6721 1.2009 12 1.2009z"/></svg>` },
]

function distributeOnSphere(n: number, r: number): THREE.Vector3[] {
  const pts: THREE.Vector3[] = []
  const golden = Math.PI * (3 - Math.sqrt(5))
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2
    const rad = Math.sqrt(1 - y * y)
    const theta = golden * i
    pts.push(new THREE.Vector3(r * rad * Math.cos(theta), r * y, r * rad * Math.sin(theta)))
  }
  return pts
}

// Floating icon that drifts gently and avoids mouse
function FloatingIcon({ icon, basePos }: { icon: typeof TECH_ICONS[0]; basePos: THREE.Vector3 }) {
  const groupRef = useRef<THREE.Group>(null)
  const phaseRef = useRef(Math.random() * Math.PI * 2)
  const { mouse } = useThree()

  useFrame((scene, dt) => {
    if (!groupRef.current) return
    phaseRef.current += dt * 0.28

    // Gentle orbital drift — stays near base position
    const driftX = Math.sin(phaseRef.current * 0.7) * 0.18
    const driftY = Math.cos(phaseRef.current * 0.5) * 0.18
    const driftZ = Math.sin(phaseRef.current * 0.6) * 0.12

    // Compute 3D mouse direction (very weak repulsion — icons drift away slowly)
    const mWorld = new THREE.Vector3(mouse.x * 3.5, mouse.y * 2, 0)
    const toIcon = basePos.clone().sub(mWorld)
    const dist = toIcon.length()

    let repulse = new THREE.Vector3()
    if (dist < 2.2) {
      // Gentle push away from cursor, max 0.3 units
      const strength = Math.max(0, (2.2 - dist) / 2.2) * 0.3
      repulse = toIcon.normalize().multiplyScalar(strength)
    }

    const target = basePos.clone().add(new THREE.Vector3(driftX, driftY, driftZ)).add(repulse)

    // Smooth lerp to target — very slow
    groupRef.current.position.lerp(target, 0.04)
    groupRef.current.lookAt(scene.camera.position)
  })

  return (
    <group ref={groupRef} position={basePos.toArray()}>
      <Html center distanceFactor={8} zIndexRange={[0, 10]} style={{ pointerEvents: 'none' }}>
        <div style={{
          width: '34px', height: '34px', borderRadius: '9px',
          background: icon.bg, border: `1.5px solid ${icon.color}35`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 0 12px ${icon.color}28, 0 2px 8px rgba(0,0,0,0.5)`,
          color: icon.color, padding: '6px', backdropFilter: 'blur(4px)',
        }}>
          <div style={{ width: '100%', height: '100%' }} dangerouslySetInnerHTML={{ __html: icon.svg }} />
        </div>
      </Html>
      <mesh>
        <sphereGeometry args={[0.035, 5, 5]} />
        <meshBasicMaterial color={icon.color} transparent opacity={0.6} />
      </mesh>
    </group>
  )
}

function GlobeWireframe() {
  const groupRef = useRef<THREE.Group>(null)
  useFrame((_, dt) => { if (groupRef.current) groupRef.current.rotation.y += dt * 0.06 })
  const lines = useMemo(() => {
    const geoms: THREE.BufferGeometry[] = []
    const R = 2.5
    for (let lat = -75; lat <= 75; lat += 30) {
      const phi = (lat * Math.PI) / 180
      const pts: THREE.Vector3[] = []
      for (let i = 0; i <= 64; i++) {
        const theta = (i / 64) * Math.PI * 2
        pts.push(new THREE.Vector3(R * Math.cos(phi) * Math.cos(theta), R * Math.sin(phi), R * Math.cos(phi) * Math.sin(theta)))
      }
      geoms.push(new THREE.BufferGeometry().setFromPoints(pts))
    }
    for (let lon = 0; lon < 360; lon += 30) {
      const theta = (lon * Math.PI) / 180
      const pts: THREE.Vector3[] = []
      for (let i = 0; i <= 64; i++) {
        const phi = ((i / 64) * 180 - 90) * (Math.PI / 180)
        pts.push(new THREE.Vector3(R * Math.cos(phi) * Math.cos(theta), R * Math.sin(phi), R * Math.cos(phi) * Math.sin(theta)))
      }
      geoms.push(new THREE.BufferGeometry().setFromPoints(pts))
    }
    return geoms
  }, [])
  return (
    <group ref={groupRef}>
      {lines.map((geom, i) => (
        <line key={i}>
          <primitive object={geom} />
          <lineBasicMaterial color="#f97316" transparent opacity={0.07} />
        </line>
      ))}
    </group>
  )
}

function CoreGem() {
  const ref = useRef<THREE.Group>(null)
  const innerRef = useRef<THREE.Mesh>(null)
  const { mouse } = useThree()
  useFrame((s, dt) => {
    if (!ref.current) return
    ref.current.rotation.y += 0.12 * dt
    ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, mouse.y * 0.35, 0.03)
    if (innerRef.current) { innerRef.current.rotation.y -= 0.22 * dt; innerRef.current.rotation.x += 0.1 * dt }
  })
  return (
    <group ref={ref}>
      {/* Transparent outer sphere */}
      <Sphere args={[2.5, 48, 48]}>
        <MeshDistortMaterial color="#1a0600" transparent opacity={0.22} roughness={0.05} metalness={0.9} distort={0.08} speed={1.2} />
      </Sphere>
      {/* Gem */}
      <mesh ref={innerRef}>
        <icosahedronGeometry args={[1.15, 2]} />
        <meshStandardMaterial color="#c45a00" emissive="#6a2000" emissiveIntensity={0.55} metalness={0.98} roughness={0.05} flatShading />
      </mesh>
      {/* Inner glow core */}
      <mesh>
        <octahedronGeometry args={[0.45]} />
        <meshStandardMaterial color="#f97316" emissive="#f97316" emissiveIntensity={1.1} metalness={0.5} roughness={0.05} />
      </mesh>
      {/* Outer gold-tinted glow shell */}
      <mesh>
        <sphereGeometry args={[1.5, 16, 16]} />
        <meshBasicMaterial color="#d4a853" transparent opacity={0.04} side={THREE.BackSide} />
      </mesh>
      <pointLight color="#f97316" intensity={3.5} distance={8} />
      <pointLight color="#d4a853" intensity={1.2} distance={5} />
    </group>
  )
}

function OrbitalRing() {
  const r = useRef<THREE.Group>(null)
  useFrame((s) => { if (r.current) r.current.rotation.y = s.clock.elapsedTime * 0.05 })
  return (
    <group ref={r}>
      <mesh rotation={[0.4, 0, 0]}><torusGeometry args={[2.5, 0.003, 8, 120]} /><meshBasicMaterial color="#f97316" transparent opacity={0.06} /></mesh>
      <mesh rotation={[-0.55, 0.45, 0]}><torusGeometry args={[2.75, 0.002, 8, 100]} /><meshBasicMaterial color="#d4a853" transparent opacity={0.04} /></mesh>
    </group>
  )
}

export default function TechGlobe() {
  const positions = useMemo(() => distributeOnSphere(TECH_ICONS.length, 2.9), [])
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 6.8], fov: 42 }} dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.12} />
        <pointLight position={[6, 4, 6]} intensity={1.8} color="#f97316" />
        <pointLight position={[-5, -3, -4]} intensity={0.7} color="#818cf8" />
        <directionalLight position={[2, 8, 4]} intensity={0.9} color="#fff5ee" />
        <Stars radius={55} depth={30} count={1200} factor={1.6} saturation={0} fade speed={0.3} />
        <GlobeWireframe />
        <CoreGem />
        <OrbitalRing />
        {TECH_ICONS.map((icon, i) => (
          <FloatingIcon key={icon.name} icon={icon} basePos={positions[i]} />
        ))}
        <OrbitControls enablePan={false} enableZoom={false} enableDamping dampingFactor={0.06} rotateSpeed={0.4} autoRotate autoRotateSpeed={0.35} />
      </Canvas>
    </div>
  )
}
