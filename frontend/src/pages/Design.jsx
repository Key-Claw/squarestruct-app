import { useCallback, useEffect, useRef, useState } from 'react'
import designHeroImage from '../assets/design/design-hero.webp'
import escalerasImage from '../assets/design/escaleras.webp'
import puertaImage from '../assets/design/puerta.webp'
import sueloImage from '../assets/design/suelo.webp'
import ventanaImage from '../assets/design/ventana.webp'
import designBocetoImage from '../assets/design/design-boceto.webp'
import bloqueEcoImage from '../assets/catalog/bloque-eco.webp'
import bloqueHormigonImage from '../assets/catalog/bloque-hormigon.webp'
import pilarEcoImage from '../assets/catalog/pilar-eco.webp'
import pilarHormigonImage from '../assets/catalog/pilar-hormigon.webp'
import Icon from '../components/common/Icon'
import DesignBoard2D from '../components/design/editor/DesignBoard2D'
import useDesignEditor from '../components/design/editor/useDesignEditor'
import Viewer3D from '../components/design/three/Viewer3D'
import { useTranslation } from 'react-i18next'
import i18n from '../i18n'

const normalizeDesignText = (value) => (
  String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
)

const normalizeDesignList = (value) => {
  if (Array.isArray(value)) {
    return value.filter(Boolean)
  }

  if (value && typeof value === 'object') {
    return Object.values(value).filter(Boolean)
  }

  return []
}

const normalizeDesignGuide = (value) => ({
  ...(value && typeof value === 'object' ? value : {}),
  sections: normalizeDesignList(value?.sections),
})

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
  if (piece.category === 'accesorios') {
    return i18n.t('design.localModel')
  }

  const material = normalizeDesignText(piece.material)
  return material.includes('plastico') || material.includes('eco') || material.includes('recicl')
    ? i18n.t('design.materials.eco')
    : i18n.t('design.materials.hormigon')
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
  const { t } = useTranslation()
  const editor = useDesignEditor()
  const [activeUtilityPanel, setActiveUtilityPanel] = useState(null)
  const [isPanMode, setIsPanMode] = useState(false)
  const [selectedQuickHelp, setSelectedQuickHelp] = useState(0)
  const [selectedGuide, setSelectedGuide] = useState(null)
  const [selectedCommunityExample, setSelectedCommunityExample] = useState(null)
  const activeLayerHeightLabel = `${layerHeightFormatter.format(editor.activeFloor * editor.layerHeightMeters)} m`
  const canvasTitle = editor.viewMode === '2d'
    ? t('design.topbar.2d', { floor: editor.activeFloor })
    : t('design.topbar.3d', { floor: editor.activeFloor })
  const howItWorks = normalizeDesignList(t('design.howItWorks', { returnObjects: true }))
  const quickToolHelp = normalizeDesignList(t('design.quickHelp', { returnObjects: true }))
  const activeQuickHelp = quickToolHelp[selectedQuickHelp] || quickToolHelp[0] || null
  const designGuides = {
    '2d': normalizeDesignGuide(t('design.guide2d', { returnObjects: true })),
    '3d': normalizeDesignGuide(t('design.guide3d', { returnObjects: true })),
  }
  const communityExamples = normalizeDesignList(t('design.examples', { returnObjects: true })).map((example) => ({
    ...example,
    alt: example.alt || example.title,
    image: example.image || designBocetoImage,
  }))
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
            <p className="design-eyebrow">{t('design.eyebrow')}</p>
            <h1>{t('design.title')}</h1>
          </div>
          <div className="design-topbar-text">
            <p>{t('design.intro')}</p>
          </div>
        </div>

        <div className="design-topbar-actions design-topbar-actions--hero">
          <button type="button" className="btn design-outline-btn">{t('design.actions.save')}</button>
          <button type="button" className="btn design-outline-btn">{t('design.actions.load')}</button>
          <button type="button" className="btn design-outline-btn">{t('design.actions.new')}</button>
          <button type="button" className="btn design-budget-btn">{t('design.actions.budget')}</button>
        </div>

        <div className="design-topbar-media" aria-hidden="true">
          <img src={designHeroImage} alt="" />
        </div>
      </header>

      <div className="row g-4 design-workspace">
        <aside className="col-12 col-lg-3 col-xl-3">
          <section className="card design-pieces-panel">
            <div className="design-tabs" role="tablist" aria-label={t('design.categories')}>
              {Object.entries(editor.designCategories).map(([category]) => (
                <button
                  className={editor.activeCategory === category ? 'active' : ''}
                  key={category}
                  onClick={() => editor.selectCategory(category)}
                  type="button"
                >
                  {t(`design.categoryLabels.${category}`)}
                </button>
              ))}
            </div>

            {editor.activeCategory !== 'accesorios' && (
              <div className="design-material-filter" aria-label={t('design.materialFilter')}>
                <button
                  type="button"
                  className={editor.materialFilter === 'hormigon' ? 'active' : ''}
                  onClick={() => editor.setMaterialFilter('hormigon')}
                >
                  {t('design.materials.hormigon')}
                </button>
                <button
                  type="button"
                  className={editor.materialFilter === 'eco' ? 'active' : ''}
                  onClick={() => editor.setMaterialFilter('eco')}
                >
                  {t('design.materials.eco')}
                </button>
              </div>
            )}

            <div className="design-piece-list">
              {editor.isLoadingPieces && editor.activeCategory !== 'accesorios' && (
                <div className="design-piece-empty">{t('design.loadingPieces')}</div>
              )}

            {!editor.isLoadingPieces && editor.piecesError && editor.activeCategory !== 'accesorios' && (
              <div className="design-piece-empty">{editor.piecesError}</div>
            )}

              {!editor.isLoadingPieces && !editor.visiblePieces.length && !editor.piecesError && (
                <div className="design-piece-empty">{t('design.noPieces')}</div>
              )}

              {editor.visiblePieces.map((piece) => (
                (() => {
                  const pieceImage = getDesignPieceImage(piece)
                  const displayName = (piece.source === 'local' && piece.modelType)
                    ? i18n.t(`design.accessoryNames.${piece.modelType}`)
                    : piece.name

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
                    <h3>{displayName}</h3>
                    <span className="design-piece-size">{piece.size}</span>
                    {piece.source === 'local' && <small>{t('design.localModel')}</small>}
                  </div>
                </button>
                  )
                })()
              ))}
            </div>

            <div className="design-drag-help">
              <div>
                <strong>{t('design.quickHelpTitle')}</strong>
                <div className="design-drag-help-icons" role="tablist" aria-label={t('design.quickHelpTitle')}>
                  {quickToolHelp.map((item, index) => (
                    <button
                      key={`${item.icon}-${index}`}
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
                  {activeQuickHelp ? (
                    <>
                      <strong>{activeQuickHelp.title}</strong>
                      <p>{activeQuickHelp.text}</p>
                    </>
                  ) : (
                    <p>{t('design.quickHelpTitle')}</p>
                  )}
                </div>
              </div>
            </div>
          </section>
        </aside>

        <main className="col-12 col-lg-9 col-xl-9 design-editor-column">
            <section className="card design-canvas-card" aria-label={t('design.canvasAria')}>
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

            <div className="design-editor-toolbar" aria-label={t('design.toolbarAria')}>
              <button
                type="button"
                className={!isPanMode ? 'active' : ''}
                aria-label={t('design.toolLabels.place')}
                aria-pressed={!isPanMode}
                onClick={() => setIsPanMode(false)}
                title={t('design.toolLabels.place')}
              >
                <Icon name="penTool" size={16} />
              </button>
              <button
                type="button"
                className={isPanMode ? 'active' : ''}
                aria-label={t('design.toolLabels.pan')}
                aria-pressed={isPanMode}
                onClick={() => setIsPanMode((current) => !current)}
                title={t('design.toolLabels.pan')}
              >
                <Icon name="move" size={16} />
              </button>
              <button
                type="button"
                className={editor.isFlipped ? 'active' : ''}
                aria-label={t('design.toolLabels.flip')}
                aria-pressed={editor.isFlipped}
                onClick={() => editor.setIsFlipped((current) => !current)}
                title={t('design.toolLabels.flip')}
              >
                <Icon name="swap" size={16} />
              </button>
              <button
                type="button"
                className={editor.isRotated ? 'active' : ''}
                aria-label={t('design.toolLabels.rotate')}
                aria-pressed={editor.isRotated}
                onClick={() => editor.setIsRotated((current) => !current)}
                title={t('design.toolLabels.rotate')}
              >
                <Icon name="rotate" size={16} />
              </button>
              <button
                type="button"
                aria-label={t('design.toolLabels.undo')}
                disabled={!editor.canUndo}
                {...undoHandlers}
                title={t('design.toolLabels.undo')}
              >
                <Icon name="undo" size={16} />
              </button>
              <button
                type="button"
                aria-label={t('design.toolLabels.redo')}
                disabled={!editor.canRedo}
                {...redoHandlers}
                title={t('design.toolLabels.redo')}
              >
                <Icon name="redo" size={16} />
              </button>
              {editor.viewMode === '3d' && (
                <button
                  type="button"
                  className={!editor.is3DGridVisible ? 'active' : ''}
                  aria-label={t('design.toolLabels.view3d')}
                  aria-pressed={!editor.is3DGridVisible}
                  onClick={() => editor.setIs3DGridVisible((current) => !current)}
                  title={t('design.toolLabels.view3d')}
                >
                  <Icon name="eye" size={16} />
                </button>
              )}
            </div>

            <div className="design-zoom" aria-label={t('design.zoomAria')}>
              <button
                type="button"
                aria-label={t('design.zoomIn')}
                onClick={editor.zoomIn}
              >
                +
              </button>
              <button
                type="button"
                aria-label={t('design.zoomOut')}
                onClick={editor.zoomOut}
              >
                -
              </button>
              <button type="button" aria-label={t('design.centerView')} onClick={editor.resetView}>
                <Icon name="fullscreen" size={16} />
              </button>
            </div>

            <div className="design-floor-switch" aria-label={t('design.floorAria')}>
              <div className="design-layer-height" aria-label={t('design.floorHeightAria', { height: activeLayerHeightLabel })}>
                <span className="design-layer-height-line" aria-hidden="true" />
                <span>{activeLayerHeightLabel}</span>
              </div>
              <div className="design-floor-controls">
                <button
                  type="button"
                  aria-label={t('design.floorDown')}
                  {...floorDownHandlers}
                >
                  &lt;
                </button>
                <button type="button" className="design-floor-label" aria-label={t('design.floorLabel', { floor: editor.activeFloor })}>
                  {t('design.floorLabel', { floor: editor.activeFloor })}
                </button>
                <button
                  type="button"
                  aria-label={t('design.floorUp')}
                  {...floorUpHandlers}
                >
                  &gt;
                </button>
                <button
                  type="button"
                  aria-label={t('design.floorReset')}
                  onClick={() => editor.setActiveFloor(0)}
                  title={t('design.floorReset')}
                >
                  <Icon name="grid" size={15} />
                </button>
              </div>
            </div>

            <div className="design-side-tools" aria-label={t('design.sideToolsAria')}>
              <button type="button" className={activeUtilityPanel === 'plan' ? 'active' : ''} onClick={() => toggleUtilityPanel('plan')}>
                <Icon name="save" size={18} />
                <span>{t('design.sideTools.plan')}</span>
              </button>
              <button type="button" className={activeUtilityPanel === 'pieces' ? 'active' : ''} onClick={() => toggleUtilityPanel('pieces')}>
                <Icon name="cube" size={18} />
                <span>{t('design.sideTools.pieces')}</span>
              </button>
              <button type="button" className={`design-side-tool--divider${activeUtilityPanel === 'budget' ? ' active' : ''}`} onClick={() => toggleUtilityPanel('budget')}>
                <Icon name="list" size={18} />
                <span>{t('design.sideTools.budget')}</span>
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
              aria-label={t('design.clearCanvasTitle')}
              onClick={editor.clearProject}
              title={t('design.clearCanvasTitle')}
            >
              <Icon name="trash" size={18} />
              <span>{t('design.clearCanvas')}</span>
            </button>

            {activeUtilityPanel === 'plan' && (
              <div className="design-utility-popover design-utility-popover--plan">
                <strong>{t('design.sideTools.plan')}</strong>
                <div className="design-plan-actions">
                  <button type="button" className="btn design-outline-btn" onClick={editor.clearProject}>{t('design.actions.new')}</button>
                  <button type="button" className="btn design-outline-btn" onClick={editor.saveProject}>
                    <Icon name="save" size={15} />
                    <span>{t('design.status.save')}</span>
                  </button>
                  <button type="button" className="btn design-outline-btn" onClick={editor.loadProject}>{t('design.status.load')}</button>
                  <button type="button" className="btn design-outline-btn" onClick={editor.exportProject}>{t('design.status.export')}</button>
                </div>
              </div>
            )}

            {activeUtilityPanel === 'pieces' && (
              <div className="design-utility-popover design-utility-popover--pieces">
                <strong>{t('design.status.pieces')}</strong>
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
                  <span>{t('design.status.emptyPieces')}</span>
                )}
              </div>
            )}

            <aside className={`design-summary-panel${activeUtilityPanel === 'budget' ? ' is-open' : ''}`}>
              <h2>{t('design.status.budget')}</h2>

              <div className="design-summary-content">
                <div className="design-summary-list">
                  {editor.stats.items.length > 0 ? editor.stats.items.map((item) => (
                    <div key={item.pieceId}>
                      <span><strong>{item.name}</strong> {item.material}</span>
                      <b>{item.amount}</b>
                    </div>
                  )) : (
                    <div>
                      <span>{t('design.status.emptyBudget')}</span>
                      <b>0</b>
                    </div>
                  )}
                </div>

                <dl className="design-summary-totals">
                  <div>
                    <dt>{t('design.status.summary.pieces')}</dt>
                    <dd>{editor.stats.totalPieces}</dd>
                  </div>
                  <div>
                    <dt>{t('design.status.summary.area')}</dt>
                    <dd>{editor.stats.totalArea} m2</dd>
                  </div>
                  <div>
                    <dt>{t('design.status.summary.height')}</dt>
                    <dd>{editor.stats.wallHeight}</dd>
                  </div>
                </dl>

                <div className="design-price-box">
                  <span>{t('design.status.price')}</span>
                  <strong>{editor.stats.estimatedTotal.toFixed(2)} EUR</strong>
                </div>
              </div>
            </aside>
          </section>
        </main>
      </div>

      <section className="card design-help-card">
        <div className="design-help-steps">
          <h2>{t('design.howItWorksTitle')}</h2>
          <p className="design-help-intro">{t('design.howItWorksIntro')}</p>
          <div className="design-help-step-row">
            {howItWorks.map((step, index) => (
              <article key={`how-${index}`}>
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
              {t('design.guideButtons.2d')}
            </button>
            <button type="button" className="btn design-help-guide-btn" onClick={() => setSelectedGuide('3d')}>
              {t('design.guideButtons.3d')}
            </button>
          </div>
        </div>

        <aside className="design-guide-box">
          <div>
            <h2>{t('design.examplesTitle')}</h2>
          </div>

          <div className="design-community-grid">
            {communityExamples.map((example, index) => (
              <button
                key={`example-${index}`}
                type="button"
                className="design-community-example"
                onClick={() => setSelectedCommunityExample(example)}
                aria-label={t('design.communityOpenAria', { title: example.title })}
              >
                <img src={example.image} alt={example.alt} />
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
            aria-label={designGuides[selectedGuide]?.title || t('design.guideManual')}
            onClick={(event) => event.stopPropagation()}
          >
            <button type="button" className="design-guide-close" aria-label={t('design.modalClose')} onClick={() => setSelectedGuide(null)}>
              ×
            </button>
            <header className="design-guide-modal-header">
              <p>{t('design.guideManual')}</p>
              <h2>{designGuides[selectedGuide]?.title}</h2>
              <p>{designGuides[selectedGuide]?.intro}</p>
            </header>
            <div className="design-guide-modal-body">
              {designGuides[selectedGuide]?.sections.map((section, index) => (
                <section key={`section-${index}`}>
                  <h3>{section.title}</h3>
                  <p>{section.text}</p>
                </section>
              ))}
            </div>
            <footer className="design-guide-modal-footer">
              <strong>{designGuides[selectedGuide]?.footer}</strong>
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
            <button type="button" className="design-community-close" aria-label={t('design.modalClose')} onClick={() => setSelectedCommunityExample(null)}>
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
