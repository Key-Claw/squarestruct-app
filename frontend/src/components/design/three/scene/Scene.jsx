import { useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import Controls from '../controls/Controls'
import DimensionGuides from './DimensionGuides'
import Grid from './Grid'
import Lights from './Lights'
import ModularBlock from './ModularBlock'

function getPieceRole(piece) {
  if (piece?.structuralRole) return piece.structuralRole
  if (piece?.category === 'accesorios') return 'reference'

  return 'structure'
}

function resolveBlocks(placements, designPieces, gridColumns, gridRows, cellSize, activeFloor, layerHeight) {
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
      const layerCount = Math.max(1, Math.ceil(height / layerHeight))
      const isActiveFloor = activeFloor >= placement.floor && activeFloor < placement.floor + layerCount
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
          height / 2 + placement.floor * layerHeight,
          (placement.row - gridRows / 2) * cellSize + depth / 2,
        ],
        size: [Math.max(width - 0.01, 0.02), height, Math.max(depth - 0.01, 0.02)],
      }
    })
}

function CameraDistance({ cellSize, gridColumns, gridRows, layerHeight, visibleLayers, viewZoom }) {
  const { camera } = useThree()
  const gridWidth = gridColumns * cellSize
  const gridDepth = gridRows * cellSize
  const gridHeight = Math.max(layerHeight, visibleLayers * layerHeight)
  const baseDistance = Math.max(22, Math.max(gridWidth, gridDepth, gridHeight * 2.2) * 1.15)

  useEffect(() => {
    const distance = baseDistance / viewZoom
    camera.position.set(distance * 0.7, Math.max(distance * 0.44, gridHeight * 0.9 + 2), distance)
    camera.lookAt(0, Math.min(gridHeight / 2, 1.8), 0)
    camera.updateProjectionMatrix()
  }, [baseDistance, camera, gridHeight, viewZoom])

  return null
}

function LayerGrid({ activeFloor, cellSize, columns, layerHeight, rows }) {
  const width = columns * cellSize
  const depth = rows * cellSize
  const xStart = -width / 2
  const zStart = -depth / 2
  const y = activeFloor * layerHeight
  const lineThickness = 0.006

  if (activeFloor <= 0) return null

  return (
    <group position={[0, y, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial color="#f8fbff" transparent opacity={0.18} roughness={0.96} />
      </mesh>

      {Array.from({ length: columns + 1 }, (_, index) => {
        const x = xStart + index * cellSize
        const isMainLine = index % 20 === 0

        return (
          <mesh key={`layer-x-${index}`} position={[x, 0.012, 0]}>
            <boxGeometry args={[isMainLine ? lineThickness * 1.8 : lineThickness, 0.008, depth]} />
            <meshStandardMaterial color={isMainLine ? '#8fb2c8' : '#d5e3ec'} transparent opacity={isMainLine ? 0.42 : 0.24} roughness={1} />
          </mesh>
        )
      })}

      {Array.from({ length: rows + 1 }, (_, index) => {
        const z = zStart + index * cellSize
        const isMainLine = index % 20 === 0

        return (
          <mesh key={`layer-z-${index}`} position={[0, 0.014, z]}>
            <boxGeometry args={[width, 0.008, isMainLine ? lineThickness * 1.8 : lineThickness]} />
            <meshStandardMaterial color={isMainLine ? '#8fb2c8' : '#d5e3ec'} transparent opacity={isMainLine ? 0.42 : 0.24} roughness={1} />
          </mesh>
        )
      })}
    </group>
  )
}

function LayerVolumeGuides({ activeFloor, depth, layerHeight, width }) {
  const visibleLayers = Math.max(1, activeFloor + 1)
  const height = visibleLayers * layerHeight
  const halfWidth = width / 2
  const halfDepth = depth / 2

  return (
    <group>
      {Array.from({ length: visibleLayers + 1 }, (_, index) => {
        const y = index * layerHeight
        const isMajorLayer = index % 20 === 0
        const opacity = index === activeFloor ? 0.42 : (isMajorLayer ? 0.22 : 0.1)

        return (
          <group key={`layer-frame-${index}`} position={[0, y, 0]}>
            <mesh position={[0, 0, -halfDepth]}>
              <boxGeometry args={[width, 0.012, 0.012]} />
              <meshStandardMaterial color="#9fb3c2" transparent opacity={opacity} roughness={0.9} />
            </mesh>
            <mesh position={[0, 0, halfDepth]}>
              <boxGeometry args={[width, 0.012, 0.012]} />
              <meshStandardMaterial color="#9fb3c2" transparent opacity={opacity} roughness={0.9} />
            </mesh>
            <mesh position={[-halfWidth, 0, 0]}>
              <boxGeometry args={[0.012, 0.012, depth]} />
              <meshStandardMaterial color="#9fb3c2" transparent opacity={opacity} roughness={0.9} />
            </mesh>
            <mesh position={[halfWidth, 0, 0]}>
              <boxGeometry args={[0.012, 0.012, depth]} />
              <meshStandardMaterial color="#9fb3c2" transparent opacity={opacity} roughness={0.9} />
            </mesh>
          </group>
        )
      })}
      {[
        [-halfWidth, halfDepth],
        [halfWidth, halfDepth],
        [-halfWidth, -halfDepth],
        [halfWidth, -halfDepth],
      ].map(([x, z]) => (
        <mesh key={`layer-corner-${x}-${z}`} position={[x, height / 2, z]}>
          <boxGeometry args={[0.018, height, 0.018]} />
          <meshStandardMaterial color="#9fb3c2" transparent opacity={0.22} roughness={0.9} />
        </mesh>
      ))}
    </group>
  )
}

function Scene({ activeFloor, designPieces, gridCellSizeMeters, gridColumns, gridRows, layerHeightMeters, placements, viewZoom }) {
  const cellSize = gridCellSizeMeters
  const layerHeight = layerHeightMeters || cellSize
  const blocks = resolveBlocks(placements, designPieces, gridColumns, gridRows, cellSize, activeFloor, layerHeight)
  const gridWidth = gridColumns * cellSize
  const gridDepth = gridRows * cellSize
  const gridSize = Math.max(gridWidth, gridDepth)
  const visibleLayers = Math.max(1, activeFloor + 1)

  return (
    <>
      <color attach="background" args={['#fbfdff']} />
      <CameraDistance cellSize={cellSize} gridColumns={gridColumns} gridRows={gridRows} layerHeight={layerHeight} visibleLayers={visibleLayers} viewZoom={viewZoom} />
      <Lights />
      <Grid columns={gridColumns} rows={gridRows} cellSize={cellSize} />
      <LayerGrid activeFloor={activeFloor} cellSize={cellSize} columns={gridColumns} layerHeight={layerHeight} rows={gridRows} />
      <LayerVolumeGuides activeFloor={activeFloor} depth={gridDepth} layerHeight={layerHeight} width={gridWidth} />
      <DimensionGuides depth={gridDepth} height={visibleLayers * layerHeight} width={gridWidth} />
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
