import { OrbitControls } from '@react-three/drei'

function Controls({ maxDistance = 32, minDistance = 4 }) {
  return (
    <OrbitControls
      enableDamping
      enablePan
      minDistance={minDistance}
      maxDistance={maxDistance}
      minPolarAngle={Math.PI / 4.2}
      maxPolarAngle={Math.PI / 2.35}
      target={[0, 0.35, 0]}
    />
  )
}

export default Controls
