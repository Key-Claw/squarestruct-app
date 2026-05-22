import { Canvas } from '@react-three/fiber'
import Scene from './scene/Scene'

function Viewer3D({
  activeFloor = 0,
  designPieces = [],
  gridCellSizeMeters = 0.05,
  gridColumns = 12,
  gridRows = 10,
  isGridVisible = true,
  layerHeightMeters = 0.05,
  onCameraStateChange,
  placements = [],
  resetSignal = 0,
  savedCameraState = null,
  viewZoom = 0.58,
}) {
  const gridMax = Math.max(gridColumns, gridRows)
  const baseDistance = Math.max(22, gridMax * gridCellSizeMeters * 1.15)
  const distance = baseDistance / viewZoom

  return (
    <div className="design-three-shell">
      <Canvas
        shadows
        camera={{ position: [distance * 0.7, distance * 0.62, distance], fov: 44 }}
        dpr={[1, 1.6]}
        gl={{ antialias: true, alpha: false }}
      >
        <Scene
          activeFloor={activeFloor}
          designPieces={designPieces}
          gridCellSizeMeters={gridCellSizeMeters}
          gridColumns={gridColumns}
          gridRows={gridRows}
          isGridVisible={isGridVisible}
          layerHeightMeters={layerHeightMeters}
          onCameraStateChange={onCameraStateChange}
          placements={placements}
          resetSignal={resetSignal}
          savedCameraState={savedCameraState}
          viewZoom={viewZoom}
        />
      </Canvas>
    </div>
  )
}

export default Viewer3D
