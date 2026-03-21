import test from "node:test";
import assert from "node:assert/strict";
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

test("usuariosDomain: addUsuarioSafe usa fallback local cuando servicio falla", async () => {
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

  assert.strictEqual(usuarios.length, 2);
  assert.strictEqual(result.username, "newuser");
  assert.strictEqual(result.nombre, "Nuevo Usuario");
  assert.strictEqual(result.activo, true);
});

test("usuariosDomain: updateUsuarioSafe usa fallback local cuando servicio falla", async () => {
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

  assert.strictEqual(usuarios[0].nombre, "Admin Actualizado");
  assert.strictEqual(usuarios[0].activo, false);
});

test("usuariosDomain: deleteUsuarioSafe usa fallback local cuando servicio falla", async () => {
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

  assert.strictEqual(usuarios.length, 1);
  assert.strictEqual(usuarios[0].id, 2);
});

