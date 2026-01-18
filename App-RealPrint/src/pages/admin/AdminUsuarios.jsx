import { useState } from "react";
import { useData } from "../../context/DataContext";
import { Table, Button, Badge, Modal, Input, Select } from "../../components/ui";

const ROLES = [
  { value: "admin", label: "Administrador" },
  { value: "cliente", label: "Cliente" },
  { value: "operario", label: "Operario" },
];

export default function AdminUsuarios() {
  // Estado para modal de catálogo
  const [catalogoModal, setCatalogoModal] = useState({ open: false, usuario: null });
  // Acceso a catálogo de empresa
  const { catalogosEmpresa, setCatalogoEmpresa, getCatalogoEmpresa } = useData();
  // Servicios disponibles para catálogo
  const SERVICIOS_CATALOGO = [
    { value: "dtf", label: "DTF" },
    { value: "rotulacion", label: "Rotulación" },
  ];
  // Estado para edición de catálogo
  const [servicioCatalogo, setServicioCatalogo] = useState("dtf");
  const [prendasCatalogo, setPrendasCatalogo] = useState([]);
  // Abrir modal de catálogo
  const handleEditCatalogo = (usuario) => {
    setServicioCatalogo("dtf");
    setPrendasCatalogo(getCatalogoEmpresa(usuario.id, "dtf"));
    setCatalogoModal({ open: true, usuario });
  };
  // Guardar catálogo
  const handleSaveCatalogo = () => {
    setCatalogoEmpresa(catalogoModal.usuario.id, servicioCatalogo, prendasCatalogo.filter(p => p.trim() !== ""));
    setCatalogoModal({ open: false, usuario: null });
  };
  // Cambiar servicio en modal
  const handleServicioCatalogoChange = (e) => {
    const value = e.target.value;
    setServicioCatalogo(value);
    setPrendasCatalogo(getCatalogoEmpresa(catalogoModal.usuario.id, value));
  };
  // Cambiar prenda
  const handlePrendaChange = (idx, value) => {
    setPrendasCatalogo(prev => prev.map((p, i) => i === idx ? value : p));
  };
  // Añadir prenda
  const handleAddPrenda = () => {
    setPrendasCatalogo(prev => [...prev, ""]);
  };
  // Eliminar prenda
  const handleRemovePrenda = (idx) => {
    setPrendasCatalogo(prev => prev.filter((_, i) => i !== idx));
  };
  const { usuarios, updateUsuario, addUsuario, deleteUsuario } = useData();
  const [selectedUsuario, setSelectedUsuario] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRol, setFilterRol] = useState("");
  const [newUsuario, setNewUsuario] = useState({
    username: "",
    password: "",
    nombre: "",
    email: "",
    role: "",
    empresa: "",
  });

  const filteredUsuarios = usuarios.filter((usuario) => {
    const matchesSearch = 
      usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = !filterRol || usuario.role === filterRol;
    return matchesSearch && matchesFilter;
  });

  const handleEdit = (usuario) => {
    setSelectedUsuario({ ...usuario });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    updateUsuario(selectedUsuario.id, selectedUsuario);
    setIsModalOpen(false);
  };

  const handleAdd = () => {
    if (newUsuario.username && newUsuario.password && newUsuario.nombre && newUsuario.email && newUsuario.role) {
      addUsuario(newUsuario);
      setNewUsuario({ username: "", password: "", nombre: "", email: "", role: "", empresa: "" });
      setIsAddModalOpen(false);
    }
  };

  const handleToggleActive = (usuario) => {
    updateUsuario(usuario.id, { activo: !usuario.activo });
  };

  const columns = [
    { key: "nombre", label: "Nombre", render: (value) => <span className="font-medium">{value}</span> },
    { key: "username", label: "Usuario" },
    { key: "email", label: "Email" },
    { key: "empresa", label: "Empresa", render: (value) => value || "-" },
    { key: "role", label: "Rol", render: (value) => (
        <Badge variant={value === "admin" ? "info" : value === "operario" ? "warning" : "success"}>
          {value.charAt(0).toUpperCase() + value.slice(1)}
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
            onClick={() => handleToggleActive(row)}
          >
            {row.activo ? "Desactivar" : "Activar"}
          </Button>
          {/* Botón Catálogo eliminado */}
        </div>
      ),
    },
  ];

  const usuariosActivos = usuarios.filter((u) => u.activo).length;

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

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Input
          placeholder="Buscar por nombre o email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Select
          options={ROLES}
          value={filterRol}
          onChange={(e) => setFilterRol(e.target.value)}
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
      {selectedUsuario && selectedUsuario.role === "cliente" && (
        <Input
          label="Empresa*"
          value={selectedUsuario.empresa || ""}
          onChange={(e) => setSelectedUsuario({ ...selectedUsuario, empresa: e.target.value })}
          required
        />
      )}
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
                  onChange={e => handlePrendaChange(idx, e.target.value)}
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
              onChange={(e) => setSelectedUsuario({ ...selectedUsuario, nombre: e.target.value })}
            />
            <Input
              label="Nombre de usuario"
              value={selectedUsuario.username}
              onChange={(e) => setSelectedUsuario({ ...selectedUsuario, username: e.target.value })}
            />
            <Input
              label="Email"
              type="email"
              value={selectedUsuario.email}
              onChange={(e) => setSelectedUsuario({ ...selectedUsuario, email: e.target.value })}
            />
            <Select
              label="Rol"
              options={ROLES}
              value={selectedUsuario.role}
              onChange={(e) => setSelectedUsuario({ ...selectedUsuario, role: e.target.value })}
            />
            <Input
              label="Contraseña"
              type="password"
              value={selectedUsuario.password || ""}
              onChange={(e) => setSelectedUsuario({ ...selectedUsuario, password: e.target.value })}
            />
            <Input
              label="Empresa"
              value={selectedUsuario.empresa || ""}
              onChange={(e) => setSelectedUsuario({ ...selectedUsuario, empresa: e.target.value })}
            />
            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
              <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSave}>
                Guardar Cambios
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
            onChange={(e) => setNewUsuario({ ...newUsuario, nombre: e.target.value })}
          />
          <Input
            label="Nombre de usuario"
            value={newUsuario.username}
            onChange={(e) => setNewUsuario({ ...newUsuario, username: e.target.value })}
          />
          <Input
            label="Email"
            type="email"
            value={newUsuario.email}
            onChange={(e) => setNewUsuario({ ...newUsuario, email: e.target.value })}
          />
          <Input
            label="Empresa"
            value={newUsuario.empresa}
            onChange={(e) => setNewUsuario({ ...newUsuario, empresa: e.target.value })}
          />
          <Select
            label="Rol"
            options={ROLES}
            value={newUsuario.role}
            onChange={(e) => setNewUsuario({ ...newUsuario, role: e.target.value })}
          />
          <Input
            label="Contraseña"
            type="password"
            value={newUsuario.password}
            onChange={(e) => setNewUsuario({ ...newUsuario, password: e.target.value })}
          />
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
            <Button variant="secondary" onClick={() => setIsAddModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAdd}>
              Añadir Usuario
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
