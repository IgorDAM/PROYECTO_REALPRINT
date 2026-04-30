# =============================================================================
# RealPrint Backend - Multi-stage Dockerfile
# =============================================================================
# Stage 1: Build
FROM maven:3.9-eclipse-temurin-17-alpine as builder

WORKDIR /app

# Copiar pom.xml y descargar dependencias (cache layer)
COPY pom.xml .
RUN mvn dependency:go-offline

# Copiar código fuente
COPY src ./src

# Build JAR
RUN mvn clean package -DskipTests

# =============================================================================
# Stage 2: Runtime
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Crear usuario no-root
RUN addgroup -g 1001 appuser && \
    adduser -D -u 1001 -G appuser appuser

# Copiar JAR desde builder
COPY --from=builder /app/target/*.jar app.jar
COPY --from=builder /app/target/classes /app/config

# Cambiar permisos
RUN chown -R appuser:appuser /app

USER appuser

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8080/api/actuator/health || exit 1

# Exponer puerto
EXPOSE 8080

# Variables de entorno por defecto
ENV JAVA_OPTS="-Xms256m -Xmx512m -XX:+UseG1GC"
ENV SPRING_PROFILE=production

# Ejecutar
CMD java ${JAVA_OPTS} -jar app.jar
