# INDEX_ONBOARDING

Guia de entrada rapida para empezar segun tiempo disponible y rol.

## Checklist de onboarding

- Leer una ruta por tiempo (5, 20 o 60 minutos).
- Seguir la ruta por rol (dev, QA, producto).
- Ejecutar comandos basicos y validar entorno.
- Usar `md/INDEX_GLOBAL.md` para profundizar.

## Ruta por tiempo

### 5 minutos (estado + entrada)

1. `md/00_inicio/00_COMIENZA_AQUI.md`
2. `md/00_inicio/PUNTO_ENTRADA.md`
3. `README.md` (raiz)

### 20 minutos (trabajo tecnico rapido)

1. `md/05_guias_y_referencias/GUIA_INSTALACION.md`
2. `md/05_guias_y_referencias/REFERENCIA_APIs.md`
3. `md/04_ejecucion_pasos/PASO_8_COMPLETADO.md`

### 60 minutos (vision completa)

1. `md/01_indices/INDICE_DOCUMENTACION.md`
2. `md/02_analisis_y_valoracion/VALORACION_ESTADO_ACTUAL.md`
3. `md/03_planes_y_roadmap/PLAN_ACCION_COMPLETADO.md`
4. `md/07_app_realprint/README.md`
5. `md/INDEX_GLOBAL.md`

## Ruta por rol

### Dev Frontend

- `md/05_guias_y_referencias/GUIA_INSTALACION.md`
- `md/05_guias_y_referencias/REFERENCIA_APIs.md`
- `md/07_app_realprint/GUIA_FUNCIONAL_FRONTEND.md`
- `md/07_app_realprint/DESIGN_TOKENS.md`

### QA

- `md/07_app_realprint/E2E_README.md`
- `md/04_ejecucion_pasos/PASO_7_COMPLETADO.md`
- `md/06_seguridad_y_calidad/REVISION_COMENTARIOS_CODIGO.md`

### Producto / Negocio

- `md/02_analisis_y_valoracion/RESUMEN_EJECUTIVO.md`
- `md/02_analisis_y_valoracion/CONCLUSIONES_FINALES.md`
- `md/03_planes_y_roadmap/PLAN_ACCION_COMPLETADO.md`

## Comandos base

```powershell
Set-Location "D:\DAM\2DAM\PROYECTO_II\PROYECTO_REALPRINT\App-RealPrint"
npm install
npm run dev
```

Para pruebas automatizadas:

```powershell
Set-Location "D:\DAM\2DAM\PROYECTO_II\PROYECTO_REALPRINT\App-RealPrint"
npm test -- --run
npm run test:e2e
```

## Siguiente documento de referencia

- Indice completo: `md/INDEX_GLOBAL.md`
- Mapa por carpetas: `md/README.md`

