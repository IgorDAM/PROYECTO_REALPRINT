import { describe, it, expect } from 'vitest';
import { createDataValue } from "./createDataValue";

function fn() {
  return undefined;
}

describe('createDataValue', () => {
  it("mantiene el contrato publico (claves y referencias)", () => {
    const input = {
      productosFinales: [],
      pedidos: [],
      usuarios: [],
      setCatalogoEmpresa: fn,
      getCatalogoEmpresa: fn,
      createPedidoSafe: fn,
      updatePedidoSafe: fn,
      deletePedidoSafe: fn,
      addUsuarioSafe: fn,
      updateUsuarioSafe: fn,
      deleteUsuarioSafe: fn,
      getEstadisticas: fn,
    };

    const value = createDataValue(input);

    const expectedKeys = [
      "productosFinales",
      "pedidos",
      "usuarios",
      "setCatalogoEmpresa",
      "getCatalogoEmpresa",
      "createPedidoSafe",
      "updatePedidoSafe",
      "deletePedidoSafe",
      "addUsuarioSafe",
      "updateUsuarioSafe",
      "deleteUsuarioSafe",
      "getEstadisticas",
    ];

    expect(Object.keys(value)).toEqual(expectedKeys);

    expectedKeys.forEach((key) => {
      expect(value[key]).toBe(input[key]);
    });
  });
});

