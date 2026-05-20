import { Edges } from '@react-three/drei'

function ModularBlock({ block }) {
  return (
    <group position={block.position}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={block.size} />
        <meshStandardMaterial color={block.color} roughness={0.64} metalness={0.04} />
        <Edges color="#ffffff" transparent opacity={0.26} />
      </mesh>
    </group>
  )
}

export default ModularBlock
