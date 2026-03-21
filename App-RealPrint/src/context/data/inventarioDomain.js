/**
 * Construye operaciones del dominio inventario con fallback local.
 * Permite separar DataContext por dominios de forma incremental.
 */
export function createInventarioDomain({
  inventario,
  setInventario,
  inventarioService,
  useCreateService,
  useUpdateService,
  useDeleteService,
}) {
  const updateInventario = (id, updates) => {
    setInventario(inventario.map((i) => (i.id === id ? { ...i, ...updates } : i)));
  };

  const updateInventarioSafe = async (id, updates) => {
    if (!useUpdateService) {
      updateInventario(id, updates);
      return;
    }

    try {
      await inventarioService.update(id, updates);
      updateInventario(id, updates);
    } catch {
      updateInventario(id, updates);
    }
  };

  const addInventario = (item) => {
    const newItem = { ...item, id: Date.now(), usados: 0 };
    setInventario([...inventario, newItem]);
    return newItem;
  };

  const addInventarioSafe = async (item) => {
    if (!useCreateService) {
      return addInventario(item);
    }

    try {
      const created = await inventarioService.create(item);
      if (created && typeof created === "object" && created.id !== undefined) {
        setInventario([...inventario, { usados: 0, ...created }]);
        return created;
      }
      return addInventario(item);
    } catch {
      return addInventario(item);
    }
  };

  const deleteInventario = (id) => {
    setInventario(inventario.filter((i) => i.id !== id));
  };

  const deleteInventarioSafe = async (id) => {
    if (!useDeleteService) {
      deleteInventario(id);
      return;
    }

    try {
      await inventarioService.remove(id);
      deleteInventario(id);
    } catch {
      deleteInventario(id);
    }
  };

  return {
    updateInventario,
    updateInventarioSafe,
    addInventario,
    addInventarioSafe,
    deleteInventario,
    deleteInventarioSafe,
  };
}

