import { useCallback, useEffect, useRef } from 'react'
import { OrbitControls } from '@react-three/drei'

function Controls({
  maxDistance = 32,
  minDistance = 4,
  onCameraStateChange,
  resetSignal = 0,
  target = [0, 0.35, 0],
}) {
  const controlsRef = useRef(null)

  const saveCameraState = useCallback(() => {
    const controls = controlsRef.current
    if (!controls || !onCameraStateChange) return

    onCameraStateChange({
      position: controls.object.position.toArray(),
      target: controls.target.toArray(),
    })
  }, [onCameraStateChange])

  useEffect(() => {
    const controls = controlsRef.current
    if (!controls) return

    controls.target.set(...target)
    controls.update()
  }, [resetSignal, target])

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      enablePan
      minDistance={minDistance}
      maxDistance={maxDistance}
      minPolarAngle={Math.PI / 4.2}
      maxPolarAngle={Math.PI / 2.35}
      onEnd={saveCameraState}
      target={target}
    />
  )
}

export default Controls
