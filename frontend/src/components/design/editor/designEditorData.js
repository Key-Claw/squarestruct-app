export const designCategories = {
  bloques: 'Bloques',
  pilares: 'Pilares',
  accesorios: 'Accesorios',
}

export const gridCellSizeMeters = 0.05
export const layerHeightMeters = 0.1
export const gridColumns = 300
export const gridRows = 300

const gridCellSizeCentimeters = gridCellSizeMeters * 100

const normalizeText = (value) => (
  String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
)

const centimetersToCells = (value, fallback = gridCellSizeCentimeters) => (
  Math.max(1, Math.ceil((Number(value) || fallback) / gridCellSizeCentimeters))
)

const getProductCategory = (product) => {
  const type = normalizeText(product.tipo)

  if (type.includes('pilar') || type.includes('columna')) return 'pilares'
  if (type.includes('bloque')) return 'bloques'
  return null
}

const getProductColor = (product) => {
  const material = normalizeText(product.material)
  const type = normalizeText(product.tipo)

  if (type.includes('pilar') || type.includes('columna')) {
    return material.includes('plastico') || material.includes('eco') ? '#6f9f46' : '#687480'
  }

  return material.includes('plastico') || material.includes('eco') ? '#7fbe52' : '#9ca6af'
}

const translateIfAvailable = (t, key) => {
  if (typeof t !== 'function') return ''

  const value = t(key)
  return value && value !== key ? value : ''
}

export const getDesignPieceDisplayName = (piece, t) => {
  const fallbackName = translateIfAvailable(t, 'design.fallbacks.piece') || 'Pieza'

  if (!piece) return fallbackName

  const nameKey = piece.nameKey || (piece.source === 'local' && piece.modelType
    ? `design.accessoryNames.${piece.modelType}`
    : '')

  if (nameKey) {
    return translateIfAvailable(t, nameKey)
      || piece.name
      || fallbackName
  }

  return piece.name || fallbackName
}

export const getDesignPieceDisplayMaterial = (piece, t) => {
  if (!piece) return ''

  const materialKey = piece.materialKey || (piece.source === 'local' ? 'design.localModel' : '')

  if (materialKey) {
    return translateIfAvailable(t, materialKey) || piece.material || ''
  }

  return piece.material || ''
}

export const localizeDesignPiece = (piece, t) => ({
  ...piece,
  material: getDesignPieceDisplayMaterial(piece, t),
  name: getDesignPieceDisplayName(piece, t),
})

export const mapProductToDesignPiece = (product) => {
  const category = getProductCategory(product)

  if (!category) return null

  return {
    id: `product-${product.idProducto}`,
    category,
    name: product.nombre || 'Producto modular',
    material: product.material || 'Sin material',
    size: `${Number(product.largo || 0).toFixed(0)} x ${Number(product.ancho || 0).toFixed(0)} x ${Number(product.alto || 0).toFixed(0)} cm`,
    price: Number(product.precio) || 0,
    color: getProductColor(product),
    footprint: {
      width: centimetersToCells(product.largo),
      height: centimetersToCells(product.ancho),
    },
    heightMeters: Math.max(0.05, (Number(product.alto) || 20) / 100),
    source: 'db',
    structuralRole: 'structure',
  }
}

export const accessoryPieces = [
  {
    id: 'accessory-door-basic',
    category: 'accesorios',
    name: '',
    nameKey: 'design.accessoryNames.door',
    material: '',
    materialKey: 'design.localModel',
    size: '90 x 10 x 210 cm',
    price: 0,
    color: '#a67c52',
    footprint: { width: 18, height: 2 },
    heightMeters: 2.1,
    source: 'local',
    structuralRole: 'opening',
    modelType: 'door',
  },
  {
    id: 'accessory-window-basic',
    category: 'accesorios',
    name: '',
    nameKey: 'design.accessoryNames.window',
    material: '',
    materialKey: 'design.localModel',
    size: '100 x 10 x 120 cm',
    price: 0,
    color: '#8fb8d8',
    footprint: { width: 20, height: 2 },
    heightMeters: 1.2,
    source: 'local',
    structuralRole: 'opening',
    modelType: 'window',
  },
  {
    id: 'accessory-stairs-basic',
    category: 'accesorios',
    name: '',
    nameKey: 'design.accessoryNames.stairs',
    material: '',
    materialKey: 'design.localModel',
    size: '120 x 80 x 80 cm',
    price: 0,
    color: '#b9a782',
    footprint: { width: 24, height: 16 },
    heightMeters: 0.8,
    source: 'local',
    structuralRole: 'reference',
    modelType: 'stairs',
  },
  {
    id: 'accessory-floor-basic',
    category: 'accesorios',
    name: '',
    nameKey: 'design.accessoryNames.floor',
    material: '',
    materialKey: 'design.localModel',
    size: '100 x 100 x 10 cm',
    price: 0,
    color: '#d7d0c4',
    footprint: { width: 20, height: 20 },
    heightMeters: 0.1,
    source: 'local',
    structuralRole: 'surface',
    modelType: 'floor',
  },
]
