# ✅ PASO 10 - Performance: Paginación en Tablas

**Fecha:** 2026-03-23  
**Duración estimada:** 3 horas  
**Objetivo:** Implementar paginación en tablas admin para mejorar performance y UX

---

## 🎯 QUÉ SE HARÁ

Implementar paginación automática en:
- ✅ Admin Pedidos (actualmente muestra todos los pedidos)
- ✅ Admin Inventario (actualmente muestra todo el inventario)
- ✅ Admin Usuarios (actualmente muestra todos los usuarios)

**Beneficios:**
- Mejor performance: menos elementos en DOM
- Mejor UX: interfaz más responsiva
- Escalabilidad: listo para bases de datos grandes

---

## 🚀 EJECUCIÓN PASO A PASO

### Paso 10.1: Crear hook `usePagination` (30 min)

Crear `src/hooks/usePagination.ts`:

```typescript
// App-RealPrint/src/hooks/usePagination.ts
import { useState, useMemo } from 'react';

export interface PaginationState {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
}

export interface UsePaginationResult<T> {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
  paginatedItems: T[];
  goToPage: (page: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  setItemsPerPage: (items: number) => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
}

/**
 * Hook para gestionar paginación de listas
 *
 * Características:
 * - Gestión automática de páginas
 * - Validación de límites
 * - Cálculo automático de totales
 * - Memory efficient
 *
 * Uso:
 * const { paginatedItems, currentPage, totalPages, goToPage, nextPage, previousPage } =
 *   usePagination(items, 25);
 */
export function usePagination<T>(
  items: T[],
  itemsPerPage: number = 25
): UsePaginationResult<T> {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(itemsPerPage);

  const totalItems = items.length;
  const totalPages = Math.ceil(totalItems / pageSize);

  // Validar página actual
  const validPage = Math.min(Math.max(currentPage, 1), Math.max(totalPages, 1));

  const paginatedItems = useMemo(() => {
    const startIndex = (validPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return items.slice(startIndex, endIndex);
  }, [items, validPage, pageSize]);

  const goToPage = (page: number) => {
    const newPage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(newPage);
  };

  const nextPage = () => {
    if (validPage < totalPages) {
      setCurrentPage(validPage + 1);
    }
  };

  const previousPage = () => {
    if (validPage > 1) {
      setCurrentPage(validPage - 1);
    }
  };

  return {
    currentPage: validPage,
    itemsPerPage: pageSize,
    totalItems,
    totalPages,
    paginatedItems,
    goToPage,
    nextPage,
    previousPage,
    setItemsPerPage,
    canGoNext: validPage < totalPages,
    canGoPrevious: validPage > 1,
  };
}
```

**Validación:**
```bash
npm test -- src/hooks/usePagination.test.ts
# Tests deben pasar
```

---

### Paso 10.2: Crear componente `PaginationControls` (30 min)

Crear `src/components/PaginationControls.tsx`:

```typescript
// App-RealPrint/src/components/PaginationControls.tsx
import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
}

/**
 * Controles de paginación reutilizables
 *
 * Características:
 * - Botones de anterior/siguiente
 * - Selector de página
 * - Selector de items por página
 * - Info de total de resultados
 * - Responsive design
 */
export function PaginationControls({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
}: PaginationControlsProps) {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = parseInt(e.target.value, 10);
    onItemsPerPageChange?.(newSize);
    // Resetear a página 1 cuando cambia el tamaño
    onPageChange(1);
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-surface-50 rounded-lg border border-surface-200">
      {/* Info de resultados */}
      <div className="text-sm text-surface-600">
        <span className="font-medium">
          {totalItems === 0
            ? 'Sin resultados'
            : `Mostrando ${startItem}-${endItem} de ${totalItems}`}
        </span>
      </div>

      {/* Selector de items por página */}
      {onItemsPerPageChange && (
        <div className="flex items-center gap-2">
          <label htmlFor="items-per-page" className="text-sm text-surface-600">
            Por página:
          </label>
          <select
            id="items-per-page"
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            className="px-3 py-1 border border-surface-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>
      )}

      {/* Controles de paginación */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 text-surface-600 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition"
          title="Página anterior"
        >
          <ChevronLeftIcon className="w-5 h-5" />
        </button>

        {/* Números de página */}
        <div className="flex gap-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((page) => {
              // Mostrar página actual y páginas adyacentes
              const distancia = Math.abs(page - currentPage);
              return distancia <= 1 || page === 1 || page === totalPages;
            })
            .map((page, idx, arr) => {
              const showEllipsis = arr[idx - 1] && arr[idx - 1] !== page - 1;
              return (
                <React.Fragment key={page}>
                  {showEllipsis && (
                    <span className="px-2 py-1 text-surface-400">...</span>
                  )}
                  <button
                    onClick={() => onPageChange(page)}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition ${
                      page === currentPage
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-surface-700 hover:bg-surface-100'
                    }`}
                  >
                    {page}
                  </button>
                </React.Fragment>
              );
            })}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 text-surface-600 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition"
          title="Página siguiente"
        >
          <ChevronRightIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
```

---

### Paso 10.3: Actualizar AdminPedidos con paginación (40 min)

Modificar `src/pages/admin/AdminPedidos.jsx`:

```typescript
// Cambios en AdminPedidos.jsx
import { usePagination } from "../../hooks/usePagination";
import { PaginationControls } from "../../components/PaginationControls";

export default function AdminPedidos() {
  const { pedidos, updatePedidoSafe, deletePedidoSafe } = usePedidosData();
  const { inventario } = useInventarioData();
  const { productosFinales } = useProductosData();
  const { loading: isProcessing, error: apiError, runApi } = useApiStatus();
  const [selectedPedido, setSelectedPedido] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstado, setFilterEstado] = useState("");

  // Filtrado
  const filteredPedidos = pedidos
    .filter(pedido => pedido && typeof pedido === "object" && pedido.id && pedido.cliente)
    .filter((pedido) => {
      const matchesSearch =
        pedido.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pedido.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (pedido.pedido ? pedido.pedido.toLowerCase().includes(searchTerm.toLowerCase()) : false) ||
        (pedido.servicio ? pedido.servicio.toLowerCase().includes(searchTerm.toLowerCase()) : false) ||
        (pedido.descripcion ? pedido.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) : false);
      const matchesFilter = !filterEstado || pedido.estado === filterEstado;
      return matchesSearch && matchesFilter;
    });

  // Paginación: 25 items por página
  const {
    paginatedItems: paginatedPedidos,
    currentPage,
    totalPages,
    itemsPerPage,
    goToPage,
    setItemsPerPage,
  } = usePagination(filteredPedidos, 25);

  // ... resto del código igual ...

  return (
    <div>
      {/* Header y filtros igual... */}

      {/* Tabla paginada */}
      <div className="mt-6">
        <Table
          columns={columns}
          data={paginatedPedidos} {/* ← Usar datos paginados */}
          isLoading={isProcessing}
          error={apiError}
        />
      </div>

      {/* Controles de paginación */}
      {totalPages > 1 && (
        <div className="mt-4">
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredPedidos.length}
            itemsPerPage={itemsPerPage}
            onPageChange={goToPage}
            onItemsPerPageChange={setItemsPerPage}
          />
        </div>
      )}

      {/* Modal igual... */}
    </div>
  );
}
```

---

### Paso 10.4: Actualizar AdminInventario con paginación (40 min)

Modificar `src/pages/admin/AdminInventario.jsx` con la misma estructura.

---

### Paso 10.5: Actualizar AdminUsuarios con paginación (40 min)

Crear o modificar `src/pages/admin/AdminUsuarios.jsx` con paginación.

---

### Paso 10.6: Tests para usePagination (30 min)

Crear `src/hooks/__tests__/usePagination.test.ts`:

```typescript
// App-RealPrint/src/hooks/__tests__/usePagination.test.ts
import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePagination } from '../usePagination';

describe('usePagination', () => {
  const mockItems = Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    name: `Item ${i + 1}`,
  }));

  it('debe paginar correctamente', () => {
    const { result } = renderHook(() => usePagination(mockItems, 25));

    expect(result.current.totalItems).toBe(100);
    expect(result.current.totalPages).toBe(4);
    expect(result.current.paginatedItems).toHaveLength(25);
    expect(result.current.currentPage).toBe(1);
  });

  it('debe cambiar de página', () => {
    const { result } = renderHook(() => usePagination(mockItems, 25));

    act(() => {
      result.current.goToPage(2);
    });

    expect(result.current.currentPage).toBe(2);
    expect(result.current.paginatedItems[0].id).toBe(26);
  });

  it('debe ir a página siguiente', () => {
    const { result } = renderHook(() => usePagination(mockItems, 25));

    act(() => {
      result.current.nextPage();
    });

    expect(result.current.currentPage).toBe(2);
  });

  it('debe ir a página anterior', () => {
    const { result } = renderHook(() => usePagination(mockItems, 25));

    act(() => {
      result.current.goToPage(3);
      result.current.previousPage();
    });

    expect(result.current.currentPage).toBe(2);
  });

  it('no debe ir más allá del límite de páginas', () => {
    const { result } = renderHook(() => usePagination(mockItems, 25));

    act(() => {
      result.current.goToPage(100);
    });

    expect(result.current.currentPage).toBe(4);
  });

  it('debe indicar si puede ir a siguiente página', () => {
    const { result } = renderHook(() => usePagination(mockItems, 25));

    expect(result.current.canGoNext).toBe(true);

    act(() => {
      result.current.goToPage(4);
    });

    expect(result.current.canGoNext).toBe(false);
  });

  it('debe indicar si puede ir a página anterior', () => {
    const { result } = renderHook(() => usePagination(mockItems, 25));

    expect(result.current.canGoPrevious).toBe(false);

    act(() => {
      result.current.goToPage(2);
    });

    expect(result.current.canGoPrevious).toBe(true);
  });

  it('debe cambiar items por página', () => {
    const { result } = renderHook(() => usePagination(mockItems, 25));

    act(() => {
      result.current.setItemsPerPage(50);
    });

    expect(result.current.itemsPerPage).toBe(50);
    expect(result.current.paginatedItems).toHaveLength(50);
    expect(result.current.totalPages).toBe(2);
  });
});
```

---

### Paso 10.7: Pruebas manuales (30 min)

```bash
cd "D:\DAM\2DAM\PROYECTO_II\PROYECTO_REALPRINT\App-RealPrint"

# 1. Instalar/actualizar
npm install

# 2. Tests
npm test -- usePagination
# Todos los tests deben pasar

# 3. Desarrollo
npm run dev
# → http://localhost:5173

# 4. Navegar a Admin > Pedidos
# Debe mostrar:
# - Tabla con max 25 items
# - Controles de paginación en la parte inferior
# - Información de "Mostrando X-Y de Z"
# - Selector de items por página (10, 25, 50, 100)

# 5. Pruebas de navegación:
# - Clickear siguiente → debe ir a página 2
# - Clickear anterior → debe volver a página 1
# - Cambiar items por página → debe actualizar vista
# - Filtrar + paginar → debe mantener coherencia

# 6. Build
npm run build
# Debe compilar sin errores
```

---

## ✅ CHECKLIST DE COMPLETITUD

- [ ] `src/hooks/usePagination.ts` creado con todas las funciones
- [ ] `src/components/PaginationControls.tsx` creado
- [ ] `src/pages/admin/AdminPedidos.jsx` actualizado con paginación (25 items/página)
- [ ] `src/pages/admin/AdminInventario.jsx` actualizado con paginación (25 items/página)
- [ ] `src/pages/admin/AdminUsuarios.jsx` actualizado con paginación (25 items/página)
- [ ] `src/hooks/__tests__/usePagination.test.ts` con 8+ tests
- [ ] Todos los tests pasan (npm test)
- [ ] Build sin errores (npm run build)
- [ ] Lint sin errores (npm run lint)
- [ ] Pruebas manuales completadas

---

## 📊 RESUMEN PASO 10

| Componente | Líneas | Propósito |
|-----------|--------|----------|
| usePagination | ~90 | Hook de paginación reutilizable |
| PaginationControls | ~120 | Componente de controles de paginación |
| AdminPedidos | +30 | Integración de paginación |
| AdminInventario | +30 | Integración de paginación |
| AdminUsuarios | +30 | Integración de paginación |
| usePagination.test | ~100 | Tests exhaustivos |
| **TOTAL** | **~400** | **Paginación completa** |

---

## 🎯 PRÓXIMO PASO

**PASO 11: Toast Notifications** (2 horas)
- Crear contexto de toasts
- Componente Toast reutilizable
- Hook useToast
- Integración en operaciones

---

## 📝 NOTAS IMPORTANTES

1. **Performance**
   - Paginación no requiere refetch (es client-side)
   - Perfecto para datos que ya están en memoria
   - Para datos del servidor, usar pagination en API

2. **UX**
   - Mostrar página actual y totales
   - Disable botones cuando no hay siguiente/anterior
   - Mantener posición scroll al cambiar página (usar scrollIntoView)

3. **Escalabilidad**
   - Si datos > 10,000 items → implementar server-side pagination
   - Usar offset/limit en API
   - Mantener mismo hook para compatibilidad

4. **Mobile**
   - Responsive controls en dispositivos pequeños
   - Botones grandes en móvil
   - Considerar página actual más pequeña

---

**Status:** 🟡 En Ejecución  
**Completado:** Documentación paso 10  
**Próximo:** Implementar paso 10

