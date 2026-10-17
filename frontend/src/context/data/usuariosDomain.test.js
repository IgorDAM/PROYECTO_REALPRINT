import { describe, it, expect } from 'vitest';
import { createUsuariosDomain } from "./usuariosDomain";

function createMockService(shouldFail = false) {
  return {
    create: async () => {
      if (shouldFail) throw new Error("Service failed");
      return { id: 999, username: "newuser", nombre: "Usuario creado" };
    },
    update: async () => {
      if (shouldFail) throw new Error("Service failed");
      return { id: 1, username: "admin", nombre: "Admin Actualizado", activo: false };
    },
    remove: async () => {
      if (shouldFail) throw new Error("Service failed");
      return {};
    },
  };
}

describe('usuariosDomain', () => {
  it("addUsuarioSafe aplica localmente el usuario creado cuando el servicio tiene exito", async () => {
    let usuarios = [
      { id: 1, username: "admin", nombre: "Admin", activo: true },
    ];

    const setUsuarios = (next) => {
      usuarios = typeof next === "function" ? next(usuarios) : next;
    };

    const mockService = createMockService(false);

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
    expect(result.nombre).toBe("Usuario creado");
    expect(result.activo).toBe(true);
  });

  // IMPORTANTE: ya NO debe haber un fallback local silencioso cuando el backend
  // falla (eso hacia parecer que la operacion funciono cuando en realidad el
  // dato nunca llego al servidor). Ahora el error debe propagarse para que la
  // pantalla que llama (via useApiStatus().runApi) lo muestre de verdad.
  it("addUsuarioSafe propaga el error cuando el servicio falla (no crea un usuario fantasma local)", async () => {
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

    await expect(domain.addUsuarioSafe({ username: "newuser", nombre: "Nuevo Usuario" })).rejects.toThrow();
    expect(usuarios.length).toBe(1);
  });

  it("updateUsuarioSafe aplica localmente el usuario que confirma el backend cuando el PUT tiene exito", async () => {
    let usuarios = [
      { id: 1, username: "admin", nombre: "Admin", activo: true },
    ];

    const setUsuarios = (next) => {
      usuarios = typeof next === "function" ? next(usuarios) : next;
    };

    const mockService = createMockService(false);

    const domain = createUsuariosDomain({
      usuarios,
      setUsuarios,
      usuariosService: mockService,
      useCreateService: false,
      useUpdateService: true,
      useDeleteService: false,
    });

    await domain.updateUsuarioSafe(1, { username: "admin", nombre: "Admin Actualizado", activo: false });

    expect(usuarios[0].nombre).toBe("Admin Actualizado");
    expect(usuarios[0].activo).toBe(false);
  });

  it("updateUsuarioSafe propaga el error cuando el servicio falla (el usuario local no cambia)", async () => {
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

    await expect(domain.updateUsuarioSafe(1, { username: "admin", nombre: "Admin Actualizado", activo: false })).rejects.toThrow();
    expect(usuarios[0].nombre).toBe("Admin");
    expect(usuarios[0].activo).toBe(true);
  });

  it("deleteUsuarioSafe elimina localmente cuando el servicio tiene exito", async () => {
    let usuarios = [
      { id: 1, username: "admin", nombre: "Admin", activo: true },
      { id: 2, username: "cliente", nombre: "Cliente", activo: true },
    ];

    const setUsuarios = (next) => {
      usuarios = typeof next === "function" ? next(usuarios) : next;
    };

    const mockService = createMockService(false);

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

  it("deleteUsuarioSafe propaga el error cuando el servicio falla (el usuario sigue en la lista)", async () => {
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

    await expect(domain.deleteUsuarioSafe(1)).rejects.toThrow();
    expect(usuarios.length).toBe(2);
  });
});
