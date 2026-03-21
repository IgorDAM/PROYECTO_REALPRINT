import test from "node:test";
import assert from "node:assert/strict";
import { createPedidosDomain } from "./pedidosDomain.js";

function createHarness(initialEstado = "pendiente") {
  let pedidos = [
    {
      id: "p1",
      estado: initialEstado,
      productoFinalId: "pf-1",
      cantidad: 3,
    },
  ];

  const inventario = [
    {
      id: 10,
      stock: 100,
      usados: 0,
    },
  ];

  const productosFinales = [
    {
      id: "pf-1",
      productosInventario: [10],
    },
  ];

  const setPedidos = (next) => {
    pedidos = typeof next === "function" ? next(pedidos) : next;
  };

  const updateInventario = (id, updates) => {
    const index = inventario.findIndex((item) => item.id == id);
    if (index === -1) return;
    inventario[index] = { ...inventario[index], ...updates };
  };

  const domain = createPedidosDomain({
    pedidos,
    setPedidos,
    tareas: [],
    setTareas: () => {},
    productosFinales,
    inventario,
    updateInventario,
    addTareaPorPedido: () => {},
    pedidosService: { create: async () => {}, update: async () => {}, remove: async () => {} },
    useCreateService: false,
    useUpdateService: false,
    useDeleteService: false,
  });

  return {
    domain,
    getPedidos: () => pedidos,
    inventario,
  };
}

test("transicion pendiente -> en_proceso -> pendiente ajusta stock y usados una sola vez", () => {
  const first = createHarness("pendiente");

  first.domain.updatePedido("p1", { estado: "en_proceso" });

  assert.equal(first.inventario[0].stock, 97);
  assert.equal(first.inventario[0].usados, 3);
  assert.equal(first.getPedidos()[0].estado, "en_proceso");

  const second = createHarness("en_proceso");
  second.inventario[0].stock = first.inventario[0].stock;
  second.inventario[0].usados = first.inventario[0].usados;

  second.domain.updatePedido("p1", { estado: "pendiente" });

  assert.equal(second.inventario[0].stock, 100);
  assert.equal(second.inventario[0].usados, 0);
  assert.equal(second.getPedidos()[0].estado, "pendiente");
});

test("transicion pendiente -> pendiente no mueve inventario ni usados", () => {
  const harness = createHarness("pendiente");

  harness.domain.updatePedido("p1", { estado: "pendiente" });

  assert.equal(harness.inventario[0].stock, 100);
  assert.equal(harness.inventario[0].usados, 0);
  assert.equal(harness.getPedidos()[0].estado, "pendiente");
});

test("transicion en_proceso -> completado mantiene inventario y usados", () => {
  const harness = createHarness("en_proceso");

  // Simula inventario ya consumido al entrar en en_proceso.
  harness.inventario[0].stock = 97;
  harness.inventario[0].usados = 3;

  harness.domain.updatePedido("p1", { estado: "completado" });

  assert.equal(harness.inventario[0].stock, 97);
  assert.equal(harness.inventario[0].usados, 3);
  assert.equal(harness.getPedidos()[0].estado, "completado");
});

