#!/bin/bash

BASE_URL="http://localhost:3001"
EMAIL="joao@email.com"
PASSWORD="123456"

echo "🔐 Obtendo token..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}")

echo "Resposta completa: $LOGIN_RESPONSE"

# Extrair token de forma mais robusta
TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
    echo "❌ Erro: Não foi possível obter o token"
    echo "Resposta do servidor: $LOGIN_RESPONSE"
    exit 1
fi

echo "✅ Token obtido: ${TOKEN:0:50}..."

echo ""
echo "🚢 Buscando ferries..."
FERRY_RESPONSE=$(curl -s "$BASE_URL/api/ferries")
echo "Resposta ferries: $FERRY_RESPONSE"

# Extrair o primeiro ferry ID
FERRY_ID=$(echo "$FERRY_RESPONSE" | grep -o '"_id":"[^"]*' | head -1 | cut -d'"' -f4)

if [ -z "$FERRY_ID" ]; then
    echo "❌ Erro: Não foi possível obter Ferry ID"
    exit 1
fi

echo "✅ Ferry ID: $FERRY_ID"

echo ""
echo "🎫 Criando ticket..."
TICKET_RESPONSE=$(curl -s -X POST "$BASE_URL/api/tickets" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{
    \"ferryId\": \"$FERRY_ID\",
    \"vehicleType\": \"car\",
    \"boardingTime\": \"08:00\",
    \"boardingDate\": \"2024-12-20\",
    \"passengerCount\": 2,
    \"vehiclePlate\": \"TEST123\"
  }")

echo "Resposta criação ticket: $TICKET_RESPONSE"

# Verificar se o ticket foi criado
if echo "$TICKET_RESPONSE" | grep -q "success.*true"; then
    echo "✅ Ticket criado com sucesso!"
    
    # Extrair ticket ID
    TICKET_ID=$(echo "$TICKET_RESPONSE" | grep -o '"_id":"[^"]*' | cut -d'"' -f4)
    echo "🎫 Ticket ID: $TICKET_ID"
    
    echo ""
    echo "📋 Listando tickets do usuário..."
    curl -s -X GET "$BASE_URL/api/tickets" \
      -H "Authorization: Bearer $TOKEN" | jq . 2>/dev/null || echo "Instale jq para melhor formatação"
    
else
    echo "❌ Erro ao criar ticket: $TICKET_RESPONSE"
fi
