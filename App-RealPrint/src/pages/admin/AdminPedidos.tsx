/**
 * Gestión de pedidos consolidada para el administrador.
 * Vista unificada que reemplaza las anteriores AdminPedidos y AdminHistorial.
 * Permite filtrar por estado, buscar, ver detalles, cambiar estado y eliminar pedidos.
 *
 * Tabulaciones:
 * - "Activos": pendiente, en_proceso
 * - "Completados": completado, enviado
 * - "Cancelados": cancelado
 *
 * Filtrado de estado:
 * - Select muestra TODOS los estados disponibles (pendiente, en_proceso, completado, enviado, cancelado)
 * - Al seleccionar un estado fuera de la pestaña activa, el resultado estará vacío
 * - Esto permite subfiltrado granular dentro de cada vista
 *
 * Buenas prácticas:
 * - Modulariza lógica de filtrado y actualización de estado
 * - Usa componentes UI reutilizables
 * - Documenta cada función relevante
 */
import { useState } from "react";
import type { ChangeEvent } from "react";
import { useSearchParams } from "react-router-dom";
import { ESTADOS_PEDIDO } from "../../context/data/uiContracts";
import { useApiStatus } from "../../hooks/useApiStatus";
import { usePedidosData } from "../../hooks/usePedidosData";
import { useProductosData } from "../../hooks/useProductosData";
import { Table, Button, Badge, Modal, Input, Select } from "../../components/ui";
import { getToken } from "../../services/tokenStorage";

type PedidoItem = Record<string, any>;

interface TableColumn {
  key: string;
  label: string;
  render?: (value: any, row?: PedidoItem) => JSX.Element | string;
}

function parseFileUrlsFromPedido(pedido: PedidoItem): string[] {
  const allowedOrigins = (() => {
    const origins = new Set<string>([window.location.origin]);
    try {
      const apiBase = import.meta.env.VITE_API_URL;
      if (typeof apiBase === "string" && apiBase.trim()) {
        const parsed = new URL(apiBase, window.location.origin);
        origins.add(parsed.origin);
      }
    } catch {
      // Ignorar configuraciones malformadas y quedarse con el origen actual.
    }
    return origins;
  })();

  const isAllowedFileUrl = (value: string): boolean => {
    try {
      const parsed = new URL(value, window.location.origin);
      return allowedOrigins.has(parsed.origin) && parsed.pathname.startsWith("/api/files/");
    } catch {
      return false;
    }
  };

  const normalizeToUrl = (f: string): string | null => {
    if (!f || typeof f !== "string") return null;
    const trimmed = f.trim();
    if (!trimmed) return null;

    if (isAllowedFileUrl(trimmed)) return trimmed;
    if (trimmed.startsWith("/api/files/")) return trimmed;

    // Si es nombre de archivo simple (con extension), convertir a URL del backend.
    if (trimmed.includes(".") && !trimmed.includes(" ")) {
      return `/api/files/${trimmed}`;
    }

    return null;
  };

  // 1) Formato nuevo recomendado: array directo en fileUrls.
  if (Array.isArray(pedido?.fileUrls)) {
    return pedido.fileUrls
      .map(normalizeToUrl)
      .filter((item): item is string => item !== null);
  }

  // 2) Compatibilidad con algunos payloads legacy donde fileUrls venía serializado en JSON.
  if (typeof pedido?.fileUrls === "string") {
    try {
      const parsed = JSON.parse(pedido.fileUrls);
      if (Array.isArray(parsed)) {
        return parsed
          .map(normalizeToUrl)
          .filter((item): item is string => item !== null);
      }
    } catch {
      const normalized = normalizeToUrl(pedido.fileUrls);
      return normalized ? [normalized] : [];
    }
  }

  // 3) Compatibilidad backend (columna fileUrlsJson).
  if (typeof pedido?.fileUrlsJson === "string" && pedido.fileUrlsJson.trim()) {
    try {
      const parsed = JSON.parse(pedido.fileUrlsJson);
      if (Array.isArray(parsed)) {
        return parsed
          .map(normalizeToUrl)
          .filter((item): item is string => item !== null);
      }
    } catch {
      return [];
    }
  }

  // 4) Extraer archivos embebidos en descripción (formato "Archivos: archivo1.pdf, archivo2.jpg")
  if (typeof pedido?.descripcion === "string") {
    const desc = pedido.descripcion;
    const match = desc.match(/Archivos:\s*([^|]+?)(?:\s*\||$)/);
    if (match && match[1]) {
      const fileList = match[1].trim();
      const files = fileList
        .split(",")
        .map((f) => normalizeToUrl(f))
        .filter((f): f is string => f !== null);
      if (files.length > 0) return files;
    }
  }

  return [];
}

function isDownloadableUrl(fileUrl: string): boolean {
  try {
    const allowedOrigins = new Set<string>([window.location.origin]);
    const apiBase = import.meta.env.VITE_API_URL;
    if (typeof apiBase === "string" && apiBase.trim()) {
      const parsed = new URL(apiBase, window.location.origin);
      allowedOrigins.add(parsed.origin);
    }

    const parsed = new URL(fileUrl, window.location.origin);
    return allowedOrigins.has(parsed.origin) && parsed.pathname.startsWith("/api/files/");
  } catch {
    return false;
  }
}

function getFileNameFromUrl(fileUrl: string, fallbackIndex: number): string {
  try {
    const parsed = new URL(fileUrl, window.location.origin);
    const lastChunk = parsed.pathname.split("/").filter(Boolean).pop();
    return lastChunk || `archivo-${fallbackIndex + 1}`;
  } catch {
    return `archivo-${fallbackIndex + 1}`;
  }
}

export default function AdminPedidos() {
  const [searchParams] = useSearchParams();
  const { pedidos, updatePedidoSafe, deletePedidoSafe } = usePedidosData();
  const { productosFinales: catalogoPrendas } = useProductosData();
  const { loading: isProcessing, error: apiError, runApi } = useApiStatus();
  const [selectedPedido, setSelectedPedido] = useState<PedidoItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstado, setFilterEstado] = useState("");
  const [downloadingFile, setDownloadingFile] = useState<string | null>(null);

  /**
   * Detecta query param ?tab= para abrir la pestaña correspondiente.
   * Usado cuando se redirige desde /admin/historial → /admin/pedidos?tab=completados
   */
  const tabFromUrl = searchParams.get("tab") as "activos" | "completados" | "cancelados" | null;
  const [activeTab, setActiveTab] = useState<"activos" | "completados" | "cancelados">(
    tabFromUrl === "completados" || tabFromUrl === "cancelados" ? tabFromUrl : "activos"
  );

  /**
   * Mapeo de tabulaciones a los estados que incluyen.
   * Esto consolida AdminPedidos + AdminHistorial en una sola vista.
   */
  const tabsConfig = {
    activos: {
      label: "Activos",
      states: ["pendiente", "en_proceso"],
      countLabel: "en progreso",
    },
    completados: {
      label: "Completados",
      states: ["completado", "enviado"],
      countLabel: "finalizados",
    },
    cancelados: {
      label: "Cancelados",
      states: ["cancelado"],
      countLabel: "cancelados",
    },
  };

  /**
   * Filtra pedidos según la pestaña activa.
   */
  const getPedidosByTab = (tab: typeof activeTab): PedidoItem[] => {
    return (pedidos as PedidoItem[]).filter((p) =>
      tabsConfig[tab].states.includes(p.estado)
    );
  };

  const tabPedidos = getPedidosByTab(activeTab);

  const filteredPedidos = (tabPedidos as PedidoItem[])
    .filter(pedido => pedido && typeof pedido === "object" && pedido.id && pedido.cliente)
    .filter((pedido) => {
      const matchesSearch =
        String(pedido.id).toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(pedido.cliente).toLowerCase().includes(searchTerm.toLowerCase()) ||
        (pedido.pedido ? String(pedido.pedido).toLowerCase().includes(searchTerm.toLowerCase()) : false) ||
        (pedido.servicio ? String(pedido.servicio).toLowerCase().includes(searchTerm.toLowerCase()) : false) ||
        (pedido.descripcion ? String(pedido.descripcion).toLowerCase().includes(searchTerm.toLowerCase()) : false);
      const matchesFilter = !filterEstado || pedido.estado === filterEstado;
      return matchesSearch && matchesFilter;
    });

  const handleViewDetails = (pedido: PedidoItem) => {
    setSelectedPedido(pedido);
    setIsModalOpen(true);
  };

  const handleUpdateEstado = async (id: string | number, nuevoEstado: string) => {
    await runApi(async () => {
      await updatePedidoSafe(id, { estado: nuevoEstado });
      if (selectedPedido?.id === id) {
        setSelectedPedido({ ...selectedPedido, estado: nuevoEstado });
      }
    }, "No se ha podido actualizar el estado del pedido");
  };

  const handleDeletePedido = async (id: string | number) => {
    const result = await runApi(
      () => deletePedidoSafe(id),
      "No se ha podido eliminar el pedido",
    );
    if (result !== null) setIsModalOpen(false);
  };

  const handleDownloadFile = async (fileUrl: string, index: number) => {
    if (!isDownloadableUrl(fileUrl)) return;

    const token = getToken();

    // Comentario didáctico: si el enlace es externo y no requiere JWT,
    // abrimos en nueva pestaña para no forzar descarga por blob.
    if ((fileUrl.startsWith("http://") || fileUrl.startsWith("https://")) && !fileUrl.includes("/api/files/")) {
      window.open(fileUrl, "_blank", "noopener,noreferrer");
      return;
    }

    setDownloadingFile(fileUrl);
    try {
      const response = await fetch(fileUrl, {
        method: "GET",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!response.ok) {
        window.open(fileUrl, "_blank", "noopener,noreferrer");
        return;
      }

      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = getFileNameFromUrl(fileUrl, index);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(objectUrl);
    } catch {
      // Fallback didáctico: si falla fetch con token, intentamos apertura directa.
      window.open(fileUrl, "_blank", "noopener,noreferrer");
    } finally {
      setDownloadingFile((current) => (current === fileUrl ? null : current));
    }
  };

  const columns: TableColumn[] = [
    { key: "id", label: "ID", render: (value) => <span className="font-medium">#{value}</span> },
    { key: "clienteNombre", label: "Cliente" },
    { key: "creadoPorNombre", label: "Creado por" },
    { key: "pedido", label: "Pedido" },
    { key: "productoFinalId", label: "Prenda", render: (id) => {
      const pf = catalogoPrendas.find((p: PedidoItem) => p.id == id);
      return pf ? pf.nombre : "-";
    } },
    { key: "fechaEntrega", label: "Entrega" },
    { key: "estado", label: "Estado", render: (value) => (
      <Badge variant={value}>{ESTADOS_PEDIDO[value]?.label || value}</Badge>
    ) },
    { key: "total", label: "Total", render: (value) => `€${typeof value === "number" ? value.toFixed(2) : "0.00"}` },
    {
      key: "acciones",
      label: "",
      render: (_, row) => (
        <Button size="sm" variant="ghost" onClick={() => handleViewDetails(row)}>
          Ver
        </Button>
      ),
    },
  ];

  /**
   * Opciones de filtrado para el SELECT.
   * Incluye todos los estados disponibles, no solo los de la pestaña activa.
   * Esto permite hacer subfiltradores dentro de cada vista.
   */
  const estadoOptions = Object.keys(ESTADOS_PEDIDO).map((state) => ({
    value: state,
    label: ESTADOS_PEDIDO[state]?.label || state,
  }));

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 lg:mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-surface-900">Gestión de Pedidos</h1>
          <p className="text-surface-500 mt-1">{filteredPedidos.length} {tabsConfig[activeTab].countLabel}</p>
        </div>
      </div>

      {apiError && (
        <div className="mb-4 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {apiError}
        </div>
      )}

      {/* Tabulaciones consolidadas - Responsive */}
      <div className="flex gap-1 sm:gap-2 mb-6 border-b border-surface-200 overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
        {(Object.entries(tabsConfig) as [typeof activeTab, typeof tabsConfig["activos"]][]).map(([tab, config]) => {
          const count = getPedidosByTab(tab).length;
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => {
                setActiveTab(tab);
                setSearchTerm("");
                setFilterEstado("");
              }}
              className={`px-3 sm:px-4 py-3 font-medium border-b-2 transition-colors whitespace-nowrap text-sm sm:text-base ${
                isActive
                  ? "border-primary-600 text-primary-600"
                  : "border-transparent text-surface-600 hover:text-surface-900"
              }`}
            >
              {config.label} <span className="text-xs sm:text-sm text-surface-500">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Filters - Responsive stacking */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
        <Input
          placeholder="Buscar por ID, cliente..."
          value={searchTerm}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
        />
        <Select
          options={estadoOptions}
          value={filterEstado}
          onChange={(e: ChangeEvent<HTMLSelectElement>) => setFilterEstado(e.target.value)}
          placeholder="Filtrar por estado"
        />
        <Button
          variant="secondary"
          onClick={() => { setSearchTerm(""); setFilterEstado(""); }}
          className="w-full"
        >
          Limpiar filtros
        </Button>
      </div>

      {/* Table - Responsive */}
      <div className="overflow-x-auto -mx-4 sm:mx-0 sm:overflow-x-visible">
        <div className="px-4 sm:px-0">
          <Table
            columns={columns}
            data={filteredPedidos}
            emptyMessage="No se encontraron pedidos"
          />
        </div>
      </div>

      {/* Detail Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Pedido #${selectedPedido?.id}`}
        size="lg"
      >
        {selectedPedido && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <p className="text-surface-500 text-sm">Prenda asociada</p>
                              <p className="font-medium">
                                {(() => {
                                  const pf = catalogoPrendas.find((p: PedidoItem) => p.id == selectedPedido.productoFinalId);
                                  return pf ? pf.nombre : "-";
                                })()}
                              </p>
                            </div>
                            <div>
                              <p className="text-surface-500 text-sm">Materiales Usados</p>
                              <p className="font-medium">
                                {(() => {
                                  const pf = catalogoPrendas.find((p: PedidoItem) => p.id == selectedPedido.productoFinalId);
                                  if (!pf) return "-";
                                  const materialIds = Array.isArray(pf.materiales)
                                    ? pf.materiales
                                        .filter((m: any) => m && m.id !== undefined)
                                        .map((m: any) => ({ id: m.id, cantidad: Number(m.cantidad) || 1 }))
                                    : Array.isArray(pf.productosInventario)
                                      ? pf.productosInventario.map((id: string | number) => ({ id, cantidad: 1 }))
                                      : [];
                                  if (!materialIds.length) return "-";
                                  return materialIds.map(({ id, cantidad }: { id: string | number; cantidad: number }) => {
                                    return `${id}${cantidad > 1 ? ` x${cantidad}` : ""}`;
                                  }).join(", ");
                                })()}
                              </p>
                            </div>
              <div>
                <p className="text-surface-500 text-sm">Cliente</p>
                <p className="font-medium">{selectedPedido.clienteNombre}</p>
              </div>
              <div>
                <p className="text-surface-500 text-sm">Creado por</p>
                <p className="font-medium">{selectedPedido.creadoPorNombre || "-"}</p>
              </div>
              <div>
                <p className="text-surface-500 text-sm">Pedido</p>
                <p className="font-medium">{selectedPedido.pedido}</p>
              </div>
              <div>
                <p className="text-surface-500 text-sm">Servicio</p>
                <p className="font-medium">{selectedPedido.servicio}</p>
              </div>
              <div>
                <p className="text-surface-500 text-sm">Cantidad</p>
                <p className="font-medium">{selectedPedido.cantidad}</p>
              </div>
              <div>
                <p className="text-surface-500 text-sm">Fecha de Pedido</p>
                <p className="font-medium">{selectedPedido.fecha}</p>
              </div>
              <div>
                <p className="text-surface-500 text-sm">Fecha de Entrega</p>
                <p className="font-medium">{selectedPedido.fechaEntrega}</p>
              </div>
              <div>
                <p className="text-surface-500 text-sm">Total</p>
                <p className="font-medium text-lg sm:text-xl">€{typeof selectedPedido.total === "number" ? selectedPedido.total.toFixed(2) : "0.00"}</p>
              </div>
              <div>
                <p className="text-surface-500 text-sm">Estado Actual</p>
                <Badge variant={selectedPedido.estado}>
                  {ESTADOS_PEDIDO[selectedPedido.estado]?.label}
                </Badge>
              </div>
            </div>

            <div>
              <p className="text-surface-500 text-sm mb-2">Descripción</p>
              <p className="bg-surface-100 p-3 rounded-lg text-sm sm:text-base">{selectedPedido.descripcion}</p>
            </div>

            <div>
              <p className="text-surface-500 text-sm mb-2">Archivos del pedido</p>
              {(() => {
                const fileUrls = parseFileUrlsFromPedido(selectedPedido);

                if (fileUrls.length === 0) {
                  return <p className="text-sm text-surface-500">No hay archivos asociados.</p>;
                }

                return (
                  <ul className="space-y-2">
                    {fileUrls.map((fileUrl, index) => (
                      <li key={`${fileUrl}-${index}`} className="rounded-lg border border-surface-200 bg-surface-50 px-3 py-2 text-sm">
                        {isDownloadableUrl(fileUrl) ? (
                          <button
                            type="button"
                            onClick={() => handleDownloadFile(fileUrl, index)}
                            className="text-left text-primary-600 hover:text-primary-700 hover:underline break-all"
                          >
                            {downloadingFile === fileUrl ? "Descargando..." : `Descargar archivo ${index + 1}`}
                          </button>
                        ) : (
                          <span className="text-surface-700 break-all">{fileUrl}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                );
              })()}
            </div>

             <div>
               <p className="text-surface-500 text-sm mb-2">Cambiar Estado</p>
               <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                 {Object.entries(ESTADOS_PEDIDO).map(([key, { label }]) => (
                   <Button
                     key={key}
                     variant={selectedPedido.estado === key ? "primary" : "secondary"}
                     size="sm"
                     disabled={isProcessing}
                     onClick={() => handleUpdateEstado(selectedPedido.id, key)}
                     className="text-xs sm:text-sm"
                   >
                     {label}
                   </Button>
                 ))}
               </div>
             </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-surface-200">
              <Button variant="danger" disabled={isProcessing} onClick={() => {
                handleDeletePedido(selectedPedido.id);
              }}>
                Eliminar Pedido
              </Button>
              <Button onClick={() => setIsModalOpen(false)}>
                Cerrar
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}


