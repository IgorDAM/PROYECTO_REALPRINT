import { httpClient } from "./httpClient";

interface PageLike<T> {
  content?: T[];
  last?: boolean;
}

const PAGE_SIZE = 100;
const MAX_PAGES = 50; // tope de seguridad: 5.000 registros

/**
 * Recorre un endpoint paginado de Spring (Page) y devuelve todos los elementos.
 * Si el endpoint devuelve un array plano, lo devuelve tal cual.
 * Antes se pedia solo /pedidos y /usuarios sin parametros, asi que el backend
 * entregaba unicamente la primera pagina (20 elementos).
 */
export async function fetchAllPages<T>(path: string): Promise<T[]> {
  const items: T[] = [];

  for (let page = 0; page < MAX_PAGES; page += 1) {
    const response = (await httpClient.get(`${path}?page=${page}&size=${PAGE_SIZE}`)) as T[] | PageLike<T>;

    if (Array.isArray(response)) return response;

    const content = response?.content ?? [];
    items.push(...content);

    if (response?.last !== false || content.length === 0) break;
  }

  return items;
}
