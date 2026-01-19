import React, { useState } from "react";
import PedidoOperario from "./PedidoOperario";

const pedidosIniciales = [
  {
    id: 1,
    cliente: "Cliente X",
    totalUnidades: 200,
    unidadesPorCaja: 50,
    cajasTotales: 4,
    cajasCompletadas: 0,
  },
  {
    id: 2,
    cliente: "Cliente Y",
    totalUnidades: 120,
    unidadesPorCaja: 50,
    cajasTotales: 3,
    cajasCompletadas: 1,
  },
];

function ListaPedidosOperario() {
  const [pedidos, setPedidos] = useState(pedidosIniciales);

  const actualizarCajas = (pedidoId, nuevasCajasCompletadas) => {
    setPedidos(pedidos =>
      pedidos.map(p =>
        p.id === pedidoId
          ? { ...p, cajasCompletadas: nuevasCajasCompletadas }
          : p
      )
    );
  };

  return (
    <div>
      <h2>Pedidos del Operario</h2>
      {pedidos.map(pedido => (
        <PedidoOperario
          key={pedido.id}
          pedido={pedido}
          onActualizarCajas={actualizarCajas}
        />
      ))}
    </div>
  );
}

export default ListaPedidosOperario;
