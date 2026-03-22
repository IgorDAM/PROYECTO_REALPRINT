import React, { lazy, Suspense } from 'react';

/**
 * Utilidad para lazy load de rutas - code splitting automático.
 *
 * Uso:
 * const AdminPedidos = lazyLoad(() => import('./pages/admin/AdminPedidos'));
 *
 * <Route path="pedidos" element={<AdminPedidos />} />
 */
export function lazyLoad(importFunc) {
  const Component = lazy(importFunc);

  return function LazyLoadedComponent(props) {
    return (
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="mb-4">
                <div className="inline-flex gap-1">
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-100" />
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-200" />
                </div>
              </div>
              <p className="text-gray-600">Cargando...</p>
            </div>
          </div>
        }
      >
        <Component {...props} />
      </Suspense>
    );
  };
}

/**
 * Hook para Intersection Observer - lazy load cuando elemento es visible.
 *
 * Uso:
 * const { ref, isVisible } = useIntersectionObserver();
 *
 * return (
 *   <div ref={ref}>
 *     {isVisible && <ExpensiveComponent />}
 *   </div>
 * );
 */
export function useIntersectionObserver(options = {}) {
  const [isVisible, setIsVisible] = React.useState(false);
  const ref = React.useRef(null);

  React.useEffect(() => {
    const observedElement = ref.current;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.unobserve(entry.target);
      }
    }, {
      threshold: 0.1,
      ...options,
    });

    if (observedElement) {
      observer.observe(observedElement);
    }

    return () => {
      if (observedElement) {
        observer.unobserve(observedElement);
      }
    };
  }, [options]);

  return { ref, isVisible };
}


