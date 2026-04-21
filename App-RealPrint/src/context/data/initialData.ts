/**
 * Datos iniciales de la aplicación (semillas).
 * Extraídos de DataContext.jsx para mantener el provider limpio y legible.
 *
 * Este módulo centraliza:
 * - INITIAL_PRODUCTOS_FINALES: catálogo de productos finales por servicio.
 * - INITIAL_CATALOGOS_EMPRESA: catálogos de empresa por cliente.
 * - INITIAL_PEDIDOS: lista vacía de pedidos (legacy).
 * - INITIAL_INVENTARIO: materiales disponibles.
 * - INITIAL_USUARIOS: usuarios de demo/testing.
 * - INITIAL_TAREAS: lista vacía de tareas (legacy).
 */

type Entity = Record<string, any>;

export const INITIAL_PRODUCTOS_FINALES: Entity[] = [
];

export const INITIAL_CATALOGOS_EMPRESA: Record<string, any> = {
  4: {
    dtf: ["Camiseta", "Pantalón", "Chándal", "Anorak"],
  },
};

export const INITIAL_PEDIDOS: Entity[] = [];

export const INITIAL_INVENTARIO: Entity[] = [
];

export const INITIAL_USUARIOS: Entity[] = [
  { id: 1, username: "admin", password: "admin123", nombre: "Administrador", email: "admin@realprint.com", role: "admin", activo: true },
  { id: 2, username: "cliente", password: "cliente123", nombre: "Cliente Demo", email: "cliente@email.com", role: "cliente", activo: true },
];

export const INITIAL_TAREAS: Entity[] = [];
