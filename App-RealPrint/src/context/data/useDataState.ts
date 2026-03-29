import type { Dispatch, SetStateAction } from "react";
import { useLocalStorageState } from "./useLocalStorageState";

type Entity = Record<string, any>;
type CatalogosEmpresa = Record<string, any>;

interface InventarioItem extends Entity {
  usados?: number;
}

interface UseDataStateInput {
  initialProductosFinales: Entity[];
  initialCatalogosEmpresa: CatalogosEmpresa;
  initialPedidos: Entity[];
  initialInventario: InventarioItem[];
  initialUsuarios: Entity[];
  initialTareas: Entity[];
}

interface UseDataStateResult {
  productosFinales: Entity[];
  setProductosFinales: Dispatch<SetStateAction<Entity[]>>;
  catalogosEmpresa: CatalogosEmpresa;
  setCatalogosEmpresa: Dispatch<SetStateAction<CatalogosEmpresa>>;
  pedidos: Entity[];
  setPedidos: Dispatch<SetStateAction<Entity[]>>;
  inventario: InventarioItem[];
  setInventario: Dispatch<SetStateAction<InventarioItem[]>>;
  usuarios: Entity[];
  setUsuarios: Dispatch<SetStateAction<Entity[]>>;
  tareas: Entity[];
  setTareas: Dispatch<SetStateAction<Entity[]>>;
}

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
}: UseDataStateInput): UseDataStateResult {
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
    onRead: (base, fallbackValue) => {
      if (!Array.isArray(base)) return fallbackValue;
      return base.map((item) => {
        if (!item || typeof item !== "object") return { usados: 0 } as InventarioItem;
        const entity = item as InventarioItem;
        return {
          ...entity,
          usados: typeof entity.usados === "number" ? entity.usados : 0,
        };
      });
    },
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


