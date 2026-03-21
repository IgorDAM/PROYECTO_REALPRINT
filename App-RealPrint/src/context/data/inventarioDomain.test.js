import test from "node:test";
import assert from "node:assert/strict";
import { createInventarioDomain } from "./inventarioDomain.js";

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

test("inventarioDomain: addInventarioSafe usa fallback local cuando servicio falla", async () => {
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

  assert.strictEqual(inventario.length, 2);
  assert.strictEqual(result.nombre, "Item nuevo");
  assert.strictEqual(result.stock, 5);
  assert.strictEqual(result.usados, 0);
});

test("inventarioDomain: updateInventarioSafe usa fallback local cuando servicio falla", async () => {
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

  assert.strictEqual(inventario[0].stock, 20);
  assert.strictEqual(inventario[0].usados, 5);
});

test("inventarioDomain: deleteInventarioSafe usa fallback local cuando servicio falla", async () => {
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

  assert.strictEqual(inventario.length, 1);
  assert.strictEqual(inventario[0].id, 2);
});

