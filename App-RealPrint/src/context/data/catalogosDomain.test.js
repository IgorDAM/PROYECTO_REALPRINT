import { describe, it, expect } from 'vitest';

// Mock de catalogosDomain para testing
function createMockCatalogosDomain(catalogos = {}) {
  return {
    catalogos,
    getServicios: () => {
      return catalogos.servicios || [];
    },
    getMateriales: () => {
      return catalogos.materiales || [];
    },
    getColores: () => {
      return catalogos.colores || [];
    },
    agregarServicio: (servicio) => {
      if (!catalogos.servicios) catalogos.servicios = [];
      if (!catalogos.servicios.includes(servicio)) {
        catalogos.servicios.push(servicio);
      }
    },
    agregarMaterial: (material) => {
      if (!catalogos.materiales) catalogos.materiales = [];
      if (!catalogos.materiales.includes(material)) {
        catalogos.materiales.push(material);
      }
    },
    validarServicio: (servicio) => {
      return (catalogos.servicios || []).includes(servicio);
    }
  };
}

describe('catalogosDomain', () => {
  it('debe retornar lista de servicios', () => {
    const catalogos = {
      servicios: ['Serigrafía', 'Rotulación', 'Bordado'],
      materiales: [],
      colores: [],
    };

    const domain = createMockCatalogosDomain(catalogos);
    const servicios = domain.getServicios();

    expect(servicios).toContain('Serigrafía');
    expect(servicios).toHaveLength(3);
  });

  it('debe retornar lista de materiales', () => {
    const catalogos = {
      servicios: [],
      materiales: ['Camiseta', 'Gorro', 'Mochila'],
      colores: [],
    };

    const domain = createMockCatalogosDomain(catalogos);
    const materiales = domain.getMateriales();

    expect(materiales).toContain('Camiseta');
    expect(materiales).toHaveLength(3);
  });

  it('debe retornar lista de colores', () => {
    const catalogos = {
      servicios: [],
      materiales: [],
      colores: ['Rojo', 'Azul', 'Negro', 'Blanco'],
    };

    const domain = createMockCatalogosDomain(catalogos);
    const colores = domain.getColores();

    expect(colores).toContain('Azul');
    expect(colores).toHaveLength(4);
  });

  it('debe agregar nuevo servicio al catálogo', () => {
    const catalogos = {
      servicios: ['Serigrafía', 'Rotulación'],
      materiales: [],
      colores: [],
    };

    const domain = createMockCatalogosDomain(catalogos);
    domain.agregarServicio('Bordado');

    expect(domain.getServicios()).toContain('Bordado');
    expect(domain.getServicios()).toHaveLength(3);
  });

  it('debe agregar nuevo material al catálogo', () => {
    const catalogos = {
      servicios: [],
      materiales: ['Camiseta', 'Gorro'],
      colores: [],
    };

    const domain = createMockCatalogosDomain(catalogos);
    domain.agregarMaterial('Mochila');

    expect(domain.getMateriales()).toContain('Mochila');
    expect(domain.getMateriales()).toHaveLength(3);
  });

  it('debe validar si un servicio existe en el catálogo', () => {
    const catalogos = {
      servicios: ['Serigrafía', 'Rotulación'],
      materiales: [],
      colores: [],
    };

    const domain = createMockCatalogosDomain(catalogos);

    expect(domain.validarServicio('Serigrafía')).toBe(true);
    expect(domain.validarServicio('Bordado')).toBe(false);
  });

  it('debe evitar duplicados al agregar servicios', () => {
    const catalogos = {
      servicios: ['Serigrafía'],
      materiales: [],
      colores: [],
    };

    const domain = createMockCatalogosDomain(catalogos);
    domain.agregarServicio('Serigrafía');
    domain.agregarServicio('Serigrafía');

    expect(domain.getServicios()).toHaveLength(1);
  });
});

