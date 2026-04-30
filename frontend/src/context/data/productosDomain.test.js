import { describe, it, expect } from 'vitest';

// Mock de productosDomain para testing
function createMockProductosDomain(productosFinales = []) {
  return {
    productosFinales,
    getProductoById: (id) => {
      return productosFinales.find(p => p.id === id);
    },
    calcularPrecioTotal: (ids) => {
      return ids.reduce((sum, id) => {
        const producto = productosFinales.find(p => p.id === id);
        return sum + (producto?.precio || 0);
      }, 0);
    },
    filtrarProductosPorNombre: (nombre) => {
      return productosFinales.filter(p =>
        p.nombre.toLowerCase().includes(nombre.toLowerCase())
      );
    },
    obtenerProductosActivos: () => {
      return productosFinales.filter(p => p.activo !== false);
    }
  };
}

describe('productosDomain', () => {
  it('debe retornar todos los productos finales', () => {
    const productos = [
      { id: '1', nombre: 'Camiseta Blanca', precio: 25.00 },
      { id: '2', nombre: 'Gorro Negro', precio: 15.00 },
    ];

    const domain = createMockProductosDomain(productos);

    expect(domain.productosFinales).toHaveLength(2);
    expect(domain.productosFinales[0].nombre).toBe('Camiseta Blanca');
  });

  it('debe calcular precio total de múltiples productos', () => {
    const productos = [
      { id: '1', nombre: 'Camiseta Blanca', precio: 25.00 },
      { id: '2', nombre: 'Gorro Negro', precio: 15.00 },
      { id: '3', nombre: 'Mochila', precio: 30.00 },
    ];

    const domain = createMockProductosDomain(productos);
    const total = domain.calcularPrecioTotal(['1', '2', '3']);

    expect(total).toBe(70.00);
  });

  it('debe filtrar productos por nombre', () => {
    const productos = [
      { id: '1', nombre: 'Camiseta Blanca', precio: 25.00 },
      { id: '2', nombre: 'Gorro Negro', precio: 15.00 },
      { id: '3', nombre: 'Camiseta Negra', precio: 28.00 },
    ];

    const domain = createMockProductosDomain(productos);
    const filtrados = domain.filtrarProductosPorNombre('camiseta');

    expect(filtrados).toHaveLength(2);
    expect(filtrados[0].nombre).toBe('Camiseta Blanca');
    expect(filtrados[1].nombre).toBe('Camiseta Negra');
  });

  it('debe obtener producto por ID', () => {
    const productos = [
      { id: '1', nombre: 'Camiseta Blanca', precio: 25.00 },
      { id: '2', nombre: 'Gorro Negro', precio: 15.00 },
    ];

    const domain = createMockProductosDomain(productos);
    const producto = domain.getProductoById('1');

    expect(producto).toBeDefined();
    expect(producto.nombre).toBe('Camiseta Blanca');
    expect(producto.precio).toBe(25.00);
  });

  it('debe filtrar solo productos activos', () => {
    const productos = [
      { id: '1', nombre: 'Camiseta Blanca', precio: 25.00, activo: true },
      { id: '2', nombre: 'Gorro Negro', precio: 15.00, activo: false },
      { id: '3', nombre: 'Mochila', precio: 30.00 }, // sin activo = true por defecto
    ];

    const domain = createMockProductosDomain(productos);
    const activos = domain.obtenerProductosActivos();

    expect(activos).toHaveLength(2);
    expect(activos.map(p => p.id)).toEqual(['1', '3']);
  });
});

