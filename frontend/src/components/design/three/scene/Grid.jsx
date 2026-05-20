function Grid({ columns, rows, cellSize }) {
  const width = columns * cellSize
  const depth = rows * cellSize
  const xStart = -width / 2
  const zStart = -depth / 2
  const lineThickness = 0.01

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial color="#f7fbff" roughness={0.92} metalness={0.02} />
      </mesh>

      {Array.from({ length: columns + 1 }, (_, index) => {
        const x = xStart + index * cellSize
        const isMainLine = index % 20 === 0

        return (
          <mesh key={`x-${index}`} position={[x, 0.012, 0]}>
            <boxGeometry args={[isMainLine ? lineThickness * 1.7 : lineThickness, 0.01, depth]} />
            <meshStandardMaterial color={isMainLine ? '#b8c6d0' : '#dbe5ec'} roughness={1} />
          </mesh>
        )
      })}

      {Array.from({ length: rows + 1 }, (_, index) => {
        const z = zStart + index * cellSize
        const isMainLine = index % 20 === 0

        return (
          <mesh key={`z-${index}`} position={[0, 0.014, z]}>
            <boxGeometry args={[width, 0.01, isMainLine ? lineThickness * 1.7 : lineThickness]} />
            <meshStandardMaterial color={isMainLine ? '#b8c6d0' : '#dbe5ec'} roughness={1} />
          </mesh>
        )
      })}

      <mesh position={[0, 0.02, 0]}>
        <boxGeometry args={[width, 0.03, 0.035]} />
        <meshStandardMaterial color="#5f9f38" roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.025, 0]}>
        <boxGeometry args={[0.035, 0.03, depth]} />
        <meshStandardMaterial color="#173f5f" roughness={0.85} />
      </mesh>
    </group>
  )
}

export default Grid
