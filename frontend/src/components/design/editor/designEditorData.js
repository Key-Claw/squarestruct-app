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
    name: 'Puerta',
    material: 'Accesorio local',
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
    name: 'Ventana',
    material: 'Accesorio local',
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
    name: 'Escalera',
    material: 'Accesorio local',
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
    name: 'Suelo',
    material: 'Accesorio local',
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
