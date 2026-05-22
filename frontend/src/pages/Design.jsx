import { useCallback, useEffect, useRef, useState } from 'react'
import designHeroImage from '../assets/design/design-hero.webp'
import escalerasImage from '../assets/design/escaleras.webp'
import puertaImage from '../assets/design/puerta.webp'
import sueloImage from '../assets/design/suelo.webp'
import ventanaImage from '../assets/design/ventana.webp'
import galleryCompactImage from '../assets/gallery/galeria-casa-compacta.webp'
import galleryMinimalImage from '../assets/gallery/galeria-casa-minimalista.webp'
import bloqueEcoImage from '../assets/catalog/bloque-eco.webp'
import bloqueHormigonImage from '../assets/catalog/bloque-hormigon.webp'
import pilarEcoImage from '../assets/catalog/pilar-eco.webp'
import pilarHormigonImage from '../assets/catalog/pilar-hormigon.webp'
import Icon from '../components/common/Icon'
import DesignBoard2D from '../components/design/editor/DesignBoard2D'
import useDesignEditor from '../components/design/editor/useDesignEditor'
import Viewer3D from '../components/design/three/Viewer3D'

const howItWorks = [
  {
    title: 'Selecciona una pieza',
    text: 'Elige un bloque, pilar o accesorio desde el panel lateral.',
  },
  {
    title: 'Edita en 2D',
    text: 'Coloca piezas en el plano y cambia de planta cuando lo necesites.',
  },
  {
    title: 'Visualiza en 3D',
    text: 'Revisa el volumen construido con la vista tridimensional.',
  },
]

const quickToolHelp = [
  {
    icon: 'penTool',
    title: 'Colocar piezas',
    text: 'Activa el modo de dibujo para añadir piezas sobre el plano 2D.',
  },
  {
    icon: 'move',
    title: 'Mover plano',
    text: 'Desplaza el tablero por el plano para navegar.',
  },
  {
    icon: 'swap',
    title: 'Invertir sentido',
    text: 'Cambia el sentido de la siguiente pieza antes de colocarla.',
  },
  {
    icon: 'rotate',
    title: 'Girar pieza',
    text: 'Rota la próxima pieza para ajustar su orientación sobre la cuadrícula.',
  },
  {
    icon: 'undo',
    title: 'Deshacer',
    text: 'Revierte el último cambio realizado sobre el plano.',
  },
  {
    icon: 'redo',
    title: 'Rehacer',
    text: 'Recupera el último cambio que acabas de deshacer.',
  },
]

const designGuides = {
  '2d': {
    title: 'Guía 2D',
    intro: 'El plano 2D es el lugar donde construyes la lógica del proyecto antes de ver el volumen final.',
    sections: [
      {
        title: '1. Elige la pieza adecuada',
        text: 'Selecciona un bloque, pilar o accesorio desde la barra lateral y comprueba el material, el tipo y la planta activa antes de colocarlo.',
      },
      {
        title: '2. Coloca y corrige en el plano',
        text: 'Haz clic sobre el tablero para situar la pieza. Si mantienes pulsado, puedes pintar varios puntos seguidos; si cambias de idea, borra con la misma lógica.',
      },
      {
        title: '3. Respeta las reglas de apoyo',
        text: 'El editor valida si una pieza necesita apoyo debajo, una conexión lateral o estar en planta 0 para no dejar elementos flotando o mal anclados.',
      },
      {
        title: '4. Cambia de planta cuando haga falta',
        text: 'Sube y baja de altura para revisar cada capa del proyecto. Así puedes ajustar huecos, comprobar coincidencias y trabajar sección por sección.',
      },
      {
        title: '5. Usa las acciones rápidas',
        text: 'Deshacer, rehacer, guardar, cargar, exportar y mover el tablero están pensados para que puedas iterar sin perder tiempo.',
      },
      {
        title: '6. Revisa la vista previa',
        text: 'El plano muestra una previsualización cuando el cursor pasa por encima, de manera que sepas antes de confirmar si la colocación es válida o no.',
      },
    ],
    footer: 'Consejo: si dudas, trabaja primero en 2D hasta que el reparto general de piezas esté cerrado y usa el 3D solo para verificar proporciones y altura.',
  },
  '3d': {
    title: 'Guía 3D',
    intro: 'La vista 3D transforma el plano en una lectura espacial más intuitiva para entender el resultado final.',
    sections: [
      {
        title: '1. Mira el volumen completo',
        text: 'Cada pieza se convierte en un bloque volumétrico con su altura real, lo que permite entender la forma final del conjunto.',
      },
      {
        title: '2. Lee las capas visibles',
        text: 'Las guías de altura y la rejilla tridimensional te ayudan a entender qué capas están activas y cuánto volumen se ha acumulado.',
      },
      {
        title: '3. Diferencia estructura y accesorios',
        text: 'Los elementos estructurales se perciben más sólidos, mientras que los accesorios se muestran con una presencia más ligera para facilitar la lectura.',
      },
      {
        title: '4. Compara medidas y proporciones',
        text: 'Las guías de dimensiones y el contorno del volumen permiten comprobar ancho, fondo y altura con una referencia visual rápida.',
      },
      {
        title: '5. Ajusta la cámara',
        text: 'Gira, acerca y aleja la escena para inspeccionar el proyecto desde distintos puntos de vista sin perder la orientación espacial.',
      },
      {
        title: '6. Usa 3D como validación final',
        text: 'Cuando el plano 2D ya está resuelto, el 3D te sirve para confirmar que la composición general, las alturas y los apoyos tienen sentido.',
      },
    ],
    footer: 'Consejo: vuelve al plano 2D si detectas una capa que no encaja; la vista 3D está pensada como comprobación final del diseño.',
  },
}

const communityExamples = [
  {
    title: 'Plano 2D',
    image: galleryCompactImage,
  },
  {
    title: 'Plano 3D',
    image: galleryMinimalImage,
  },
]

const normalizeDesignText = (value) => (
  String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
)

const getDesignPieceImage = (piece) => {
  if (piece.id === 'accessory-door-basic') return puertaImage
  if (piece.id === 'accessory-window-basic') return ventanaImage
  if (piece.id === 'accessory-stairs-basic') return escalerasImage
  if (piece.id === 'accessory-floor-basic') return sueloImage

  const material = normalizeDesignText(piece.material)
  const isEco = material.includes('plastico') || material.includes('eco') || material.includes('recicl')

  if (piece.category === 'pilares') return isEco ? pilarEcoImage : pilarHormigonImage
  if (piece.category === 'bloques') return isEco ? bloqueEcoImage : bloqueHormigonImage

  return null
}

const getDesignPieceBadge = (piece) => {
  if (piece.category === 'accesorios') return 'Modelo'

  const material = normalizeDesignText(piece.material)
  return material.includes('plastico') || material.includes('eco') || material.includes('recicl')
    ? 'Eco'
    : 'Hormigón'
}

const layerHeightFormatter = new Intl.NumberFormat('es-ES', {
  maximumFractionDigits: 1,
  minimumFractionDigits: 1,
})

const FLOOR_HOLD_REPEAT_MS = 175
const HOLD_REPEAT_DELAY_MS = 250

function usePressAndHoldAction(action, { delayMs = 0, repeatMs = FLOOR_HOLD_REPEAT_MS, fireImmediately = true } = {}) {
  const actionRef = useRef(action)
  const repeatTimerRef = useRef(null)
  const delayTimerRef = useRef(null)
  const suppressNextClickRef = useRef(false)
  const holdActivatedRef = useRef(false)

  useEffect(() => {
    actionRef.current = action
  }, [action])

  const stopRepeating = useCallback(() => {
    if (delayTimerRef.current) {
      window.clearTimeout(delayTimerRef.current)
      delayTimerRef.current = null
    }

    if (repeatTimerRef.current) {
      window.clearInterval(repeatTimerRef.current)
      repeatTimerRef.current = null
    }
  }, [])

  useEffect(() => () => {
    if (delayTimerRef.current) {
      window.clearTimeout(delayTimerRef.current)
    }

    if (repeatTimerRef.current) {
      window.clearInterval(repeatTimerRef.current)
    }
  }, [])

  useEffect(() => {
    const handleWindowBlur = () => stopRepeating()

    window.addEventListener('blur', handleWindowBlur)

    return () => {
      window.removeEventListener('blur', handleWindowBlur)
    }
  }, [stopRepeating])

  const handlePointerDown = useCallback((event) => {
    if (event.button !== 0) return

    event.preventDefault()
    suppressNextClickRef.current = fireImmediately
    holdActivatedRef.current = false

    if (repeatTimerRef.current) {
      window.clearInterval(repeatTimerRef.current)
      repeatTimerRef.current = null
    }

    if (delayTimerRef.current) {
      window.clearTimeout(delayTimerRef.current)
    }

    if (fireImmediately) {
      actionRef.current()
    }

    delayTimerRef.current = window.setTimeout(() => {
      holdActivatedRef.current = true
      if (!fireImmediately) {
        actionRef.current()
      }

      repeatTimerRef.current = window.setInterval(() => {
        actionRef.current()
      }, repeatMs)
    }, delayMs)
  }, [delayMs, fireImmediately, repeatMs])

  const handleClick = useCallback(() => {
    if (suppressNextClickRef.current) {
      suppressNextClickRef.current = false
      return
    }

    if (holdActivatedRef.current) {
      holdActivatedRef.current = false
      return
    }

    actionRef.current()
  }, [])

  return {
    onClick: handleClick,
    onPointerCancel: stopRepeating,
    onPointerDown: handlePointerDown,
    onPointerLeave: stopRepeating,
    onPointerUp: stopRepeating,
  }
}

function Design() {
  const editor = useDesignEditor()
  const [activeUtilityPanel, setActiveUtilityPanel] = useState(null)
  const [isPanMode, setIsPanMode] = useState(false)
  const [selectedQuickHelp, setSelectedQuickHelp] = useState(0)
  const [selectedGuide, setSelectedGuide] = useState(null)
  const [selectedCommunityExample, setSelectedCommunityExample] = useState(null)
  const activeLayerHeightLabel = `${layerHeightFormatter.format(editor.activeFloor * editor.layerHeightMeters)} m`
  const canvasTitle = editor.viewMode === '2d'
    ? `Plano 2D · Capa ${editor.activeFloor}`
    : `Vista 3D del proyecto · Capa ${editor.activeFloor}`
  const floorDownHandlers = usePressAndHoldAction(() => {
    editor.setActiveFloor((current) => Math.max(0, current - 1))
  })
  const floorUpHandlers = usePressAndHoldAction(() => {
    editor.setActiveFloor((current) => current + 1)
  })
  const undoHandlers = usePressAndHoldAction(editor.undo, {
    delayMs: HOLD_REPEAT_DELAY_MS,
    fireImmediately: false,
  })
  const redoHandlers = usePressAndHoldAction(editor.redo, {
    delayMs: HOLD_REPEAT_DELAY_MS,
    fireImmediately: false,
  })

  useEffect(() => {
    const handleKeyDown = (event) => {
      const target = event.target
      const isTypingField = target instanceof HTMLElement && (
        target.tagName === 'INPUT'
        || target.tagName === 'TEXTAREA'
        || target.tagName === 'SELECT'
        || target.isContentEditable
      )

      if (isTypingField) return

      const hasUndoShortcut = (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'z'
      const hasRedoShortcut = (event.ctrlKey || event.metaKey) && (event.key.toLowerCase() === 'y' || (event.shiftKey && event.key.toLowerCase() === 'z'))

      if (hasUndoShortcut) {
        event.preventDefault()
        if (event.shiftKey) {
          editor.redo()
        } else {
          editor.undo()
        }
        return
      }

      if (hasRedoShortcut) {
        event.preventDefault()
        editor.redo()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [editor])

  useEffect(() => {
    if (!selectedGuide && !selectedCommunityExample) return undefined

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setSelectedGuide(null)
        setSelectedCommunityExample(null)
      }
    }

    window.addEventListener('keydown', handleEscape)

    return () => {
      window.removeEventListener('keydown', handleEscape)
    }
  }, [selectedCommunityExample, selectedGuide])

  const toggleUtilityPanel = (panel) => {
    setActiveUtilityPanel((current) => (current === panel ? null : panel))
  }

  return (
    <section className="page-shell design-page container-fluid">
      <header className="card design-topbar">
        <div className="design-topbar-copy">
          <div className="design-topbar-title">
            <p className="design-eyebrow">Diseñador modular</p>
            <h1>Diseña tu estructura</h1>
          </div>
          <div className="design-topbar-text">
            <p>Crea tu plano en 3D utilizando bloques modulares y calcula materiales precios.</p>
          </div>
        </div>

        <div className="design-topbar-actions design-topbar-actions--hero">
          <button type="button" className="btn design-outline-btn">Guardar</button>
          <button type="button" className="btn design-outline-btn">Cargar</button>
          <button type="button" className="btn design-outline-btn">Nuevo</button>
          <button type="button" className="btn design-budget-btn">Gestionar presupuesto</button>
        </div>

        <div className="design-topbar-media" aria-hidden="true">
          <img src={designHeroImage} alt="" />
        </div>
      </header>

      <div className="row g-4 design-workspace">
        <aside className="col-12 col-lg-3 col-xl-3">
          <section className="card design-pieces-panel">
            <div className="design-tabs" role="tablist" aria-label="Tipos de piezas">
              {Object.entries(editor.designCategories).map(([category, label]) => (
                <button
                  className={editor.activeCategory === category ? 'active' : ''}
                  key={category}
                  onClick={() => editor.selectCategory(category)}
                  type="button"
                >
                  {label}
                </button>
              ))}
            </div>

            {editor.activeCategory !== 'accesorios' && (
              <div className="design-material-filter" aria-label="Filtrar por material">
                <button
                  type="button"
                  className={editor.materialFilter === 'hormigon' ? 'active' : ''}
                  onClick={() => editor.setMaterialFilter('hormigon')}
                >
                  Hormigon
                </button>
                <button
                  type="button"
                  className={editor.materialFilter === 'eco' ? 'active' : ''}
                  onClick={() => editor.setMaterialFilter('eco')}
                >
                  Eco
                </button>
              </div>
            )}

            {editor.isLoadingPieces && editor.activeCategory !== 'accesorios' && (
              <div className="design-piece-empty">Cargando piezas desde la base de datos...</div>
            )}

            {!editor.isLoadingPieces && editor.piecesError && editor.activeCategory !== 'accesorios' && (
              <div className="design-piece-empty">{editor.piecesError}</div>
            )}

            {!editor.isLoadingPieces && !editor.visiblePieces.length && !editor.piecesError && (
              <div className="design-piece-empty">No hay piezas disponibles en esta categoria.</div>
            )}

            {editor.visiblePieces.length > 0 && (
              <div className="design-piece-dropdown">
                <label htmlFor="design-piece-select">Pieza activa</label>
                <select
                  id="design-piece-select"
                  value={editor.selectedPiece?.id || ''}
                  onChange={(event) => editor.setSelectedPieceId(event.target.value)}
                >
                  {editor.visiblePieces.map((piece) => (
                    <option key={piece.id} value={piece.id}>
                      {piece.name} - {piece.size}
                    </option>
                  ))}
                </select>
                {editor.selectedPiece && (
                  <div className="design-piece-dropdown-summary" style={{ '--piece-color': editor.selectedPiece.color }}>
                    <span>{getDesignPieceBadge(editor.selectedPiece)}</span>
                    <strong>{editor.selectedPiece.name}</strong>
                    <small>{editor.selectedPiece.size}</small>
                  </div>
                )}
              </div>
            )}

            <div className="design-piece-list">

              {editor.visiblePieces.map((piece) => (
                (() => {
                  const pieceImage = getDesignPieceImage(piece)

                  return (
                <button
                  className={`design-piece-card${editor.selectedPiece?.id === piece.id ? ' is-selected' : ''}`}
                  key={piece.id}
                  onClick={() => editor.setSelectedPieceId(piece.id)}
                  type="button"
                >
                  <div className="design-piece-media" style={{ '--piece-color': piece.color }}>
                    {pieceImage ? (
                      <img src={pieceImage} alt="" />
                    ) : (
                      null
                    )}
                  </div>
                  <span className="design-piece-badge">{getDesignPieceBadge(piece)}</span>
                  <div>
                    <h3>{piece.name}</h3>
                    <span className="design-piece-size">{piece.size}</span>
                    {piece.source === 'local' && <small>Modelo local</small>}
                  </div>
                </button>
                  )
                })()
              ))}
            </div>

            <div className="design-drag-help">
              <div>
                <strong>Ayuda rápida</strong>
                <div className="design-drag-help-icons" role="tablist" aria-label="Herramientas rápidas">
                  {quickToolHelp.map((item, index) => (
                    <button
                      key={item.title}
                      type="button"
                      className={selectedQuickHelp === index ? 'is-active' : ''}
                      aria-pressed={selectedQuickHelp === index}
                      aria-label={item.title}
                      onClick={() => setSelectedQuickHelp(index)}
                      title={item.title}
                    >
                      <Icon name={item.icon} size={16} />
                    </button>
                  ))}
                </div>
                <div className="design-drag-help-copy">
                  <strong>{quickToolHelp[selectedQuickHelp].title}</strong>
                  <p>{quickToolHelp[selectedQuickHelp].text}</p>
                </div>
              </div>
            </div>
          </section>
        </aside>

        <main className="col-12 col-lg-9 col-xl-9 design-editor-column">
          <section className="card design-canvas-card" aria-label="Editor modular 2D y visualizador 3D">
            <div className="design-canvas-status">
              <strong>{canvasTitle}</strong>
              <span>{editor.statusMessage}</span>
            </div>

            {editor.viewMode === '2d' ? (
              <DesignBoard2D
                activeFloor={editor.activeFloor}
                boardOffset={editor.boardOffset}
                designPieces={editor.designPieces}
                getPlacementPreview={editor.getPlacementPreview}
                gridCellSizeMeters={editor.gridCellSizeMeters}
                layerHeightMeters={editor.layerHeightMeters}
                gridColumns={editor.gridColumns}
                gridRows={editor.gridRows}
                isPanMode={isPanMode}
                onBoardMessage={editor.setStatusMessage}
                panBoard={editor.panBoard}
                placements={editor.placements}
                placePiece={editor.placePiece}
                removePiece={editor.removePiece}
                viewZoom={editor.viewZoom}
                zoomByWheel={editor.zoomByWheel}
              />
            ) : (
              <Viewer3D
                activeFloor={editor.activeFloor}
                designPieces={editor.designPieces}
                gridCellSizeMeters={editor.gridCellSizeMeters}
                gridColumns={editor.gridColumns}
                gridRows={editor.gridRows}
                isGridVisible={editor.is3DGridVisible}
                layerHeightMeters={editor.layerHeightMeters}
                onCameraStateChange={editor.setThreeCameraState}
                placements={editor.placements}
                resetSignal={editor.threeCameraResetKey}
                savedCameraState={editor.threeCameraState}
                viewZoom={editor.viewZoom}
              />
            )}

            <div className="design-editor-toolbar" aria-label="Herramientas de edición">
              <button
                type="button"
                className={!isPanMode ? 'active' : ''}
                aria-label="Modo colocar piezas"
                aria-pressed={!isPanMode}
                onClick={() => setIsPanMode(false)}
                title="Colocar piezas"
              >
                <Icon name="penTool" size={16} />
              </button>
              <button
                type="button"
                className={isPanMode ? 'active' : ''}
                aria-label="Mover por el plano"
                aria-pressed={isPanMode}
                onClick={() => setIsPanMode((current) => !current)}
                title="Mover por el plano"
              >
                <Icon name="move" size={16} />
              </button>
              <button
                type="button"
                className={editor.isFlipped ? 'active' : ''}
                aria-label="Cambiar sentido de la siguiente pieza"
                aria-pressed={editor.isFlipped}
                onClick={() => editor.setIsFlipped((current) => !current)}
                title="Cambiar sentido"
              >
                <Icon name="swap" size={16} />
              </button>
              <button
                type="button"
                className={editor.isRotated ? 'active' : ''}
                aria-label="Girar siguiente pieza"
                aria-pressed={editor.isRotated}
                onClick={() => editor.setIsRotated((current) => !current)}
                title="Girar siguiente pieza"
              >
                <Icon name="rotate" size={16} />
              </button>
              <button
                type="button"
                aria-label="Deshacer cambio"
                disabled={!editor.canUndo}
                {...undoHandlers}
                title="Deshacer"
              >
                <Icon name="undo" size={16} />
              </button>
              <button
                type="button"
                aria-label="Rehacer cambio"
                disabled={!editor.canRedo}
                {...redoHandlers}
                title="Rehacer"
              >
                <Icon name="redo" size={16} />
              </button>
              {editor.viewMode === '3d' && (
                <button
                  type="button"
                  className={!editor.is3DGridVisible ? 'active' : ''}
                  aria-label="Ver solo lo construido"
                  aria-pressed={!editor.is3DGridVisible}
                  onClick={() => editor.setIs3DGridVisible((current) => !current)}
                  title="Ver solo lo construido"
                >
                  <Icon name="eye" size={16} />
                </button>
              )}
            </div>

            <div className="design-zoom" aria-label="Control de zoom">
              <button
                type="button"
                aria-label="Ampliar vista"
                onClick={editor.zoomIn}
              >
                +
              </button>
              <button
                type="button"
                aria-label="Reducir vista"
                onClick={editor.zoomOut}
              >
                -
              </button>
              <button type="button" aria-label="Centrar vista" onClick={editor.resetView}>
                <Icon name="fullscreen" size={16} />
              </button>
            </div>

            <div className="design-floor-switch" aria-label="Cambiar capa">
              <div className="design-layer-height" aria-label={`Altura actual ${activeLayerHeightLabel}`}>
                <span className="design-layer-height-line" aria-hidden="true" />
                <span>{activeLayerHeightLabel}</span>
              </div>
              <div className="design-floor-controls">
                <button
                  type="button"
                  aria-label="Bajar capa"
                  {...floorDownHandlers}
                >
                  &lt;
                </button>
                <button type="button" className="design-floor-label" aria-label={`Capa activa ${editor.activeFloor}`}>
                  Capa {editor.activeFloor}
                </button>
                <button
                  type="button"
                  aria-label="Subir capa"
                  {...floorUpHandlers}
                >
                  &gt;
                </button>
                <button
                  type="button"
                  aria-label="Volver a la capa cero"
                  onClick={() => editor.setActiveFloor(0)}
                  title="Volver a capa cero"
                >
                  <Icon name="grid" size={15} />
                </button>
              </div>
            </div>

            <div className="design-side-tools" aria-label="Utilidades del plano">
              <button type="button" className={activeUtilityPanel === 'plan' ? 'active' : ''} onClick={() => toggleUtilityPanel('plan')}>
                <Icon name="save" size={18} />
                <span>Plano</span>
              </button>
              <button type="button" className={activeUtilityPanel === 'pieces' ? 'active' : ''} onClick={() => toggleUtilityPanel('pieces')}>
                <Icon name="cube" size={18} />
                <span>Piezas</span>
              </button>
              <button type="button" className={`design-side-tool--divider${activeUtilityPanel === 'budget' ? ' active' : ''}`} onClick={() => toggleUtilityPanel('budget')}>
                <Icon name="list" size={18} />
                <span>Presupuesto</span>
              </button>
            </div>

            <div className="design-view-switch" aria-label="Cambiar vista">
              <button
                type="button"
                className={editor.viewMode === '2d' ? 'active' : ''}
                onClick={() => editor.setViewMode('2d')}
              >
                2D
              </button>
              <button
                type="button"
                className={editor.viewMode === '3d' ? 'active' : ''}
                onClick={() => editor.setViewMode('3d')}
              >
                3D
              </button>
            </div>

            <button
              type="button"
              className="design-clear-canvas-btn"
              aria-label="Limpiar plano"
              onClick={editor.clearProject}
              title="Limpiar plano"
            >
              <Icon name="trash" size={18} />
              <span>Limpiar</span>
            </button>

            {activeUtilityPanel === 'plan' && (
              <div className="design-utility-popover design-utility-popover--plan">
                <strong>Plano</strong>
                <div className="design-plan-actions">
                  <button type="button" className="btn design-outline-btn" onClick={editor.clearProject}>Nuevo plano</button>
                  <button type="button" className="btn design-outline-btn" onClick={editor.saveProject}>
                    <Icon name="save" size={15} />
                    <span>Guardar plano</span>
                  </button>
                  <button type="button" className="btn design-outline-btn" onClick={editor.loadProject}>Cargar plano</button>
                  <button type="button" className="btn design-outline-btn" onClick={editor.exportProject}>Exportar</button>
                </div>
              </div>
            )}

            {activeUtilityPanel === 'pieces' && (
              <div className="design-utility-popover design-utility-popover--pieces">
                <strong>Piezas colocadas</strong>
                {editor.stats.items.length > 0 ? (
                  editor.stats.items.map((item) => (
                    <button
                      type="button"
                      className={editor.selectedPieceId === item.pieceId ? 'active' : ''}
                      key={item.pieceId}
                      onClick={() => {
                        editor.selectCategory(item.category)
                        editor.setSelectedPieceId(item.pieceId)
                      }}
                    >
                      <span>{item.name}</span>
                      <small>{item.size}</small>
                      <b>{item.amount}</b>
                    </button>
                  ))
                ) : (
                  <span>Sin piezas colocadas</span>
                )}
              </div>
            )}

            <aside className={`design-summary-panel${activeUtilityPanel === 'budget' ? ' is-open' : ''}`}>
              <h2>Presupuesto estimado</h2>

              <div className="design-summary-content">
                <div className="design-summary-list">
                  {editor.stats.items.length > 0 ? editor.stats.items.map((item) => (
                    <div key={`${item.name}-${item.material}`}>
                      <span><strong>{item.name}</strong> {item.material}</span>
                      <b>{item.amount}</b>
                    </div>
                  )) : (
                    <div>
                      <span>No hay piezas colocadas.</span>
                      <b>0</b>
                    </div>
                  )}
                </div>

                <dl className="design-summary-totals">
                  <div>
                    <dt>Total piezas</dt>
                    <dd>{editor.stats.totalPieces}</dd>
                  </div>
                  <div>
                    <dt>Superficie</dt>
                    <dd>{editor.stats.totalArea} m2</dd>
                  </div>
                  <div>
                    <dt>Altura muros</dt>
                    <dd>{editor.stats.wallHeight}</dd>
                  </div>
                </dl>

                <div className="design-price-box">
                  <span>Precio estimado</span>
                  <strong>{editor.stats.estimatedTotal.toFixed(2)} EUR</strong>
                </div>
              </div>
            </aside>
          </section>
        </main>
      </div>

      <section className="card design-help-card">
        <div className="design-help-steps">
          <h2>Como funciona</h2>
          <p className="design-help-intro">
            Esta guía resume el flujo completo del diseñador para que puedas colocar piezas, validar apoyos y revisar el volumen final sin perder contexto.
          </p>
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

          <div className="design-help-guide-actions">
            <button type="button" className="btn design-help-guide-btn" onClick={() => setSelectedGuide('2d')}>
              Guía 2D
            </button>
            <button type="button" className="btn design-help-guide-btn" onClick={() => setSelectedGuide('3d')}>
              Guía 3D
            </button>
          </div>
        </div>

        <aside className="design-guide-box">
          <div>
            <h2>Ejemplos</h2>
          </div>

          <div className="design-community-grid">
            {communityExamples.map((example) => (
              <button
                key={example.title}
                type="button"
                className="design-community-example"
                onClick={() => setSelectedCommunityExample(example)}
                aria-label={`Abrir ejemplo ${example.title}`}
              >
                <img src={example.image} alt={example.title} />
                <span>
                  <strong>{example.title}</strong>
                </span>
              </button>
            ))}
          </div>
        </aside>
      </section>

      {selectedGuide && (
        <div className="design-guide-backdrop" role="presentation" onClick={() => setSelectedGuide(null)}>
          <article
            className="design-guide-modal"
            role="dialog"
            aria-modal="true"
            aria-label={designGuides[selectedGuide].title}
            onClick={(event) => event.stopPropagation()}
          >
            <button type="button" className="design-guide-close" aria-label="Cerrar" onClick={() => setSelectedGuide(null)}>
              ×
            </button>
            <header className="design-guide-modal-header">
              <p>Manual de instrucciones</p>
              <h2>{designGuides[selectedGuide].title}</h2>
              <p>{designGuides[selectedGuide].intro}</p>
            </header>
            <div className="design-guide-modal-body">
              {designGuides[selectedGuide].sections.map((section) => (
                <section key={section.title}>
                  <h3>{section.title}</h3>
                  <p>{section.text}</p>
                </section>
              ))}
            </div>
            <footer className="design-guide-modal-footer">
              <strong>{designGuides[selectedGuide].footer}</strong>
            </footer>
          </article>
        </div>
      )}

      {selectedCommunityExample && (
        <div className="design-community-backdrop" role="presentation" onClick={() => setSelectedCommunityExample(null)}>
          <article
            className="design-community-modal"
            role="dialog"
            aria-modal="true"
            aria-label={selectedCommunityExample.title}
            onClick={(event) => event.stopPropagation()}
          >
            <button type="button" className="design-community-close" aria-label="Cerrar" onClick={() => setSelectedCommunityExample(null)}>
              ×
            </button>
            <img src={selectedCommunityExample.image} alt={selectedCommunityExample.title} />
            <div className="design-community-caption">
              <strong>{selectedCommunityExample.title}</strong>
            </div>
          </article>
        </div>
      )}
    </section>
  )
}

export default Design
