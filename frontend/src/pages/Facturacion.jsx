import '../styles/facturacion.css'

const metricas = [
  { icono: 'EUR', titulo: 'Facturacion total', valor: '12.450,75 EUR', detalle: '+18,6% vs. mes anterior' },
  { icono: '84', titulo: 'Numero de facturas', valor: '84', detalle: '+12,2% vs. mes anterior' },
  { icono: 'TM', titulo: 'Ticket medio', valor: '148,22 EUR', detalle: '+5,3% vs. mes anterior' },
  { icono: 'TOP', titulo: 'Producto mas vendido', valor: 'Bloque 600', detalle: '423 unidades' },
]

const facturas = [
  { id: 'FAC-2025-0084', cliente: 'Raul Garcia', fecha: '14/05/2025', productos: 8, total: '320,75 EUR', pago: 'VISA', estado: 'Pagada' },
  { id: 'FAC-2025-0083', cliente: 'Cristian Lopez', fecha: '13/05/2025', productos: 12, total: '640,20 EUR', pago: 'Bizum', estado: 'Pagada' },
  { id: 'FAC-2025-0082', cliente: 'Maria Fernandez', fecha: '12/05/2025', productos: 5, total: '185,00 EUR', pago: 'Mastercard', estado: 'Pagada' },
  { id: 'FAC-2025-0081', cliente: 'Daniel Ruiz', fecha: '11/05/2025', productos: 9, total: '412,40 EUR', pago: 'VISA', estado: 'Pendiente' },
  { id: 'FAC-2025-0080', cliente: 'Laura Martinez', fecha: '10/05/2025', productos: 7, total: '275,90 EUR', pago: 'Transferencia', estado: 'Pagada' },
  { id: 'FAC-2025-0079', cliente: 'Jorge Sanchez', fecha: '09/05/2025', productos: 6, total: '315,60 EUR', pago: 'VISA', estado: 'Pagada' },
]

const productos = [
  { nombre: 'Bloque 600', unidades: 563, ingresos: '4.782,50 EUR', porcentaje: 45 },
  { nombre: 'Bloque 300', unidades: 312, ingresos: '2.652,00 EUR', porcentaje: 25 },
  { nombre: 'Bloque 900', unidades: 187, ingresos: '1.589,50 EUR', porcentaje: 15 },
  { nombre: 'Esquina 300', unidades: 100, ingresos: '850,00 EUR', porcentaje: 8 },
  { nombre: 'Pilar 30x30', unidades: 83, ingresos: '576,75 EUR', porcentaje: 7 },
]

const acciones = [
  { tipo: 'factura', texto: 'Factura FAC-2025-0084 marcada como pagada', hora: 'Hoy, 10:45' },
  { tipo: 'pedido', texto: 'Pedido #PED-2025-0125 actualizado', hora: 'Hoy, 09:32' },
  { tipo: 'cliente', texto: 'Nuevo cliente registrado: Laura Martinez', hora: 'Ayer, 18:20' },
  { tipo: 'alerta', texto: 'Factura FAC-2025-0078 anulada', hora: 'Ayer, 16:05' },
]

const menuAdmin = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'clientes', label: 'Clientes' },
  { id: 'productos', label: 'Productos' },
  { id: 'pedidos', label: 'Pedidos' },
  { id: 'facturacion', label: 'Facturacion' },
  { id: 'pagos', label: 'Pagos' },
  { id: 'informes', label: 'Informes' },
  { id: 'usuarios', label: 'Usuarios' },
]

function Facturacion() {
  return (
    <section className="billing-admin-page">
      {/* ====================================================================
          SIDEBAR IZQUIERDO - Branding, menú admin, caja de ayuda
          ==================================================================== */}
      <aside className="billing-sidebar">
        <div className="billing-brand">
          <strong>SquareStruct</strong>
          <span>Construccion modular</span>
        </div>

        <nav className="billing-menu" aria-label="Menu de administracion">
          {menuAdmin.map((item) => (
            <button
              className={`billing-menu-item${item.id === 'facturacion' ? ' active' : ''}`}
              type="button"
              key={item.id}
            >
              <span>{item.label.slice(0, 1)}</span>
              <strong>{item.label}</strong>
            </button>
          ))}
        </nav>

        <div className="billing-help-box">
          <strong>Necesitas ayuda?</strong>
          <p>Consulta nuestra guia rapida para revisar facturas y exportaciones.</p>
          <button className="btn" type="button">Ir a la guia</button>
        </div>
      </aside>

      {/* ====================================================================
          CONTENIDO PRINCIPAL
          - Barra superior con título y botones de acción
          - Métricas resumen (facturación total, # facturas, ticket medio, top producto)
          - Filtros (cliente, fecha, estado, método pago)
          - Panel facturas recientes (tabla con acciones)
          - Panel tendencias de compra (gráfico donut)
          - Panel productos más vendidos
          - Panel últimas acciones
          ==================================================================== */}
      <main className="billing-dashboard">
        <header className="billing-topbar">
          <div>
            <p className="eyebrow">Administracion</p>
            <h1>Panel de facturacion</h1>
            <p>Controla las facturas, los ingresos y las tendencias de compra de tus usuarios.</p>
          </div>

          <div className="billing-topbar-actions">
            <button className="btn billing-soft-btn" type="button">Actualizar</button>
            <button className="btn billing-soft-btn" type="button">Exportar</button>
            <button className="btn billing-primary-btn" type="button">Nueva factura</button>
          </div>
        </header>

        <section className="billing-metrics-grid">
          {/* Tarjetas de métricas principales: facturación, # facturas, ticket medio, top producto */}
          {metricas.map((metrica) => (
            <article className="billing-metric-card" key={metrica.titulo}>
              <span className="billing-metric-icon">{metrica.icono}</span>
              <div>
                <p>{metrica.titulo}</p>
                <strong>{metrica.valor}</strong>
                <small>{metrica.detalle}</small>
              </div>
            </article>
          ))}
        </section>

        {/* Barra de filtros: búsqueda de cliente, rango de fechas, estado, método de pago */}
        <section className="billing-filter-card">
          <input className="form-control" type="text" placeholder="Buscar cliente..." />
          <input className="form-control" type="text" value="01/05/2025 - 14/05/2025" readOnly />
          <select className="form-select" defaultValue="Todos">
            <option>Todos</option>
            <option>Pagada</option>
            <option>Pendiente</option>
          </select>
          <select className="form-select" defaultValue="Metodo de pago">
            <option>Metodo de pago</option>
            <option>VISA</option>
            <option>Bizum</option>
            <option>Transferencia</option>
          </select>
          <button className="btn billing-primary-btn" type="button">Filtrar</button>
        </section>

        {/* GRID DE 4 PANELES: Facturas | Tendencias | Productos Top | Últimas acciones */}
        <div className="billing-content-grid">
          {/* PANEL 1: Tabla de facturas recientes con estado, método de pago y acciones */}
          <section className="billing-panel billing-invoices-panel">
            <div className="billing-panel-head">
              <h2>Facturas recientes</h2>
              <button className="btn billing-soft-btn" type="button">Ver todas</button>
            </div>

            <div className="table-responsive">
              <table className="table billing-modern-table align-middle">
                <thead>
                  <tr>
                    <th># Factura</th>
                    <th>Cliente</th>
                    <th>Fecha</th>
                    <th>Productos</th>
                    <th>Total</th>
                    <th>Pago</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {facturas.map((factura) => (
                    <tr key={factura.id}>
                      <td>{factura.id}</td>
                      <td>{factura.cliente}</td>
                      <td>{factura.fecha}</td>
                      <td>{factura.productos}</td>
                      <td>{factura.total}</td>
                      <td>{factura.pago}</td>
                      <td>
                        <span className={`billing-status ${factura.estado === 'Pagada' ? 'paid' : 'pending'}`}>
                          {factura.estado}
                        </span>
                      </td>
                      <td>
                        <div className="billing-table-actions">
                          <button className="btn" type="button">Ver</button>
                          <button className="btn" type="button">PDF</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <nav className="billing-pagination" aria-label="Paginacion facturas">
              <button className="btn" type="button">&lt;</button>
              <button className="btn active" type="button">1</button>
              <button className="btn" type="button">2</button>
              <button className="btn" type="button">3</button>
              <button className="btn" type="button">&gt;</button>
            </nav>
          </section>

          {/* PANEL 2: Gráfico donut de tendencias de compra con leyenda de productos */}
          <section className="billing-panel billing-trends-panel">
            <div className="billing-panel-head">
              <h2>Tendencias de compra</h2>
              <button className="btn billing-soft-btn" type="button">Este mes</button>
            </div>

            <div className="billing-donut-row">
              <div className="billing-donut" aria-hidden="true">
                <div>
                  <span>Total</span>
                  <strong>1.245</strong>
                  <small>unidades</small>
                </div>
              </div>

              <ul className="billing-legend">
                {productos.map((producto) => (
                  <li key={producto.nombre}>
                    <span>{producto.nombre}</span>
                    <strong>{producto.porcentaje}%</strong>
                    <em>{producto.unidades} uds.</em>
                  </li>
                ))}
              </ul>
            </div>

            <button className="btn billing-report-btn" type="button">Ver informe completo</button>
          </section>

          {/* PANEL 3: Listado de productos más vendidos con barra de progreso (%) */}
          <section className="billing-panel">
            <div className="billing-panel-head">
              <h2>Productos mas vendidos</h2>
              <button className="btn billing-soft-btn" type="button">Ver todos</button>
            </div>

            <div className="billing-products-list">
              {productos.map((producto) => (
                <article key={producto.nombre}>
                  <span className="billing-product-thumb"></span>
                  <div>
                    <strong>{producto.nombre}</strong>
                    <small>{producto.unidades} unidades - {producto.ingresos}</small>
                  </div>
                  <div className="billing-progress">
                    <span style={{ width: `${producto.porcentaje}%` }}></span>
                  </div>
                  <em>{producto.porcentaje}%</em>
                </article>
              ))}
            </div>
          </section>

          {/* PANEL 4: Historial de últimas acciones del sistema (facturas, pedidos, clientes) */}
          <section className="billing-panel">
            <div className="billing-panel-head">
              <h2>Ultimas acciones</h2>
              <button className="btn billing-soft-btn" type="button">Ver todas</button>
            </div>

            <div className="billing-activity-list">
              {acciones.map((accion) => (
                <article key={accion.texto}>
                  <span className={`billing-activity-icon ${accion.tipo}`}>{accion.tipo.slice(0, 1)}</span>
                  <div>
                    <strong>{accion.texto}</strong>
                    <small>por Admin</small>
                  </div>
                  <time>{accion.hora}</time>
                </article>
              ))}
            </div>
          </section>
        </div>
      </main>
    </section>
  )
}

export default Facturacion
