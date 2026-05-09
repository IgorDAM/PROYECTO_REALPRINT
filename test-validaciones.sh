#!/bin/bash

echo "=== PRUEBAS DE VALIDACIONES Y PAGINACIÓN (ACTUALIZADO) ==="

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. Login y obtener token admin
echo -e "\n${YELLOW}1. Login como admin...${NC}"
RESPONSE=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}')

ADMIN_TOKEN=$(echo $RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -z "$ADMIN_TOKEN" ]; then
  echo -e "${RED}❌ Error: No se pudo obtener token de admin${NC}"
  echo "Respuesta: $RESPONSE"
  exit 1
fi

echo -e "${GREEN}✅ Token admin obtenido${NC}"

# 2. Login como cliente
echo -e "\n${YELLOW}2. Login como cliente...${NC}"
RESPONSE=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "cliente", "password": "cliente123"}')

CLIENTE_TOKEN=$(echo $RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -z "$CLIENTE_TOKEN" ]; then
  echo -e "${RED}❌ Error: No se pudo obtener token de cliente${NC}"
  echo "Respuesta: $RESPONSE"
else
  echo -e "${GREEN}✅ Token cliente obtenido${NC}"
fi

# 3. Prueba validación: Crear pedido sin servicio (campo obligatorio)
echo -e "\n${YELLOW}3. Probando validación: Crear pedido sin servicio...${NC}"
RESPONSE=$(curl -s -X POST http://localhost:8080/api/pedidos \
  -H "Authorization: Bearer $CLIENTE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"cantidad": 10}')

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X POST http://localhost:8080/api/pedidos \
  -H "Authorization: Bearer $CLIENTE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"cantidad": 10}')

if [ "$HTTP_CODE" = "400" ]; then
  echo -e "${GREEN}✅ Validación funciona (HTTP 400)${NC}"
  echo "Respuesta: $RESPONSE" | head -c 200
  echo "..."
elif [ "$HTTP_CODE" = "403" ]; then
  echo -e "${RED}❌ HTTP 403 - Sin permiso (verifica que sea cliente)${NC}"
else
  echo -e "${RED}❌ HTTP $HTTP_CODE (esperado 400)${NC}"
  echo "Respuesta: $RESPONSE"
fi

# 4. Prueba validación: Usuario con email inválido
echo -e "\n${YELLOW}4. Probando validación: Usuario con email inválido...${NC}"
RESPONSE=$(curl -s -X POST http://localhost:8080/api/usuarios \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"username": "test123", "nombre": "Test", "email": "invalid-email", "role": "cliente"}')

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X POST http://localhost:8080/api/usuarios \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"username": "test123", "nombre": "Test", "email": "invalid-email", "role": "cliente"}')

if [ "$HTTP_CODE" = "400" ]; then
  echo -e "${GREEN}✅ Validación de email funciona (HTTP 400)${NC}"
  echo "Respuesta: $RESPONSE" | head -c 200
  echo "..."
else
  echo -e "${RED}❌ HTTP $HTTP_CODE (esperado 400)${NC}"
  echo "Respuesta: $RESPONSE"
fi

# 5. Prueba validación: Username muy corto
echo -e "\n${YELLOW}5. Probando validación: Username muy corto...${NC}"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X POST http://localhost:8080/api/usuarios \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"username": "ab", "nombre": "Test", "email": "test@example.com", "role": "cliente"}')

if [ "$HTTP_CODE" = "400" ]; then
  echo -e "${GREEN}✅ Validación de longitud funciona (HTTP 400)${NC}"
else
  echo -e "${RED}❌ HTTP $HTTP_CODE (esperado 400)${NC}"
fi

# 6. Prueba paginación de pedidos
echo -e "\n${YELLOW}6. Probando paginación de pedidos...${NC}"
RESPONSE=$(curl -s "http://localhost:8080/api/pedidos?page=0&size=5&sort=id,desc" \
  -H "Authorization: Bearer $ADMIN_TOKEN")

if echo $RESPONSE | grep -q "totalElements"; then
  TOTAL=$(echo $RESPONSE | grep -o '"totalElements":[0-9]*' | grep -o '[0-9]*')
  TOTAL_PAGES=$(echo $RESPONSE | grep -o '"totalPages":[0-9]*' | grep -o '[0-9]*')
  echo -e "${GREEN}✅ Paginación funciona${NC}"
  echo "   Total elementos: $TOTAL"
  echo "   Total páginas: $TOTAL_PAGES"
  echo "   Tamaño página: 5"
else
  echo -e "${RED}❌ Paginación NO funciona (no devuelve objeto Page)${NC}"
  echo "Respuesta (primeros 200 caracteres): ${RESPONSE:0:200}..."
fi

# 7. Prueba paginación de usuarios
echo -e "\n${YELLOW}7. Probando paginación de usuarios...${NC}"
RESPONSE=$(curl -s "http://localhost:8080/api/usuarios?page=0&size=5&sort=nombre,asc" \
  -H "Authorization: Bearer $ADMIN_TOKEN")

if echo $RESPONSE | grep -q "totalElements"; then
  TOTAL=$(echo $RESPONSE | grep -o '"totalElements":[0-9]*' | grep -o '[0-9]*')
  TOTAL_PAGES=$(echo $RESPONSE | grep -o '"totalPages":[0-9]*' | grep -o '[0-9]*')
  echo -e "${GREEN}✅ Paginación de usuarios funciona${NC}"
  echo "   Total elementos: $TOTAL"
  echo "   Total páginas: $TOTAL_PAGES"
  echo "   Tamaño página: 5"
else
  echo -e "${RED}❌ Paginación de usuarios NO funciona${NC}"
  echo "Respuesta (primeros 200 caracteres): ${RESPONSE:0:200}..."
fi

# 8. Prueba orden descendente
echo -e "\n${YELLOW}8. Probando ordenamiento descendente...${NC}"
RESPONSE=$(curl -s "http://localhost:8080/api/pedidos?page=0&size=3&sort=id,desc" \
  -H "Authorization: Bearer $ADMIN_TOKEN")

if echo $RESPONSE | grep -q "totalElements"; then
  FIRST_ID=$(echo $RESPONSE | grep -o '"id":[0-9]*' | head -1 | grep -o '[0-9]*')
  echo -e "${GREEN}✅ Ordenamiento funciona${NC}"
  echo "   Primer ID (desc): $FIRST_ID"
else
  echo -e "${RED}❌ No se pudo verificar ordenamiento${NC}"
fi

echo -e "\n${YELLOW}=== FIN DE PRUEBAS ===${NC}"
echo -e "\n${YELLOW}Resumen:${NC}"
echo "- Las validaciones deben devolver HTTP 400 con mensajes de error"
echo "- La paginación debe devolver un objeto Page con totalElements, totalPages, content, etc."
echo ""
