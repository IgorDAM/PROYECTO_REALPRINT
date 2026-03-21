import test from "node:test";
import assert from "node:assert/strict";
import { createDataValue } from "./createDataValue.js";

function fn() {
  return undefined;
}

test("createDataValue mantiene el contrato publico (claves y referencias)", () => {
  const input = {
    productosFinales: [],
    setProductosFinales: fn,
    addProductoFinal: fn,
    updateProductoFinal: fn,
    deleteProductoFinal: fn,
    pedidos: [],
    inventario: [],
    usuarios: [],
    tareas: [],
    catalogosEmpresa: {},
    setCatalogoEmpresa: fn,
    getCatalogoEmpresa: fn,
    addPedido: fn,
    createPedidoSafe: fn,
    updatePedido: fn,
    updatePedidoSafe: fn,
    deletePedido: fn,
    deletePedidoSafe: fn,
    updateInventario: fn,
    updateInventarioSafe: fn,
    addInventario: fn,
    addInventarioSafe: fn,
    deleteInventario: fn,
    deleteInventarioSafe: fn,
    addUsuario: fn,
    addUsuarioSafe: fn,
    updateUsuario: fn,
    updateUsuarioSafe: fn,
    deleteUsuario: fn,
    deleteUsuarioSafe: fn,
    updateTarea: fn,
    getEstadisticas: fn,
  };

  const value = createDataValue(input);

  const expectedKeys = [
    "productosFinales",
    "setProductosFinales",
    "addProductoFinal",
    "updateProductoFinal",
    "deleteProductoFinal",
    "pedidos",
    "inventario",
    "usuarios",
    "tareas",
    "catalogosEmpresa",
    "setCatalogoEmpresa",
    "getCatalogoEmpresa",
    "addPedido",
    "createPedidoSafe",
    "updatePedido",
    "updatePedidoSafe",
    "deletePedido",
    "deletePedidoSafe",
    "updateInventario",
    "updateInventarioSafe",
    "addInventario",
    "addInventarioSafe",
    "deleteInventario",
    "deleteInventarioSafe",
    "addUsuario",
    "addUsuarioSafe",
    "updateUsuario",
    "updateUsuarioSafe",
    "deleteUsuario",
    "deleteUsuarioSafe",
    "updateTarea",
    "getEstadisticas",
  ];

  assert.deepEqual(Object.keys(value), expectedKeys);

  expectedKeys.forEach((key) => {
    assert.strictEqual(value[key], input[key]);
  });
});

