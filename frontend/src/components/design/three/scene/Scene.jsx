import { useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import Controls from '../controls/Controls'
import DimensionGuides from './DimensionGuides'
import Grid from './Grid'
import Lights from './Lights'
import ModularBlock from './ModularBlock'

const STORY_HEIGHT = 2.65

function getPieceRole(piece) {
  if (piece?.structuralRole) return piece.structuralRole
  if (piece?.category === 'accesorios') return 'reference'

  return 'structure'
}

function resolveBlocks(placements, designPieces, gridColumns, gridRows, cellSize, activeFloor) {
  if (!placements.length) {
    return []
  }

  return placements
    .filter((placement) => placement.floor <= activeFloor)
    .map((placement) => {
      const piece = designPieces.find((item) => item.id === placement.pieceId)
      const width = placement.width * cellSize
      const depth = placement.height * cellSize
      const height = piece?.heightMeters || 0.2
      const isActiveFloor = placement.floor === activeFloor
      const role = getPieceRole(piece)

      return {
        id: placement.id,
        label: piece?.name || 'Pieza',
        material: piece?.material || '',
        color: piece?.color || '#7e8993',
        modelType: piece?.modelType || '',
        opacity: isActiveFloor ? 0.84 : 0.34,
        role,
        position: [
          (placement.column - gridColumns / 2) * cellSize + width / 2,
          height / 2 + placement.floor * STORY_HEIGHT,
          (placement.row - gridRows / 2) * cellSize + depth / 2,
        ],
        size: [Math.max(width - 0.01, 0.02), height, Math.max(depth - 0.01, 0.02)],
      }
    })
}

function CameraDistance({ cellSize, gridColumns, gridRows, viewZoom }) {
  const { camera } = useThree()
  const gridWidth = gridColumns * cellSize
  const gridDepth = gridRows * cellSize
  const baseDistance = Math.max(22, Math.max(gridWidth, gridDepth) * 1.15)

  useEffect(() => {
    const distance = baseDistance / viewZoom
    camera.position.set(distance * 0.7, distance * 0.62, distance)
    camera.lookAt(0, 0, 0)
    camera.updateProjectionMatrix()
  }, [baseDistance, camera, viewZoom])

  return null
}

function FloorLevels({ activeFloor, depth, width }) {
  if (activeFloor <= 0) return null

  return Array.from({ length: activeFloor }, (_, index) => {
    const floor = index + 1
    const y = floor * STORY_HEIGHT
    const opacity = floor === activeFloor ? 0.22 : 0.1

    return (
      <group key={`floor-level-${floor}`} position={[0, y, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[width, depth]} />
          <meshStandardMaterial color="#f8fbff" transparent opacity={opacity} roughness={0.96} />
        </mesh>
        <mesh position={[0, 0.015, -depth / 2]}>
          <boxGeometry args={[width, 0.03, 0.035]} />
          <meshStandardMaterial color="#9fb3c2" transparent opacity={0.28} roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.015, depth / 2]}>
          <boxGeometry args={[width, 0.03, 0.035]} />
          <meshStandardMaterial color="#9fb3c2" transparent opacity={0.28} roughness={0.9} />
        </mesh>
        <mesh position={[-width / 2, 0.015, 0]}>
          <boxGeometry args={[0.035, 0.03, depth]} />
          <meshStandardMaterial color="#9fb3c2" transparent opacity={0.28} roughness={0.9} />
        </mesh>
        <mesh position={[width / 2, 0.015, 0]}>
          <boxGeometry args={[0.035, 0.03, depth]} />
          <meshStandardMaterial color="#9fb3c2" transparent opacity={0.28} roughness={0.9} />
        </mesh>
      </group>
    )
  })
}

function Scene({ activeFloor, designPieces, gridCellSizeMeters, gridColumns, gridRows, placements, viewZoom }) {
  const cellSize = gridCellSizeMeters
  const blocks = resolveBlocks(placements, designPieces, gridColumns, gridRows, cellSize, activeFloor)
  const gridWidth = gridColumns * cellSize
  const gridDepth = gridRows * cellSize
  const gridSize = Math.max(gridWidth, gridDepth)

  return (
    <>
      <color attach="background" args={['#fbfdff']} />
      <CameraDistance cellSize={cellSize} gridColumns={gridColumns} gridRows={gridRows} viewZoom={viewZoom} />
      <Lights />
      <Grid columns={gridColumns} rows={gridRows} cellSize={cellSize} />
      <FloorLevels activeFloor={activeFloor} depth={gridDepth} width={gridWidth} />
      <DimensionGuides depth={gridDepth} width={gridWidth} />
      <group>
        {blocks.map((block) => (
          <ModularBlock block={block} key={block.id} />
        ))}
      </group>
      <Controls maxDistance={Math.max(42, gridSize * 2.2)} minDistance={Math.max(3, gridSize * 0.08)} />
    </>
  )
}

export default Scene
