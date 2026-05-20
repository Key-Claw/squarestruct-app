import { Canvas } from '@react-three/fiber'
import Scene from './scene/Scene'

function Viewer3D({ designPieces = [], gridColumns = 12, gridRows = 10, placements = [], viewZoom = 0.58 }) {
  const gridMax = Math.max(gridColumns, gridRows)
  const baseDistance = Math.max(22, gridMax * 0.05 * 1.15)
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
          designPieces={designPieces}
          gridColumns={gridColumns}
          gridRows={gridRows}
          placements={placements}
          viewZoom={viewZoom}
        />
      </Canvas>

      <div className="design-three-caption" aria-hidden="true">
        <span>Plano modular 3D</span>
        <strong>Vista interactiva</strong>
      </div>
    </div>
  )
}

export default Viewer3D
