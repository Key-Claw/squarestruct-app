import { Edges } from '@react-three/drei'

function OpeningMarker({ block }) {
  const [width, height, depth] = block.size
  const frameThickness = 0.035
  const includeBottomFrame = block.modelType === 'window'

  return (
    <group position={block.position}>
      <mesh position={[-width / 2 + frameThickness / 2, 0, 0]} castShadow>
        <boxGeometry args={[frameThickness, height, Math.max(depth, 0.035)]} />
        <meshStandardMaterial color={block.color} roughness={0.78} metalness={0.02} transparent={block.opacity < 1} opacity={block.opacity} />
      </mesh>
      <mesh position={[width / 2 - frameThickness / 2, 0, 0]} castShadow>
        <boxGeometry args={[frameThickness, height, Math.max(depth, 0.035)]} />
        <meshStandardMaterial color={block.color} roughness={0.78} metalness={0.02} transparent={block.opacity < 1} opacity={block.opacity} />
      </mesh>
      <mesh position={[0, height / 2 - frameThickness / 2, 0]} castShadow>
        <boxGeometry args={[width, frameThickness, Math.max(depth, 0.035)]} />
        <meshStandardMaterial color={block.color} roughness={0.78} metalness={0.02} transparent={block.opacity < 1} opacity={block.opacity} />
      </mesh>
      {includeBottomFrame && (
        <mesh position={[0, -height / 2 + frameThickness / 2, 0]} castShadow>
          <boxGeometry args={[width, frameThickness, Math.max(depth, 0.035)]} />
          <meshStandardMaterial color={block.color} roughness={0.78} metalness={0.02} transparent={block.opacity < 1} opacity={block.opacity} />
        </mesh>
      )}
    </group>
  )
}

function StairsMarker({ block }) {
  const [width, height, depth] = block.size
  const steps = 6
  const stepDepth = depth / steps
  const stepHeight = height / steps
  const opacity = Math.min(block.opacity, 0.62)
  const rotationY = block.rotated ? Math.PI / 2 : 0
  const stepDirection = block.flipped ? -1 : 1

  return (
    <group position={block.position} rotation={[0, rotationY, 0]}>
      {Array.from({ length: steps }, (_, index) => {
        const currentHeight = stepHeight * (index + 1)
        const z = stepDirection * (-depth / 2 + stepDepth * index + stepDepth / 2)

        return (
          <mesh key={`step-${index}`} position={[0, -height / 2 + currentHeight / 2, z]} castShadow receiveShadow>
            <boxGeometry args={[width, currentHeight, stepDepth]} />
            <meshStandardMaterial color={block.color} roughness={0.86} metalness={0.01} transparent={opacity < 1} opacity={opacity} />
            <Edges color="#102736" transparent opacity={0.18} />
          </mesh>
        )
      })}
    </group>
  )
}

function ReferenceMarker({ block }) {
  const opacity = Math.min(block.opacity, 0.48)

  return (
    <group position={block.position}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={block.size} />
        <meshStandardMaterial color={block.color} roughness={0.86} metalness={0.01} transparent={opacity < 1} opacity={opacity} />
        <Edges color="#102736" transparent opacity={0.18} />
      </mesh>
    </group>
  )
}

function ModularBlock({ block }) {
  if (block.role === 'opening') {
    return <OpeningMarker block={block} />
  }

  if (block.modelType === 'stairs') {
    return <StairsMarker block={block} />
  }

  if (block.role !== 'structure') {
    return <ReferenceMarker block={block} />
  }

  return (
    <group position={block.position}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={block.size} />
        <meshStandardMaterial color={block.color} roughness={0.88} metalness={0.01} transparent={block.opacity < 1} opacity={block.opacity} />
        <Edges color="#102736" transparent opacity={block.opacity > 0.5 ? 0.28 : 0.14} />
      </mesh>
    </group>
  )
}

export default ModularBlock
