import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ErrorBoundary from './ErrorBoundary';
import { ErrorFallback } from './ErrorFallback';

// Mock logger
vi.mock('../services/logger', () => ({
  logger: {
    error: vi.fn(),
  },
}));

// Componente que lanza error
function ThrowError() {
  throw new Error('Test error');
}

// Componente que renderiza normalmente
function SafeComponent() {
  return <div>Safe content</div>;
}

describe('ErrorBoundary', () => {
  beforeEach(() => {
    // Suprimir console.error de React para tests
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  it('debe renderizar contenido normal cuando no hay errores', () => {
    render(
      <ErrorBoundary name="TestBoundary">
        <SafeComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText('Safe content')).toBeInTheDocument();
  });

  it('debe mostrar ErrorFallback cuando hay error', () => {
    render(
      <ErrorBoundary
        name="TestBoundary"
        fallback={<div>Error capturado</div>}
      >
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText('Error capturado')).toBeInTheDocument();
  });

  it('debe renderizar ErrorFallback por defecto', () => {
    render(
      <ErrorBoundary name="TestBoundary">
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText('Algo salió mal')).toBeInTheDocument();
  });

  it('debe tener botón para reintentar', () => {
    render(
      <ErrorBoundary name="TestBoundary">
        <ThrowError />
      </ErrorBoundary>
    );

    const button = screen.getByRole('button', { name: /intentar de nuevo/i });
    expect(button).toBeInTheDocument();
  });

  it('debe resetear estado cuando se hace click en reintentar', async () => {
    const user = userEvent.setup();

    const { rerender } = render(
      <ErrorBoundary name="TestBoundary">
        <ThrowError />
      </ErrorBoundary>
    );

    // Verificar que muestra error
    expect(screen.getByText('Algo salió mal')).toBeInTheDocument();

    // Rerender con componente seguro
    rerender(
      <ErrorBoundary name="TestBoundary">
        <SafeComponent />
      </ErrorBoundary>
    );

    // Hacer click en reintentar
    const button = screen.getByRole('button', { name: /intentar de nuevo/i });
    await user.click(button);

    // Debería mostrar contenido seguro
    expect(screen.getByText('Safe content')).toBeInTheDocument();
  });

  it('debe tener botón para ir al inicio', () => {
    render(
      <ErrorBoundary name="TestBoundary">
        <ThrowError />
      </ErrorBoundary>
    );

    const button = screen.getByRole('button', { name: /ir al inicio/i });
    expect(button).toBeInTheDocument();
  });

  it('debe llamar a onReset si se proporciona', async () => {
    const onReset = vi.fn();
    const user = userEvent.setup();

    const { rerender } = render(
      <ErrorBoundary
        name="TestBoundary"
        onReset={onReset}
      >
        <ThrowError />
      </ErrorBoundary>
    );

    rerender(
      <ErrorBoundary
        name="TestBoundary"
        onReset={onReset}
      >
        <SafeComponent />
      </ErrorBoundary>
    );

    const button = screen.getByRole('button', { name: /intentar de nuevo/i });
    await user.click(button);

    expect(onReset).toHaveBeenCalled();
  });

  it('debe mostrar error ID en UI', () => {
    render(
      <ErrorBoundary name="TestBoundary">
        <ThrowError />
      </ErrorBoundary>
    );

    // Verificar que hay elementos con error ID
    const errorIdElements = screen.getAllByText(/Error ID:/);
    expect(errorIdElements.length).toBeGreaterThan(0);
  });
});

