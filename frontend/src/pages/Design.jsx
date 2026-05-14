import { useMemo, useState } from 'react'

import Icon from '../components/ui/Icon'
import Design3D from '../components/design/Design3D'

const DESIGN_STORAGE_KEY = 'squarestruct-design-draft'
const DESIGN_DRAG_MIME = 'application/x-squarestruct-piece'

const designCategories = {
  bloques: 'Bloques',
  pilares: 'Pilares',
  accesorios: 'Accesorios',
}

const designPieces = [
  {
    id: 'bloque-200-reciclado',
    category: 'bloques',
    name: 'Bloque 200',
    material: 'Plastico reciclado',
    size: '20 x 15 x 20 cm',
    price: 18.5,
    color: '#4f8f2f',
    footprint: { width: 1, height: 1 },
  },
  {
    id: 'bloque-200-hormigon',
    category: 'bloques',
    name: 'Bloque 200',
    material: 'Hormigon',
    size: '20 x 15 x 20 cm',
    price: 21.9,
    color: '#c2c7cf',
    footprint: { width: 1, height: 1 },
  },
  {
    id: 'bloque-300-hormigon',
    category: 'bloques',
    name: 'Bloque 300',
    material: 'Hormigon',
    size: '30 x 15 x 20 cm',
    price: 25.4,
    color: '#9aa4b2',
    footprint: { width: 2, height: 1 },
  },
  {
    id: 'bloque-600-hormigon',
    category: 'bloques',
    name: 'Bloque 600',
    material: 'Hormigon',
    size: '60 x 15 x 20 cm',
    price: 31.8,
    color: '#6b7280',
    footprint: { width: 3, height: 1 },
  },
  {
    id: 'bloque-800-reciclado',
    category: 'bloques',
    name: 'Bloque 800',
    material: 'Plastico reciclado',
    size: '80 x 15 x 20 cm',
    price: 34.6,
    color: '#7fbf4d',
    footprint: { width: 4, height: 1 },
  },
  {
    id: 'pilar-esquina',
    category: 'pilares',
    name: 'Pilar esquina',
    material: 'Hormigon',
    size: '20 x 20 x 240 cm',
    price: 45.0,
    color: '#8b949e',
    footprint: { width: 1, height: 1 },
  },
  {
    id: 'pilar-medio',
    category: 'pilares',
    name: 'Pilar medio',
    material: 'Hormigon',
    size: '20 x 20 x 240 cm',
    price: 39.5,
    color: '#d0d6de',
    footprint: { width: 1, height: 1 },
  },
  {
    id: 'remate-superior',
    category: 'accesorios',
    name: 'Remate superior',
    material: 'Plastico reciclado',
    size: '20 x 15 x 10 cm',
    price: 12.2,
    color: '#9dd671',
    footprint: { width: 1, height: 1 },
  },
]

const gridColumns = 10
const gridRows = 7
const createEmptyPlacements = () => []

function createPlacementId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  return `placement-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function getPieceFootprint(piece) {
  return piece?.footprint || { width: 1, height: 1 }
}

function createPlacement(piece, row, column, floor = 0, placementId = createPlacementId()) {
  const footprint = getPieceFootprint(piece)

  return {
    id: placementId,
    pieceId: piece.id,
    row,
    column,
    width: footprint.width,
    height: footprint.height,
    floor,
  }
}

function placementCoversCell(placement, row, column, floor = placement.floor) {
  return (
    floor === placement.floor
    && row >= placement.row
    && row < placement.row + placement.height
    && column >= placement.column
    && column < placement.column + placement.width
  )
}

function rectanglesOverlap(a, b) {
  const aBottom = a.row + a.height
  const aRight = a.column + a.width
  const bBottom = b.row + b.height
  const bRight = b.column + b.width

  return a.row < bBottom && aBottom > b.row && a.column < bRight && aRight > b.column
}

// Un bloque está apoyado si toca la planta inferior o si se engancha a un bloque
// del mismo piso por su lado izquierdo. Con esto evitamos piezas "flotando".
function hasStructuralSupport(placements, candidatePlacement, ignorePlacementId = null) {
  if (candidatePlacement.floor === 0) {
    return true
  }

  const lowerFloor = candidatePlacement.floor - 1

  const hasSupportBelow = placements.some((placement) => {
    if (placement.id === ignorePlacementId || placement.floor !== lowerFloor) {
      return false
    }

    return rectanglesOverlap(placement, candidatePlacement)
  })

  if (hasSupportBelow) {
    return true
  }

  return placements.some((placement) => {
    if (placement.id === ignorePlacementId || placement.floor !== candidatePlacement.floor) {
      return false
    }

    const touchesLeftSide = placement.column + placement.width === candidatePlacement.column
    const verticalOverlap = rectanglesOverlap(
      { row: placement.row, height: placement.height, column: 0, width: 1 },
      { row: candidatePlacement.row, height: candidatePlacement.height, column: 0, width: 1 },
    )

    return touchesLeftSide && verticalOverlap
  })
}

function evaluatePlacement(placements, candidatePlacement, ignorePlacementId = null) {
  if (candidatePlacement.row < 0 || candidatePlacement.column < 0) {
    return { ok: false, reason: 'La pieza no cabe fuera del plano.' }
  }

  if (candidatePlacement.row + candidatePlacement.height > gridRows || candidatePlacement.column + candidatePlacement.width > gridColumns) {
    return { ok: false, reason: 'La pieza no cabe en el borde del plano.' }
  }

  const collidesWithAnotherPlacement = placements.some((placement) => {
    if (placement.id === ignorePlacementId) {
      return false
    }

    if (placement.floor !== candidatePlacement.floor) {
      return false
    }

    return rectanglesOverlap(placement, candidatePlacement)
  })

  if (collidesWithAnotherPlacement) {
    return { ok: false, reason: 'La pieza choca con otra colocada.' }
  }

  if (!hasStructuralSupport(placements, candidatePlacement, ignorePlacementId)) {
    return { ok: false, reason: 'La pieza necesita apoyo debajo o conexión lateral.' }
  }

  return { ok: true, reason: '' }
}

function buildBoardFromPlacements(placements, floor = 0) {
  const board = Array.from({ length: gridRows }, () => Array(gridColumns).fill(null))

  placements.forEach((placement) => {
    if (placement.floor !== floor) {
      return
    }

    for (let rowOffset = 0; rowOffset < placement.height; rowOffset += 1) {
      for (let columnOffset = 0; columnOffset < placement.width; columnOffset += 1) {
        const row = placement.row + rowOffset
        const column = placement.column + columnOffset

        if (row < 0 || row >= gridRows || column < 0 || column >= gridColumns) {
          continue
        }

        board[row][column] = {
          placementId: placement.id,
          pieceId: placement.pieceId,
          isAnchor: rowOffset === 0 && columnOffset === 0,
          floor: placement.floor,
        }
      }
    }
  })

  return board
}

function convertBoardToPlacements(board) {
  if (!Array.isArray(board)) {
    return createEmptyPlacements()
  }

  const placements = []

  board.forEach((row, rowIndex) => {
    row.forEach((cell, columnIndex) => {
      if (!cell) {
        return
      }

      placements.push({
        id: createPlacementId(),
        pieceId: cell.pieceId,
        row: rowIndex,
        column: columnIndex,
        width: 1,
        height: 1,
        floor: cell.floor || 0,
      })
    })
  })

  return placements
}

function findPlacementAtCell(placements, row, column, floor = 0) {
  return placements.find((placement) => placementCoversCell(placement, row, column, floor)) || null
}

const howItWorks = [
  {
    title: 'Elige una pieza',
    text: 'Selecciona un bloque, pilar o accesorio desde el panel izquierdo.',
  },
  {
    title: 'Coloca en la cuadricula',
    text: 'Haz clic sobre una zona libre para dejar la pieza en el plano 2D.',
  },
  {
    title: 'Revisa el resumen',
    text: 'El panel derecho se actualiza con piezas, materiales y coste estimado.',
  },
]

function loadDraft() {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    const rawDraft = window.localStorage.getItem(DESIGN_STORAGE_KEY)
    if (!rawDraft) {
      return null
    }

    const parsedDraft = JSON.parse(rawDraft)

    if (!parsedDraft.activeCategory) {
      return null
    }

    return {
      placements: Array.isArray(parsedDraft.placements)
        ? parsedDraft.placements
        : convertBoardToPlacements(parsedDraft.board),
      activeCategory: parsedDraft.activeCategory,
      selectedPieceId: parsedDraft.selectedPieceId || null,
      activeFloor: Number.isFinite(parsedDraft.activeFloor) ? parsedDraft.activeFloor : 0,
    }
  } catch {
    return null
  }
}

function Design({ onNavigate }) {
  const initialDraft = loadDraft()
  const [activeCategory, setActiveCategory] = useState(initialDraft?.activeCategory || 'bloques')
  const [selectedPieceId, setSelectedPieceId] = useState(
    initialDraft?.selectedPieceId || designPieces.find((piece) => piece.category === 'bloques')?.id || designPieces[0].id,
  )
  const [placements, setPlacements] = useState(() => initialDraft?.placements || createEmptyPlacements())
  const [hoverCell, setHoverCell] = useState(null)
  const [dragPayload, setDragPayload] = useState(null)
  const [dragOverCell, setDragOverCell] = useState(null)
  const [draggingPieceId, setDraggingPieceId] = useState(null)
  const [activeFloor, setActiveFloor] = useState(initialDraft?.activeFloor || 0)
  const [viewMode, setViewMode] = useState('2d')
  const [statusMessage, setStatusMessage] = useState('Selecciona una pieza y colócala en la cuadricula.')

  const visiblePieces = designPieces.filter((piece) => piece.category === activeCategory)
  const selectedPiece = designPieces.find((piece) => piece.id === selectedPieceId) || visiblePieces[0] || designPieces[0]
  const board = useMemo(() => buildBoardFromPlacements(placements, activeFloor), [placements, activeFloor])
  const placementMap = useMemo(() => new Map(placements.map((placement) => [placement.id, placement])), [placements])

  const boardStats = useMemo(() => {
    const pieceMap = new Map(designPieces.map((piece) => [piece.id, piece]))
    const summaryMap = new Map()
    let totalPieces = 0
    let materialsSubtotal = 0
    let occupiedCells = 0

    placements.forEach((placement) => {
      const piece = pieceMap.get(placement.pieceId)
      if (!piece) {
        return
      }

      totalPieces += 1
      materialsSubtotal += piece.price
      occupiedCells += placement.width * placement.height

      const summaryKey = `${piece.name}-${piece.material}`
      const currentSummary = summaryMap.get(summaryKey)

      if (currentSummary) {
        currentSummary.amount += 1
        return
      }

      summaryMap.set(summaryKey, {
        name: piece.name,
        material: piece.material,
        unitPrice: piece.price,
        amount: 1,
      })
    })

    const summaryItems = Array.from(summaryMap.values())
      .map((item) => ({
        ...item,
        lineSubtotal: item.unitPrice * item.amount,
      }))
      .sort((a, b) => b.lineSubtotal - a.lineSubtotal)

    const contingencyRate = 0.08
    const contingencyAmount = materialsSubtotal * contingencyRate
    const estimatedTotal = materialsSubtotal + contingencyAmount

    return {
      totalPieces,
      materialsSubtotal,
      contingencyRate,
      contingencyAmount,
      estimatedTotal,
      totalArea: (occupiedCells * 1.2).toFixed(1),
      wallHeight: `${(totalPieces > 0 ? 2.4 : 0).toFixed(2)} m`,
      items: summaryItems,
    }
  }, [placements])

  const handlePieceSelect = (pieceId) => {
    setSelectedPieceId(pieceId)
    setStatusMessage('Pieza seleccionada. Ahora haz clic en una celda para colocarla.')
  }

  const handleCategoryChange = (category) => {
    setActiveCategory(category)

    const firstPieceFromCategory = designPieces.find((piece) => piece.category === category)
    if (firstPieceFromCategory) {
      setSelectedPieceId(firstPieceFromCategory.id)
    }

    setStatusMessage(`Mostrando piezas de ${designCategories[category].toLowerCase()}.`)
  }

  const handleCellPlace = (rowIndex, columnIndex) => {
    if (!selectedPiece) {
      return
    }

    const candidatePlacement = createPlacement(selectedPiece, rowIndex, columnIndex, activeFloor)
    const evaluation = evaluatePlacement(placements, candidatePlacement)

    if (!evaluation.ok) {
      setStatusMessage(evaluation.reason)
      return
    }

    setPlacements((currentPlacements) => [...currentPlacements, candidatePlacement])
    setStatusMessage(`${selectedPiece.name} colocado ocupando ${candidatePlacement.width}x${candidatePlacement.height} celdas.`)
  }

  const buildDragPayload = (payload) => JSON.stringify(payload)

  const parseDragPayload = (event) => {
    const serializedPayload = event.dataTransfer.getData(DESIGN_DRAG_MIME)

    if (!serializedPayload) {
      return dragPayload
    }

    try {
      return JSON.parse(serializedPayload)
    } catch {
      return dragPayload
    }
  }

  const clearDragState = () => {
    setDragPayload(null)
    setDragOverCell(null)
    setDraggingPieceId(null)
  }

  const handlePieceDragStart = (event, piece) => {
    const payload = {
      source: 'palette',
      pieceId: piece.id,
    }

    event.dataTransfer.effectAllowed = 'copy'
    event.dataTransfer.setData(DESIGN_DRAG_MIME, buildDragPayload(payload))
    setDragPayload(payload)
    setDraggingPieceId(piece.id)
    setStatusMessage(`Arrastrando ${piece.name}. Suelta en una celda vacía para colocarla.`)
  }

  const handlePlacedPieceDragStart = (event, rowIndex, columnIndex, pieceId) => {
    const placement = findPlacementAtCell(placements, rowIndex, columnIndex, activeFloor)

    const payload = {
      source: 'board',
      pieceId,
      placementId: placement?.id || null,
      from: {
        row: rowIndex,
        column: columnIndex,
      },
    }

    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData(DESIGN_DRAG_MIME, buildDragPayload(payload))
    setDragPayload(payload)
    setDraggingPieceId(pieceId)
    setStatusMessage('Arrastrando bloque colocado. Suéltalo en una nueva celda para recolocarlo.')
  }

  const handleDragEnd = () => {
    clearDragState()
  }

  const handleCellDragOver = (event, rowIndex, columnIndex) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = dragPayload?.source === 'board' ? 'move' : 'copy'
    setDragOverCell({ row: rowIndex, column: columnIndex })
  }

  const handleCellDrop = (event, rowIndex, columnIndex) => {
    event.preventDefault()

    const payload = parseDragPayload(event)
    if (!payload) {
      clearDragState()
      return
    }

    const pieceFromPayload = designPieces.find((piece) => piece.id === payload.pieceId)
    if (!pieceFromPayload) {
      clearDragState()
      return
    }

    const targetPlacement = createPlacement(pieceFromPayload, rowIndex, columnIndex)

    if (payload.source === 'palette') {
      const evaluation = evaluatePlacement(placements, targetPlacement)

      if (!evaluation.ok) {
        setStatusMessage(evaluation.reason)
        clearDragState()
        return
      }

      setPlacements((currentPlacements) => [...currentPlacements, targetPlacement])
      setSelectedPieceId(payload.pieceId)
      setStatusMessage(`${pieceFromPayload.name} añadido ocupando ${targetPlacement.width}x${targetPlacement.height} celdas.`)
      clearDragState()
      return
    }

    if (payload.source === 'board') {
      const sourcePlacementId = payload.placementId || findPlacementAtCell(placements, payload.from?.row, payload.from?.column)?.id
      const sourcePlacement = placements.find((placement) => placement.id === sourcePlacementId)

      if (!sourcePlacement) {
        setStatusMessage('No se pudo mover el bloque. Vuelve a intentarlo.')
        clearDragState()
        return
      }

      const movedPlacement = {
        ...sourcePlacement,
        row: rowIndex,
        column: columnIndex,
      }

      const evaluation = evaluatePlacement(placements, movedPlacement, sourcePlacement.id)

      if (!evaluation.ok) {
        setStatusMessage(evaluation.reason)
        clearDragState()
        return
      }

      setPlacements((currentPlacements) => {
        const withoutSource = currentPlacements.filter((placement) => placement.id !== sourcePlacement.id)
        return [...withoutSource, movedPlacement]
      })
      setSelectedPieceId(sourcePlacement.pieceId)
      setStatusMessage(`Bloque recolocado ocupando ${movedPlacement.width}x${movedPlacement.height} celdas.`)
      clearDragState()
      return
    }

    clearDragState()
  }

  const handleRemoveCell = (rowIndex, columnIndex) => {
    const placement = findPlacementAtCell(placements, rowIndex, columnIndex, activeFloor)

    if (!placement) {
      return
    }

    setPlacements((currentPlacements) => currentPlacements.filter((item) => item.id !== placement.id))
    setStatusMessage(`Pieza ${rowIndex + 1}-${columnIndex + 1} eliminada del plano.`)
  }

  const handleNewProject = () => {
    setPlacements(createEmptyPlacements())
    setHoverCell(null)
    clearDragState()
    setStatusMessage('Plano reiniciado. Puedes empezar un diseño nuevo.')
  }

  const handleSaveDraft = () => {
    if (typeof window === 'undefined') {
      return
    }

    const draft = {
      activeCategory,
      selectedPieceId,
      activeFloor,
      placements,
    }

    window.localStorage.setItem(DESIGN_STORAGE_KEY, JSON.stringify(draft))
    setStatusMessage('Borrador guardado en el navegador.')
  }

  const handleLoadDraft = () => {
    const draft = loadDraft()

    if (!draft) {
      setStatusMessage('No hay ningún borrador guardado todavía.')
      return
    }

    setActiveCategory(draft.activeCategory)
    setSelectedPieceId(draft.selectedPieceId || designPieces.find((piece) => piece.category === draft.activeCategory)?.id || designPieces[0].id)
    setActiveFloor(Number.isFinite(draft.activeFloor) ? draft.activeFloor : 0)
    setPlacements(draft.placements || convertBoardToPlacements(draft.board))
    setStatusMessage('Borrador recuperado correctamente.')
  }

  return (
    <section className="page-shell design-page container-fluid">
      {/* ====================================================================
          BARRA SUPERIOR
          Mantiene la estructura visual, pero ahora las acciones sí están
          conectadas a un estado real del diseñador 2D.
          ==================================================================== */}
      <header className="card design-topbar">
        <div>
          <h1>Disena tu estructura modular</h1>
          <p>
            Esta primera iteracion funciona como un editor 2D de planos: eliges piezas, las colocas en la cuadricula y el resumen se recalcula al instante.
          </p>
        </div>

        <div className="design-topbar-actions">
          <button type="button" className="btn design-outline-btn" onClick={handleSaveDraft}>Guardar</button>
          <button type="button" className="btn design-outline-btn" onClick={handleLoadDraft}>Cargar</button>
          <button type="button" className="btn design-outline-btn" onClick={handleNewProject}>Nuevo</button>
          <button type="button" className="btn design-budget-btn" onClick={() => onNavigate('catalogo', '', 'productos')}>
            Ver productos reales
          </button>
        </div>
      </header>

      <div className="row g-4 design-workspace">
        {/* ====================================================================
            PANEL IZQUIERDO
            Aquí se concentran las piezas disponibles y la selección de categoría.
            ==================================================================== */}
        <aside className="col-12 col-xl-3">
          <section className="card design-pieces-panel">
            <h2>Bloques y piezas</h2>
            <div className="design-tabs" role="tablist" aria-label="Tipos de piezas">
              {Object.entries(designCategories).map(([category, label]) => (
                <button
                  key={category}
                  type="button"
                  className={activeCategory === category ? 'active' : ''}
                  onClick={() => handleCategoryChange(category)}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="design-piece-list">
              {visiblePieces.map((piece) => (
                <button
                  type="button"
                  className={`design-piece-card${selectedPieceId === piece.id ? ' is-selected' : ''}`}
                  key={piece.id}
                  onClick={() => handlePieceSelect(piece.id)}
                  draggable
                  onDragStart={(event) => handlePieceDragStart(event, piece)}
                  onDragEnd={handleDragEnd}
                >
                  <div className="design-piece-media" style={{ '--piece-color': piece.color }}>
                    {piece.name}
                  </div>
                  <div>
                    <h3>{piece.name}</h3>
                    <p>{piece.material}</p>
                    <span>{piece.size}</span>
                    <strong>{piece.price.toFixed(2)} EUR</strong>
                  </div>
                </button>
              ))}
            </div>

            <div className="design-drag-help">
              <span aria-hidden="true"><Icon name="grid" size={22} /></span>
              <div>
                <strong>Fase 1 del editor</strong>
                <p>Selecciona una pieza y colócala con un clic sobre la cuadricula.</p>
              </div>
            </div>
          </section>
        </aside>

        {/* ====================================================================
            ÁREA CENTRAL
            La parte visual del editor 2D. Aquí se verán las piezas colocadas y,
            en una fase posterior, se podrá enchufar Three.js sin romper el layout.
            ==================================================================== */}
        <main className="col-12 col-xl-6">
          <section className="card design-canvas-card" aria-label="Plano modular 2D">
            <div className="design-board-header">
              <div>
                <h2>Plano 2D modular</h2>
                <p>{statusMessage}</p>
              </div>

              <div className="design-board-legend" aria-label="Leyenda de la rejilla">
                <span><i className="legend-color legend-color--green" /> Disponible</span>
                <span><i className="legend-color legend-color--blue" /> Pieza colocada</span>
                <span><i className="legend-color legend-color--outline" /> Previsualización</span>
              </div>
            </div>

            <div className="design-board-shell">
              <div className="design-board-metrics">
                <span>Celda: 1 unidad</span>
                <span>Vista: {viewMode === '2d' ? '2D' : '3D'}</span>
                <span>Pieza actual: {selectedPiece?.name || 'Ninguna'}</span>
              </div>

              <div className="design-floor-controls" aria-label="Cambiar de piso">
                <button type="button" className="btn design-floor-btn" onClick={() => setActiveFloor((currentFloor) => Math.max(0, currentFloor - 1))} aria-label="Bajar un piso">
                  ↓
                </button>
                <div className="design-floor-indicator">
                  <span>Piso activo</span>
                  <strong>{activeFloor}</strong>
                </div>
                <button type="button" className="btn design-floor-btn" onClick={() => setActiveFloor((currentFloor) => currentFloor + 1)} aria-label="Subir un piso">
                  ↑
                </button>
              </div>

              <div className="design-view-switch-inline">
                <button type="button" className="btn" onClick={() => setViewMode('2d')}>2D</button>
                <button type="button" className="btn" onClick={() => setViewMode('3d')}>3D</button>
              </div>

              {viewMode === '2d' ? (
                <div className="design-board" role="grid" aria-label="Cuadricula de trabajo del plano">
                  {(() => {
                    const previewSourceCell = dragOverCell || hoverCell
                    const previewPiece = dragPayload ? designPieces.find((item) => item.id === dragPayload.pieceId) : selectedPiece
                    const previewPlacement = previewPiece && previewSourceCell
                      ? {
                        row: previewSourceCell.row,
                        column: previewSourceCell.column,
                        width: getPieceFootprint(previewPiece).width,
                        height: getPieceFootprint(previewPiece).height,
                        floor: activeFloor,
                      }
                      : null
                    const previewFits = previewPlacement ? evaluatePlacement(placements, previewPlacement, dragPayload?.placementId || null).ok : false

                    return board.map((row, rowIndex) => (
                      row.map((cell, columnIndex) => {
                        const cellPlacement = cell ? placementMap.get(cell.placementId) : null
                        const isDragOver = dragOverCell?.row === rowIndex && dragOverCell?.column === columnIndex
                        const piece = cellPlacement ? designPieces.find((item) => item.id === cellPlacement.pieceId) : null
                        const isPreviewCell = Boolean(previewPlacement && placementCoversCell(previewPlacement, rowIndex, columnIndex))
                        const isPreviewAnchor = isPreviewCell && rowIndex === previewPlacement.row && columnIndex === previewPlacement.column

                        return (
                          <button
                            key={`${rowIndex}-${columnIndex}`}
                            type="button"
                            className={`design-board-cell${cell ? ' is-filled' : ''}${cellPlacement ? ' is-occupied' : ''}${cell?.isAnchor ? ' is-anchor' : ''}${isPreviewCell && previewFits ? ' is-preview' : ''}${isPreviewCell && !previewFits ? ' is-invalid-preview' : ''}${isDragOver ? ' is-drag-target' : ''}`}
                            onMouseEnter={() => setHoverCell({ row: rowIndex, column: columnIndex })}
                            onMouseLeave={() => setHoverCell(null)}
                            onClick={() => (cellPlacement ? handleRemoveCell(rowIndex, columnIndex) : handleCellPlace(rowIndex, columnIndex))}
                            draggable={Boolean(cell)}
                            onDragStart={(event) => {
                              if (!cell) return
                              handlePlacedPieceDragStart(event, rowIndex, columnIndex, cell.pieceId, cell.placementId)
                            }}
                            onDragEnd={handleDragEnd}
                            onDragOver={(event) => handleCellDragOver(event, rowIndex, columnIndex)}
                            onDrop={(event) => handleCellDrop(event, rowIndex, columnIndex)}
                            aria-label={cellPlacement ? `Quitar ${piece?.name || 'pieza'} del bloque en la celda ${rowIndex + 1}-${columnIndex + 1}` : `Colocar ${selectedPiece?.name || 'pieza'} en la celda ${rowIndex + 1}-${columnIndex + 1}`}
                            style={{ '--piece-color': piece?.color || previewPiece?.color || '#6b7280' }}
                          >
                            {cellPlacement && piece && cell?.isAnchor ? (
                              <span className={`design-piece-token${draggingPieceId === piece.id ? ' is-being-dragged' : ''}`} style={{ '--piece-color': piece.color }}>
                                {piece.name}
                                <small>Piso {cellPlacement.floor}</small>
                              </span>
                            ) : isPreviewAnchor && previewPiece ? (
                              <span className="design-piece-token design-piece-token--preview" style={{ '--piece-color': previewPiece.color }}>
                                {previewPiece.name}
                                <small>Piso {activeFloor}</small>
                              </span>
                            ) : null}
                          </button>
                        )
                      })
                    ))
                  })()}
                </div>
              ) : (
                <div style={{ height: 560 }}>
                  <Design3D placements={placements} designPieces={designPieces} />
                </div>
              )}
            </div>

            <div className="design-board-footer">
              <div>
                <Icon name="grid" size={18} />
                <span>Haz clic en una zona libre del piso {activeFloor} para colocar la pieza activa.</span>
              </div>
              <button type="button" className="btn design-outline-btn" onClick={() => setPlacements(createEmptyPlacements())}>
                Limpiar todo
              </button>
            </div>
          </section>
        </main>

        {/* ====================================================================
            PANEL DERECHO
            Resume el estado real del tablero en lugar de mostrar datos estáticos.
            ==================================================================== */}
        <aside className="col-12 col-xl-3">
          <section className="card design-summary-panel">
            <h2>Resumen del proyecto</h2>

            <div className="design-summary-list">
              {boardStats.items.length > 0 ? boardStats.items.map((item) => (
                <div key={`${item.name}-${item.material}`}>
                  <span><strong>{item.name}</strong> {item.material}</span>
                  <b>{item.amount}</b>
                </div>
              )) : (
                <div className="design-summary-empty">
                  <span>No hay piezas colocadas todavía.</span>
                </div>
              )}
            </div>

            <dl className="design-summary-totals">
              <div>
                <dt>Total piezas</dt>
                <dd>{boardStats.totalPieces}</dd>
              </div>
              <div>
                <dt>Superficie estimada</dt>
                <dd>{boardStats.totalArea} m2</dd>
              </div>
              <div>
                <dt>Altura de muros</dt>
                <dd>{boardStats.wallHeight}</dd>
              </div>
            </dl>

            <div className="design-price-box">
              <span>Precio estimado</span>
              <strong>{boardStats.estimatedTotal.toFixed(2)} EUR</strong>
              <div className="design-price-breakdown" aria-label="Desglose del presupuesto">
                {boardStats.items.length > 0 ? (
                  boardStats.items.map((item) => (
                    <div key={`${item.name}-${item.material}`}>
                      <p>{item.name} ({item.material})</p>
                      <b>
                        {item.amount} x {item.unitPrice.toFixed(2)} EUR = {item.lineSubtotal.toFixed(2)} EUR
                      </b>
                    </div>
                  ))
                ) : (
                  <div>
                    <p>No hay líneas de presupuesto todavía.</p>
                    <b>Coloca bloques para ver el desglose.</b>
                  </div>
                )}

                <div className="design-price-breakdown-total">
                  <p>Subtotal materiales</p>
                  <b>{boardStats.materialsSubtotal.toFixed(2)} EUR</b>
                </div>
                <div className="design-price-breakdown-total">
                  <p>Reserva ({Math.round(boardStats.contingencyRate * 100)}%)</p>
                  <b>{boardStats.contingencyAmount.toFixed(2)} EUR</b>
                </div>
                <div className="design-price-breakdown-total is-final">
                  <p>Total estimado</p>
                  <b>{boardStats.estimatedTotal.toFixed(2)} EUR</b>
                </div>
              </div>
            </div>

            <h3>Acciones rapidas</h3>
            <div className="design-quick-actions">
              <button type="button" className="btn design-outline-btn" onClick={handleNewProject}>Nuevo plano</button>
              <button type="button" className="btn design-outline-btn" onClick={handleSaveDraft}>Exportar borrador</button>
            </div>
          </section>
        </aside>
      </div>

      {/* ====================================================================
          PIE INFERIOR
          Sirve para explicar la lógica del editor antes de pasar a Three.js.
          ==================================================================== */}
      <section className="card design-help-card">
        <div className="design-help-steps">
          <h2>Como funciona</h2>
          <div className="design-help-step-row">
            {howItWorks.map((step, index) => (
              <article key={step.title}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <aside className="design-guide-box">
          <div>
            <h2>Necesitas ayuda?</h2>
            <p>Consulta el catalogo real para comparar piezas y materiales con el editor.</p>
          </div>
          <button type="button" className="btn design-guide-btn" onClick={() => onNavigate('catalogo', '', 'productos')}>
            Ver catalogo
          </button>
        </aside>
      </section>
    </section>
  )
}

export default Design
