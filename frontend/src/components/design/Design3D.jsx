import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

// Componente mínimo que monta una escena Three.js y dibuja bloques sencillos
// El componente espera recibir un array de `placements` y `designPieces` para
// dibujar cada bloque con su footprint real en la misma posición que el plano 2D.
export default function Design3D({ placements, board, designPieces }) {
  const containerRef = useRef(null)
  const sceneRef = useRef(null)

  const resolvedPlacements = Array.isArray(placements)
    ? placements
    : Array.isArray(board)
      ? board.flatMap((row, rowIndex) => row.flatMap((cell, columnIndex) => {
        if (!cell) {
          return []
        }

        return [{
          id: `${cell.pieceId}-${rowIndex}-${columnIndex}`,
          pieceId: cell.pieceId,
          row: rowIndex,
          column: columnIndex,
          width: 1,
          height: 1,
        }]
      }))
      : []

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Escena básica
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000)
    camera.position.set(8, 10, 14)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(window.devicePixelRatio || 1)
    container.appendChild(renderer.domElement)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.enablePan = false
    controls.target.set(0, 0, 0)
    controls.update()

    // Luz
    const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 0.9)
    hemi.position.set(0, 50, 0)
    scene.add(hemi)

    const dir = new THREE.DirectionalLight(0xffffff, 0.6)
    dir.position.set(5, 10, 7)
    scene.add(dir)

    // Grid base
    const grid = new THREE.GridHelper(20, 20, 0x888888, 0xdddddd)
    scene.add(grid)

    sceneRef.current = { scene, camera, renderer }

    let frameId = 0

    const animate = () => {
      controls.update()
      renderer.render(scene, camera)
      frameId = requestAnimationFrame(animate)
    }
    animate()

    const handleResize = () => {
      const { clientWidth: w, clientHeight: h } = container
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(frameId)
      controls.dispose()
      renderer.dispose()
      container.removeChild(renderer.domElement)
    }
  }, [])

  useEffect(() => {
    const s = sceneRef.current
    if (!s) return

    const toRemove = s.scene.children.filter((c) => c.userData?.isBlock)
    toRemove.forEach((c) => s.scene.remove(c))

    resolvedPlacements.forEach((placement) => {
      const piece = designPieces.find((p) => p.id === placement.pieceId)
      const color = piece?.color || '#6b7280'

      const geometry = new THREE.BoxGeometry(placement.width * 0.9, 0.6, placement.height * 0.9)
      const material = new THREE.MeshStandardMaterial({ color })
      const cube = new THREE.Mesh(geometry, material)
      cube.position.set(
        placement.column - 5 + (placement.width / 2),
        0.3 + ((placement.floor || 0) * 0.7),
        placement.row - 3.5 + (placement.height / 2),
      )
      cube.userData.isBlock = true
      s.scene.add(cube)

      const edge = new THREE.EdgesGeometry(geometry)
      const line = new THREE.LineSegments(edge, new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.22 }))
      line.position.copy(cube.position)
      line.userData.isBlock = true
      s.scene.add(line)
    })
  }, [resolvedPlacements, designPieces])

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%', minHeight: 540 }} />
  )
}
