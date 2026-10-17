import { describe, it, expect } from 'vitest';
import { createPedidosDomain } from "./pedidosDomain";

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

describe('pedidosDomain', () => {
  it("transicion pendiente -> en_proceso -> pendiente ajusta stock y usados una sola vez", () => {
    const first = createHarness("pendiente");

    first.domain.updatePedido("p1", { estado: "en_proceso" });

    expect(first.inventario[0].stock).toBe(97);
    expect(first.inventario[0].usados).toBe(3);
    expect(first.getPedidos()[0].estado).toBe("en_proceso");

    const second = createHarness("en_proceso");
    second.inventario[0].stock = first.inventario[0].stock;
    second.inventario[0].usados = first.inventario[0].usados;

    second.domain.updatePedido("p1", { estado: "pendiente" });

    expect(second.inventario[0].stock).toBe(100);
    expect(second.inventario[0].usados).toBe(0);
    expect(second.getPedidos()[0].estado).toBe("pendiente");
  });

  it("transicion pendiente -> pendiente no mueve inventario ni usados", () => {
    const harness = createHarness("pendiente");

    harness.domain.updatePedido("p1", { estado: "pendiente" });

    expect(harness.inventario[0].stock).toBe(100);
    expect(harness.inventario[0].usados).toBe(0);
    expect(harness.getPedidos()[0].estado).toBe("pendiente");
  });

  it("transicion en_proceso -> completado mantiene inventario y usados", () => {
    const harness = createHarness("en_proceso");

    // Simula inventario ya consumido al entrar en en_proceso.
    harness.inventario[0].stock = 97;
    harness.inventario[0].usados = 3;

    harness.domain.updatePedido("p1", { estado: "completado" });

    expect(harness.inventario[0].stock).toBe(97);
    expect(harness.inventario[0].usados).toBe(3);
    expect(harness.getPedidos()[0].estado).toBe("completado");
  });

  it("agregar varios pedidos seguidos conserva todos los pedidos en estado", () => {
    const harness = createHarness("pendiente");

    harness.domain.addPedido({
      cliente: "Cliente A",
      productoFinalId: "pf-1",
      cantidad: 1,
      cantidadUnidades: 10,
      total: 10,
    });

    harness.domain.addPedido({
      cliente: "Cliente B",
      productoFinalId: "pf-1",
      cantidad: 1,
      cantidadUnidades: 20,
      total: 20,
    });

    const pedidos = harness.getPedidos();

    // p1 inicial + 2 nuevos pedidos
    expect(pedidos).toHaveLength(3);
    expect(pedidos.some((p) => p.cliente === "Cliente A")).toBe(true);
    expect(pedidos.some((p) => p.cliente === "Cliente B")).toBe(true);
  });

  it("producto en caja con cantidad > 1 crea un único pedido con boxTotal", () => {
    let pedidos = [];
    const inventario = [{ id: 10, stock: 100, usados: 0 }];
    const productosFinales = [{ id: "pf-caja", enCaja: true, tamanoCaja: 50, productosInventario: [10] }];

    const setPedidos = (next) => {
      pedidos = typeof next === "function" ? next(pedidos) : next;
    };

    const domain = createPedidosDomain({
      pedidos,
      setPedidos,
      tareas: [],
      setTareas: () => {},
      productosFinales,
      inventario,
      updateInventario: () => {},
      addTareaPorPedido: () => {},
      pedidosService: { create: async () => {}, update: async () => {}, remove: async () => {} },
      useCreateService: false,
      useUpdateService: false,
      useDeleteService: false,
    });

    domain.addPedido({
      cliente: "Cliente Caja",
      productoFinalId: "pf-caja",
      cantidad: 3,
      cantidadUnidades: 150,
      total: 1500,
      tamanoCaja: 50,
    });

    expect(pedidos).toHaveLength(1);
    expect(pedidos[0].boxTotal).toBe(3);
    expect(pedidos[0].cajasCompletadas).toBe(0);
    expect(pedidos[0].cantidad).toBe(3);
  });
});

describe("pedidosDomain *Safe - no deben caer en silencio a estado local si el backend falla", () => {
  function createHarnessConService(pedidosService) {
    let pedidos = [{ id: 1, estado: "pendiente", servicio: "serigrafia", total: null }];
    const setPedidos = (next) => {
      pedidos = typeof next === "function" ? next(pedidos) : next;
    };

    const domain = createPedidosDomain({
      pedidos,
      setPedidos,
      tareas: [],
      setTareas: () => {},
      productosFinales: [],
      inventario: [],
      updateInventario: () => {},
      addTareaPorPedido: () => {},
      pedidosService,
      useCreateService: true,
      useUpdateService: true,
      useDeleteService: true,
    });

    return { domain, getPedidos: () => pedidos };
  }

  it("createPedidoSafe propaga el error cuando la API falla (no crea un pedido fantasma local)", async () => {
    const harness = createHarnessConService({
      create: async () => { throw new Error("500 Internal Server Error"); },
      update: async () => ({}),
      remove: async () => {},
    });

    await expect(harness.domain.createPedidoSafe({ servicio: "serigrafia" })).rejects.toThrow();
    // No debe haberse anadido ningun pedido local de "emergencia".
    expect(harness.getPedidos()).toHaveLength(1);
  });

  it("updatePedidoSafe propaga el error cuando el PUT falla (p.ej. 400 por validacion)", async () => {
    const harness = createHarnessConService({
      create: async () => ({}),
      update: async () => { throw new Error("400 Bad Request"); },
      remove: async () => {},
    });

    await expect(harness.domain.updatePedidoSafe(1, { estado: "en_proceso" })).rejects.toThrow();
    // El pedido local no debe haberse modificado como si hubiera funcionado.
    expect(harness.getPedidos()[0].estado).toBe("pendiente");
  });

  it("updatePedidoSafe aplica localmente el pedido que confirma el backend cuando el PUT tiene exito", async () => {
    const pedidoActualizado = { id: 1, estado: "en_proceso", servicio: "serigrafia", total: null };
    const harness = createHarnessConService({
      create: async () => ({}),
      update: async () => pedidoActualizado,
      remove: async () => {},
    });

    const resultado = await harness.domain.updatePedidoSafe(1, { servicio: "serigrafia", estado: "en_proceso" });

    expect(resultado).toEqual(pedidoActualizado);
    expect(harness.getPedidos()[0].estado).toBe("en_proceso");
  });

  it("deletePedidoSafe propaga el error cuando el DELETE falla (el pedido sigue en la lista)", async () => {
    const harness = createHarnessConService({
      create: async () => ({}),
      update: async () => ({}),
      remove: async () => { throw new Error("500 Internal Server Error"); },
    });

    await expect(harness.domain.deletePedidoSafe(1)).rejects.toThrow();
    expect(harness.getPedidos()).toHaveLength(1);
  });
});
