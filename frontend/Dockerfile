# =============================================================================
# RealPrint Frontend - Multi-stage Dockerfile
# =============================================================================
# Stage 1: Build
FROM node:20-alpine as builder

WORKDIR /app

# Copiar package*.json
COPY package*.json ./

# Instalar dependencias
RUN npm ci --only=production

# Instalar devDependencies para build
RUN npm install

# Copiar código fuente
COPY . .

# Build la aplicación
RUN npm run build

# =============================================================================
# Stage 2: Runtime (Nginx)
FROM nginx:alpine

WORKDIR /app

# Copiar configuración de Nginx
COPY nginx.conf /etc/nginx/nginx.conf
COPY default.conf /etc/nginx/conf.d/default.conf

# Copiar build desde builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Crear usuario no-root
RUN addgroup -g 1001 -S nginx && \
    adduser -u 1001 -S nginx -G nginx && \
    chown -R nginx:nginx /usr/share/nginx/html && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    chown -R nginx:nginx /etc/nginx/conf.d && \
    touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid

USER nginx

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:80/ || exit 1

# Exponer puerto
EXPOSE 80

# Ejecutar Nginx
CMD ["nginx", "-g", "daemon off;"]
