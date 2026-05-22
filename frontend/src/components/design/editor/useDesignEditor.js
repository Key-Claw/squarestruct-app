import { useEffect, useMemo, useRef, useState } from 'react'
import { getProductos } from '../../../services/productService'
import i18n from '../../../i18n'
import { normalizarProducto } from '../../../utils/text'
import {
  accessoryPieces,
  designCategories,
  gridCellSizeMeters,
  gridColumns,
  gridRows,
  layerHeightMeters,
  mapProductToDesignPiece,
} from './designEditorData'

const STORAGE_KEY = 'squarestruct-design-draft'
const INITIAL_VIEW_ZOOM = 1.78
const MIN_VIEW_ZOOM = 0.5
const MAX_VIEW_ZOOM = 2.2
const MATERIAL_ALL = 'todos'
const MATERIAL_HORMIGON = 'hormigon'
const MATERIAL_ECO = 'eco'

const t = (key, options) => i18n.t(key, options)
const getDefaultViewZoom = () => INITIAL_VIEW_ZOOM

const normalizeMaterial = (value) => (
  String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
)

function createPlacementId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  return `placement-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function getFootprint(piece, rotated) {
  const footprint = piece?.footprint || { width: 1, height: 1 }

  return rotated
    ? { width: footprint.height, height: footprint.width }
    : footprint
}

function buildPlacementCandidate(row, column, piece, isRotated, isFlipped, floor, id = 'preview') {
  const footprint = getFootprint(piece, isRotated)
  const anchorRow = isFlipped && isRotated ? row - footprint.height + 1 : row
  const anchorColumn = isFlipped && !isRotated ? column - footprint.width + 1 : column

  return {
    id,
    pieceId: piece.id,
    row: anchorRow,
    column: anchorColumn,
    width: footprint.width,
    height: footprint.height,
    floor,
    flipped: isFlipped,
    rotated: isRotated,
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

function placementsOverlap(a, b) {
  return (
    a.row < b.row + b.height
    && a.row + a.height > b.row
    && a.column < b.column + b.width
    && a.column + a.width > b.column
  )
}

function getPieceLayerCount(piece) {
  return Math.max(1, Math.ceil((piece?.heightMeters || layerHeightMeters) / layerHeightMeters))
}

function placementCoversLayer(placement, floor, pieceMap) {
  const piece = pieceMap.get(placement.pieceId)
  const layerCount = getPieceLayerCount(piece)

  return floor >= placement.floor && floor < placement.floor + layerCount
}

function placementsOverlapInVolume(a, b, pieceMap) {
  const aPiece = pieceMap.get(a.pieceId)
  const bPiece = pieceMap.get(b.pieceId)
  const aTop = a.floor + getPieceLayerCount(aPiece)
  const bTop = b.floor + getPieceLayerCount(bPiece)

  return placementsOverlap(a, b) && a.floor < bTop && aTop > b.floor
}

function clonePlacements(placements) {
  return placements.map((placement) => ({ ...placement }))
}

function placementSignature(placement) {
  return [
    placement.id,
    placement.pieceId,
    placement.row,
    placement.column,
    placement.width,
    placement.height,
    placement.floor,
    placement.flipped ? 1 : 0,
    placement.rotated ? 1 : 0,
  ].join('|')
}

function arePlacementsEqual(a, b) {
  if (a.length !== b.length) return false

  return a.every((placement, index) => placementSignature(placement) === placementSignature(b[index]))
}

function isStructuralPlacement(placement, pieceMap) {
  const piece = pieceMap.get(placement.pieceId)

  return piece?.structuralRole === 'structure'
}

function isAccessoryPiece(piece) {
  return piece?.category === 'accesorios'
}

function hasDirectLowerStructuralSupport(placements, candidate, pieceMap) {
  return placements.some((placement) => (
    isStructuralPlacement(placement, pieceMap)
    && placement.floor + getPieceLayerCount(pieceMap.get(placement.pieceId)) === candidate.floor
    && placementsOverlap(placement, candidate)
  ))
}

function hasLowerFloorSupport(placements, candidate, pieceMap) {
  return candidate.floor === 0 || hasDirectLowerStructuralSupport(placements, candidate, pieceMap)
}

function intervalsCoverSpan(intervals, start, end) {
  let coveredUntil = start

  const sortedIntervals = intervals
    .sort((a, b) => a.start - b.start)

  for (const interval of sortedIntervals) {
    if (interval.end <= coveredUntil) continue
    if (interval.start > coveredUntil) return false

    coveredUntil = Math.max(coveredUntil, interval.end)
    if (coveredUntil >= end) return true
  }

  return coveredUntil >= end
}

function getAllowedAccessorySupportSides(piece, candidate) {
  if (piece?.modelType === 'door') {
    return ['left', 'right', 'top', 'bottom']
  }

  if (candidate.width > candidate.height) {
    return ['top', 'bottom']
  }

  if (candidate.height > candidate.width) {
    return ['left', 'right']
  }

  return ['left', 'right', 'top', 'bottom']
}

function getAdjacentSupportInterval(placement, candidate, side) {
  if (side === 'left' || side === 'right') {
    const touchesSide = side === 'left'
      ? placement.column + placement.width === candidate.column
      : candidate.column + candidate.width === placement.column

    if (!touchesSide) return null

    const start = Math.max(placement.row, candidate.row)
    const end = Math.min(placement.row + placement.height, candidate.row + candidate.height)

    return end > start ? { start, end } : null
  }

  const touchesSide = side === 'top'
    ? placement.row + placement.height === candidate.row
    : candidate.row + candidate.height === placement.row

  if (!touchesSide) return null

  const start = Math.max(placement.column, candidate.column)
  const end = Math.min(placement.column + placement.width, candidate.column + candidate.width)

  return end > start ? { start, end } : null
}

function hasFullAdjacentStructuralSupport(placements, candidate, pieceMap) {
  const candidatePiece = pieceMap.get(candidate.pieceId)
  const candidateTop = candidate.floor + getPieceLayerCount(candidatePiece)
  const allowedSides = getAllowedAccessorySupportSides(candidatePiece, candidate)
  const intervalsBySide = new Map(allowedSides.map((side) => [side, []]))

  placements.forEach((placement) => {
    if (!isStructuralPlacement(placement, pieceMap)) {
      return
    }

    const placementTop = placement.floor + getPieceLayerCount(pieceMap.get(placement.pieceId))
    const overlapsVertically = placement.floor < candidateTop && placementTop > candidate.floor

    if (!overlapsVertically) return

    allowedSides.forEach((side) => {
      const interval = getAdjacentSupportInterval(placement, candidate, side)

      if (interval) intervalsBySide.get(side).push(interval)
    })
  })

  return allowedSides.some((side) => {
    const sideIntervals = intervalsBySide.get(side)
    const isVerticalSide = side === 'left' || side === 'right'
    const start = isVerticalSide ? candidate.row : candidate.column
    const end = isVerticalSide
      ? candidate.row + candidate.height
      : candidate.column + candidate.width

    return intervalsCoverSpan(sideIntervals, start, end)
  })
}

function validatePlacement(placements, candidate, designPieces) {
  const pieceMap = new Map(designPieces.map((piece) => [piece.id, piece]))
  const candidatePiece = pieceMap.get(candidate.pieceId)
  const needsStructuralSupport = candidatePiece?.structuralRole === 'structure'
  const needsAccessorySupport = isAccessoryPiece(candidatePiece)

  if (
    candidate.row < 0
    || candidate.column < 0
    || candidate.row + candidate.height > gridRows
    || candidate.column + candidate.width > gridColumns
  ) {
    return { ok: false, message: t('design.messages.outOfBounds') }
  }

  const hasCollision = placements.some((placement) => (
    placementsOverlapInVolume(placement, candidate, pieceMap)
  ))

  if (hasCollision) {
    return { ok: false, message: t('design.messages.collision') }
  }

  if (
    needsStructuralSupport
    && !hasLowerFloorSupport(placements, candidate, pieceMap)
  ) {
    return { ok: false, message: t('design.messages.needsSupport') }
  }

  if (
    needsAccessorySupport
    && candidate.floor > 0
    && !hasDirectLowerStructuralSupport(placements, candidate, pieceMap)
    && !hasFullAdjacentStructuralSupport(placements, candidate, pieceMap)
  ) {
    return { ok: false, message: t('design.messages.needsAccessorySupport') }
  }

  return { ok: true, message: '' }
}

function pruneUnsupportedPlacements(placements, designPieces) {
  let nextPlacements = [...placements]
  let removedAny

  do {
    removedAny = false

    nextPlacements = nextPlacements.filter((placement) => {
      const placementsWithoutCurrent = nextPlacements.filter((item) => item.id !== placement.id)
      const validation = validatePlacement(placementsWithoutCurrent, placement, designPieces)

      if (validation.ok) return true

      removedAny = true
      return false
    })
  } while (removedAny)

  return nextPlacements
}

function loadDraft() {
  if (typeof window === 'undefined') return null

  try {
    const draft = JSON.parse(window.localStorage.getItem(STORAGE_KEY))

    if (!draft || !Array.isArray(draft.placements)) return null

    return draft
  } catch {
    return null
  }
}

function buildStats(placements, designPieces) {
  const pieceMap = new Map(designPieces.map((piece) => [piece.id, piece]))
  const summaryMap = new Map()
  let occupiedCells = 0
  let materialsSubtotal = 0
  let maxLayerTop = 0
  let totalPieces = 0

  placements.forEach((placement) => {
    const piece = pieceMap.get(placement.pieceId)
    if (!piece) return

    totalPieces += 1
    occupiedCells += placement.width * placement.height
    materialsSubtotal += piece.price
    maxLayerTop = Math.max(maxLayerTop, placement.floor + getPieceLayerCount(piece))

    const key = piece.id
    const current = summaryMap.get(key) || {
      amount: 0,
      category: piece.category,
      material: piece.material,
      name: piece.name,
      pieceId: piece.id,
      size: piece.size,
    }
    summaryMap.set(key, { ...current, amount: current.amount + 1 })
  })

  return {
    items: Array.from(summaryMap.values()),
    totalPieces,
    totalArea: (occupiedCells * gridCellSizeMeters * gridCellSizeMeters).toFixed(2),
    wallHeight: `${(maxLayerTop * layerHeightMeters).toFixed(2)} m`,
    estimatedTotal: materialsSubtotal * 1.08,
  }
}

function useDesignEditor() {
  const draft = loadDraft()
  const [activeCategory, setActiveCategory] = useState(draft?.activeCategory || 'bloques')
  const [dbPieces, setDbPieces] = useState([])
  const [isLoadingPieces, setIsLoadingPieces] = useState(true)
  const [piecesError, setPiecesError] = useState('')
  const [materialFilter, setMaterialFilter] = useState(MATERIAL_ECO)
  const [selectedPieceId, setSelectedPieceId] = useState(draft?.selectedPieceId || null)
  const initialPlacements = draft?.placements || []
  const [placements, setPlacementsState] = useState(initialPlacements)
  const placementsRef = useRef(initialPlacements)
  const [activeFloor, setActiveFloor] = useState(draft?.activeFloor || 0)
  const [viewMode, setViewMode] = useState('2d')
  const [viewZoom, setViewZoom] = useState(() => getDefaultViewZoom())
  const [is3DGridVisible, setIs3DGridVisible] = useState(true)
  const [threeCameraResetKey, setThreeCameraResetKey] = useState(0)
  const [threeCameraState, setThreeCameraState] = useState(null)
  const [boardOffset, setBoardOffset] = useState({ x: 0, y: 0 })
  const [isRotated, setIsRotated] = useState(false)
  const [isFlipped, setIsFlipped] = useState(draft?.isFlipped || false)
  const [undoStack, setUndoStack] = useState([])
  const [redoStack, setRedoStack] = useState([])
  const [statusMessage, setStatusMessage] = useState(t('design.messages.initial'))

  const commitPlacements = (nextPlacements, { recordHistory = true } = {}) => {
    const currentPlacements = placementsRef.current

    if (arePlacementsEqual(currentPlacements, nextPlacements)) {
      return false
    }

    if (recordHistory) {
      setUndoStack((current) => [...current, clonePlacements(currentPlacements)])
      setRedoStack([])
    }

    placementsRef.current = nextPlacements
    setPlacementsState(nextPlacements)
    return true
  }

  useEffect(() => {
    placementsRef.current = placements
  }, [placements])

  useEffect(() => {
    let isMounted = true

    const loadPieces = async () => {
      try {
        setIsLoadingPieces(true)
        setPiecesError('')
        const products = await getProductos()
        const mappedPieces = Array.isArray(products)
          ? products
            .map(normalizarProducto)
            .map(mapProductToDesignPiece)
            .filter(Boolean)
          : []

        if (!isMounted) return

        setDbPieces(mappedPieces)
        if (!mappedPieces.length) {
          setPiecesError(t('design.errors.noPieces'))
        }
      } catch (error) {
        if (!isMounted) return

        setDbPieces([])
        setPiecesError(error.message || t('design.errors.loadFailed'))
      } finally {
        if (isMounted) setIsLoadingPieces(false)
      }
    }

    loadPieces()

    return () => {
      isMounted = false
    }
  }, [])

  const designPieces = useMemo(() => [...dbPieces, ...accessoryPieces], [dbPieces])

  const visiblePieces = useMemo(
    () => designPieces.filter((piece) => {
      if (piece.category !== activeCategory) return false
      if (activeCategory === 'accesorios' || materialFilter === MATERIAL_ALL) return true

      const material = normalizeMaterial(piece.material)

      if (materialFilter === MATERIAL_HORMIGON) {
        return material.includes('hormigon')
      }

      if (materialFilter === MATERIAL_ECO) {
        return material.includes('plastico') || material.includes('eco') || material.includes('recicl')
      }

      return true
    }),
    [activeCategory, designPieces, materialFilter],
  )

  const selectedPiece = visiblePieces.find((piece) => piece.id === selectedPieceId) || visiblePieces[0] || null
  const stats = useMemo(() => buildStats(placements, designPieces), [designPieces, placements])

  const selectCategory = (category) => {
    setActiveCategory(category)
    const firstPiece = designPieces.find((piece) => piece.category === category)
    setSelectedPieceId(firstPiece?.id || null)
  }

  const getPlacementPreview = (row, column) => {
    if (!selectedPiece) {
      return null
    }

    const candidate = buildPlacementCandidate(row, column, selectedPiece, isRotated, isFlipped, activeFloor)
    const validation = validatePlacement(placementsRef.current, candidate, designPieces)

    return {
      ...candidate,
      isValid: validation.ok,
      message: validation.message,
    }
  }

  const placePiece = (row, column, options = {}) => {
    const { silentInvalid = false, silentSuccess = false } = options

    if (!selectedPiece) {
      if (!silentInvalid) setStatusMessage(t('design.messages.selectAvailable'))
      return false
    }

    const candidate = buildPlacementCandidate(row, column, selectedPiece, isRotated, isFlipped, activeFloor, createPlacementId())
    const currentPlacements = placementsRef.current
    const validation = validatePlacement(currentPlacements, candidate, designPieces)

    if (!validation.ok) {
      if (!silentInvalid) setStatusMessage(validation.message)
      return false
    }

    commitPlacements([...currentPlacements, candidate])
    if (!silentSuccess) setStatusMessage(t('design.messages.placed', { name: selectedPiece.name, floor: activeFloor }))
    return true
  }

  const removePiece = (row, column, options = {}) => {
    const { silentSuccess = false } = options
    const pieceMap = new Map(designPieces.map((piece) => [piece.id, piece]))
    const currentPlacements = placementsRef.current
    const placement = currentPlacements.find((item) => (
      placementCoversLayer(item, activeFloor, pieceMap)
      && placementCoversCell(item, row, column, item.floor)
    )) || null
    if (!placement) return false

    const remainingPlacements = currentPlacements.filter((item) => item.id !== placement.id)
    const prunedPlacements = pruneUnsupportedPlacements(remainingPlacements, designPieces)
    const removedCount = remainingPlacements.length - prunedPlacements.length

    commitPlacements(prunedPlacements)
    if (!silentSuccess) {
      setStatusMessage(
        removedCount > 0
          ? t('design.messages.removedWithDependents')
          : t('design.messages.removed'),
      )
    }
    return true
  }

  const jumpToSelectedPieceHeight = () => {
    const layerCount = getPieceLayerCount(selectedPiece)

    setActiveFloor((current) => current + layerCount)
    setStatusMessage(t('design.messages.layerAdjusted', { layers: layerCount, cm: Math.round(layerCount * layerHeightMeters * 100) }))
  }

  const clearProject = () => {
    commitPlacements([])
    setStatusMessage(t('design.messages.reset'))
  }

  const saveProject = () => {
    if (typeof window === 'undefined') return

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({
      activeCategory,
      selectedPieceId,
      activeFloor,
      isFlipped,
      placements: placementsRef.current,
    }))
    setStatusMessage(t('design.messages.draftSaved'))
  }

  const loadProject = () => {
    const savedDraft = loadDraft()

    if (!savedDraft) {
      setStatusMessage(t('design.messages.draftMissing'))
      return
    }

    setActiveCategory(savedDraft.activeCategory || 'bloques')
    setSelectedPieceId(savedDraft.selectedPieceId || null)
    setActiveFloor(savedDraft.activeFloor || 0)
    setIsFlipped(Boolean(savedDraft.isFlipped))
    commitPlacements(savedDraft.placements)
    setStatusMessage(t('design.messages.draftLoaded'))
  }

  const undo = () => {
    if (!undoStack.length) return false

    const previousPlacements = undoStack[undoStack.length - 1]
    const currentPlacements = clonePlacements(placementsRef.current)

    setUndoStack((current) => current.slice(0, -1))
    setRedoStack((current) => [...current, currentPlacements])
    commitPlacements(previousPlacements, { recordHistory: false })
    setStatusMessage(t('design.messages.undo'))
    return true
  }

  const redo = () => {
    if (!redoStack.length) return false

    const nextPlacements = redoStack[redoStack.length - 1]
    const currentPlacements = clonePlacements(placementsRef.current)

    setRedoStack((current) => current.slice(0, -1))
    setUndoStack((current) => [...current, currentPlacements])
    commitPlacements(nextPlacements, { recordHistory: false })
    setStatusMessage(t('design.messages.redo'))
    return true
  }

  const exportProject = () => {
    if (typeof window === 'undefined') return

    const payload = {
      exportedAt: new Date().toISOString(),
      activeCategory,
      activeFloor,
      selectedPieceId,
      placements,
      stats,
    }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')

    link.href = url
    link.download = 'squarestruct-plano.json'
    link.click()
    window.URL.revokeObjectURL(url)
    setStatusMessage(t('design.messages.exported'))
  }

  const updateZoom = (delta) => {
    setViewZoom((current) => Math.max(
      MIN_VIEW_ZOOM,
      Math.min(MAX_VIEW_ZOOM, Number((current + delta).toFixed(2))),
    ))
  }

  const zoomIn = () => {
    updateZoom(0.14)
  }

  const zoomOut = () => {
    updateZoom(-0.14)
  }

  const zoomByWheel = (deltaY) => {
    updateZoom(deltaY < 0 ? 0.14 : -0.14)
  }

  const panBoard = (deltaX, deltaY) => {
    setBoardOffset((current) => ({
      x: Math.max(-480, Math.min(480, current.x + deltaX)),
      y: Math.max(-320, Math.min(320, current.y + deltaY)),
    }))
  }

  const resetBoardOffset = () => {
    setBoardOffset({ x: 0, y: 0 })
  }

  const resetView = () => {
    setViewZoom(getDefaultViewZoom())

    if (viewMode === '3d') {
      setThreeCameraState(null)
      setThreeCameraResetKey((current) => current + 1)
      return
    }

    resetBoardOffset()
  }

  return {
    activeCategory,
    activeFloor,
    boardOffset,
    clearProject,
    designCategories,
    designPieces,
    exportProject,
    getPlacementPreview,
    gridColumns,
    gridCellSizeMeters,
    gridRows,
    is3DGridVisible,
    jumpToSelectedPieceHeight,
    layerHeightMeters,
    isLoadingPieces,
    isFlipped,
    isRotated,
    loadProject,
    materialFilter,
    piecesError,
    placements,
    panBoard,
    placePiece,
    removePiece,
    resetBoardOffset,
    resetView,
    saveProject,
    selectCategory,
    selectedPiece,
    selectedPieceId,
    canRedo: redoStack.length > 0,
    canUndo: undoStack.length > 0,
    redo,
    setActiveFloor,
    setIs3DGridVisible,
    setIsFlipped,
    setIsRotated,
    setMaterialFilter,
    setSelectedPieceId,
    setStatusMessage,
    setViewMode,
    setThreeCameraState,
    undo,
    stats,
    statusMessage,
    threeCameraResetKey,
    threeCameraState,
    viewMode,
    visiblePieces,
    viewZoom,
    zoomIn,
    zoomOut,
    zoomByWheel,
  }
}

export { placementCoversCell }
export default useDesignEditor
