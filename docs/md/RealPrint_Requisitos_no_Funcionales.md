# Requisitos No Funcionales - Resumen breve

**Proyecto**: RealPrint  
**Stack**: React 18 + Spring Boot 4.0.5 + Java 17 + MySQL 8 + Docker  
**Estado global**: **desarrollo / staging**, con base sólida pero **producción todavía parcial**.

---

## 1) Estado por áreas

### Seguridad
- ✅ JWT y roles `ADMIN/CLIENTE`
- ✅ BCrypt para contraseñas
- ✅ CORS configurado para desarrollo
- ⚠️ Falta reforzar: rate limiting, hardening HTTPS, rotación de secretos

### Funcionalidad core
- ✅ CRUD de pedidos
- ✅ Relación `pedido -> cliente` con JPA
- ✅ Gestión de archivos con `PedidoArchivo`
- ✅ Validaciones básicas en backend
- ⚠️ Auditoría avanzada todavía parcial

### Base de datos
- ✅ MySQL en Docker
- ✅ `ddl-auto=validate` en configuración actual
- ✅ Variables sensibles en entorno (`DB_PASSWORD`, `JWT_SECRET`)
- ⚠️ Backups automáticos y replicación: pendientes

### Frontend
- ✅ Dashboards de cliente y admin
- ✅ Diseño responsive
- ✅ Formularios con validación básica
- ⚠️ Accesibilidad completa y mejoras de UX: parciales

### DevOps / despliegue
- ✅ Dockerfiles presentes para backend y frontend
- ✅ `docker-compose` de desarrollo
- ✅ Pipeline CI/CD creado en `.github/workflows/ci-cd.yml`
- ⚠️ Producción endurecida, monitoring y alertas: por completar

### Documentación y calidad
- ✅ Documentación amplia del proyecto
- ✅ Springdoc configurado en el backend
- ⚠️ Tests automáticos todavía mejorables

---

## 2) Requisitos no funcionales más importantes

| Área | Estado | Comentario |
|---|---|---|
| Rendimiento | Parcial | Correcto para uso normal, falta medir y afinar |
| Seguridad | Parcial | Bien base, faltan capas extra de protección |
| Escalabilidad | Parcial | Docker y MySQL listos, falta crecer con más robustez |
| Disponibilidad | Parcial | Hay base, pero backups/replicación no están cerrados |
| Usabilidad | Bastante bien | Responsive y navegación ya resueltos |
| Mantenibilidad | Bien | Código organizado y documentación amplia |
| Calidad / tests | Parcial | Hay estructura, pero falta más cobertura |

---

## 3) Qué sí puedo decir sin exagerar

- El proyecto **está bien preparado para desarrollo y demo**.
- **No conviene decir que está 100% listo para producción**.
- Lo correcto es ponerlo como **“parcialmente listo para producción”**.

---

## 4) Qué falta para producción real

- Rate limiting
- Backups automáticos verificados
- Monitoring/alertas más completas
- Hardening HTTPS/SSL real en despliegue
- Mejor cobertura de tests
- Replicación o estrategia de alta disponibilidad

---

## 5) Conclusión corta

**Conclusión**: el proyecto está **correcto como base funcional** y **bastante avanzado**, pero el documento debe reflejar que **producción aún no está cerrada del todo**.

Si quieres, el siguiente paso puede ser dejar este resumen en formato todavía más corto, tipo **1 página**, para entregar directamente.

