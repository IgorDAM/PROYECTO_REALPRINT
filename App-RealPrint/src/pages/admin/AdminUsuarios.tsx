/**
 * Gestión de usuarios para el administrador.
 * Permite añadir, editar, eliminar usuarios y gestionar catálogos de empresa.
 * Incluye lógica para roles y filtrado.
 *
 * Buenas prácticas:
 * - Modulariza lógica de edición y filtrado
 * - Usa componentes UI reutilizables
 * - Documenta cada función relevante
 */
import { useState } from "react";
import type { ChangeEvent } from "react";
import { useApiStatus } from "../../hooks/useApiStatus";
import { useUsuariosData } from "../../hooks/useUsuariosData";
import { Table, Button, Badge, Modal, Input, Select } from "../../components/ui";

type UsuarioItem = Record<string, any>;

interface RoleOption {
  value: string;
  label: string;
}

interface CatalogoModalState {
  open: boolean;
  usuario: UsuarioItem | null;
}

interface NewUsuarioItem {
  username: string;
  password: string;
  nombre: string;
  email: string;
  role: string;
  empresa: string;
  especialidad?: string;
}

interface TableColumn {
  key: string;
  label: string;
  render?: (value: any, row: UsuarioItem) => JSX.Element | string;
}

const ROLES: RoleOption[] = [
  { value: "admin", label: "Administrador" },
  { value: "cliente", label: "Cliente" },
];

export default function AdminUsuarios() {
  // Estado para modal de catálogo
  const [catalogoModal, setCatalogoModal] = useState<CatalogoModalState>({ open: false, usuario: null });
  const { usuarios, updateUsuarioSafe, addUsuarioSafe, deleteUsuarioSafe, setCatalogoEmpresa, getCatalogoEmpresa } = useUsuariosData();
  // Servicios disponibles para catálogo
  const SERVICIOS_CATALOGO = [
    { value: "serigrafia", label: "Serigrafía" },
    { value: "dtf", label: "DTF" },
  ];
  // Estado para edición de catálogo
  const [servicioCatalogo, setServicioCatalogo] = useState("serigrafia");
  const [prendasCatalogo, setPrendasCatalogo] = useState<string[]>([]);
  // Guardar catálogo
  const handleSaveCatalogo = () => {
    if (!catalogoModal.usuario) return;
    setCatalogoEmpresa(catalogoModal.usuario.id, servicioCatalogo, prendasCatalogo.filter((p) => p.trim() !== ""));
    setCatalogoModal({ open: false, usuario: null });
  };

  const openCatalogoModal = (usuario: UsuarioItem) => {
    const defaultService = "serigrafia";
    setServicioCatalogo(defaultService);
    setPrendasCatalogo(getCatalogoEmpresa(usuario.id, defaultService));
    setCatalogoModal({ open: true, usuario });
  };
  // Cambiar servicio en modal
  const handleServicioCatalogoChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setServicioCatalogo(value);
    if (!catalogoModal.usuario) return;
    setPrendasCatalogo(getCatalogoEmpresa(catalogoModal.usuario.id, value));
  };
  // Cambiar prenda
  const handlePrendaChange = (idx: number, value: string) => {
    setPrendasCatalogo((prev) => prev.map((p, i) => (i === idx ? value : p)));
  };
  // Añadir prenda
  const handleAddPrenda = () => {
    setPrendasCatalogo((prev) => [...prev, ""]);
  };
  // Eliminar prenda
  const handleRemovePrenda = (idx: number) => {
    setPrendasCatalogo((prev) => prev.filter((_, i) => i !== idx));
  };
  const { loading: isProcessing, error: apiError, runApi } = useApiStatus();
  const [selectedUsuario, setSelectedUsuario] = useState<UsuarioItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRol, setFilterRol] = useState("");
  const [newUsuario, setNewUsuario] = useState<NewUsuarioItem>({
    username: "",
    password: "",
    nombre: "",
    email: "",
    role: "",
    empresa: "",
  });

  const filteredUsuarios = (usuarios as UsuarioItem[]).filter((usuario) => {
    const matchesSearch =
      String(usuario.nombre || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(usuario.email || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = !filterRol || usuario.role === filterRol;
    return matchesSearch && matchesFilter;
  });

  const handleEdit = (usuario: UsuarioItem) => {
    setSelectedUsuario({ ...usuario });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!selectedUsuario) return;
    const result = await runApi(
      () => updateUsuarioSafe(selectedUsuario.id, selectedUsuario),
      "No se ha podido guardar el usuario",
    );
    if (result !== null) setIsModalOpen(false);
  };

  const handleAdd = async () => {
    if (newUsuario.username && newUsuario.password && newUsuario.nombre && newUsuario.email && newUsuario.role) {
      const result = await runApi(
        () => addUsuarioSafe(newUsuario),
        "No se ha podido anadir el usuario",
      );
      if (result !== null) {
        setNewUsuario({ username: "", password: "", nombre: "", email: "", role: "", empresa: "" });
        setIsAddModalOpen(false);
      }
    }
  };

  const handleToggleActive = async (usuario: UsuarioItem) => {
    await runApi(
      () => updateUsuarioSafe(usuario.id, { activo: !usuario.activo }),
      "No se ha podido actualizar el estado del usuario",
    );
  };

  const handleDeleteUsuario = async (usuario: UsuarioItem) => {
    if (!window.confirm(`¿Seguro que quieres eliminar a ${usuario.nombre}?`)) return;
    await runApi(
      () => deleteUsuarioSafe(usuario.id),
      "No se ha podido eliminar el usuario",
    );
  };

  const columns: TableColumn[] = [
    { key: "nombre", label: "Nombre", render: (value) => <span className="font-medium">{value}</span> },
    { key: "username", label: "Usuario" },
    { key: "email", label: "Email" },
    { key: "empresa", label: "Empresa", render: (value) => value || "-" },
    { key: "role", label: "Rol", render: (value) => (
        <Badge variant={value === "admin" ? "info" : "success"}>
          {String(value).charAt(0).toUpperCase() + String(value).slice(1)}
        </Badge>
      )
    },
    { key: "password", label: "Contraseña", render: () => <span>••••••</span> },
    { key: "activo", label: "Estado", render: (value) => (
        <Badge variant={value ? "success" : "danger"}>
          {value ? "Activo" : "Inactivo"}
        </Badge>
      ),
    },
    { key: "acciones", label: "Acciones", render: (_, row) => (
        <div className="flex flex-wrap gap-2 min-w-[180px]">
          <Button size="sm" variant="ghost" onClick={() => handleEdit(row)}>
            Editar
          </Button>
          <Button
            size="sm"
            variant={row.activo ? "danger" : "success"}
            disabled={isProcessing}
            onClick={() => handleToggleActive(row)}
          >
            {row.activo ? "Desactivar" : "Activar"}
          </Button>
          <Button size="sm" variant="danger" disabled={isProcessing} onClick={() => handleDeleteUsuario(row)}>
            Eliminar
          </Button>
          {row.role === "cliente" ? (
            <Button size="sm" variant="secondary" onClick={() => openCatalogoModal(row)}>
              Catalogo
            </Button>
          ) : null}
        </div>
      ),
    },
  ];

  const usuariosActivos = (usuarios as UsuarioItem[]).filter((u) => u.activo).length;

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 lg:mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-surface-900">Gestión de Usuarios</h1>
          <p className="text-surface-500 mt-1">
            {usuarios.length} usuarios | <span className="text-emerald-600 font-semibold">{usuariosActivos} activos</span>
          </p>
        </div>
        <Button icon="person_add" onClick={() => setIsAddModalOpen(true)} className="w-full sm:w-auto">
          Añadir Usuario
        </Button>
      </div>

      {apiError && (
        <div className="mb-4 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {apiError}
        </div>
      )}

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Input
          placeholder="Buscar por nombre o email..."
          value={searchTerm}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
        />
        <Select
          options={ROLES}
          value={filterRol}
          onChange={(e: ChangeEvent<HTMLSelectElement>) => setFilterRol(e.target.value)}
          placeholder="Filtrar por rol"
        />
        <Button
          variant="secondary"
          onClick={() => { setSearchTerm(""); setFilterRol(""); }}
        >
          Limpiar filtros
        </Button>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        data={filteredUsuarios}
        emptyMessage="No se encontraron usuarios"
      />

      {/* Modal Catálogo Empresa */}
      <Modal
        isOpen={catalogoModal.open}
        onClose={() => setCatalogoModal({ open: false, usuario: null })}
        title={catalogoModal.usuario ? `Catálogo de ${catalogoModal.usuario.nombre}` : "Catálogo"}
      >
        <div className="space-y-4">
          <Select
            label="Servicio"
            options={SERVICIOS_CATALOGO}
            value={servicioCatalogo}
            onChange={handleServicioCatalogoChange}
          />
          <div>
            <label className="block mb-1 font-medium">Prendas/Objetos</label>
            {prendasCatalogo.map((prenda, idx) => (
              <div key={idx} className="flex gap-2 mb-2">
                <Input
                  value={prenda}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => handlePrendaChange(idx, e.target.value)}
                  placeholder="Ej. Camiseta, Pantalón, Balón..."
                />
                <Button size="sm" variant="danger" onClick={() => handleRemovePrenda(idx)}>
                  Eliminar
                </Button>
              </div>
            ))}
            <Button size="sm" variant="success" onClick={handleAddPrenda}>
              Añadir Prenda/Objeto
            </Button>
          </div>
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
            <Button variant="secondary" onClick={() => setCatalogoModal({ open: false, usuario: null })}>
              Cancelar
            </Button>
            <Button onClick={handleSaveCatalogo}>
              Guardar Catálogo
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Editar Usuario"
      >
        {selectedUsuario && (
          <div className="space-y-4">
            <Input
              label="Nombre completo"
              value={selectedUsuario.nombre}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setSelectedUsuario({ ...selectedUsuario, nombre: e.target.value })}
            />
            <Input
              label="Nombre de usuario"
              value={selectedUsuario.username}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setSelectedUsuario({ ...selectedUsuario, username: e.target.value })}
            />
            <Input
              label="Email"
              type="email"
              value={selectedUsuario.email}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setSelectedUsuario({ ...selectedUsuario, email: e.target.value })}
            />
            <Select
              label="Rol"
              options={ROLES}
              value={selectedUsuario.role}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => setSelectedUsuario({ ...selectedUsuario, role: e.target.value, especialidad: undefined })}
            />
            <Input
              label="Contraseña"
              type="password"
              value={selectedUsuario.password || ""}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setSelectedUsuario({ ...selectedUsuario, password: e.target.value })}
            />
            <Input
              label="Empresa"
              value={selectedUsuario.empresa || ""}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setSelectedUsuario({ ...selectedUsuario, empresa: e.target.value })}
            />
            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
              <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSave} disabled={isProcessing}>
                {isProcessing ? "Guardando..." : "Guardar Cambios"}
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Add Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Añadir Usuario"
      >
        <div className="space-y-4">
          <Input
            label="Nombre completo"
            value={newUsuario.nombre}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setNewUsuario({ ...newUsuario, nombre: e.target.value })}
          />
          <Input
            label="Nombre de usuario"
            value={newUsuario.username}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setNewUsuario({ ...newUsuario, username: e.target.value })}
          />
          <Input
            label="Email"
            type="email"
            value={newUsuario.email}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setNewUsuario({ ...newUsuario, email: e.target.value })}
          />
          <Input
            label="Empresa"
            value={newUsuario.empresa}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setNewUsuario({ ...newUsuario, empresa: e.target.value })}
          />
          <Select
            label="Rol"
            options={ROLES}
            value={newUsuario.role}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => setNewUsuario({ ...newUsuario, role: e.target.value })}
          />
          <Input
            label="Contraseña"
            type="password"
            value={newUsuario.password}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setNewUsuario({ ...newUsuario, password: e.target.value })}
          />
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
            <Button variant="secondary" onClick={() => setIsAddModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAdd} disabled={isProcessing}>
              {isProcessing ? "Anadiendo..." : "Anadir Usuario"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

