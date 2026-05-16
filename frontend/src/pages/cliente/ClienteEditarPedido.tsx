/**
 * Página de edición de pedido para clientes.
 * Permite modificar un pedido pendiente usando el mismo wizard que para crear.
 *
 * Buenas prácticas:
 * - Reutiliza componentes existentes (CreateOrderForm, LinearPedidoEditor)
 * - Valida estado del pedido (solo PENDIENTE puede editarse)
 * - Valida acceso (cliente solo edita sus propios pedidos)
 */
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { usePedidosData } from "../../hooks/usePedidosData";
import LinearPedidoEditor from "./LinearPedidoEditor";
import { CreateOrderForm } from "../../components/CreateOrderForm";

export default function ClienteEditarPedido() {
  const { id } = useParams();
  const { user } = useAuth();
  const { pedidos } = usePedidosData();
  const navigate = useNavigate();

  const pedido = pedidos.find((p) => String(p.id) === String(id) && p.clienteId === user?.id);

  useEffect(() => {
    if (!pedido) {
      navigate("/cliente");
      return;
    }
    // Solo permitir editar si está pendiente
    if (pedido.estado !== "pendiente") {
      navigate("/cliente");
    }
  }, [pedido, navigate]);

  if (!pedido) return null;

  // Determinar si es un pedido lineal (basado en metros lineales)
  const esPedidoLineal =
    pedido &&
    typeof pedido.linearMeters === "number" &&
    pedido.linearMeters > 0;

  if (esPedidoLineal) {
    return <LinearPedidoEditor pedido={pedido} onCancel={() => navigate("/cliente")} />;
  }

  // Para pedidos normales (no lineales), usar el mismo wizard de creación
  return <CreateOrderForm pedido={pedido} onCancel={() => navigate("/cliente")} />;

}
