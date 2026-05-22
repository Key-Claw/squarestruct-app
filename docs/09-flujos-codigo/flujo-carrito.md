# Flujo Carrito

## Entrada

El carrito empieza en `Catalog.jsx`, cuando el usuario pulsa anadir sobre un producto.

## Procesamiento

1. `Catalog.jsx` llama a `onAddToCart`.
2. `App.jsx` recibe el producto en `handleAddToCart`.
3. Si el producto ya existe, aumenta `cantidad`.
4. Si no existe, lo anade con `cantidad: 1`.
5. `CartPanel` se abre para mostrar el carrito.

## Renderizado

`frontend/src/components/layout/CartPanel.jsx` muestra productos, cantidades, eliminacion y total. El estado real vive en `App.jsx`, no en base de datos.

## Checkout

1. El usuario pulsa checkout.
2. Si no hay usuario, se abre login y queda marcada la compra pendiente.
3. Al iniciar sesion, se abre `Checkout`.
4. `Checkout.jsx` valida datos y llama a `orderService.crearPedido`.
5. Si el backend crea el pedido, `App.jsx` vacia el carrito y navega a facturas.

## Como Defenderlo

El carrito es estado temporal de interfaz. El pedido empieza a existir de verdad cuando se envia al backend y se guarda en MySQL.
