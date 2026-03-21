/**
 * Punto unico de entrada de la capa de servicios.
 *
 * Por que usarlo:
 * - simplifica imports (import { authService } from "../services"),
 * - evita acoplar componentes a rutas internas de archivos.
 */
export { authService } from "./authService";
export { inventarioService } from "./inventarioService";
export { pedidosService } from "./pedidosService";
export { usuariosService } from "./usuariosService";
export { httpClient } from "./httpClient";
export { ApiError, normalizeApiError } from "./errors";
