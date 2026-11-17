# Backend de retiros

Node.js + Express + Firebase Admin. Ejecutar `npm install`, configurar `.env` a partir de `.env.example`, colocar la cuenta de servicio en `service-account.json` y arrancar con `npm start`.

Rutas:
- `GET /health`: salud del servicio.
- `GET /withdrawals`: requiere `Authorization: Bearer <Firebase ID token>`.
- `POST /withdrawals`: requiere token; reserva el saldo disponible y crea la solicitud.
- `POST /admin/withdrawals/:id/status`: requiere `x-admin-secret`; `paid` descuenta el saldo reservado (solo después de transferir manualmente) y `rejected` lo libera.

No expongas `.env`, `service-account.json` ni `ADMIN_API_SECRET`.
