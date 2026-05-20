import { useState } from 'react'
import designHeroImage from '../assets/design/design-hero.webp'
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

const normalizeDesignText = (value) => (
  String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
)

const getDesignPieceImage = (piece) => {
  const material = normalizeDesignText(piece.material)
  const isEco = material.includes('plastico') || material.includes('eco') || material.includes('recicl')

  if (piece.category === 'pilares') return isEco ? pilarEcoImage : pilarHormigonImage
  if (piece.category === 'bloques') return isEco ? bloqueEcoImage : bloqueHormigonImage

  return null
}

const getDesignPieceBadge = (piece) => {
  if (piece.category === 'accesorios') return 'Accesorio'

  const material = normalizeDesignText(piece.material)
  return material.includes('plastico') || material.includes('eco') || material.includes('recicl')
    ? 'Eco'
    : 'Hormigón'
}

function Design({ onNavigate }) {
  const editor = useDesignEditor()
  const [activeUtilityPanel, setActiveUtilityPanel] = useState(null)
  const [isPanMode, setIsPanMode] = useState(false)

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

            <div className="design-piece-list">
              {editor.isLoadingPieces && editor.activeCategory !== 'accesorios' && (
                <div className="design-piece-empty">Cargando piezas desde la base de datos...</div>
              )}

              {!editor.isLoadingPieces && editor.piecesError && editor.activeCategory !== 'accesorios' && (
                <div className="design-piece-empty">{editor.piecesError}</div>
              )}

              {!editor.isLoadingPieces && !editor.visiblePieces.length && !editor.piecesError && (
                <div className="design-piece-empty">No hay piezas disponibles en esta categoria.</div>
              )}

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
              <span aria-hidden="true">+</span>
              <div>
                <strong>Selecciona y coloca</strong>
                <p>la edicion se realiza en la vista 2D</p>
              </div>
            </div>
          </section>
        </aside>

        <main className="col-12 col-lg-9 col-xl-9 design-editor-column">
          <section className="card design-canvas-card" aria-label="Editor modular 2D y visualizador 3D">
            <div className="design-canvas-status">
              <strong>{editor.viewMode === '2d' ? 'Plano 2D editable' : 'Vista 3D del proyecto'}</strong>
              <span>{editor.statusMessage}</span>
            </div>

            {editor.viewMode === '2d' ? (
              <DesignBoard2D
                activeFloor={editor.activeFloor}
                boardOffset={editor.boardOffset}
                designPieces={editor.designPieces}
                gridCellSizeMeters={editor.gridCellSizeMeters}
                gridColumns={editor.gridColumns}
                gridRows={editor.gridRows}
                isPanMode={isPanMode}
                panBoard={editor.panBoard}
                placements={editor.placements}
                placePiece={editor.placePiece}
                removePiece={editor.removePiece}
                viewZoom={editor.viewZoom}
              />
            ) : (
              <Viewer3D
                designPieces={editor.designPieces}
                gridColumns={editor.gridColumns}
                gridRows={editor.gridRows}
                placements={editor.placements}
                viewZoom={editor.viewZoom}
              />
            )}

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
              <button type="button" aria-label={`Zoom ${Math.round(editor.viewZoom * 100)} por ciento`}>
                {Math.round(editor.viewZoom * 100)}
              </button>
            </div>

            <div className="design-floor-switch" aria-label="Cambiar planta">
              <button
                type="button"
                aria-label="Subir planta"
                onClick={() => editor.setActiveFloor((current) => current + 1)}
              >
                ↑
              </button>
              <button type="button" aria-label={`Planta activa ${editor.activeFloor}`}>
                P{editor.activeFloor}
              </button>
              <button
                type="button"
                aria-label="Bajar planta"
                onClick={() => editor.setActiveFloor((current) => Math.max(0, current - 1))}
              >
                ↓
              </button>
            </div>

            <div className="design-side-tools" aria-label="Utilidades del plano">
              <button type="button" className={activeUtilityPanel === 'plan' ? 'active' : ''} onClick={() => toggleUtilityPanel('plan')}>
                <span aria-hidden="true">💾</span>
                <span>Plano</span>
              </button>
              <button
                type="button"
                aria-pressed={isPanMode}
                className={isPanMode ? 'active' : ''}
                onClick={() => setIsPanMode((current) => !current)}
              >
                <span aria-hidden="true">↔</span>
                <span>Mover</span>
              </button>
              <button type="button" className={activeUtilityPanel === 'pieces' ? 'active' : ''} onClick={() => toggleUtilityPanel('pieces')}>
                <Icon name="cube" size={18} />
                <span>Piezas</span>
              </button>
              <button type="button" className={activeUtilityPanel === 'floor' ? 'active' : ''} onClick={() => toggleUtilityPanel('floor')}>
                <Icon name="grid" size={18} />
                <span>Plantas</span>
              </button>
              <button type="button" className={`design-side-tool--divider${activeUtilityPanel === 'budget' ? ' active' : ''}`} onClick={() => toggleUtilityPanel('budget')}>
                <Icon name="list" size={18} />
                <span>Presupuesto</span>
              </button>
              <button
                type="button"
                aria-pressed={editor.isRotated}
                className={`design-side-tool--divider${editor.isRotated ? ' active' : ''}`}
                onClick={() => editor.setIsRotated((current) => !current)}
              >
                <Icon name="fit" size={18} />
                <span>Girar</span>
              </button>
              <button type="button" onClick={() => editor.setViewMode(editor.viewMode === '2d' ? '3d' : '2d')}>
                <Icon name={editor.viewMode === '2d' ? 'cube' : 'grid'} size={18} />
                <span>{editor.viewMode === '2d' ? '3D' : '2D'}</span>
              </button>
            </div>

            {activeUtilityPanel === 'plan' && (
              <div className="design-utility-popover design-utility-popover--plan">
                <strong>Plano</strong>
                <div className="design-plan-actions">
                  <button type="button" className="btn design-outline-btn" onClick={editor.clearProject}>Nuevo plano</button>
                  <button type="button" className="btn design-outline-btn" onClick={editor.saveProject}>💾 Guardar plano</button>
                  <button type="button" className="btn design-outline-btn" onClick={editor.loadProject}>Cargar plano</button>
                  <button type="button" className="btn design-outline-btn" onClick={editor.exportProject}>Exportar</button>
                </div>
              </div>
            )}

            {activeUtilityPanel === 'floor' && (
              <div className="design-utility-popover design-utility-popover--floor">
                <strong>Planta activa</strong>
                <div className="design-floor-mini">
                  <button type="button" onClick={() => editor.setActiveFloor((current) => Math.max(0, current - 1))}>-</button>
                  <span>P{editor.activeFloor}</span>
                  <button type="button" onClick={() => editor.setActiveFloor((current) => current + 1)}>+</button>
                </div>
              </div>
            )}

            {activeUtilityPanel === 'pieces' && (
              <div className="design-utility-popover design-utility-popover--pieces">
                <strong>Piezas colocadas</strong>
                {editor.stats.items.length > 0 ? (
                  editor.stats.items.map((item) => (
                    <span key={`${item.name}-${item.material}`}>{item.name} · {item.amount}</span>
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
            <p>Consulta nuestra guia rapida para aprender a usar el disenador.</p>
          </div>
          <button type="button" className="btn design-guide-btn" onClick={() => onNavigate('catalog', '', 'productos')}>
            Ver guia
          </button>
        </aside>
      </section>
    </section>
  )
}

export default Design
