import { describe, it, expect } from 'vitest';
import { createInventarioDomain } from "./inventarioDomain";

function createMockService(shouldFail = false) {
  return {
    create: async () => {
      if (shouldFail) throw new Error("Service failed");
      return { id: 999, nombre: "Item creado" };
    },
    update: async () => {
      if (shouldFail) throw new Error("Service failed");
      return {};
    },
    remove: async () => {
      if (shouldFail) throw new Error("Service failed");
      return {};
    },
  };
}

describe('inventarioDomain', () => {
  it("addInventarioSafe usa fallback local cuando servicio falla", async () => {
    let inventario = [
      { id: 1, nombre: "Item 1", stock: 10, usados: 0 },
    ];

    const setInventario = (next) => {
      inventario = typeof next === "function" ? next(inventario) : next;
    };

    const mockService = createMockService(true);

    const domain = createInventarioDomain({
      inventario,
      setInventario,
      inventarioService: mockService,
      useCreateService: true,
      useUpdateService: false,
      useDeleteService: false,
    });

    const result = await domain.addInventarioSafe({ nombre: "Item nuevo", stock: 5 });

    expect(inventario.length).toBe(2);
    expect(result.nombre).toBe("Item nuevo");
    expect(result.stock).toBe(5);
    expect(result.usados).toBe(0);
  });

  it("updateInventarioSafe usa fallback local cuando servicio falla", async () => {
    let inventario = [
      { id: 1, nombre: "Item 1", stock: 10, usados: 0 },
    ];

    const setInventario = (next) => {
      inventario = typeof next === "function" ? next(inventario) : next;
    };

    const mockService = createMockService(true);

    const domain = createInventarioDomain({
      inventario,
      setInventario,
      inventarioService: mockService,
      useCreateService: false,
      useUpdateService: true,
      useDeleteService: false,
    });

    await domain.updateInventarioSafe(1, { stock: 20, usados: 5 });

    expect(inventario[0].stock).toBe(20);
    expect(inventario[0].usados).toBe(5);
  });

  it("deleteInventarioSafe usa fallback local cuando servicio falla", async () => {
    let inventario = [
      { id: 1, nombre: "Item 1", stock: 10, usados: 0 },
      { id: 2, nombre: "Item 2", stock: 5, usados: 0 },
    ];

    const setInventario = (next) => {
      inventario = typeof next === "function" ? next(inventario) : next;
    };

    const mockService = createMockService(true);

    const domain = createInventarioDomain({
      inventario,
      setInventario,
      inventarioService: mockService,
      useCreateService: false,
      useUpdateService: false,
      useDeleteService: true,
    });

    await domain.deleteInventarioSafe(1);

    expect(inventario.length).toBe(1);
    expect(inventario[0].id).toBe(2);
  });
});

