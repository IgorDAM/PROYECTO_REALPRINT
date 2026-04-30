import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePagination } from './usePagination';

describe('usePagination', () => {
  const mockItems = Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    name: `Item ${i + 1}`,
  }));

  it('debe paginar items correctamente', () => {
    const { result } = renderHook(() => usePagination(mockItems, 25));

    expect(result.current.paginatedItems).toHaveLength(25);
    expect(result.current.paginatedItems[0].id).toBe(1);
    expect(result.current.totalPages).toBe(4);
  });

  it('debe tener el total de páginas correcto', () => {
    const { result } = renderHook(() => usePagination(mockItems, 25));

    expect(result.current.totalPages).toBe(4);
    expect(result.current.pageInfo.totalItems).toBe(100);
  });

  it('debe cambiar a siguiente página', () => {
    const { result } = renderHook(() => usePagination(mockItems, 25));

    expect(result.current.currentPage).toBe(1);

    act(() => {
      result.current.nextPage();
    });

    expect(result.current.currentPage).toBe(2);
    expect(result.current.paginatedItems[0].id).toBe(26);
  });

  it('debe cambiar a página anterior', () => {
    const { result } = renderHook(() => usePagination(mockItems, 25));

    act(() => {
      result.current.goToPage(2);
    });

    expect(result.current.currentPage).toBe(2);

    act(() => {
      result.current.prevPage();
    });

    expect(result.current.currentPage).toBe(1);
  });

  it('debe ir a página específica', () => {
    const { result } = renderHook(() => usePagination(mockItems, 25));

    act(() => {
      result.current.goToPage(3);
    });

    expect(result.current.currentPage).toBe(3);
    expect(result.current.paginatedItems[0].id).toBe(51);
  });

  it('debe tener info de paginación correcta', () => {
    const { result } = renderHook(() => usePagination(mockItems, 25));

    expect(result.current.pageInfo).toEqual({
      currentPage: 1,
      totalPages: 4,
      totalItems: 100,
      itemsPerPage: 25,
      startIndex: 1,
      endIndex: 25,
      hasNextPage: true,
      hasPrevPage: false,
    });
  });

  it('debe tener hasNextPage false en última página', () => {
    const { result } = renderHook(() => usePagination(mockItems, 25));

    act(() => {
      result.current.goToPage(4);
    });

    expect(result.current.pageInfo.hasNextPage).toBe(false);
    expect(result.current.pageInfo.hasPrevPage).toBe(true);
  });

  it('debe limitar página a rango válido', () => {
    const { result } = renderHook(() => usePagination(mockItems, 25));

    act(() => {
      result.current.goToPage(999);
    });

    expect(result.current.currentPage).toBe(4);
  });

  it('debe manejar array vacío', () => {
    const { result } = renderHook(() => usePagination([], 25));

    expect(result.current.totalPages).toBe(0);
    expect(result.current.paginatedItems).toHaveLength(0);
    expect(result.current.pageInfo.hasNextPage).toBe(false);
  });

  it('debe actualizar items cuando cambia array', () => {
    const items1 = Array.from({ length: 50 }, (_, i) => ({ id: i + 1 }));
    const { result, rerender } = renderHook(
      ({ items }) => usePagination(items, 25),
      { initialProps: { items: items1 } }
    );

    expect(result.current.totalPages).toBe(2);

    const items2 = Array.from({ length: 100 }, (_, i) => ({ id: i + 1 }));
    rerender({ items: items2 });

    expect(result.current.totalPages).toBe(4);
  });
});

