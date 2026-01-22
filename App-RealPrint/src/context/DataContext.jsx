/**
 * Contexto global de datos de la aplicación.
 * Incluye productos, inventario, usuarios, pedidos, tareas y catálogos.
 *
 * Buenas prácticas:
 * - Usa localStorage para persistencia de datos
 * - Expone un hook useData para consumir el contexto
 * - Modulariza funciones de negocio (CRUD, estadísticas, etc.)
 * - Documenta cada función relevante
 */
// Datos iniciales de productos finales vacíos
const INITIAL_PRODUCTOS_FINALES = [
  {"nombre":"VINILO NEGRO MATE 5 AÑOS","servicio":"rotulacion","materiales":[{"id":1768852824131,"cantidad":1}],"clientesPermitidos":["2"],"subservicio":"","quienRopa":"","precio":27,"productosInventario":[1768852824131],"id":1768852849977},
  {"nombre":"CAMISETA 1ª EQUIPACIÓN 128 (niño)","servicio":"serigrafia","materiales":[{"id":1768852685196,"cantidad":1},{"id":1768852729362,"cantidad":1},{"id":1768852760551,"cantidad":1},{"id":1768854441473,"cantidad":1},{"id":1768854474683,"cantidad":1},{"id":1768854499241,"cantidad":1},{"id":1768854542540,"cantidad":1},{"id":1768854585560,"cantidad":1}],"clientesPermitidos":["2"],"subservicio":"serigrafia+planchado","quienRopa":"cliente_ropa","enCaja":true,"tamanoCaja":50,"precio":11,"productosInventario":[1768852685196,1768852729362,1768852760551,1768854441473,1768854474683,1768854499241,1768854542540,1768854585560],"id":1769000000000,"prenda":"Camiseta","modelo":"1ª equipación","talla":"128"},
  {"nombre":"CAMISETA 1ª EQUIPACIÓN 140 (niño)","servicio":"serigrafia","materiales":[{"id":1768852685196,"cantidad":1},{"id":1768852729362,"cantidad":1},{"id":1768852760551,"cantidad":1},{"id":1768854441473,"cantidad":1},{"id":1768854474683,"cantidad":1},{"id":1768854499241,"cantidad":1},{"id":1768854542540,"cantidad":1},{"id":1768854585560,"cantidad":1}],"clientesPermitidos":["2"],"subservicio":"serigrafia+planchado","quienRopa":"cliente_ropa","enCaja":true,"tamanoCaja":50,"precio":11,"productosInventario":[1768852685196,1768852729362,1768852760551,1768854441473,1768854474683,1768854499241,1768854542540,1768854585560],"id":1769000000001,"prenda":"Camiseta","modelo":"1ª equipación","talla":"140"},
  {"nombre":"CAMISETA 1ª EQUIPACIÓN 152 (niño)","servicio":"serigrafia","materiales":[{"id":1768852685196,"cantidad":1},{"id":1768852729362,"cantidad":1},{"id":1768852760551,"cantidad":1},{"id":1768854441473,"cantidad":1},{"id":1768854474683,"cantidad":1},{"id":1768854499241,"cantidad":1},{"id":1768854542540,"cantidad":1},{"id":1768854585560,"cantidad":1}],"clientesPermitidos":["2"],"subservicio":"serigrafia+planchado","quienRopa":"cliente_ropa","enCaja":true,"tamanoCaja":50,"precio":11,"productosInventario":[1768852685196,1768852729362,1768852760551,1768854441473,1768854474683,1768854499241,1768854542540,1768854585560],"id":1769000000002,"prenda":"Camiseta","modelo":"1ª equipación","talla":"152"},
  {"nombre":"CAMISETA 1ª EQUIPACIÓN 164 (niño)","servicio":"serigrafia","materiales":[{"id":1768852685196,"cantidad":1},{"id":1768852729362,"cantidad":1},{"id":1768852760551,"cantidad":1},{"id":1768854441473,"cantidad":1},{"id":1768854474683,"cantidad":1},{"id":1768854499241,"cantidad":1},{"id":1768854542540,"cantidad":1},{"id":1768854585560,"cantidad":1}],"clientesPermitidos":["2"],"subservicio":"serigrafia+planchado","quienRopa":"cliente_ropa","enCaja":true,"tamanoCaja":50,"precio":11,"productosInventario":[1768852685196,1768852729362,1768852760551,1768854441473,1768854474683,1768854499241,1768854542540,1768854585560],"id":1769000000003,"talla":"164","modelo":"1ª equipación","prenda":"Camiseta"},
  {"nombre":"CAMISETA 2ª EQUIPACIÓN 128 (niño)","servicio":"serigrafia","materiales":[{"id":1768852685196,"cantidad":1},{"id":1768852729362,"cantidad":1},{"id":1768852760551,"cantidad":1},{"id":1768854441473,"cantidad":1},{"id":1768854474683,"cantidad":1},{"id":1768854499241,"cantidad":1},{"id":1768854542540,"cantidad":1},{"id":1768854585560,"cantidad":1}],"clientesPermitidos":["2"],"subservicio":"serigrafia+planchado","quienRopa":"cliente_ropa","enCaja":true,"tamanoCaja":50,"precio":11,"productosInventario":[1768852685196,1768852729362,1768852760551,1768854441473,1768854474683,1768854499241,1768854542540,1768854585560],"id":1769000000004,"talla":"128","modelo":"2ª equipación","prenda":"Camiseta"},
  {"nombre":"CAMISETA 2ª EQUIPACIÓN 140 (niño)","servicio":"serigrafia","materiales":[{"id":1768852685196,"cantidad":1},{"id":1768852729362,"cantidad":1},{"id":1768852760551,"cantidad":1},{"id":1768854441473,"cantidad":1},{"id":1768854474683,"cantidad":1},{"id":1768854499241,"cantidad":1},{"id":1768854542540,"cantidad":1},{"id":1768854585560,"cantidad":1}],"clientesPermitidos":["2"],"subservicio":"serigrafia+planchado","quienRopa":"cliente_ropa","enCaja":true,"tamanoCaja":50,"precio":11,"productosInventario":[1768852685196,1768852729362,1768852760551,1768854441473,1768854474683,1768854499241,1768854542540,1768854585560],"id":1769000000005,"talla":"140","modelo":"2ª equipación","prenda":"Camiseta"},
  {"nombre":"CAMISETA 2ª EQUIPACIÓN 152 (niño)","servicio":"serigrafia","materiales":[{"id":1768852685196,"cantidad":1},{"id":1768852729362,"cantidad":1},{"id":1768852760551,"cantidad":1},{"id":1768854441473,"cantidad":1},{"id":1768854474683,"cantidad":1},{"id":1768854499241,"cantidad":1},{"id":1768854542540,"cantidad":1},{"id":1768854585560,"cantidad":1}],"clientesPermitidos":["2"],"subservicio":"serigrafia+planchado","quienRopa":"cliente_ropa","enCaja":true,"tamanoCaja":50,"precio":11,"productosInventario":[1768852685196,1768852729362,1768852760551,1768854441473,1768854474683,1768854499241,1768854542540,1768854585560],"id":1769000000006,"talla":"152","modelo":"2ª equipación","prenda":"Camiseta"},
  {"nombre":"CAMISETA 2ª EQUIPACIÓN 164 (niño)","servicio":"serigrafia","materiales":[{"id":1768852685196,"cantidad":1},{"id":1768852729362,"cantidad":1},{"id":1768852760551,"cantidad":1},{"id":1768854441473,"cantidad":1},{"id":1768854474683,"cantidad":1},{"id":1768854499241,"cantidad":1},{"id":1768854542540,"cantidad":1},{"id":1768854585560,"cantidad":1}],"clientesPermitidos":["2"],"subservicio":"serigrafia+planchado","quienRopa":"cliente_ropa","enCaja":true,"tamanoCaja":50,"precio":11,"productosInventario":[1768852685196,1768852729362,1768852760551,1768854441473,1768854474683,1768854499241,1768854542540,1768854585560],"id":1769000000007,"talla":"164","modelo":"2ª equipación","prenda":"Camiseta"},
  {"nombre":"CAMISETA 3ª EQUIPACIÓN 128 (niño)","servicio":"serigrafia","materiales":[{"id":1768852685196,"cantidad":1},{"id":1768852729362,"cantidad":1},{"id":1768852760551,"cantidad":1},{"id":1768854441473,"cantidad":1},{"id":1768854474683,"cantidad":1},{"id":1768854499241,"cantidad":1},{"id":1768854542540,"cantidad":1},{"id":1768854585560,"cantidad":1}],"clientesPermitidos":["2"],"subservicio":"serigrafia+planchado","quienRopa":"cliente_ropa","enCaja":true,"tamanoCaja":50,"precio":11,"productosInventario":[1768852685196,1768852729362,1768852760551,1768854441473,1768854474683,1768854499241,1768854542540,1768854585560],"id":1769000000008,"talla":"128","modelo":"3ª equipación","prenda":"Camiseta"},
  {"nombre":"CAMISETA 3ª EQUIPACIÓN 140 (niño)","servicio":"serigrafia","materiales":[{"id":1768852685196,"cantidad":1},{"id":1768852729362,"cantidad":1},{"id":1768852760551,"cantidad":1},{"id":1768854441473,"cantidad":1},{"id":1768854474683,"cantidad":1},{"id":1768854499241,"cantidad":1},{"id":1768854542540,"cantidad":1},{"id":1768854585560,"cantidad":1}],"clientesPermitidos":["2"],"subservicio":"serigrafia+planchado","quienRopa":"cliente_ropa","enCaja":true,"tamanoCaja":50,"precio":11,"productosInventario":[1768852685196,1768852729362,1768852760551,1768854441473,1768854474683,1768854499241,1768854542540,1768854585560],"id":1769000000009,"talla":"140","modelo":"3ª equipación","prenda":"Camiseta"},
  {"nombre":"CAMISETA 3ª EQUIPACIÓN 152 (niño)","servicio":"serigrafia","materiales":[{"id":1768852685196,"cantidad":1},{"id":1768852729362,"cantidad":1},{"id":1768852760551,"cantidad":1},{"id":1768854441473,"cantidad":1},{"id":1768854474683,"cantidad":1},{"id":1768854499241,"cantidad":1},{"id":1768854542540,"cantidad":1},{"id":1768854585560,"cantidad":1}],"clientesPermitidos":["2"],"subservicio":"serigrafia+planchado","quienRopa":"cliente_ropa","enCaja":true,"tamanoCaja":50,"precio":11,"productosInventario":[1768852685196,1768852729362,1768852760551,1768854441473,1768854474683,1768854499241,1768854542540,1768854585560],"id":1769000000010,"talla":"152","modelo":"3ª equipación","prenda":"Camiseta"},
  {"nombre":"CAMISETA 3ª EQUIPACIÓN 164 (niño)","servicio":"serigrafia","materiales":[{"id":1768852685196,"cantidad":1},{"id":1768852729362,"cantidad":1},{"id":1768852760551,"cantidad":1},{"id":1768854441473,"cantidad":1},{"id":1768854474683,"cantidad":1},{"id":1768854499241,"cantidad":1},{"id":1768854542540,"cantidad":1},{"id":1768854585560,"cantidad":1}],"clientesPermitidos":["2"],"subservicio":"serigrafia+planchado","quienRopa":"cliente_ropa","enCaja":true,"tamanoCaja":50,"precio":11,"productosInventario":[1768852685196,1768852729362,1768852760551,1768854441473,1768854474683,1768854499241,1768854542540,1768854585560],"id":1769000000011,"talla":"164","modelo":"3ª equipación","prenda":"Camiseta"},
  {"nombre":"CAMISETA 1ª EQUIPACIÓN S (hombre)","servicio":"serigrafia","materiales":[{"id":1768852685196,"cantidad":1},{"id":1768852729362,"cantidad":1},{"id":1768852760551,"cantidad":1},{"id":1768854441473,"cantidad":1},{"id":1768854474683,"cantidad":1},{"id":1768854499241,"cantidad":1},{"id":1768854542540,"cantidad":1},{"id":1768854585560,"cantidad":1}],"clientesPermitidos":["2"],"subservicio":"serigrafia+planchado","quienRopa":"cliente_ropa","enCaja":true,"tamanoCaja":50,"precio":11,"productosInventario":[1768852685196,1768852729362,1768852760551,1768854441473,1768854474683,1768854499241,1768854542540,1768854585560],"id":1769000000012,"talla":"S_hombre","modelo":"1ª equipación","prenda":"Camiseta"},
  {"nombre":"CAMISETA 1ª EQUIPACIÓN M (hombre)","servicio":"serigrafia","materiales":[{"id":1768852685196,"cantidad":1},{"id":1768852729362,"cantidad":1},{"id":1768852760551,"cantidad":1},{"id":1768854441473,"cantidad":1},{"id":1768854474683,"cantidad":1},{"id":1768854499241,"cantidad":1},{"id":1768854542540,"cantidad":1},{"id":1768854585560,"cantidad":1}],"clientesPermitidos":["2"],"subservicio":"serigrafia+planchado","quienRopa":"cliente_ropa","enCaja":true,"tamanoCaja":50,"precio":11,"productosInventario":[1768852685196,1768852729362,1768852760551,1768854441473,1768854474683,1768854499241,1768854542540,1768854585560],"id":1769000000013,"talla":"M_hombre","modelo":"1ª equipación","prenda":"Camiseta"},
  {"nombre":"CAMISETA 1ª EQUIPACIÓN L (hombre)","servicio":"serigrafia","materiales":[{"id":1768852685196,"cantidad":1},{"id":1768852729362,"cantidad":1},{"id":1768852760551,"cantidad":1},{"id":1768854441473,"cantidad":1},{"id":1768854474683,"cantidad":1},{"id":1768854499241,"cantidad":1},{"id":1768854542540,"cantidad":1},{"id":1768854585560,"cantidad":1}],"clientesPermitidos":["2"],"subservicio":"serigrafia+planchado","quienRopa":"cliente_ropa","enCaja":true,"tamanoCaja":50,"precio":11,"productosInventario":[1768852685196,1768852729362,1768852760551,1768854441473,1768854474683,1768854499241,1768854542540,1768854585560],"id":1769000000014,"talla":"L_hombre","modelo":"1ª equipación","prenda":"Camiseta"},
  {"nombre":"CAMISETA 1ª EQUIPACIÓN XL (hombre)","servicio":"serigrafia","materiales":[{"id":1768852685196,"cantidad":1},{"id":1768852729362,"cantidad":1},{"id":1768852760551,"cantidad":1},{"id":1768854441473,"cantidad":1},{"id":1768854474683,"cantidad":1},{"id":1768854499241,"cantidad":1},{"id":1768854542540,"cantidad":1},{"id":1768854585560,"cantidad":1}],"clientesPermitidos":["2"],"subservicio":"serigrafia+planchado","quienRopa":"cliente_ropa","enCaja":true,"tamanoCaja":50,"precio":11,"productosInventario":[1768852685196,1768852729362,1768852760551,1768854441473,1768854474683,1768854499241,1768854542540,1768854585560],"id":1769000000015,"talla":"XL_hombre","modelo":"1ª equipación","prenda":"Camiseta"},
  {"nombre":"CAMISETA 1ª EQUIPACIÓN XXL (hombre)","servicio":"serigrafia","materiales":[{"id":1768852685196,"cantidad":1},{"id":1768852729362,"cantidad":1},{"id":1768852760551,"cantidad":1},{"id":1768854441473,"cantidad":1},{"id":1768854474683,"cantidad":1},{"id":1768854499241,"cantidad":1},{"id":1768854542540,"cantidad":1},{"id":1768854585560,"cantidad":1}],"clientesPermitidos":["2"],"subservicio":"serigrafia+planchado","quienRopa":"cliente_ropa","enCaja":true,"tamanoCaja":50,"precio":11,"productosInventario":[1768852685196,1768852729362,1768852760551,1768854441473,1768854474683,1768854499241,1768854542540,1768854585560],"id":1769000000016,"talla":"XXL_hombre","modelo":"1ª equipación","prenda":"Camiseta"},
  {"nombre":"CAMISETA 2ª EQUIPACIÓN S (hombre)","servicio":"serigrafia","materiales":[{"id":1768852685196,"cantidad":1},{"id":1768852729362,"cantidad":1},{"id":1768852760551,"cantidad":1},{"id":1768854441473,"cantidad":1},{"id":1768854474683,"cantidad":1},{"id":1768854499241,"cantidad":1},{"id":1768854542540,"cantidad":1},{"id":1768854585560,"cantidad":1}],"clientesPermitidos":["2"],"subservicio":"serigrafia+planchado","quienRopa":"cliente_ropa","enCaja":true,"tamanoCaja":50,"precio":11,"productosInventario":[1768852685196,1768852729362,1768852760551,1768854441473,1768854474683,1768854499241,1768854542540,1768854585560],"id":1769000000017,"talla":"S_hombre","modelo":"2ª equipación","prenda":"Camiseta"},
  {"nombre":"CAMISETA 2ª EQUIPACIÓN M (hombre)","servicio":"serigrafia","materiales":[{"id":1768852685196,"cantidad":1},{"id":1768852729362,"cantidad":1},{"id":1768852760551,"cantidad":1},{"id":1768854441473,"cantidad":1},{"id":1768854474683,"cantidad":1},{"id":1768854499241,"cantidad":1},{"id":1768854542540,"cantidad":1},{"id":1768854585560,"cantidad":1}],"clientesPermitidos":["2"],"subservicio":"serigrafia+planchado","quienRopa":"cliente_ropa","enCaja":true,"tamanoCaja":50,"precio":11,"productosInventario":[1768852685196,1768852729362,1768852760551,1768854441473,1768854474683,1768854499241,1768854542540,1768854585560],"id":1769000000018,"talla":"M_hombre","modelo":"2ª equipación","prenda":"Camiseta"},
  {"nombre":"CAMISETA 2ª EQUIPACIÓN L (hombre)","servicio":"serigrafia","materiales":[{"id":1768852685196,"cantidad":1},{"id":1768852729362,"cantidad":1},{"id":1768852760551,"cantidad":1},{"id":1768854441473,"cantidad":1},{"id":1768854474683,"cantidad":1},{"id":1768854499241,"cantidad":1},{"id":1768854542540,"cantidad":1},{"id":1768854585560,"cantidad":1}],"clientesPermitidos":["2"],"subservicio":"serigrafia+planchado","quienRopa":"cliente_ropa","enCaja":true,"tamanoCaja":50,"precio":11,"productosInventario":[1768852685196,1768852729362,1768852760551,1768854441473,1768854474683,1768854499241,1768854542540,1768854585560],"id":1769000000019,"talla":"L_hombre","modelo":"2ª equipación","prenda":"Camiseta"},
  {"nombre":"CAMISETA 2ª EQUIPACIÓN XL (hombre)","servicio":"serigrafia","materiales":[{"id":1768852685196,"cantidad":1},{"id":1768852729362,"cantidad":1},{"id":1768852760551,"cantidad":1},{"id":1768854441473,"cantidad":1},{"id":1768854474683,"cantidad":1},{"id":1768854499241,"cantidad":1},{"id":1768854542540,"cantidad":1},{"id":1768854585560,"cantidad":1}],"clientesPermitidos":["2"],"subservicio":"serigrafia+planchado","quienRopa":"cliente_ropa","enCaja":true,"tamanoCaja":50,"precio":11,"productosInventario":[1768852685196,1768852729362,1768852760551,1768854441473,1768854474683,1768854499241,1768854542540,1768854585560],"id":1769000000020,"talla":"XL_hombre","modelo":"2ª equipación","prenda":"Camiseta"},
  {"nombre":"CAMISETA 2ª EQUIPACIÓN XXL (hombre)","servicio":"serigrafia","materiales":[{"id":1768852685196,"cantidad":1},{"id":1768852729362,"cantidad":1},{"id":1768852760551,"cantidad":1},{"id":1768854441473,"cantidad":1},{"id":1768854474683,"cantidad":1},{"id":1768854499241,"cantidad":1},{"id":1768854542540,"cantidad":1},{"id":1768854585560,"cantidad":1}],"clientesPermitidos":["2"],"subservicio":"serigrafia+planchado","quienRopa":"cliente_ropa","enCaja":true,"tamanoCaja":50,"precio":11,"productosInventario":[1768852685196,1768852729362,1768852760551,1768854441473,1768854474683,1768854499241,1768854542540,1768854585560],"id":1769000000021,"talla":"XXL_hombre","modelo":"2ª equipación","prenda":"Camiseta"},
  {"nombre":"CAMISETA 3ª EQUIPACIÓN S (hombre)","servicio":"serigrafia","materiales":[{"id":1768852685196,"cantidad":1},{"id":1768852729362,"cantidad":1},{"id":1768852760551,"cantidad":1},{"id":1768854441473,"cantidad":1},{"id":1768854474683,"cantidad":1},{"id":1768854499241,"cantidad":1},{"id":1768854542540,"cantidad":1},{"id":1768854585560,"cantidad":1}],"clientesPermitidos":["2"],"subservicio":"serigrafia+planchado","quienRopa":"cliente_ropa","enCaja":true,"tamanoCaja":50,"precio":11,"productosInventario":[1768852685196,1768852729362,1768852760551,1768854441473,1768854474683,1768854499241,1768854542540,1768854585560],"id":1769000000022,"talla":"S_hombre","modelo":"3ª equipación","prenda":"Camiseta"},
  {"nombre":"CAMISETA 3ª EQUIPACIÓN M (hombre)","servicio":"serigrafia","materiales":[{"id":1768852685196,"cantidad":1},{"id":1768852729362,"cantidad":1},{"id":1768852760551,"cantidad":1},{"id":1768854441473,"cantidad":1},{"id":1768854474683,"cantidad":1},{"id":1768854499241,"cantidad":1},{"id":1768854542540,"cantidad":1},{"id":1768854585560,"cantidad":1}],"clientesPermitidos":["2"],"subservicio":"serigrafia+planchado","quienRopa":"cliente_ropa","enCaja":true,"tamanoCaja":50,"precio":11,"productosInventario":[1768852685196,1768852729362,1768852760551,1768854441473,1768854474683,1768854499241,1768854542540,1768854585560],"id":1769000000023,"talla":"M_hombre","modelo":"3ª equipación","prenda":"Camiseta"},
  {"nombre":"CAMISETA 3ª EQUIPACIÓN L (hombre)","servicio":"serigrafia","materiales":[{"id":1768852685196,"cantidad":1},{"id":1768852729362,"cantidad":1},{"id":1768852760551,"cantidad":1},{"id":1768854441473,"cantidad":1},{"id":1768854474683,"cantidad":1},{"id":1768854499241,"cantidad":1},{"id":1768854542540,"cantidad":1},{"id":1768854585560,"cantidad":1}],"clientesPermitidos":["2"],"subservicio":"serigrafia+planchado","quienRopa":"cliente_ropa","enCaja":true,"tamanoCaja":50,"precio":11,"productosInventario":[1768852685196,1768852729362,1768852760551,1768854441473,1768854474683,1768854499241,1768854542540,1768854585560],"id":1769000000024,"talla":"L_hombre","modelo":"3ª equipación","prenda":"Camiseta"},
  {"nombre":"CAMISETA 3ª EQUIPACIÓN XL (hombre)","servicio":"serigrafia","materiales":[{"id":1768852685196,"cantidad":1},{"id":1768852729362,"cantidad":1},{"id":1768852760551,"cantidad":1},{"id":1768854441473,"cantidad":1},{"id":1768854474683,"cantidad":1},{"id":1768854499241,"cantidad":1},{"id":1768854542540,"cantidad":1},{"id":1768854585560,"cantidad":1}],"clientesPermitidos":["2"],"subservicio":"serigrafia+planchado","quienRopa":"cliente_ropa","enCaja":true,"tamanoCaja":50,"precio":11,"productosInventario":[1768852685196,1768852729362,1768852760551,1768854441473,1768854474683,1768854499241,1768854542540,1768854585560],"id":1769000000025,"talla":"XL_hombre","modelo":"3ª equipación","prenda":"Camiseta"},
  {"nombre":"CAMISETA 3ª EQUIPACIÓN XXL (hombre)","servicio":"serigrafia","materiales":[{"id":1768852685196,"cantidad":1},{"id":1768852729362,"cantidad":1},{"id":1768852760551,"cantidad":1},{"id":1768854441473,"cantidad":1},{"id":1768854474683,"cantidad":1},{"id":1768854499241,"cantidad":1},{"id":1768854542540,"cantidad":1},{"id":1768854585560,"cantidad":1}],"clientesPermitidos":["2"],"subservicio":"serigrafia+planchado","quienRopa":"cliente_ropa","enCaja":true,"tamanoCaja":50,"precio":11,"productosInventario":[1768852685196,1768852729362,1768852760551,1768854441473,1768854474683,1768854499241,1768854542540,1768854585560],"id":1769000000026,"talla":"XXL_hombre","modelo":"3ª equipación","prenda":"Camiseta"},
  {"nombre":"CAMISETA 1ª EQUIPACIÓN S (mujer)","servicio":"serigrafia","materiales":[{"id":1768852685196,"cantidad":1},{"id":1768852729362,"cantidad":1},{"id":1768852760551,"cantidad":1},{"id":1768854441473,"cantidad":1},{"id":1768854474683,"cantidad":1},{"id":1768854499241,"cantidad":1},{"id":1768854542540,"cantidad":1},{"id":1768854585560,"cantidad":1}],"clientesPermitidos":["2"],"subservicio":"serigrafia+planchado","quienRopa":"cliente_ropa","enCaja":true,"tamanoCaja":50,"precio":11,"productosInventario":[1768852685196,1768852729362,1768852760551,1768854441473,1768854474683,1768854499241,1768854542540,1768854585560],"id":1769000000027,"prenda":"Camiseta","modelo":"1ª equipación","talla":"S_mujer"},
  {"nombre":"CAMISETA 1ª EQUIPACIÓN M (mujer)","servicio":"serigrafia","materiales":[{"id":1768852685196,"cantidad":1},{"id":1768852729362,"cantidad":1},{"id":1768852760551,"cantidad":1},{"id":1768854441473,"cantidad":1},{"id":1768854474683,"cantidad":1},{"id":1768854499241,"cantidad":1},{"id":1768854542540,"cantidad":1},{"id":1768854585560,"cantidad":1}],"clientesPermitidos":["2"],"subservicio":"serigrafia+planchado","quienRopa":"cliente_ropa","enCaja":true,"tamanoCaja":50,"precio":11,"productosInventario":[1768852685196,1768852729362,1768852760551,1768854441473,1768854474683,1768854499241,1768854542540,1768854585560],"id":1769000000028,"talla":"M_mujer","prenda":"Camiseta","modelo":"1ª equipación"},
  {"nombre":"CAMISETA 1ª EQUIPACIÓN L (mujer)","servicio":"serigrafia","materiales":[{"id":1768852685196,"cantidad":1},{"id":1768852729362,"cantidad":1},{"id":1768852760551,"cantidad":1},{"id":1768854441473,"cantidad":1},{"id":1768854474683,"cantidad":1},{"id":1768854499241,"cantidad":1},{"id":1768854542540,"cantidad":1},{"id":1768854585560,"cantidad":1}],"clientesPermitidos":["2"],"subservicio":"serigrafia+planchado","quienRopa":"cliente_ropa","enCaja":true,"tamanoCaja":50,"precio":11,"productosInventario":[1768852685196,1768852729362,1768852760551,1768854441473,1768854474683,1768854499241,1768854542540,1768854585560],"id":1769000000029,"prenda":"Camiseta","modelo":"1ª equipación","talla":"L_mujer"},
  {"nombre":"CAMISETA 1ª EQUIPACIÓN XL (mujer)","servicio":"serigrafia","materiales":[{"id":1768852685196,"cantidad":1},{"id":1768852729362,"cantidad":1},{"id":1768852760551,"cantidad":1},{"id":1768854441473,"cantidad":1},{"id":1768854474683,"cantidad":1},{"id":1768854499241,"cantidad":1},{"id":1768854542540,"cantidad":1},{"id":1768854585560,"cantidad":1}],"clientesPermitidos":["2"],"subservicio":"serigrafia+planchado","quienRopa":"cliente_ropa","enCaja":true,"tamanoCaja":50,"precio":11,"productosInventario":[1768852685196,1768852729362,1768852760551,1768854441473,1768854474683,1768854499241,1768854542540,1768854585560],"id":1769000000030,"prenda":"Camiseta","modelo":"1ª equipación","talla":"XL_mujer"},
  {"nombre":"CAMISETA 2ª EQUIPACIÓN S (mujer)","servicio":"serigrafia","materiales":[{"id":1768852685196,"cantidad":1},{"id":1768852729362,"cantidad":1},{"id":1768852760551,"cantidad":1},{"id":1768854441473,"cantidad":1},{"id":1768854474683,"cantidad":1},{"id":1768854499241,"cantidad":1},{"id":1768854542540,"cantidad":1},{"id":1768854585560,"cantidad":1}],"clientesPermitidos":["2"],"subservicio":"serigrafia+planchado","quienRopa":"cliente_ropa","enCaja":true,"tamanoCaja":50,"precio":11,"productosInventario":[1768852685196,1768852729362,1768852760551,1768854441473,1768854474683,1768854499241,1768854542540,1768854585560],"id":1769000000031,"prenda":"Camiseta","modelo":"2ª equipación","talla":"S_mujer"},
  {"nombre":"CAMISETA 2ª EQUIPACIÓN M (mujer)","servicio":"serigrafia","materiales":[{"id":1768852685196,"cantidad":1},{"id":1768852729362,"cantidad":1},{"id":1768852760551,"cantidad":1},{"id":1768854441473,"cantidad":1},{"id":1768854474683,"cantidad":1},{"id":1768854499241,"cantidad":1},{"id":1768854542540,"cantidad":1},{"id":1768854585560,"cantidad":1}],"clientesPermitidos":["2"],"subservicio":"serigrafia+planchado","quienRopa":"cliente_ropa","enCaja":true,"tamanoCaja":50,"precio":11,"productosInventario":[1768852685196,1768852729362,1768852760551,1768854441473,1768854474683,1768854499241,1768854542540,1768854585560],"id":1769000000032,"prenda":"Camiseta","modelo":"2ª equipación","talla":"M_mujer"},
  {"nombre":"CAMISETA 2ª EQUIPACIÓN L (mujer)","servicio":"serigrafia","materiales":[{"id":1768852685196,"cantidad":1},{"id":1768852729362,"cantidad":1},{"id":1768852760551,"cantidad":1},{"id":1768854441473,"cantidad":1},{"id":1768854474683,"cantidad":1},{"id":1768854499241,"cantidad":1},{"id":1768854542540,"cantidad":1},{"id":1768854585560,"cantidad":1}],"clientesPermitidos":["2"],"subservicio":"serigrafia+planchado","quienRopa":"cliente_ropa","enCaja":true,"tamanoCaja":50,"precio":11,"productosInventario":[1768852685196,1768852729362,1768852760551,1768854441473,1768854474683,1768854499241,1768854542540,1768854585560],"id":1769000000033,"prenda":"Camiseta","modelo":"2ª equipación","talla":"L_mujer"},
  {"nombre":"CAMISETA 2ª EQUIPACIÓN XL (mujer)","servicio":"serigrafia","materiales":[{"id":1768852685196,"cantidad":1},{"id":1768852729362,"cantidad":1},{"id":1768852760551,"cantidad":1},{"id":1768854441473,"cantidad":1},{"id":1768854474683,"cantidad":1},{"id":1768854499241,"cantidad":1},{"id":1768854542540,"cantidad":1},{"id":1768854585560,"cantidad":1}],"clientesPermitidos":["2"],"subservicio":"serigrafia+planchado","quienRopa":"cliente_ropa","enCaja":true,"tamanoCaja":50,"precio":11,"productosInventario":[1768852685196,1768852729362,1768852760551,1768854441473,1768854474683,1768854499241,1768854542540,1768854585560],"id":1769000000034,"prenda":"Camiseta","modelo":"2ª equipación","talla":"XL_mujer"},
  {"nombre":"CAMISETA 3ª EQUIPACIÓN S (mujer)","servicio":"serigrafia","materiales":[{"id":1768852685196,"cantidad":1},{"id":1768852729362,"cantidad":1},{"id":1768852760551,"cantidad":1},{"id":1768854441473,"cantidad":1},{"id":1768854474683,"cantidad":1},{"id":1768854499241,"cantidad":1},{"id":1768854542540,"cantidad":1},{"id":1768854585560,"cantidad":1}],"clientesPermitidos":["2"],"subservicio":"serigrafia+planchado","quienRopa":"cliente_ropa","enCaja":true,"tamanoCaja":50,"precio":11,"productosInventario":[1768852685196,1768852729362,1768852760551,1768854441473,1768854474683,1768854499241,1768854542540,1768854585560],"id":1769000000035,"prenda":"Camiseta","modelo":"3ª equipación","talla":"S_mujer"},
  {"nombre":"CAMISETA 3ª EQUIPACIÓN M (mujer)","servicio":"serigrafia","materiales":[{"id":1768852685196,"cantidad":1},{"id":1768852729362,"cantidad":1},{"id":1768852760551,"cantidad":1},{"id":1768854441473,"cantidad":1},{"id":1768854474683,"cantidad":1},{"id":1768854499241,"cantidad":1},{"id":1768854542540,"cantidad":1},{"id":1768854585560,"cantidad":1}],"clientesPermitidos":["2"],"subservicio":"serigrafia+planchado","quienRopa":"cliente_ropa","enCaja":true,"tamanoCaja":50,"precio":11,"productosInventario":[1768852685196,1768852729362,1768852760551,1768854441473,1768854474683,1768854499241,1768854542540,1768854585560],"id":1769000000036,"prenda":"Camiseta","modelo":"3ª equipación","talla":"M_mujer"},
  {"nombre":"CAMISETA 3ª EQUIPACIÓN L (mujer)","servicio":"serigrafia","materiales":[{"id":1768852685196,"cantidad":1},{"id":1768852729362,"cantidad":1},{"id":1768852760551,"cantidad":1},{"id":1768854441473,"cantidad":1},{"id":1768854474683,"cantidad":1},{"id":1768854499241,"cantidad":1},{"id":1768854542540,"cantidad":1},{"id":1768854585560,"cantidad":1}],"clientesPermitidos":["2"],"subservicio":"serigrafia+planchado","quienRopa":"cliente_ropa","enCaja":true,"tamanoCaja":50,"precio":11,"productosInventario":[1768852685196,1768852729362,1768852760551,1768854441473,1768854474683,1768854499241,1768854542540,1768854585560],"id":1769000000037,"prenda":"Camiseta","modelo":"3ª equipación","talla":"L_mujer"},
  {"nombre":"CAMISETA 3ª EQUIPACIÓN XL (mujer)","servicio":"serigrafia","materiales":[{"id":1768852685196,"cantidad":1},{"id":1768852729362,"cantidad":1},{"id":1768852760551,"cantidad":1},{"id":1768854441473,"cantidad":1},{"id":1768854474683,"cantidad":1},{"id":1768854499241,"cantidad":1},{"id":1768854542540,"cantidad":1},{"id":1768854585560,"cantidad":1}],"clientesPermitidos":["2"],"subservicio":"serigrafia+planchado","quienRopa":"cliente_ropa","enCaja":true,"tamanoCaja":50,"precio":11,"productosInventario":[1768852685196,1768852729362,1768852760551,1768854441473,1768854474683,1768854499241,1768854542540,1768854585560],"id":1769000000038,"prenda":"Camiseta","modelo":"3ª equipación","talla":"XL_mujer"},
  // ... (continúa con el resto de productos finales que has proporcionado, hasta el último objeto)
];
// Catálogo de ejemplo: empresaId -> servicio -> array de prendas/objetos
const INITIAL_CATALOGOS_EMPRESA = {
  // empresaId: { servicio: ["Camiseta", "Pantalón", ...] }
  4: {
    dtf: ["Camiseta", "Pantalón", "Chándal", "Anorak"],
    rotulacion: ["Furgoneta", "Balón", "Botella"]
  }
};

// Las funciones setCatalogoEmpresa y getCatalogoEmpresa deben ir dentro de DataProvider
import { createContext, useContext, useState, useEffect } from "react";

const DataContext = createContext(null);

// Datos iniciales de pedidos vacíos
const INITIAL_PEDIDOS = [];

const INITIAL_INVENTARIO = [
  {"nombre":"ESCUDO ADULTO","categoria":"Transfer","stock":20000,"stockMinimo":2500,"precio":2,"disponibleParaPedidos":false,"serviciosDisponibles":["serigrafia"],"id":1768852685196,"usados":0},
  {"nombre":"MARCAJE DIGI 1ª EQUIPACION","categoria":"Transfer","stock":20000,"stockMinimo":2500,"precio":1.5,"disponibleParaPedidos":false,"serviciosDisponibles":["serigrafia"],"id":1768852729362,"usados":0},
  {"nombre":"MARCAJE ORIGEN 1ªEQUIPACION","categoria":"Transfer","stock":20000,"stockMinimo":2500,"precio":1,"disponibleParaPedidos":false,"serviciosDisponibles":["serigrafia"],"id":1768852760551,"usados":0},
  {"nombre":"VINILO NEGRO MATE 5 AÑOS","categoria":"Vinilo","stock":67,"stockMinimo":15,"precio":27,"disponibleParaPedidos":true,"serviciosDisponibles":["rotulacion"],"id":1768852824131,"usados":0},
  {"nombre":"MARCAJE PROD.OFICIAL ","categoria":"Transfer","stock":20000,"stockMinimo":2500,"precio":1,"disponibleParaPedidos":false,"serviciosDisponibles":["serigrafia"],"id":1768854441473,"usados":0},
  {"nombre":"MARCAJE INTEGRA 1ªEQUIPACION","categoria":"Transfer","stock":20000,"stockMinimo":2500,"precio":1,"disponibleParaPedidos":false,"serviciosDisponibles":["serigrafia"],"id":1768854474683,"usados":0},
  {"nombre":"PARCHE LIGA","categoria":"Transfer","stock":20000,"stockMinimo":2500,"precio":2,"disponibleParaPedidos":false,"serviciosDisponibles":["serigrafia"],"id":1768854499241,"usados":0},
  {"nombre":"MARCAJE CENTRAL LECHERA 1ªEQUIPACION","categoria":"Transfer","stock":20000,"stockMinimo":2500,"precio":1,"disponibleParaPedidos":false,"serviciosDisponibles":["serigrafia"],"id":1768854542540,"usados":0},
  {"nombre":"MARCAJE HYUNDAI 1ªEQUIPACION","categoria":"Transfer","stock":19986,"stockMinimo":2500,"precio":1.5,"disponibleParaPedidos":false,"serviciosDisponibles":["serigrafia"],"id":1768854585560,"usados":0}
];

// Al crear un producto en inventario, debe tener el campo 'usados' (contador de veces utilizado)

const INITIAL_USUARIOS = [
  { id: 1, username: "admin", password: "admin123", nombre: "Administrador", email: "admin@realprint.com", role: "admin", activo: true },
  { id: 2, username: "cliente", password: "cliente123", nombre: "Cliente Demo", email: "cliente@email.com", role: "cliente", activo: true },
  { id: 3, username: "operario_demo_serigrafia", password: "operario123", nombre: "Operario Demo Serigrafía", email: "operario_demo_serigrafia@email.com", role: "operario", activo: true, especialidad: "serigrafia" },
  { id: 4, username: "operario_demo_rotulacion", password: "operario123", nombre: "Operario Demo Rotulación", email: "operario_demo_rotulacion@email.com", role: "operario", activo: true, especialidad: "rotulacion" },
];

const INITIAL_TAREAS = [
  // ...tareas si las hubiera
];

export const ESTADOS_PEDIDO = {
  pendiente: { label: "Pendiente", color: "bg-yellow-300 text-yellow-800" },
  en_proceso: { label: "En Proceso", color: "bg-blue-300 text-blue-800" },
  completado: { label: "Completado", color: "bg-green-300 text-green-800" },
  enviado: { label: "Enviado", color: "bg-purple-300 text-purple-800" },
  cancelado: { label: "Cancelado", color: "bg-red-300 text-red-800" },
};

export const SERVICIOS = [
  {
    value: "serigrafia",
    label: "Serigrafía",
    subservicios: [],
  },
  {
    value: "rotulacion",
    label: "Rotulación",
    subservicios: [],
  },
];

export function DataProvider({ children }) {
  // Productos finales (prendas/objetos que trae el cliente y se asocian a materiales del inventario)
  const [productosFinales, setProductosFinales] = useState(() => {
    const stored = localStorage.getItem("realprint_productos_finales");
    return stored ? JSON.parse(stored) : INITIAL_PRODUCTOS_FINALES;
  });


  // Catálogo de prendas/objetos por empresa y servicio (con persistencia en localStorage)
  const [catalogosEmpresa, setCatalogosEmpresa] = useState(() => {
    const stored = localStorage.getItem("realprint_catalogos_empresa");
    return stored ? JSON.parse(stored) : INITIAL_CATALOGOS_EMPRESA;
  });

  // Guardar catálogo en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem("realprint_catalogos_empresa", JSON.stringify(catalogosEmpresa));
  }, [catalogosEmpresa]);

  // Añadir o actualizar catálogo para una empresa y servicio
  const setCatalogoEmpresa = (empresaId, servicio, prendas) => {
    setCatalogosEmpresa(prev => ({
      ...prev,
      [empresaId]: {
        ...(prev[empresaId] || {}),
        [servicio]: prendas
      }
    }));
  };

  // Obtener catálogo para una empresa y servicio
  const getCatalogoEmpresa = (empresaId, servicio) => {
    return (catalogosEmpresa[empresaId] && catalogosEmpresa[empresaId][servicio]) || [];
  };

  // Guardar productos finales en localStorage cuando cambian
        useEffect(() => {
          localStorage.setItem("realprint_productos_finales", JSON.stringify(productosFinales));
        }, [productosFinales]);
        // Funciones para productos finales
        const addProductoFinal = (producto) => {
          const newProducto = { ...producto, id: Date.now() };
          setProductosFinales([...productosFinales, newProducto]);
          return newProducto;
        };

        const updateProductoFinal = (id, updates) => {
          setProductosFinales(productosFinales.map((p) => (p.id === id ? { ...p, ...updates } : p)));
        };

        const deleteProductoFinal = (id) => {
          setProductosFinales(productosFinales.filter((p) => p.id !== id));
        };
  const [pedidos, setPedidos] = useState(() => {
    const stored = localStorage.getItem("realprint_pedidos");
    return stored ? JSON.parse(stored) : INITIAL_PEDIDOS;
  });
  const [inventario, setInventario] = useState(() => {
    const stored = localStorage.getItem("realprint_inventario");
    const base = stored ? JSON.parse(stored) : INITIAL_INVENTARIO;
    // Asegura que todos los productos tengan el campo 'usados'
    return base.map(item => ({ ...item, usados: typeof item.usados === 'number' ? item.usados : 0 }));
  });
  const [usuarios, setUsuarios] = useState(() => {
    const stored = localStorage.getItem("realprint_usuarios");
    return stored ? JSON.parse(stored) : INITIAL_USUARIOS;
  });

  // Añadir tarea pendiente para el operario adecuado
  const addTareaPorPedido = (pedido) => {
    // Buscar operario con especialidad igual al servicio del pedido (ignorando mayúsculas/minúsculas)
    const servicioKey = (pedido.servicio || "").toLowerCase();
    const operario = usuarios.find(u => u.role === "operario" && (u.especialidad || "").toLowerCase() === servicioKey);
    if (!operario) return;
    const nuevaTarea = {
      id: Date.now(),
      operarioId: operario.id,
      pedidoId: pedido.id,
      tarea: `Atender pedido de ${pedido.servicio}`,
      estado: "pendiente",
      fechaCreacion: new Date().toISOString(),
    };
    setTareas(prev => [nuevaTarea, ...prev]);
  };
  const [tareas, setTareas] = useState(() => {
    const stored = localStorage.getItem("realprint_tareas");
    return stored ? JSON.parse(stored) : INITIAL_TAREAS;
  });


  // Guardar inventario en localStorage cuando cambian
  useEffect(() => {
    localStorage.setItem("realprint_inventario", JSON.stringify(inventario));
  }, [inventario]);

  // Guardar pedidos en localStorage cuando cambian
  useEffect(() => {
    localStorage.setItem("realprint_pedidos", JSON.stringify(pedidos));
  }, [pedidos]);

  // Guardar usuarios en localStorage cuando cambian
  useEffect(() => {
    localStorage.setItem("realprint_usuarios", JSON.stringify(usuarios));
  }, [usuarios]);

  // Guardar tareas en localStorage cuando cambian
  useEffect(() => {
    localStorage.setItem("realprint_tareas", JSON.stringify(tareas));
  }, [tareas]);

  // Funciones para pedidos
  const addPedido = (pedido) => {
    const productoFinal = productosFinales.find(pf => pf.id == pedido.productoFinalId);
    // Si el producto es en caja, crear un pedido y tarea por cada caja
    if (productoFinal && productoFinal.enCaja && pedido.cantidad > 1) {
      const pedidosPorCaja = [];
      for (let i = 0; i < pedido.cantidad; i++) {
        const boxId = `${Date.now()}_${i}`;
        const pedidoCaja = {
          ...pedido,
          id: boxId,
          fecha: new Date().toISOString().split("T")[0],
          estado: "pendiente",
          boxIndex: i + 1,
          boxTotal: pedido.cantidad,
        };
        // Descontar inventario por caja
        if (productoFinal.productosInventario) {
          productoFinal.productosInventario.forEach(id => {
            const prod = inventario.find(i => i.id == id);
            if (prod) {
              updateInventario(id, { stock: Math.max(0, prod.stock - (pedido.tamanoCaja || productoFinal.tamanoCaja || 50)) });
            }
          });
        }
        pedidosPorCaja.push(pedidoCaja);
        addTareaPorPedido(pedidoCaja);
      }
      setPedidos([...pedidosPorCaja, ...pedidos]);
      return pedidosPorCaja;
    } else {
      // Pedido normal (una sola caja o unidad)
      const newPedido = {
        ...pedido,
        id: Date.now().toString(),
        fecha: new Date().toISOString().split("T")[0],
        estado: "pendiente",
      };
      // Descontar inventario si el pedido tiene productoFinalId
      if (newPedido.productoFinalId) {
        if (productoFinal && productoFinal.productosInventario) {
          productoFinal.productosInventario.forEach(id => {
            const prod = inventario.find(i => i.id == id);
            if (prod) {
              updateInventario(id, { stock: Math.max(0, prod.stock - (newPedido.cantidad || 1)) });
            }
          });
        }
      }
      setPedidos([newPedido, ...pedidos]);
      addTareaPorPedido(newPedido);
      return newPedido;
    }
  };

  const updatePedido = (id, updates) => {
    setPedidos(pedidos.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };

  const deletePedido = (id) => {
    setPedidos(pedidos.filter((p) => p.id !== id));
    setTareas(tareas.filter((t) => t.pedidoId !== id));
  };

  // Funciones para inventario
  const updateInventario = (id, updates) => {
    setInventario(inventario.map((i) => (i.id === id ? { ...i, ...updates } : i)));
  };

  const addInventario = (item) => {
    const newItem = { ...item, id: Date.now(), usados: 0 };
    setInventario([...inventario, newItem]);
    return newItem;
  };

  const deleteInventario = (id) => {
    setInventario(inventario.filter((i) => i.id !== id));
  };

  // Funciones para usuarios
  const addUsuario = (usuario) => {
    const newUsuario = { ...usuario, id: Date.now(), activo: true };
    setUsuarios([...usuarios, newUsuario]);
    return newUsuario;
  };

  const updateUsuario = (id, updates) => {
    setUsuarios(usuarios.map((u) => (u.id === id ? { ...u, ...updates } : u)));
  };

  const deleteUsuario = (id) => {
    setUsuarios(usuarios.filter((u) => u.id !== id));
  };

  // Funciones para tareas
  const updateTarea = (id, updates) => {
    setTareas(tareas.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  };

  // Estadísticas
  const getEstadisticas = () => {
    const pedidosPendientes = pedidos.filter((p) => p.estado === "pendiente").length;
    const pedidosEnProceso = pedidos.filter((p) => p.estado === "en_proceso").length;
    const pedidosCompletados = pedidos.filter((p) => p.estado === "completado" || p.estado === "enviado").length;
    const productosStockBajo = inventario.filter((i) => i.stock <= i.stockMinimo).length;
    const totalVentas = pedidos.reduce((sum, p) => sum + (typeof p.total === "number" ? p.total : 0), 0);
    const usuariosActivos = usuarios.filter((u) => u.activo).length;

    return {
      pedidosPendientes,
      pedidosEnProceso,
      pedidosCompletados,
      productosStockBajo,
      totalVentas,
      usuariosActivos,
      totalPedidos: pedidos.length,
    };
  };

  const value = {
      productosFinales,
      setProductosFinales,
      addProductoFinal,
      updateProductoFinal,
      deleteProductoFinal,
    pedidos,
    inventario,
    usuarios,
    tareas,
    catalogosEmpresa,
    setCatalogoEmpresa,
    getCatalogoEmpresa,
    addPedido,
    updatePedido,
    deletePedido,
    updateInventario,
    addInventario,
    deleteInventario,
    addUsuario,
    updateUsuario,
    deleteUsuario,
    updateTarea,
    getEstadisticas,
    catalogosEmpresa,
    setCatalogoEmpresa,
    getCatalogoEmpresa,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData debe usarse dentro de DataProvider");
  }
  return context;
}
