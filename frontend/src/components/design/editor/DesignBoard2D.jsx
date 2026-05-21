import { useCallback, useEffect, useRef } from 'react'

function getPlacementLabel(piece) {
  if (!piece) return 'PZ'

  const sizeLabel = String(piece.size || '')
    .replace(/\s*cm\s*$/i, '')
    .replace(/\s*x\s*/gi, 'x')

  if (sizeLabel) return sizeLabel

  const initials = String(piece.name || 'Pieza')
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word[0])
    .join('')
    .slice(0, 4)
    .toUpperCase()

  return initials || 'PZ'
}

function DesignBoard2D({
  activeFloor,
  boardOffset,
  designPieces,
  gridCellSizeMeters,
  gridColumns,
  gridRows,
  isPanMode,
  panBoard,
  placements,
  placePiece,
  removePiece,
  viewZoom,
  zoomByWheel,
}) {
  const stageRef = useRef(null)
  const dragRef = useRef(null)
  const suppressNextBoardActionRef = useRef(false)

  const getBoardCellFromEvent = (event) => {
    const bounds = event.currentTarget.getBoundingClientRect()
    const column = Math.floor(((event.clientX - bounds.left) / bounds.width) * gridColumns)
    const row = Math.floor(((event.clientY - bounds.top) / bounds.height) * gridRows)

    if (row < 0 || row >= gridRows || column < 0 || column >= gridColumns) return null

    return { row, column }
  }

  const hasPlacementAtCell = (row, column) => (
    placements.some((placement) => (
      placement.floor === activeFloor
      && row >= placement.row
      && row < placement.row + placement.height
      && column >= placement.column
      && column < placement.column + placement.width
    ))
  )

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
    if (!isPanMode && !isDualButtonPan) return

    if (isDualButtonPan) {
      event.preventDefault()
      suppressNextBoardActionRef.current = true
    }

    dragRef.current = {
      dragged: false,
      isDualButtonPan,
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
    }
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const handlePointerMove = (event) => {
    const isDualButtonPan = event.buttons === 3

    if (!dragRef.current && !isPanMode && isDualButtonPan) {
      suppressNextBoardActionRef.current = true
      dragRef.current = {
        dragged: false,
        isDualButtonPan: true,
        pointerId: event.pointerId,
        x: event.clientX,
        y: event.clientY,
      }
      event.currentTarget.setPointerCapture(event.pointerId)
    }

    if ((!isPanMode && !dragRef.current?.isDualButtonPan) || !dragRef.current) return

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

    if (event.currentTarget.hasPointerCapture(dragRef.current.pointerId)) {
      event.currentTarget.releasePointerCapture(dragRef.current.pointerId)
    }

    dragRef.current = null
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
        aria-label={`Plano 2D editable de la planta ${activeFloor}. ${gridColumns * gridCellSizeMeters} por ${gridRows * gridCellSizeMeters} metros.`}
        onClick={handleBoardClick}
        onContextMenu={handleBoardContextMenu}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
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
            {placements.filter((placement) => placement.floor < activeFloor).map((placement) => {
              const piece = designPieces.find((item) => item.id === placement.pieceId)
              const floorDistance = activeFloor - placement.floor

              return (
                <div
                  className="design-lower-floor-placement"
                  key={`lower-${placement.id}`}
                  style={{
                    '--floor-opacity': String(Math.max(0.24, 0.68 - floorDistance * 0.1)),
                    '--piece-color': piece?.color || '#6b7280',
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

        <div className="design-placements-overlay" aria-hidden="true">
          {placements.filter((placement) => placement.floor === activeFloor).map((placement) => {
            const piece = designPieces.find((item) => item.id === placement.pieceId)
            const labelFit = Math.min(1.9, Math.max(0.58, Math.min(placement.width / 24, placement.height / 10)))

            return (
              <div
                className="design-placement"
                key={placement.id}
                title={`${piece?.name || 'Pieza'} · ${piece?.size || 'sin medidas'}`}
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
                <span>{getPlacementLabel(piece)}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default DesignBoard2D
