import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

const DOUBLE_TAP_REMOVE_MS = 420
const DOUBLE_TAP_SLOP_PX = 18

function getPlacementLabel(piece, t) {
  if (!piece) return 'PZ'

  const sizeLabel = String(piece.size || '')
    .replace(/\s*cm\s*$/i, '')
    .replace(/\s*x\s*/gi, 'x')

  if (sizeLabel) return sizeLabel

  const initials = String(piece.name || t('design.fallbacks.piece'))
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word[0])
    .join('')
    .slice(0, 4)
    .toUpperCase()

  return initials || 'PZ'
}

function getPieceLayerCount(piece, layerHeightMeters) {
  const layerHeight = layerHeightMeters || 0.1

  return Math.max(1, Math.ceil((piece?.heightMeters || layerHeight) / layerHeight))
}

function placementCoversLayer(placement, piece, activeFloor, layerHeightMeters) {
  const layerCount = getPieceLayerCount(piece, layerHeightMeters)

  return activeFloor >= placement.floor && activeFloor < placement.floor + layerCount
}

function getCellKey(cell) {
  return `${cell.row}:${cell.column}`
}

function getCellsBetween(start, end) {
  if (!start) return [end]

  const cells = []
  let x = start.column
  let y = start.row
  const endX = end.column
  const endY = end.row
  const deltaX = Math.abs(endX - x)
  const deltaY = Math.abs(endY - y)
  const stepX = x < endX ? 1 : -1
  const stepY = y < endY ? 1 : -1
  let error = deltaX - deltaY

  while (true) {
    cells.push({ row: y, column: x })
    if (x === endX && y === endY) break

    const doubleError = error * 2

    if (doubleError > -deltaY) {
      error -= deltaY
      x += stepX
    }

    if (doubleError < deltaX) {
      error += deltaX
      y += stepY
    }
  }

  return cells
}

function DesignBoard2D({
  activeFloor,
  boardOffset,
  designPieces,
  getPlacementPreview,
  gridCellSizeMeters,
  layerHeightMeters = gridCellSizeMeters,
  gridColumns,
  gridRows,
  isPanMode,
  onBoardMessage,
  panBoard,
  placements,
  placePiece,
  removePiece,
  viewZoom,
  zoomByWheel,
}) {
  const { t } = useTranslation()
  const stageRef = useRef(null)
  const dragRef = useRef(null)
  const lastFilledTapRef = useRef(null)
  const suppressNextBoardActionRef = useRef(false)
  const [hoverPreview, setHoverPreview] = useState(null)

  const getBoardCellFromEvent = (event) => {
    const bounds = event.currentTarget.getBoundingClientRect()
    const column = Math.floor(((event.clientX - bounds.left) / bounds.width) * gridColumns)
    const row = Math.floor(((event.clientY - bounds.top) / bounds.height) * gridRows)

    if (row < 0 || row >= gridRows || column < 0 || column >= gridColumns) return null

    return { row, column }
  }

  const getPlacementAtCell = (row, column) => {
    const reversedPlacements = [...placements].reverse()

    return reversedPlacements.find((placement) => {
      const piece = designPieces.find((item) => item.id === placement.pieceId)

      return (
        placementCoversLayer(placement, piece, activeFloor, layerHeightMeters)
        && row >= placement.row
        && row < placement.row + placement.height
        && column >= placement.column
        && column < placement.column + placement.width
      )
    }) || null
  }

  const hasPlacementAtCell = (row, column) => Boolean(getPlacementAtCell(row, column))

  const resetLastFilledTap = () => {
    lastFilledTapRef.current = null
  }

  const handleFilledCellTap = (event, cell) => {
    const placement = getPlacementAtCell(cell.row, cell.column)

    if (!placement) {
      resetLastFilledTap()
      return false
    }

    const lastTap = lastFilledTapRef.current
    const now = event.timeStamp || Date.now()
    const pointerDistance = lastTap
      ? Math.hypot(event.clientX - lastTap.x, event.clientY - lastTap.y)
      : Number.POSITIVE_INFINITY
    const isDoubleTap = (
      lastTap
      && lastTap.placementId === placement.id
      && now - lastTap.time <= DOUBLE_TAP_REMOVE_MS
      && pointerDistance <= DOUBLE_TAP_SLOP_PX
    )

    event.preventDefault()
    suppressNextBoardActionRef.current = true
    setHoverPreview(null)

    if (isDoubleTap) {
      resetLastFilledTap()
      removePiece(cell.row, cell.column)
      return true
    }

    lastFilledTapRef.current = {
      placementId: placement.id,
      time: now,
      x: event.clientX,
      y: event.clientY,
    }

    if (event.pointerType !== 'mouse') {
      onBoardMessage?.('design.messages.doubleTapRemove')
    }

    return true
  }

  const paintCell = (cell, options = {}) => {
    if (!cell) return false

    const key = getCellKey(cell)
    const visitedCells = dragRef.current?.visitedCells

    if (visitedCells?.has(key)) return false
    visitedCells?.add(key)

    if (hasPlacementAtCell(cell.row, cell.column)) return false

    resetLastFilledTap()
    return placePiece(cell.row, cell.column, options)
  }

  const eraseCell = (cell, options = {}) => {
    if (!cell) return false

    const key = getCellKey(cell)
    const visitedCells = dragRef.current?.visitedCells

    if (visitedCells?.has(key)) return false
    visitedCells?.add(key)

    resetLastFilledTap()
    return removePiece(cell.row, cell.column, options)
  }

  const updateHoverPreview = (event) => {
    if (isPanMode || !getPlacementPreview) {
      setHoverPreview(null)
      return
    }

    const cell = getBoardCellFromEvent(event)
    setHoverPreview(cell ? getPlacementPreview(cell.row, cell.column) : null)
  }

  const handleBoardClick = (event) => {
    if (suppressNextBoardActionRef.current) {
      suppressNextBoardActionRef.current = false
      return
    }

    if (isPanMode || dragRef.current?.dragged) return

    const cell = getBoardCellFromEvent(event)
    if (!cell || hasPlacementAtCell(cell.row, cell.column)) return

    placePiece(cell.row, cell.column)
  }

  const handleBoardContextMenu = (event) => {
    event.preventDefault()
    if (suppressNextBoardActionRef.current) {
      suppressNextBoardActionRef.current = false
      return
    }

    if (isPanMode || dragRef.current?.dragged) return

    const cell = getBoardCellFromEvent(event)
    if (!cell) return

    removePiece(cell.row, cell.column)
  }

  const handlePointerDown = (event) => {
    const isDualButtonPan = event.buttons === 3
    const isPrimaryPaint = event.button === 0 && (event.buttons & 1) === 1
    const isSecondaryErase = event.button === 2 && (event.buttons & 2) === 2

    if (!isPanMode && !isDualButtonPan && !isPrimaryPaint && !isSecondaryErase) return

    if (!isPanMode && isPrimaryPaint && !isDualButtonPan) {
      if (event.pointerType !== 'mouse') {
        const cell = getBoardCellFromEvent(event)

        if (cell && handleFilledCellTap(event, cell)) {
          return
        }

        return
      }

      event.preventDefault()
      suppressNextBoardActionRef.current = true
      setHoverPreview(null)

      const cell = getBoardCellFromEvent(event)

      if (cell && handleFilledCellTap(event, cell)) {
        return
      }

      dragRef.current = {
        dragged: false,
        lastCell: cell,
        mode: 'paint',
        visitedCells: new Set(),
        pointerId: event.pointerId,
        x: event.clientX,
        y: event.clientY,
      }
      event.currentTarget.setPointerCapture(event.pointerId)
      paintCell(cell)
      return
    }

    if (!isPanMode && isSecondaryErase && !isDualButtonPan) {
      event.preventDefault()
      suppressNextBoardActionRef.current = true
      setHoverPreview(null)

      const cell = getBoardCellFromEvent(event)

      dragRef.current = {
        dragged: false,
        lastCell: cell,
        mode: 'erase',
        visitedCells: new Set(),
        pointerId: event.pointerId,
        x: event.clientX,
        y: event.clientY,
      }
      event.currentTarget.setPointerCapture(event.pointerId)
      eraseCell(cell)
      return
    }

    if (isDualButtonPan) {
      event.preventDefault()
      suppressNextBoardActionRef.current = true
      setHoverPreview(null)
    }

    dragRef.current = {
      dragged: false,
      isDualButtonPan,
      mode: 'pan',
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
    }
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const handlePointerMove = (event) => {
    const isDualButtonPan = event.buttons === 3

    if (!dragRef.current && !isPanMode && event.buttons === 0) {
      updateHoverPreview(event)
    }

    if (!dragRef.current && !isPanMode && isDualButtonPan) {
      suppressNextBoardActionRef.current = true
      dragRef.current = {
        dragged: false,
        isDualButtonPan: true,
        mode: 'pan',
        pointerId: event.pointerId,
        x: event.clientX,
        y: event.clientY,
      }
      event.currentTarget.setPointerCapture(event.pointerId)
    }

    if (!dragRef.current) return

    if (dragRef.current.mode === 'paint' || dragRef.current.mode === 'erase') {
      const isPaintMode = dragRef.current.mode === 'paint'
      const requiredButton = isPaintMode ? 1 : 2

      if ((event.buttons & requiredButton) !== requiredButton) return
      event.preventDefault()

      const cell = getBoardCellFromEvent(event)
      if (!cell) return

      getCellsBetween(dragRef.current.lastCell, cell).forEach((targetCell) => {
        if (isPaintMode) {
          paintCell(targetCell, { silentInvalid: true, silentSuccess: true })
          return
        }

        eraseCell(targetCell, { silentSuccess: true })
      })

      if (cell.row !== dragRef.current.lastCell?.row || cell.column !== dragRef.current.lastCell?.column) {
        dragRef.current.dragged = true
      }

      dragRef.current.lastCell = cell
      suppressNextBoardActionRef.current = true
      return
    }

    if (!isPanMode && !dragRef.current.isDualButtonPan) return

    const deltaX = event.clientX - dragRef.current.x
    const deltaY = event.clientY - dragRef.current.y

    if (Math.abs(deltaX) > 1 || Math.abs(deltaY) > 1) {
      if (dragRef.current.isDualButtonPan) {
        event.preventDefault()
        suppressNextBoardActionRef.current = true
      }

      dragRef.current.dragged = true
      panBoard(deltaX, deltaY)
      dragRef.current.x = event.clientX
      dragRef.current.y = event.clientY
    }
  }

  const handlePointerUp = (event) => {
    if (!dragRef.current) return
    const shouldRefreshPreview = dragRef.current.mode === 'paint' || dragRef.current.mode === 'erase'

    if (event.currentTarget.hasPointerCapture(dragRef.current.pointerId)) {
      event.currentTarget.releasePointerCapture(dragRef.current.pointerId)
    }

    if (dragRef.current.mode === 'paint' || dragRef.current.mode === 'erase') {
      suppressNextBoardActionRef.current = true
    }

    dragRef.current = null
    if (shouldRefreshPreview) updateHoverPreview(event)
  }

  const handlePointerLeave = () => {
    setHoverPreview(null)
  }

  const handleWheel = useCallback((event) => {
    event.preventDefault()
    event.stopPropagation()
    zoomByWheel(event.deltaY)
  }, [zoomByWheel])

  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return undefined

    stage.addEventListener('wheel', handleWheel, { passive: false })

    return () => {
      stage.removeEventListener('wheel', handleWheel)
    }
  }, [handleWheel])

  return (
    <div className={`design-board-stage${isPanMode ? ' is-pan-mode' : ''}`} ref={stageRef}>
      <div
        className="design-board-grid"
        role="grid"
        aria-label={t('design.boardAria', {
          floor: activeFloor,
          height: gridRows * gridCellSizeMeters,
          width: gridColumns * gridCellSizeMeters,
        })}
        onClick={handleBoardClick}
        onContextMenu={handleBoardContextMenu}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onPointerLeave={handlePointerLeave}
        style={{
          '--cols': String(gridColumns),
          '--major-cols': String(gridColumns / 20),
          '--major-rows': String(gridRows / 20),
          '--pan-x': `${boardOffset.x}px`,
          '--pan-y': `${boardOffset.y}px`,
          '--rows': String(gridRows),
          '--view-zoom': String(viewZoom),
        }}
      >
        {activeFloor > 0 && (
          <div className="design-lower-floor-overlay" aria-hidden="true">
            {placements.filter((placement) => {
              const piece = designPieces.find((item) => item.id === placement.pieceId)
              const topLayer = placement.floor + getPieceLayerCount(piece, layerHeightMeters)

              return topLayer <= activeFloor
            }).map((placement) => {
              const piece = designPieces.find((item) => item.id === placement.pieceId)
              const topLayer = placement.floor + getPieceLayerCount(piece, layerHeightMeters)
              const isDirectSupport = topLayer === activeFloor
              const floorDistance = activeFloor - topLayer + 1

              return (
                <div
                  className={`design-lower-floor-placement${isDirectSupport ? ' is-direct-support' : ''}`}
                  key={`lower-${placement.id}`}
                  style={{
                    '--floor-opacity': String(isDirectSupport ? 0.68 : Math.max(0.16, 0.42 - floorDistance * 0.08)),
                    '--piece-color': isDirectSupport ? (piece?.color || '#6b7280') : '#64748b',
                    left: `${(placement.column / gridColumns) * 100}%`,
                    top: `${(placement.row / gridRows) * 100}%`,
                    width: `${(placement.width / gridColumns) * 100}%`,
                    height: `${(placement.height / gridRows) * 100}%`,
                  }}
                />
              )
            })}
          </div>
        )}

        {hoverPreview && (
          <div
            className={`design-placement-preview${hoverPreview.isValid ? ' is-valid' : ' is-invalid'}`}
            aria-hidden="true"
            title={hoverPreview.message || t('design.previewDefault')}
            style={{
              left: `${(hoverPreview.column / gridColumns) * 100}%`,
              top: `${(hoverPreview.row / gridRows) * 100}%`,
              width: `${(hoverPreview.width / gridColumns) * 100}%`,
              height: `${(hoverPreview.height / gridRows) * 100}%`,
            }}
          />
        )}

        <div className="design-placements-overlay" aria-hidden="true">
          {placements.filter((placement) => {
            const piece = designPieces.find((item) => item.id === placement.pieceId)

            return placementCoversLayer(placement, piece, activeFloor, layerHeightMeters)
          }).map((placement) => {
            const piece = designPieces.find((item) => item.id === placement.pieceId)
            const labelFit = Math.min(1.9, Math.max(0.58, Math.min(placement.width / 24, placement.height / 10)))

            return (
              <div
                className="design-placement"
                key={placement.id}
                title={`${piece?.name || t('design.fallbacks.piece')} - ${piece?.size || t('design.fallbacks.noDimensions')}`}
                style={{
                  '--label-fit': String(labelFit),
                  '--piece-color': piece?.color || '#6b7280',
                  '--label-scale': String(1 / Math.max(viewZoom, 0.01)),
                  left: `${(placement.column / gridColumns) * 100}%`,
                  top: `${(placement.row / gridRows) * 100}%`,
                  width: `${(placement.width / gridColumns) * 100}%`,
                  height: `${(placement.height / gridRows) * 100}%`,
                }}
              >
                <span>{getPlacementLabel(piece, t)}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default DesignBoard2D
