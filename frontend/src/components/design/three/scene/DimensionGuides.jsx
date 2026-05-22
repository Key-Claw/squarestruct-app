import { Line, Text } from '@react-three/drei'

const guideColor = '#102736'
const guideY = 0.055

function formatMeters(value) {
  return `${Number(value.toFixed(1)).toString()} m`
}

function DimensionGuides({ depth, height = 0, width }) {
  const offset = 0.72
  const halfWidth = width / 2
  const halfDepth = depth / 2
  const xGuideZ = halfDepth + offset
  const zGuideX = halfWidth + offset
  const heightGuideX = -halfWidth - offset
  const heightGuideZ = -halfDepth - offset

  return (
    <group>
      <Line color={guideColor} lineWidth={1} points={[[-halfWidth, guideY, xGuideZ], [halfWidth, guideY, xGuideZ]]} transparent opacity={0.55} />
      <Line color={guideColor} lineWidth={1} points={[[-halfWidth, guideY, halfDepth], [-halfWidth, guideY, xGuideZ + 0.14]]} transparent opacity={0.45} />
      <Line color={guideColor} lineWidth={1} points={[[halfWidth, guideY, halfDepth], [halfWidth, guideY, xGuideZ + 0.14]]} transparent opacity={0.45} />
      <Text
        anchorX="center"
        anchorY="middle"
        color={guideColor}
        fontSize={0.22}
        position={[0, guideY + 0.01, xGuideZ + 0.18]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        {formatMeters(width)}
      </Text>

      <Line color={guideColor} lineWidth={1} points={[[zGuideX, guideY, -halfDepth], [zGuideX, guideY, halfDepth]]} transparent opacity={0.55} />
      <Line color={guideColor} lineWidth={1} points={[[halfWidth, guideY, -halfDepth], [zGuideX + 0.14, guideY, -halfDepth]]} transparent opacity={0.45} />
      <Line color={guideColor} lineWidth={1} points={[[halfWidth, guideY, halfDepth], [zGuideX + 0.14, guideY, halfDepth]]} transparent opacity={0.45} />
      <Text
        anchorX="center"
        anchorY="middle"
        color={guideColor}
        fontSize={0.22}
        position={[zGuideX + 0.2, guideY + 0.01, 0]}
        rotation={[-Math.PI / 2, 0, Math.PI / 2]}
      >
        {formatMeters(depth)}
      </Text>

      {height > 0 && (
        <>
          <Line color={guideColor} lineWidth={1} points={[[heightGuideX, 0, heightGuideZ], [heightGuideX, height, heightGuideZ]]} transparent opacity={0.55} />
          <Line color={guideColor} lineWidth={1} points={[[heightGuideX - 0.14, 0, heightGuideZ], [heightGuideX + 0.14, 0, heightGuideZ]]} transparent opacity={0.45} />
          <Line color={guideColor} lineWidth={1} points={[[heightGuideX - 0.14, height, heightGuideZ], [heightGuideX + 0.14, height, heightGuideZ]]} transparent opacity={0.45} />
          <Text
            anchorX="center"
            anchorY="middle"
            color={guideColor}
            fontSize={0.22}
            position={[heightGuideX - 0.2, height / 2, heightGuideZ]}
            rotation={[0, -Math.PI / 2, 0]}
          >
            {formatMeters(height)}
          </Text>
        </>
      )}
    </group>
  )
}

export default DimensionGuides
