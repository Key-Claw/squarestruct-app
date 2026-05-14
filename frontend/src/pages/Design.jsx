import { useMemo, useState } from 'react'

import Icon from '../components/ui/Icon'

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
  },
  {
    id: 'bloque-200-hormigon',
    category: 'bloques',
    name: 'Bloque 200',
    material: 'Hormigon',
    size: '20 x 15 x 20 cm',
    price: 21.9,
    color: '#c2c7cf',
  },
  {
    id: 'bloque-300-hormigon',
    category: 'bloques',
    name: 'Bloque 300',
    material: 'Hormigon',
    size: '30 x 15 x 20 cm',
    price: 25.4,
    color: '#9aa4b2',
  },
  {
    id: 'bloque-600-hormigon',
    category: 'bloques',
    name: 'Bloque 600',
    material: 'Hormigon',
    size: '60 x 15 x 20 cm',
    price: 31.8,
    color: '#6b7280',
  },
  {
    id: 'bloque-800-reciclado',
    category: 'bloques',
    name: 'Bloque 800',
    material: 'Plastico reciclado',
    size: '80 x 15 x 20 cm',
    price: 34.6,
    color: '#7fbf4d',
  },
  {
    id: 'pilar-esquina',
    category: 'pilares',
    name: 'Pilar esquina',
    material: 'Hormigon',
    size: '20 x 20 x 240 cm',
    price: 45.0,
    color: '#8b949e',
  },
  {
    id: 'pilar-medio',
    category: 'pilares',
    name: 'Pilar medio',
    material: 'Hormigon',
    size: '20 x 20 x 240 cm',
    price: 39.5,
    color: '#d0d6de',
  },
  {
    id: 'remate-superior',
    category: 'accesorios',
    name: 'Remate superior',
    material: 'Plastico reciclado',
    size: '20 x 15 x 10 cm',
    price: 12.2,
    color: '#9dd671',
  },
]

const gridColumns = 10
const gridRows = 7
const baseBoardState = () => Array.from({ length: gridRows }, () => Array(gridColumns).fill(null))

const howItWorks = [
  {
    title: 'Elige una pieza',
    text: 'Selecciona un bloque, pilar o accesorio desde el panel izquierdo.'
  },
  {
    title: 'Coloca en la cuadricula',
    text: 'Haz clic sobre una celda para dejar la pieza en el plano 2D.'
  },
  {
    title: 'Revisa el resumen',
    text: 'El panel derecho se actualiza con piezas, materiales y coste estimado.'
  },
]

function createEmptyBoard() {
  return baseBoardState()
}

function cloneBoard(board) {
  return board.map((row) => [...row])
}

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

    if (!Array.isArray(parsedDraft.board) || !parsedDraft.activeCategory) {
      return null
    }

    return {
      board: parsedDraft.board,
      activeCategory: parsedDraft.activeCategory,
      selectedPieceId: parsedDraft.selectedPieceId || null,
    }
  } catch {
    return null
  }
}

function Design({ onNavigate }) {
  // El diseñador comienza en una versión 2D simple para cerrar bien la lógica modular.
  const initialDraft = loadDraft()
  const [activeCategory, setActiveCategory] = useState(initialDraft?.activeCategory || 'bloques')
  const [selectedPieceId, setSelectedPieceId] = useState(
    initialDraft?.selectedPieceId || designPieces.find((piece) => piece.category === 'bloques')?.id || designPieces[0].id,
  )
  const [board, setBoard] = useState(initialDraft?.board || createEmptyBoard())
  const [hoverCell, setHoverCell] = useState(null)
  const [dragPayload, setDragPayload] = useState(null)
  const [dragOverCell, setDragOverCell] = useState(null)
  const [draggingPieceId, setDraggingPieceId] = useState(null)
  const [statusMessage, setStatusMessage] = useState('Selecciona una pieza y colócala en la cuadricula.')

  const visiblePieces = designPieces.filter((piece) => piece.category === activeCategory)
  const selectedPiece = designPieces.find((piece) => piece.id === selectedPieceId) || visiblePieces[0] || designPieces[0]

  const boardStats = useMemo(() => {
    const pieceMap = new Map(designPieces.map((piece) => [piece.id, piece]))
    const summaryMap = new Map()
    let totalPieces = 0
    let totalBudget = 0

    board.forEach((row) => {
      row.forEach((cell) => {
        if (!cell) {
          return
        }

        const piece = pieceMap.get(cell.pieceId)
        if (!piece) {
          return
        }

        totalPieces += 1
        totalBudget += piece.price

        const summaryKey = `${piece.name}-${piece.material}`
        const currentSummary = summaryMap.get(summaryKey)

        if (currentSummary) {
          currentSummary.amount += 1
          return
        }

        summaryMap.set(summaryKey, {
          name: piece.name,
          material: piece.material,
          amount: 1,
        })
      })
    })

    return {
      totalPieces,
      totalBudget,
      totalArea: (totalPieces * 1.2).toFixed(1),
      wallHeight: `${(totalPieces > 0 ? 2.4 : 0).toFixed(2)} m`,
      items: Array.from(summaryMap.values()),
    }
  }, [board])

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

    setBoard((currentBoard) => {
      const nextBoard = cloneBoard(currentBoard)
      nextBoard[rowIndex][columnIndex] = {
        pieceId: selectedPiece.id,
        label: `${selectedPiece.name} · ${selectedPiece.material}`,
      }
      return nextBoard
    })

    setStatusMessage(`${selectedPiece.name} colocado en la celda ${rowIndex + 1}-${columnIndex + 1}.`)
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
    const payload = {
      source: 'board',
      pieceId,
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

    setBoard((currentBoard) => {
      const nextBoard = cloneBoard(currentBoard)
      const targetCell = nextBoard[rowIndex][columnIndex]

      if (payload.source === 'palette') {
        if (targetCell) {
          setStatusMessage('Posición inválida: la celda ya está ocupada por otra pieza.')
          return currentBoard
        }

        nextBoard[rowIndex][columnIndex] = {
          pieceId: payload.pieceId,
          label: `${pieceFromPayload.name} · ${pieceFromPayload.material}`,
        }
        setSelectedPieceId(payload.pieceId)
        setStatusMessage(`${pieceFromPayload.name} añadido en la celda ${rowIndex + 1}-${columnIndex + 1}.`)
        return nextBoard
      }

      if (payload.source === 'board') {
        const sourceRow = payload.from?.row
        const sourceColumn = payload.from?.column

        if (typeof sourceRow !== 'number' || typeof sourceColumn !== 'number') {
          setStatusMessage('No se pudo mover el bloque. Vuelve a intentarlo.')
          return currentBoard
        }

        if (sourceRow === rowIndex && sourceColumn === columnIndex) {
          return currentBoard
        }

        if (targetCell) {
          setStatusMessage('Posición inválida: mueve el bloque a una celda vacía.')
          return currentBoard
        }

        const sourceCell = nextBoard[sourceRow][sourceColumn]
        if (!sourceCell) {
          setStatusMessage('No se pudo mover el bloque porque la celda origen está vacía.')
          return currentBoard
        }

        nextBoard[sourceRow][sourceColumn] = null
        nextBoard[rowIndex][columnIndex] = sourceCell
        setSelectedPieceId(sourceCell.pieceId)
        setStatusMessage(`Bloque recolocado en la celda ${rowIndex + 1}-${columnIndex + 1}.`)
        return nextBoard
      }

      return currentBoard
    })

    clearDragState()
  }

  const handleRemoveCell = (rowIndex, columnIndex) => {
    setBoard((currentBoard) => {
      const nextBoard = cloneBoard(currentBoard)
      nextBoard[rowIndex][columnIndex] = null
      return nextBoard
    })

    setStatusMessage(`Celda ${rowIndex + 1}-${columnIndex + 1} vaciada.`)
  }

  const handleNewProject = () => {
    setBoard(createEmptyBoard())
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
      board,
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
    setBoard(draft.board)
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
                <span>Vista: 2D</span>
                <span>Pieza actual: {selectedPiece?.name || 'Ninguna'}</span>
              </div>

              <div className="design-board" role="grid" aria-label="Cuadricula de trabajo del plano">
                {board.map((row, rowIndex) => (
                  row.map((cell, columnIndex) => {
                    const isHovered = hoverCell?.row === rowIndex && hoverCell?.column === columnIndex
                    const isDragOver = dragOverCell?.row === rowIndex && dragOverCell?.column === columnIndex
                    const piece = cell ? designPieces.find((item) => item.id === cell.pieceId) : null
                    const draggedPiece = dragPayload ? designPieces.find((item) => item.id === dragPayload.pieceId) : null
                    const showDragPreview = isDragOver && !cell && draggedPiece

                    return (
                      <button
                        key={`${rowIndex}-${columnIndex}`}
                        type="button"
                        className={`design-board-cell${cell ? ' is-filled' : ''}${isHovered ? ' is-preview' : ''}${isDragOver ? ' is-drag-target' : ''}`}
                        onMouseEnter={() => setHoverCell({ row: rowIndex, column: columnIndex })}
                        onMouseLeave={() => setHoverCell(null)}
                        onClick={() => (cell ? handleRemoveCell(rowIndex, columnIndex) : handleCellPlace(rowIndex, columnIndex))}
                        draggable={Boolean(cell)}
                        onDragStart={(event) => {
                          if (!cell) {
                            return
                          }
                          handlePlacedPieceDragStart(event, rowIndex, columnIndex, cell.pieceId)
                        }}
                        onDragEnd={handleDragEnd}
                        onDragOver={(event) => handleCellDragOver(event, rowIndex, columnIndex)}
                        onDrop={(event) => handleCellDrop(event, rowIndex, columnIndex)}
                        aria-label={cell ? `Quitar ${piece?.name || 'pieza'} de la celda ${rowIndex + 1}-${columnIndex + 1}` : `Colocar ${selectedPiece?.name || 'pieza'} en la celda ${rowIndex + 1}-${columnIndex + 1}`}
                      >
                        {cell && piece ? (
                          <span
                            className={`design-piece-token${draggingPieceId === piece.id ? ' is-being-dragged' : ''}`}
                            style={{ '--piece-color': piece.color }}
                          >
                            {piece.name}
                          </span>
                        ) : showDragPreview ? (
                          <span className="design-piece-token design-piece-token--preview" style={{ '--piece-color': draggedPiece.color }}>
                            {draggedPiece.name}
                          </span>
                        ) : isHovered && selectedPiece ? (
                          <span className="design-piece-token design-piece-token--preview" style={{ '--piece-color': selectedPiece.color }}>
                            {selectedPiece.name}
                          </span>
                        ) : null}
                      </button>
                    )
                  })
                ))}
              </div>
            </div>

            <div className="design-board-footer">
              <div>
                <Icon name="grid" size={18} />
                <span>Haz clic en una celda vacía para colocar la pieza activa.</span>
              </div>
              <button type="button" className="btn design-outline-btn" onClick={() => setBoard((currentBoard) => cloneBoard(currentBoard).map((row) => row.map(() => null)))}>
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
              <strong>{boardStats.totalBudget.toFixed(2)} EUR</strong>
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
