# Bitácora de uso de IA — UberClone (versión conductor)

**Herramienta usada:** Claude (Anthropic), chat web.
**Período:** Lunes 2 al jueves 5 de noviembre de 2026
**Alcance de esta bitácora:** registro del conductor, pestañas 1 y 2 (validaciones, guardado en Firebase y cambio de idioma).

## Resumen de bloques de código asistidos por IA

| Archivo | Entrada |
|---|---|
| `src/utils/validations.js` | #1, #8 |
| `src/services/driverService.js` | #2 |
| `src/config/firebase.js` | #5 |
| `src/context/RegistroContext.js` | #6 |
| `src/components/Selector.js`, `DateField.js`, `PhotoField.js` | #6, #8 |
| `src/navigation/RegistroTabs.js`, `App.js`, `index.js` | #6 |
| `src/screens/DatosScreen.js`, `VehiculoScreen.js` | #6, #8 |
| `src/data/translations.js` | #8 |
| `.gitignore`, `.env.example`, `package.json`, `app.json` | #3, #4, #7 |

---

### Entrada #1
- Fecha: 2026-11-02
- Integrante: [Juan Uribe]
- Herramienta: Claude
- Objetivo: Entender qué hay que entregar esta semana (registro del conductor) y obtener las validaciones de las pestañas 1 y 2
- Prompt: "[27/10 18:21] INddestable: Todos los jueves se hacen entregas + final  Registro conductor Pestaña 1 Pestaña 2 [27/10 18:23] INddestable: Registrar usuario hacer validaciones que este en la base de datos  ayudame con esto" (se adjuntó el PDF "UberClone — Versión Conductor")
- Resumen de la respuesta: Identificó la tarea (registro con validaciones y guardado en base de datos) y entregó funciones puras de validación para cada pestaña, con los errores por campo.
- Qué se usó / modificó / descartó: Se explico lógica de validación. Se corrigio después para que devuelva claves de error y se pueda traducir (entrada #8).
- Archivos y commit: src/utils/validations.js
- Verificación: Se probó en el emulador de Android escribiendo datos inválidos (documento con letras, placa mal escrita, XL con menos de 6 pasajeros) y revisando que el error salga debajo del campo.
- Aprendizaje: Uso de validaciones  y uso de firebase

### Entrada #2
- Fecha: 2026-11-02
- Integrante: [Juan Uribe]
- Herramienta: Claude
- Objetivo: Elegir la base de datos y guardar al conductor verificando que no esté repetido
- Prompt: "1 . ni idea  2. absolutamente nada tengo que crear el github y todo lo necesrio se ejeuta en expo go"
- Resumen de la respuesta: Recomendó Firebase (Authentication + Firestore) porque funciona en Expo Go sin servidor propio, y entregó un servicio que busca si el documento ya existe, crea la cuenta y guarda al conductor con estado `pending`.
- Qué se usó / modificó / descartó: Se usó Firebase. Se descartó MongoDB (exige un backend aparte).
- Archivos y commit: src/services/driverService.js — [hash del commit]
- Verificación: Se envió un registro desde la app. [completar: usuario visible en Authentication y documento en Firestore → drivers con status "pending"; error al repetir documento o correo]
- Aprendizaje:Diferencias de Firebase y Mongodb

### Entrada #3
- Fecha: 2026-11-02
- Integrante: [Juan Uribe]
- Herramienta: Claude
- Objetivo: Entender para qué sirve el `.gitignore`
- Prompt: "el gitignore es importante?"
- Resumen de la respuesta: Explicó que protege el archivo `.env` con las claves y evita subir `node_modules`, y cómo comprobarlo con `git status`.
- Qué se usó / modificó / descartó: Se usó la recomendación de agregar `.env` al `.gitignore`.
- Archivos y commit: .gitignore — [hash del commit]
- Verificación: `git status` no muestra `.env`. [confirmar]
- Aprendizaje: 

### Entrada #4
- Fecha: 2026-11-04
- Integrante: [Juan Uribe]
- Herramienta: Claude
- Objetivo: Crear el proyecto de Firebase y conectarlo a la app
- Prompt: "me pregunto asistencia de ia gemini" / "el paso 14" (con captura de la consola de Firebase) / [se pegó el objeto firebaseConfig; por seguridad no se copia aquí]
- Resumen de la respuesta: Guió la creación de Firestore y Authentication, y convirtió la configuración en variables del `.env` leídas desde `src/config/firebase.js`.
- Qué se usó / modificó / descartó: Se usó. Se descartó activar el asistente Gemini de la consola de Firebase. 
- Archivos y commit: src/config/firebase.js, .env.example — [hash del commit]
- Verificación: La app arranca y se conecta a Firebase sin errores. [confirmar]
- Aprendizaje: [Por qué las claves van en `.env` y no en el código.]

### Entrada #5
- Fecha: 2026-11-05
- Integrante: [Nombre Apellido]
- Herramienta: Claude
- Objetivo: Corregir por qué la app mostraba la pantalla de ejemplo ("Hello World") y luego un error al arrancar
- Prompt: "no veo nada me sale esto solo  bro pasame el archivo que deba arreglar ya listo" (con captura) / [se pegó el registro de la terminal con el error "Cannot find module 'expo-router/internal/testing'"]
- Resumen de la respuesta: Detectó una línea `"main"` mal ubicada dentro de `dependencies` en `package.json`, que faltaba instalar React Navigation, y que `app.json` conservaba el plugin, `"output": "server"` y `typedRoutes` de Expo Router.
- Qué se usó / modificó / descartó: Se aplicaron los cambios en `package.json` y `app.json`. Se descartó la configuración de Expo Router.
- Archivos y commit: package.json, app.json — [hash del commit]
- Verificación: `npx expo start -c` arranca sin el error y la app muestra el formulario.
- Aprendizaje: [Qué hace el campo `main` y por qué un resto de configuración puede romper el arranque.]

### Entrada #6 
- Fecha: 2026-11-05
- Integrante: [Juan Uribe]
- Herramienta: Claude
- Objetivo: Que el selector de idioma cambie los textos de la app entre español e inglés
- Prompt: "ya ejecuta pero ahora quiero que al darle al boton de idioma cambie, puedo hacer un archivo json con la traduccion y que lo traiga?" 
- Resumen de la respuesta: Si,crea un diccionario de traducciones y reemplazó los textos fijos por `t('clave')`; los errores de validación pasaron a ser claves que se traducen al mostrarlas. Sobre los archivos propios, solo añadió la traducción.
- Qué se usó / modificó / descartó: Se explica usó el paquete de traducción. Se descartó guardar el idioma en AsyncStorage .
- Archivos y commit: src/data/translations.js, src/screens/*, src/utils/validations.js, src/components/PhotoField.js, DateField.js, src/navigation/RegistroTabs.js — [hash del commit]
- Verificación: Al elegir English cambian campos, botones, errores y títulos de pestañas; al volver a Español regresan. [confirmar]
- Aprendizaje: [Por qué los errores se devuelven como claves y por qué los colores se guardan como `white`, `black`, etc.]
