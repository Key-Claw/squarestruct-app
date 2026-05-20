import { useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import Controls from '../controls/Controls'
import Grid from './Grid'
import Lights from './Lights'
import ModularBlock from './ModularBlock'

const cellSize = 0.05

function resolveBlocks(placements, designPieces, gridColumns, gridRows) {
  if (!placements.length) {
    return []
  }

  return placements.map((placement) => {
    const piece = designPieces.find((item) => item.id === placement.pieceId)
    const width = placement.width * cellSize
    const depth = placement.height * cellSize
    const height = piece?.heightMeters || 0.2

    return {
      id: placement.id,
      label: piece?.name || 'Pieza',
      material: piece?.material || '',
      color: piece?.color || '#7e8993',
      position: [
        (placement.column - gridColumns / 2) * cellSize + width / 2,
        height / 2 + placement.floor * 2.65,
        (placement.row - gridRows / 2) * cellSize + depth / 2,
      ],
      size: [Math.max(width - 0.01, 0.02), height, Math.max(depth - 0.01, 0.02)],
    }
  })
}

function CameraDistance({ gridColumns, gridRows, viewZoom }) {
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

function Scene({ designPieces, gridColumns, gridRows, placements, viewZoom }) {
  const blocks = resolveBlocks(placements, designPieces, gridColumns, gridRows)
  const gridSize = Math.max(gridColumns * cellSize, gridRows * cellSize)

  return (
    <>
      <color attach="background" args={['#fbfdff']} />
      <CameraDistance gridColumns={gridColumns} gridRows={gridRows} viewZoom={viewZoom} />
      <Lights />
      <Grid columns={gridColumns} rows={gridRows} cellSize={cellSize} />
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
