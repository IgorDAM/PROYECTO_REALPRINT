/**
 * Construye operaciones del dominio usuarios con fallback local.
 * Facilita la migracion gradual desde DataContext monolitico.
 */
export function createUsuariosDomain({
  usuarios,
  setUsuarios,
  usuariosService,
  useCreateService,
  useUpdateService,
  useDeleteService,
}) {
  const addUsuario = (usuario) => {
    const newUsuario = { ...usuario, id: Date.now(), activo: true };
    setUsuarios([...usuarios, newUsuario]);
    return newUsuario;
  };

  const addUsuarioSafe = async (usuario) => {
    if (!useCreateService) {
      return addUsuario(usuario);
    }

    try {
      const created = await usuariosService.create(usuario);
      if (created && typeof created === "object" && created.id !== undefined) {
        const normalizedUser = { activo: true, ...created };
        setUsuarios([...usuarios, normalizedUser]);
        return normalizedUser;
      }
      return addUsuario(usuario);
    } catch {
      return addUsuario(usuario);
    }
  };

  const updateUsuario = (id, updates) => {
    setUsuarios(usuarios.map((u) => (u.id === id ? { ...u, ...updates } : u)));
  };

  const updateUsuarioSafe = async (id, updates) => {
    if (!useUpdateService) {
      updateUsuario(id, updates);
      return;
    }

    try {
      await usuariosService.update(id, updates);
      updateUsuario(id, updates);
    } catch {
      updateUsuario(id, updates);
    }
  };

  const deleteUsuario = (id) => {
    setUsuarios(usuarios.filter((u) => u.id !== id));
  };

  const deleteUsuarioSafe = async (id) => {
    if (!useDeleteService) {
      deleteUsuario(id);
      return;
    }

    try {
      await usuariosService.remove(id);
      deleteUsuario(id);
    } catch {
      deleteUsuario(id);
    }
  };

  return {
    addUsuario,
    addUsuarioSafe,
    updateUsuario,
    updateUsuarioSafe,
    deleteUsuario,
    deleteUsuarioSafe,
  };
}

