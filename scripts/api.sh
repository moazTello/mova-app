#!/bin/bash
# الاستخدام: source scripts/api.sh

export API=$(grep EXPO_PUBLIC_API_URL .env | cut -d= -f2)

# الاستخدام: login الإيميل كلمة_السر
login() {
  curl -s -X POST "$API/auth/login" \
    -H "Accept: application/json" -H "Content-Type: application/json" \
    -d "{\"email\":\"$1\",\"password\":\"$2\"}" \
    | python3 -c "import sys,json; print(json.load(sys.stdin).get('token',''))"
}

# الحسابات بتنقرا من scripts/accounts.sh (ما بينرفع على git)
[ -f scripts/accounts.sh ] && source scripts/accounts.sh

export ADMIN=$(login "$ADMIN_EMAIL" "$ADMIN_PASS")
export SELLER=$(login "$SELLER_EMAIL" "$SELLER_PASS")
export CUSTOMER=$(login "$CUSTOMER_EMAIL" "$CUSTOMER_PASS")

echo "API      = $API"
echo "ADMIN    = ${ADMIN:0:12}..."
echo "SELLER   = ${SELLER:0:12}..."
echo "CUSTOMER = ${CUSTOMER:0:12}..."