import { describe, it, expect } from 'vitest';
import { createUsuariosDomain } from "./usuariosDomain.js";

function createMockService(shouldFail = false) {
  return {
    create: async () => {
      if (shouldFail) throw new Error("Service failed");
      return { id: 999, username: "newuser", nombre: "Usuario creado" };
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

describe('usuariosDomain', () => {
  it("addUsuarioSafe usa fallback local cuando servicio falla", async () => {
    let usuarios = [
      { id: 1, username: "admin", nombre: "Admin", activo: true },
    ];

    const setUsuarios = (next) => {
      usuarios = typeof next === "function" ? next(usuarios) : next;
    };

    const mockService = createMockService(true);

    const domain = createUsuariosDomain({
      usuarios,
      setUsuarios,
      usuariosService: mockService,
      useCreateService: true,
      useUpdateService: false,
      useDeleteService: false,
    });

    const result = await domain.addUsuarioSafe({ username: "newuser", nombre: "Nuevo Usuario" });

    expect(usuarios.length).toBe(2);
    expect(result.username).toBe("newuser");
    expect(result.nombre).toBe("Nuevo Usuario");
    expect(result.activo).toBe(true);
  });

  it("updateUsuarioSafe usa fallback local cuando servicio falla", async () => {
    let usuarios = [
      { id: 1, username: "admin", nombre: "Admin", activo: true },
    ];

    const setUsuarios = (next) => {
      usuarios = typeof next === "function" ? next(usuarios) : next;
    };

    const mockService = createMockService(true);

    const domain = createUsuariosDomain({
      usuarios,
      setUsuarios,
      usuariosService: mockService,
      useCreateService: false,
      useUpdateService: true,
      useDeleteService: false,
    });

    await domain.updateUsuarioSafe(1, { nombre: "Admin Actualizado", activo: false });

    expect(usuarios[0].nombre).toBe("Admin Actualizado");
    expect(usuarios[0].activo).toBe(false);
  });

  it("deleteUsuarioSafe usa fallback local cuando servicio falla", async () => {
    let usuarios = [
      { id: 1, username: "admin", nombre: "Admin", activo: true },
      { id: 2, username: "cliente", nombre: "Cliente", activo: true },
    ];

    const setUsuarios = (next) => {
      usuarios = typeof next === "function" ? next(usuarios) : next;
    };

    const mockService = createMockService(true);

    const domain = createUsuariosDomain({
      usuarios,
      setUsuarios,
      usuariosService: mockService,
      useCreateService: false,
      useUpdateService: false,
      useDeleteService: true,
    });

    await domain.deleteUsuarioSafe(1);

    expect(usuarios.length).toBe(1);
    expect(usuarios[0].id).toBe(2);
  });
});

