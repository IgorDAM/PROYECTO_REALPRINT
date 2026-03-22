import { describe, it, expect } from 'vitest';

describe('tareasDomain', () => {
  function createMockTareasDomain(tareas = []) {
    return {
      tareas,
      updateTarea: (id, updates) => {
        const index = tareas.findIndex(t => t.id === id);
        if (index !== -1) {
          tareas[index] = { ...tareas[index], ...updates };
        }
      },
      getTareasPorEstado: (estado) => {
        return tareas.filter(t => t.estado === estado);
      },
      getTareasPorOperario: (operarioId) => {
        return tareas.filter(t => t.operario_id === operarioId);
      }
    };
  }

  it('debe filtrar tareas por estado', () => {
    const tareas = [
      { id: '1', titulo: 'Serigrafía - Pedido 101', estado: 'pendiente', operario_id: '1' },
      { id: '2', titulo: 'Rotulación - Pedido 102', estado: 'en_proceso', operario_id: '2' },
      { id: '3', titulo: 'Bordado - Pedido 103', estado: 'pendiente', operario_id: '1' },
    ];

    const domain = createMockTareasDomain(tareas);
    const pendientes = domain.getTareasPorEstado('pendiente');

    expect(pendientes).toHaveLength(2);
    expect(pendientes[0].titulo).toContain('Serigrafía');
    expect(pendientes[1].titulo).toContain('Bordado');
  });

  it('debe actualizar tarea de pendiente a en_proceso', () => {
    const tareas = [
      { id: '1', titulo: 'Serigrafía', estado: 'pendiente', operario_id: '1' },
    ];

    const domain = createMockTareasDomain(tareas);
    domain.updateTarea('1', { estado: 'en_proceso' });

    expect(domain.tareas[0].estado).toBe('en_proceso');
    expect(domain.tareas[0].titulo).toBe('Serigrafía');
  });

  it('debe marcar tarea como completada', () => {
    const tareas = [
      { id: '1', titulo: 'Rotulación', estado: 'en_proceso', operario_id: '2' },
    ];

    const domain = createMockTareasDomain(tareas);
    domain.updateTarea('1', { estado: 'completada' });

    expect(domain.tareas[0].estado).toBe('completada');
  });

  it('debe filtrar tareas por operario', () => {
    const tareas = [
      { id: '1', titulo: 'Tarea 1', estado: 'pendiente', operario_id: '1' },
      { id: '2', titulo: 'Tarea 2', estado: 'pendiente', operario_id: '2' },
      { id: '3', titulo: 'Tarea 3', estado: 'en_proceso', operario_id: '1' },
    ];

    const domain = createMockTareasDomain(tareas);
    const tareasOperario1 = domain.getTareasPorOperario('1');

    expect(tareasOperario1).toHaveLength(2);
    expect(tareasOperario1[0].id).toBe('1');
    expect(tareasOperario1[1].id).toBe('3');
  });
});
