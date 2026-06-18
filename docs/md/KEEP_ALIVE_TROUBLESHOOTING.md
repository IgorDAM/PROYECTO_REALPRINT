# Keep Backend Alive - Guía de Troubleshooting

## ¿Por qué falla el workflow "Keep Backend Alive"?

El workflow **no es culpa de cambios en tu código**. El problema es el **cold start en Render**.

### 🔴 Error Típico
```
curl: (28) Operation timed out after 120002 milliseconds with 0 bytes received
📊 Código HTTP: 000
```

## 🧊 ¿Qué es "Cold Start"?

Render **suspende los servicios gratuitos** después de 15+ minutos sin recibir solicitudes. Esto significa:

| Aspecto | Descripción |
|--------|-----------|
| **Causa** | Inactividad del backend en Render (plan gratuito) |
| **Síntoma** | El servidor responde lentamente (~30-120+ segundos) |
| **Solución** | El workflow de keep-alive hace ping regularmente para evitar suspensión |

## ✅ Acciones Sugeridas

### 1️⃣ Verificar Estado del Backend
```bash
# Accede al dashboard de Render
https://dashboard.render.com/

# Ve a tu servicio "proyecto-realprint"
# Revisa la pestaña "Logs"
```

### 2️⃣ Verificar PostgreSQL
- Asegúrate de que la **database PostgreSQL está levantada**
- Ve a: `Render Dashboard > Databases > realprint-db`
- Verifica que el estado sea **"Running"**

### 3️⃣ Test Manual del Backend
```bash
# Espera 2 minutos y luego accede a la app
https://app-realprint.netlify.app/

# O hazle curl manual (con espera)
curl -I https://proyecto-realprint.onrender.com/api/health/db
```

## 🔧 Cambios Realizados al Workflow

El workflow ha sido mejorado con **detección inteligente de cold start**:

| Mejora | Antes | Después |
|--------|-------|---------|
| **Detección de cold start** | No detectaba | **Detecta código HTTP 000 (timeout)** |
| **Espera inteligente** | 10s fijos | **90s tras detectar cold start** |
| **Timeout inicial** | 120s | **30s** (detección rápida) |
| **Timeouts post-cold-start** | 90s/60s | **60s** (estables) |
| **Total de intentos** | 3 | **3 (pero con lógica inteligente)** |
| **Tiempo máximo** | ~290s | **~210s** (3.5 min) |

### ⏰ Nuevo Patrón de Reintentos (v3 - Inteligente)

#### Escenario 1: Servidor Despierto
```
Intento 1 (30s timeout) → ✅ HTTP 200
Total: ~3-5 segundos
```

#### Escenario 2: Cold Start (Normal)
```
Intento 1 (30s timeout) → ❄️ Timeout detectado (HTTP 000)
Espera 90s (cold start) → ⏳
Intento 2 (60s timeout) → ✅ HTTP 200
Total: ~150-180 segundos
```

#### Escenario 3: Servidor Caído
```
Intento 1 (30s timeout) → ❌ HTTP 503/502
❌ Fallo inmediato (no es cold start)
Total: ~30-40 segundos
```

## 📌 Cómo Funciona la Prevención

1. **UptimeRobot** → Hace ping cada 5 minutos (tu monitor externo)
2. **GitHub Actions (keep-alive.yml)** → Hace ping en momentos intercalados
3. **Combinación** → Cubre todos los minutos ~ evita suspensión

## ❓ ¿Qué hacer si sigue fallando después de los cambios?

### Opción A: Reiniciar el Backend
1. Ve a `Render Dashboard > proyecto-realprint`
2. Click en **"Manual Deploy"** o **"Redeploy"**
3. Espera a que termine el despliegue

### Opción B: Verificar Base de Datos
```bash
# En Render Dashboard, verifica:
# 1. Database está levantada
# 2. Web Service tiene acceso a ella (Environment vars OK)
# 3. DATABASE_URL está correctamente configurada
```

### Opción C: Cambiar a Plan de Pago
Si el problema persiste, considera actualizar a un plan de pago en Render que **no suspenda por inactividad**.

## 📊 Logs para Diagnosticar

En `GitHub Actions > Keep Backend Alive > Run logs`, busca:

```
✅ Keep-alive exitoso (servidor ya despierto)  → Servidor activo
❄️ Cold start detectado. Esperando 90s...      → Normal (cold start)
✅ Keep-alive exitoso (post cold start)        → Despertó correctamente
📊 Código HTTP: 503/502                        → Servidor con problemas
❌ Todos los intentos fallaron                 → Backend realmente caído
```

## 🔗 Enlaces Útiles

- **Render Dashboard:** https://dashboard.render.com/
- **App en Producción:** https://app-realprint.netlify.app/
- **Logs del Workflow:** https://github.com/IgorDAM/PROYECTO_REALPRINT/actions/workflows/keep-alive.yml

## 📝 Notas Importantes

> **⚠️ Esto es NORMAL:**
> - Que el workflow tarde 5-10 minutos en completarse (por el cold start)
> - Que el primer access a la app sea lento (~30-60s)
> - Que veas "timeout" ocasional si no hubo requests recientemente

> **🚨 Esto NO es normal:**
> - Que **siempre** falle en todos los intentos
> - Que la app esté inaccessible por más de 1 minuto después de cold start
> - Que veas errores en logs de PostgreSQL

---

**Última actualización:** 2026-06-18
**Versión del workflow:** v3 (detección inteligente de cold start)

