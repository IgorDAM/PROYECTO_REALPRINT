import React from "react";

function PedidoOperario({ pedido, onActualizarCajas }) {
  return (
    <div style={{ border: '1px solid #ccc', borderRadius: 8, padding: 16, marginBottom: 16 }}>
      <h3>Pedido #{pedido.id} - {pedido.cliente}</h3>
      <p>Total: {pedido.totalUnidades} camisetas ({pedido.cajasTotales} cajas de {pedido.unidadesPorCaja})</p>
      <div style={{ marginTop: 8 }}>
        {Array.from({ length: pedido.cajasTotales }).map((_, idx) => (
          <label key={idx} style={{ marginRight: 10 }}>
            <input
              type="checkbox"
              checked={idx < pedido.cajasCompletadas}
              onChange={() => onActualizarCajas(pedido.id, idx + 1)}
              disabled={idx > pedido.cajasCompletadas}
            />
            Caja {idx + 1}
          </label>
        ))}
      </div>
    </div>
  );
}

export default PedidoOperario;
