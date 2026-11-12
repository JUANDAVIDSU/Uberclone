# UberClone — Versión Conductor

Aplicación móvil del conductor hecha con React Native y Expo (se ejecuta en Expo Go).
Usa Firebase (Authentication y Firestore) y React Native Paper.

## Funcionalidades

- **Login** como primera pantalla; desde ahí se entra con una cuenta o se va al registro.
- **Registro del conductor** en tres pestañas (datos personales, vehículo, documentos y pagos) con validaciones; los errores salen debajo de cada campo. La cuenta queda en estado `pending`.
- **Inicio**: mapa con la ubicación actual e interruptor Disponible / No disponible (solo si la cuenta está `approved`). Mientras está disponible, la ubicación se guarda en Firestore cada 5 segundos.
- **Solicitudes en tiempo real** (`onSnapshot`) con temporizador de 15 s para aceptar o rechazar.
- **Viaje en curso**: ruta a la recogida, "Pasajero a bordo" y ruta al destino, "Finalizar viaje".
- **Cobro y resumen**: tarifa, comisión (20 %), propina y ganancia neta con `calculateFare`; efectivo o pago por pasarela confirmado en tiempo real.
- **Ganancias** (hoy, semana, mes y saldo) e **Historial** con filtros y detalle.
- **Perfil y configuración**: datos editables, idioma (español / inglés) y cierre de sesión.
- Navegación combinada: Stack (flujo del viaje), Tabs (registro) y Drawer (menú).

## Instalación

```bash
npm install
npx expo install @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs @react-navigation/drawer react-native-screens react-native-gesture-handler react-native-reanimated react-native-worklets react-native-maps expo-location
```

## Variables de entorno

1. Copia `.env.example` como `.env`.
2. Completa los valores de tu proyecto de Firebase (consola de Firebase → Configuración del proyecto → Tus apps).
3. `.env` está en `.gitignore`; solo se sube `.env.example`.

## Ejecutar

```bash
npx expo start -c
```

Escanea el código QR con Expo Go.

## Estado del proyecto

Esta es la **versión del conductor**. Falta la **app del cliente (pasajero)**, que es la que crea las solicitudes de viaje y paga con la pasarela. Mientras tanto la app trae un **modo simulación** (`SIMULATION` en `src/config/pricing.js`):

- Mientras estás **Disponible**, se inventa una solicitud cada 8-20 segundos: ruta real por las calles cerca de tu ubicación, direcciones, propina y método de pago al azar.
- Tú aceptas o rechazas; si no respondes en 15 segundos, se rechaza sola.
- En los pagos por pasarela, el pasajero "paga" a los pocos segundos (aprobado; una de cada cinco veces rechaza primero y luego reintenta).
- **Cuando exista la app del cliente**, pon `SIMULATION.enabled = false`: desaparecen las solicitudes inventadas y el pago simulado, y la app queda escuchando las solicitudes reales de la colección `trips`.

Cómo probar:

1. Crea una cuenta desde **Crear cuenta de conductor**.
2. En Firestore, colección `drivers`, abre tu documento y cambia `account.status` a `approved`.
3. Inicia sesión, activa **Disponible** y acepta el permiso de ubicación.
4. Espera la solicitud, acepta, toca **Pasajero a bordo** y **Finalizar viaje**, y cobra.

## Modelo de datos en Firestore

Cada conductor es **un solo documento** `drivers/{uid}`, organizado por secciones:

```
drivers/{uid}
├── account    status (pending / approved), available, language, createdAt
├── personal   fullName, documentId, phone, birthDate, gender, email, photo
├── vehicle    category, plate, brand, model, year, color, capacity, photo
├── documents  license {number, photo, expiry}, soat {photo, expiry},
│              technicalReview {photo, expiry}
├── payments   mercadoPagoEmail, termsAccepted, commissionRate
├── wallet     balance, totalEarned, totalCommissions, tripsPaid, updatedAt
└── location   lat, lng, updatedAt
```

- El **dinero es por usuario**: `wallet` se actualiza en una transacción cuando un viaje queda pagado. El pago por pasarela suma la ganancia neta y el pago en efectivo resta la comisión.
- Los viajes están en la colección `trips` (cada uno guarda `driverId` y la `commissionRate` aplicada), porque una solicitud debe ser visible para los conductores antes de que alguno la acepte.
- Para aprobar un conductor, cambia `account.status` a `approved`.

## Formato de una solicitud (lo que debe crear la app del cliente)

Colección `trips`, un documento por viaje:

| Campo | Valor |
|---|---|
| `status` | `requested` (luego: accepted, driver_arriving, in_progress, completed, paid, cancelled, rejected) |
| `driverId` | `null` al crearla |
| `passengerId` | id del pasajero |
| `origin`, `destination` | `{ lat, lng, address }` |
| `distanceKm`, `durationMin` | de Google Distance Matrix |
| `category` | `economy`, `xl` o `premium` |
| `paymentMethod` | `cash`, `mercadopago` o `stripe` |
| `paymentStatus`, `paymentId` | `pending` y `null` al crearla |
| `tip`, `rating` | `0` y `null` |
| `createdAt` | fecha del servidor |

Para el pago por pasarela, el backend (con la llave secreta) debe dejar `paymentStatus`, `paymentId` y `status: "paid"`; la app del conductor lo ve en tiempo real y suma el viaje a su saldo.

## Rutas

Las rutas siguen las calles: con `EXPO_PUBLIC_GOOGLE_MAPS_KEY` usa Google Directions y, si no hay clave, OSRM (servidor público gratuito de demostración). Si ninguno responde, dibuja una línea recta. Se piden solo al cambiar de tramo.

## Pendiente

- App del cliente (crear solicitudes y pagar).
- Backend de pagos (Mercado Pago o Stripe).
- Subir fotos a Cloudinary (hoy quedan como ruta local del dispositivo).
- Notificaciones push (no funcionan en Expo Go).

## Estructura

```
App.js, index.js
src/
├── components/   Selector, DateField, PhotoField, RouteMap, FareSummary
├── config/       firebase.js, pricing.js (tarifas y comisión)
├── context/      RegistroContext, SessionContext, DriverContext
├── data/         translations.js (español / inglés)
├── theme/        theme.js (tema blanco y negro)
├── hooks/        useDriverLocation, useTripRequests, useEarnings, useT
├── navigation/   RootNavigator, MainDrawer, RegistroTabs
├── screens/      Login, Datos, Vehiculo, Documentos, Home, Request, Trip,
│                 Payment, Earnings, History, TripDetail, Profile
├── services/     driverService.js, tripService.js
└── utils/        calculateFare, validations, driverDoc, wallet, geo, dates, earnings, format, storage
```

## Uso de IA

Se usó Claude (Anthropic) como asistente. El registro completo está en [docs/AI_LOG.md](docs/AI_LOG.md).
