import { describe, it, expect } from 'vitest';

// Mock de estadísticasDomain para testing
function createMockEstadisticasDomain(pedidos = [], inventario = [], usuarios = []) {
  return {
    pedidos,
    inventario,
    usuarios,
    getTotalPedidos: () => pedidos.length,
    getPedidosPorEstado: (estado) => {
      return pedidos.filter(p => p.estado === estado).length;
    },
    getStockTotal: () => {
      return inventario.reduce((sum, item) => sum + (item.stock || 0), 0);
    },
    getItemsConsumidos: () => {
      return inventario.reduce((sum, item) => sum + (item.usados || 0), 0);
    },
    getTotalUsuarios: () => usuarios.length,
    getUsuariosPorRol: (rol) => {
      return usuarios.filter(u => u.role === rol).length;
    },
    calcularTasaCompletitud: () => {
      const completados = pedidos.filter(p => p.estado === 'completada').length;
      return pedidos.length > 0 ? (completados / pedidos.length) * 100 : 0;
    }
  };
}

describe('estadisticasDomain', () => {
  it('debe calcular total de pedidos', () => {
    const pedidos = [
      { id: '1', estado: 'pendiente' },
      { id: '2', estado: 'en_proceso' },
      { id: '3', estado: 'completada' },
    ];

    const domain = createMockEstadisticasDomain(pedidos);
    const total = domain.getTotalPedidos();

    expect(total).toBe(3);
  });

  it('debe contar pedidos por estado', () => {
    const pedidos = [
      { id: '1', estado: 'pendiente' },
      { id: '2', estado: 'pendiente' },
      { id: '3', estado: 'en_proceso' },
      { id: '4', estado: 'completada' },
    ];

    const domain = createMockEstadisticasDomain(pedidos);

    expect(domain.getPedidosPorEstado('pendiente')).toBe(2);
    expect(domain.getPedidosPorEstado('en_proceso')).toBe(1);
    expect(domain.getPedidosPorEstado('completada')).toBe(1);
  });

  it('debe calcular stock total de inventario', () => {
    const inventario = [
      { id: 1, nombre: 'Item 1', stock: 100, usados: 10 },
      { id: 2, nombre: 'Item 2', stock: 50, usados: 5 },
      { id: 3, nombre: 'Item 3', stock: 200, usados: 0 },
    ];

    const domain = createMockEstadisticasDomain([], inventario);
    const total = domain.getStockTotal();

    expect(total).toBe(350);
  });

  it('debe calcular items consumidos del inventario', () => {
    const inventario = [
      { id: 1, nombre: 'Item 1', stock: 100, usados: 10 },
      { id: 2, nombre: 'Item 2', stock: 50, usados: 5 },
      { id: 3, nombre: 'Item 3', stock: 200, usados: 25 },
    ];

    const domain = createMockEstadisticasDomain([], inventario);
    const consumidos = domain.getItemsConsumidos();

    expect(consumidos).toBe(40);
  });

  it('debe contar total de usuarios', () => {
    const usuarios = [
      { id: 1, username: 'admin', role: 'admin' },
      { id: 2, username: 'operario1', role: 'operario' },
      { id: 3, username: 'cliente1', role: 'cliente' },
    ];

    const domain = createMockEstadisticasDomain([], [], usuarios);
    const total = domain.getTotalUsuarios();

    expect(total).toBe(3);
  });

  it('debe contar usuarios por rol', () => {
    const usuarios = [
      { id: 1, username: 'admin', role: 'admin' },
      { id: 2, username: 'operario1', role: 'operario' },
      { id: 3, username: 'operario2', role: 'operario' },
      { id: 4, username: 'cliente1', role: 'cliente' },
    ];

    const domain = createMockEstadisticasDomain([], [], usuarios);

    expect(domain.getUsuariosPorRol('admin')).toBe(1);
    expect(domain.getUsuariosPorRol('operario')).toBe(2);
    expect(domain.getUsuariosPorRol('cliente')).toBe(1);
  });

  it('debe calcular tasa de completitud de pedidos', () => {
    const pedidos = [
      { id: '1', estado: 'completada' },
      { id: '2', estado: 'completada' },
      { id: '3', estado: 'pendiente' },
      { id: '4', estado: 'pendiente' },
    ];

    const domain = createMockEstadisticasDomain(pedidos);
    const tasa = domain.calcularTasaCompletitud();

    // 2 completados de 4 = 50%
    expect(tasa).toBe(50);
  });

  it('debe retornar 0 en tasa de completitud si no hay pedidos', () => {
    const domain = createMockEstadisticasDomain([]);
    const tasa = domain.calcularTasaCompletitud();

    expect(tasa).toBe(0);
  });

  it('debe retornar 100% si todos los pedidos están completados', () => {
    const pedidos = [
      { id: '1', estado: 'completada' },
      { id: '2', estado: 'completada' },
      { id: '3', estado: 'completada' },
    ];

    const domain = createMockEstadisticasDomain(pedidos);
    const tasa = domain.calcularTasaCompletitud();

    expect(tasa).toBe(100);
  });
});

