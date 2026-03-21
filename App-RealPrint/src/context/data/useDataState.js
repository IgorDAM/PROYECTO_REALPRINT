import { useLocalStorageState } from "./useLocalStorageState";

/**
 * Centraliza el estado persistido de DataContext sin alterar su contrato publico.
 */
export function useDataState({
  initialProductosFinales,
  initialCatalogosEmpresa,
  initialPedidos,
  initialInventario,
  initialUsuarios,
  initialTareas,
}) {
  const [productosFinales, setProductosFinales] = useLocalStorageState(
    "realprint_productos_finales",
    initialProductosFinales,
  );

  const [catalogosEmpresa, setCatalogosEmpresa] = useLocalStorageState(
    "realprint_catalogos_empresa",
    initialCatalogosEmpresa,
  );

  const [pedidos, setPedidos] = useLocalStorageState("realprint_pedidos", initialPedidos);

  const [inventario, setInventario] = useLocalStorageState("realprint_inventario", initialInventario, {
    // Asegura que todos los productos mantengan el campo 'usados'.
    onRead: (base) => base.map((item) => ({ ...item, usados: typeof item.usados === "number" ? item.usados : 0 })),
  });

  const [usuarios, setUsuarios] = useLocalStorageState("realprint_usuarios", initialUsuarios);
  const [tareas, setTareas] = useLocalStorageState("realprint_tareas", initialTareas);

  return {
    productosFinales,
    setProductosFinales,
    catalogosEmpresa,
    setCatalogosEmpresa,
    pedidos,
    setPedidos,
    inventario,
    setInventario,
    usuarios,
    setUsuarios,
    tareas,
    setTareas,
  };
}

