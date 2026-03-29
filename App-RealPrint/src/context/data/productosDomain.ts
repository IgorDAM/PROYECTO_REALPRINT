type Entity = Record<string, any>;
type SetState<T> = (value: T | ((prev: T) => T)) => void;

interface ProductosDomainConfig {
  productosFinales: Entity[];
  setProductosFinales: SetState<Entity[]>;
}

interface ProductosDomainOps {
  addProductoFinal: (producto: Entity) => Entity;
  updateProductoFinal: (id: number | string, updates: Record<string, any>) => void;
  deleteProductoFinal: (id: number | string) => void;
}

/**
 * Construye operaciones del dominio productos finales.
 * Permite separar DataContext en piezas sin romper contrato publico.
 */
export function createProductosDomain({ productosFinales, setProductosFinales }: ProductosDomainConfig): ProductosDomainOps {
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


