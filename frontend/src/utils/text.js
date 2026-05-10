export const normalizarTexto = (value) => {
  if (typeof value !== 'string' || !/[ÃƒÆ’Ãƒâ€šÃ¯Â¿Â½]/.test(value)) {
    return value
  }

  try {
    const bytes = Uint8Array.from([...value].map((character) => character.charCodeAt(0)))
    return new TextDecoder('utf-8').decode(bytes)
  } catch {
    return value
  }
}

export const normalizarProducto = (product) => ({
  ...product,
  nombre: normalizarTexto(product.nombre),
  descripcion: normalizarTexto(product.descripcion),
  tipo: normalizarTexto(product.tipo),
  material: normalizarTexto(product.material)
})
