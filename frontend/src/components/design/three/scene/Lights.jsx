function Lights() {
  return (
    <>
      <ambientLight intensity={0.58} />
      <hemisphereLight args={['#ffffff', '#d7e7f6', 1.05]} position={[0, 5, 0]} />
      <directionalLight
        castShadow
        intensity={1.45}
        position={[5, 7, 4]}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
    </>
  )
}

export default Lights
