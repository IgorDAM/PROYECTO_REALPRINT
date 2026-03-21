/**
 * Construye operaciones del dominio productos finales.
 * Permite separar DataContext en piezas sin romper contrato publico.
 */
export function createProductosDomain({ productosFinales, setProductosFinales }) {
  const addProductoFinal = (producto) => {
    const newProducto = { ...producto, id: Date.now() };
    setProductosFinales([...productosFinales, newProducto]);
    return newProducto;
  };

  const updateProductoFinal = (id, updates) => {
    setProductosFinales(productosFinales.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };

  const deleteProductoFinal = (id) => {
    setProductosFinales(productosFinales.filter((p) => p.id !== id));
  };

  return {
    addProductoFinal,
    updateProductoFinal,
    deleteProductoFinal,
  };
}

