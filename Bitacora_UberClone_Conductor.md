# Bitácora de uso de IA — UberClone (versión conductor)

**Herramienta usada:** Claude (Anthropic), chat web.  
**Período:** Lunes 2 al jueves 12 de noviembre de 2026.  
**Proyecto:** Aplicación móvil para conductores, desarrollada con React Native y Expo.  
**Nota:** Esta bitácora es un ejemplo académico elaborado a partir del documento de requisitos y del ejemplo entregado. Las conversaciones, fechas de algunas consultas, verificaciones y commits se presentan como simulación didáctica. Antes de entregarla como registro real, cada integrante debe reemplazar los datos ficticios por sus prompts, pruebas y commits verdaderos.

## Resumen de bloques de trabajo asistidos por IA

| Tema | Entradas |
|---|---:|
| Organización del proyecto, GitHub y configuración inicial | #1 |
| Registro: datos personales y validaciones | #2 |
| Registro: vehículo y documentos | #3 |
| Firebase, autenticación y estado de aprobación | #4 |
| Manejo de imágenes y almacenamiento | #5 |
| Navegación y estructura de pantallas | #6 |
| Disponibilidad y geolocalización | #7 |
| Solicitudes entrantes y temporizador | #8 |
| Estados del viaje y navegación | #9 |
| Google Maps, rutas y distancias | #10 |
| Cálculo de tarifas, comisión y propinas | #11 |
| Pagos con Mercado Pago / modo de prueba y efectivo | #12 |
| Ganancias y saldo del conductor | #13 |
| Historial, filtros y detalle de carreras | #14 |
| Notificaciones y sincronización en tiempo real | #15 |
| Perfil, configuración, idioma y sesión | #16 |
| Pruebas, errores y revisión general | #17 |
| README, seguridad, entrega y video | #18 |

---

### Entrada #1

- **Fecha:** 2026-11-02
- **Integrante:** Juan Uribe
- **Herramienta:** Claude
- **Objetivo:** Entender el alcance del proyecto y organizar el trabajo antes de empezar a programar.
- **Prompt:** "Tengo este proyecto UberClone versión conductor y la verdad está bastante grande. No sé por dónde empezar ni cómo dividirlo para no revolver todo. ¿Me puedes explicar qué partes debería hacer primero y qué depende de qué?"
- **Resumen de la respuesta:** La IA recomendó separar el trabajo por módulos: configuración, registro, autenticación, ubicación, viajes, pagos y consultas. También explicó que convenía terminar primero el registro y la estructura de datos, porque las demás pantallas necesitan saber quién es el conductor y cuál es su estado.
- **Qué se usó / modificó / descartó:** Se usó la división por módulos y se decidió avanzar por funcionalidades pequeñas. Se descartó intentar construir todas las pantallas al mismo tiempo.
- **Archivos y commit:** `README.md`, estructura inicial del proyecto y repositorio Git — [agregar hash real].
- **Verificación:** Se revisó que el repositorio quedara creado y que el proyecto pudiera abrirse localmente. [Completar con el resultado real].
- **Aprendizaje:** Antes de empezar a programar es importante entender las dependencias entre funcionalidades. El registro y la información del conductor son la base para el resto de la aplicación.

### Entrada #2

- **Fecha:** 2026-11-02
- **Integrante:** Juan Uribe
- **Herramienta:** Claude
- **Objetivo:** Resolver las validaciones de los datos personales del conductor.
- **Prompt:** "Estoy haciendo la primera pestaña del registro. Tengo nombre, documento, celular, fecha de nacimiento, género, correo e idioma. ¿Cómo puedo organizar las validaciones? Por ejemplo, que el documento no acepte letras y que no deje registrar menores de edad. No quiero que todos los errores salgan en una alerta."
- **Resumen de la respuesta:** La IA sugirió validar cada campo por separado y mostrar el mensaje debajo del campo que tenga el problema. También recomendó separar las reglas de validación de los componentes visuales para que sean más fáciles de probar y mantener.
- **Qué se usó / modificó / descartó:** Se usó la idea de tener validaciones independientes. Se ajustaron los mensajes para que fueran claros y específicos. Se descartó mostrar todos los errores en un único `Alert`, porque el requisito pide mostrarlos junto al campo.
- **Archivos y commit:** `src/utils/validations.js`, `src/screens/DatosScreen.js` — [agregar hash real].
- **Verificación:** Probar nombres con números, documentos con letras, celulares incompletos, correos sin dominio y fechas de nacimiento de personas menores de 18 años. También probar una fecha en la que la persona cumple exactamente 18 años.
- **Aprendizaje:** Aprendí que una validación no es solamente revisar si un campo está vacío. También hay que comprobar formato, longitud y reglas del negocio. La edad debe calcularse considerando día y mes, no solamente restando los años.

### Entrada #3

- **Fecha:** 2026-11-03
- **Integrante:** Juan Uribe
- **Herramienta:** Claude
- **Objetivo:** Completar las validaciones de vehículo y documentos.
- **Prompt:** "Ya tengo la parte personal, pero me enredo con las reglas del vehículo. La placa debe ser colombiana, XL necesita mínimo seis pasajeros y el año no puede ser mayor al actual. También están la licencia, SOAT y técnico-mecánica. ¿Qué casos debería revisar para no dejar huecos?"
- **Resumen de la respuesta:** La IA propuso revisar cada regla con casos válidos, inválidos y casos límite. Indicó convertir la placa a mayúsculas antes de validarla, comprobar que el año tenga cuatro dígitos y revisar que las fechas de vencimiento sean posteriores al día actual.
- **Qué se usó / modificó / descartó:** Se usaron las reglas de validación y la recomendación de probar los límites. Se dejó la revisión técnico-mecánica condicionada a si aplica según el año del vehículo. No se asumió que todos los vehículos tienen exactamente la misma obligación documental.
- **Archivos y commit:** `src/utils/validations.js`, `src/screens/VehiculoScreen.js`, `src/screens/DocumentosScreen.js` — [agregar hash real].
- **Verificación:** Casos de prueba: placa escrita en minúsculas, placa incompleta, año futuro, categoría XL con cinco pasajeros, XL con seis pasajeros, licencia vencida y SOAT vigente. Confirmar que las fotos obligatorias no se puedan omitir.
- **Aprendizaje:** Los requisitos deben convertirse en casos concretos de prueba. También entendí que hay reglas que dependen de otro dato, como la revisión técnico-mecánica según el año del vehículo.

### Entrada #4

- **Fecha:** 2026-11-03
- **Integrante:** Juan Uribe
- **Herramienta:** Claude
- **Objetivo:** Elegir y configurar el servicio para registrar usuarios y guardar la información del conductor.
- **Prompt:** "No tengo claro si usar Firebase o montar una base de datos aparte. La aplicación es Expo y necesito guardar los conductores, saber si ya existe un documento y dejar la cuenta pendiente hasta que la aprueben. ¿Cuál opción me conviene para este proyecto y qué debería separar?"
- **Resumen de la respuesta:** La IA explicó que Firebase Authentication puede encargarse de la cuenta y Firestore de los datos del conductor. Recomendó separar el servicio de registro de las pantallas y guardar un estado como `pending` para impedir que un conductor no aprobado se ponga disponible.
- **Qué se usó / modificó / descartó:** Se tomó Firebase como alternativa para el ejemplo de implementación. Se mantuvo separada la autenticación de los datos del perfil. Se descartó guardar toda la información únicamente en el estado local del dispositivo.
- **Archivos y commit:** `src/config/firebase.js`, `src/services/driverService.js`, `src/context/RegistroContext.js` — [agregar hash real].
- **Verificación:** Registrar un usuario de prueba y comprobar que aparezca en Authentication y que su documento exista en la colección correspondiente de Firestore. Intentar registrar de nuevo el mismo correo o documento.
- **Aprendizaje:** Entendí la diferencia entre autenticación y base de datos: una permite identificar al usuario y la otra guarda sus datos. También aprendí que el estado de aprobación debe controlar qué acciones puede realizar el conductor.

### Entrada #5

- **Fecha:** 2026-11-04
- **Integrante:** Juan Uribe
- **Herramienta:** Claude
- **Objetivo:** Definir cómo manejar las fotos del conductor, del vehículo y de los documentos.
- **Prompt:** "En el registro piden foto de perfil, foto del carro y fotos de documentos. ¿Es buena idea guardar las imágenes directamente en Firebase o convertirlas a texto y guardarlas en el documento? ¿Qué debería revisar para que no se dañen?"
- **Resumen de la respuesta:** La IA explicó que las imágenes deben almacenarse en un servicio de archivos y que en la base de datos se puede guardar la URL o referencia. Recomendó validar que el usuario haya seleccionado una imagen y comprobar permisos de cámara o galería.
- **Qué se usó / modificó / descartó:** Se usó el enfoque de guardar referencias a imágenes, no archivos completos dentro del documento del conductor. Se consideró Cloudinary como alternativa para el almacenamiento de imágenes. Se descartó guardar imágenes en `AsyncStorage`.
- **Archivos y commit:** `src/components/PhotoField.js`, `src/services/uploadService.js`, configuración del servicio de imágenes — [agregar hash real].
- **Verificación:** Seleccionar una imagen desde galería, cancelar la selección, denegar permisos y comprobar que el formulario informe correctamente cuando falta una foto obligatoria. Revisar que la URL guardada permita recuperar la imagen.
- **Aprendizaje:** Aprendí que los datos y los archivos se deben manejar de forma diferente. En la base de datos es mejor guardar una referencia al archivo y no convertirla en un dato enorme dentro del perfil.

### Entrada #6

- **Fecha:** 2026-11-04
- **Integrante:** Juan Uribe
- **Herramienta:** Claude
- **Objetivo:** Organizar la navegación del registro y las pantallas principales.
- **Prompt:** "Tengo tres partes del registro: datos personales, vehículo y documentos. Después de registrarse también hay inicio, ganancias, historial, perfil y configuración. ¿Cómo puedo organizar la navegación para que no se vuelva un montón de pantallas conectadas sin orden?"
- **Resumen de la respuesta:** La IA recomendó que el registro tenga una navegación por pestañas y que las secciones principales del conductor estén agrupadas en una navegación lateral o menú. Para el proceso de viaje sugirió una navegación controlada por el estado actual de la carrera.
- **Qué se usó / modificó / descartó:** Se tomó la separación entre flujo de registro y navegación principal. Se evitó mezclar las pantallas de registro con las pantallas que solo debe ver un conductor aprobado.
- **Archivos y commit:** `src/navigation/RegistroTabs.js`, `src/navigation/DriverNavigator.js`, `App.js` — [agregar hash real].
- **Verificación:** Recorrer las tres pestañas del registro, comprobar que los datos no se pierdan al cambiar de pestaña y revisar que las opciones principales permitan entrar y volver a Inicio.
- **Aprendizaje:** La navegación también representa las etapas del proceso. No todas las pantallas deben estar disponibles para todos los usuarios; depende de si terminó el registro y de si la cuenta fue aprobada.

### Entrada #7

- **Fecha:** 2026-11-05
- **Integrante:** Juan Uribe
- **Herramienta:** Claude
- **Objetivo:** Controlar la disponibilidad del conductor y actualizar su ubicación.
- **Prompt:** "En Inicio necesito un botón para ponerme Disponible o No disponible. Cuando esté disponible la ubicación debe actualizarse cada cierto tiempo, pero si lo apago o salgo de la pantalla no quiero que siga consumiendo batería. ¿Cómo debería pensar ese flujo?"
- **Resumen de la respuesta:** La IA explicó que la disponibilidad debe ser un estado controlado y que el seguimiento de ubicación solo debe iniciarse cuando el conductor esté aprobado y disponible. Recomendó usar el ciclo de vida de `useEffect` y su función de limpieza para detener la suscripción cuando corresponda.
- **Qué se usó / modificó / descartó:** Se usó la idea de iniciar y detener el seguimiento según el estado. Se añadió como condición que la cuenta esté aprobada. Se descartó mantener el GPS activo permanentemente aunque el conductor esté desconectado.
- **Archivos y commit:** `src/hooks/useDriverLocation.js`, `src/screens/HomeScreen.js`, `src/services/locationService.js` — [agregar hash real].
- **Verificación:** Dar permisos de ubicación, activar disponibilidad y observar cambios de coordenadas. Después desactivar el estado y comprobar que dejan de enviarse actualizaciones. Repetir saliendo de la pantalla.
- **Aprendizaje:** Entendí que `useEffect` no solo sirve para ejecutar algo al abrir una pantalla; también permite limpiar procesos que ya no se necesitan. Esto evita consumo innecesario de batería y actualizaciones duplicadas.

### Entrada #8

- **Fecha:** 2026-11-05
- **Integrante:** Juan Uribe
- **Herramienta:** Claude
- **Objetivo:** Mostrar solicitudes de viaje y controlar el tiempo para aceptarlas.
- **Prompt:** "Cuando un pasajero pide un viaje, al conductor le debe aparecer una tarjeta con origen, destino, distancia, duración, categoría, pago y ganancia estimada. Tiene 15 segundos para aceptar. ¿Qué pasa si llegan dos solicitudes o si se acaba el tiempo?"
- **Resumen de la respuesta:** La IA recomendó manejar una solicitud activa, mostrar un temporizador visible y cambiar su estado cuando se acepta, rechaza o vence. También explicó que el temporizador debe limpiarse si el conductor responde antes de los 15 segundos o si la pantalla deja de estar activa.
- **Qué se usó / modificó / descartó:** Se usó el flujo de una solicitud activa y el vencimiento automático. Se añadió la necesidad de evitar que una misma solicitud sea aceptada dos veces. Se descartó dejar temporizadores ejecutándose en segundo plano sin control.
- **Archivos y commit:** `src/hooks/useTripRequests.js`, `src/components/TripRequestCard.js`, `src/screens/IncomingRequestScreen.js` — [agregar hash real].
- **Verificación:** Simular una solicitud, aceptar antes de los 15 segundos, rechazarla y dejar que el contador llegue a cero. Confirmar que cada resultado se registre una sola vez.
- **Aprendizaje:** Un temporizador requiere limpieza y control de estados. También aprendí que la interfaz debe responder de manera diferente según si la solicitud está pendiente, aceptada, rechazada o vencida.

### Entrada #9

- **Fecha:** 2026-11-06
- **Integrante:** Juan Uribe
- **Herramienta:** Claude
- **Objetivo:** Entender y organizar los estados del viaje.
- **Prompt:** "Me confundo con las pantallas del viaje. Primero acepto, después voy por el pasajero, luego lo llevo al destino y finalmente cobro. ¿Cómo hago para que la aplicación sepa qué pantalla mostrar y no deje finalizar un viaje antes de recoger al pasajero?"
- **Resumen de la respuesta:** La IA explicó que conviene manejar el viaje como una secuencia de estados: `requested`, `accepted`, `driver_arriving`, `in_progress`, `completed`, `paid` y `cancelled`. Cada acción debe permitir únicamente las transiciones válidas.
- **Qué se usó / modificó / descartó:** Se usó el modelo de estados como referencia para controlar los botones y pantallas. Se decidió que cancelar solo sea posible antes de que el viaje esté en curso, según las reglas del proyecto. Se descartó controlar el flujo únicamente con variables visuales independientes.
- **Archivos y commit:** `src/context/TripContext.js`, `src/utils/tripStatus.js`, pantallas del flujo de viaje — [agregar hash real].
- **Verificación:** Intentar avanzar de `accepted` directamente a `paid`, finalizar antes de marcar pasajero a bordo y cancelar después de iniciar el recorrido. La aplicación debe bloquear las transiciones que no correspondan.
- **Aprendizaje:** Los estados representan la situación real del viaje. Tenerlos definidos evita que los botones permitan acciones fuera de orden y facilita recuperar el proceso si la aplicación se vuelve a abrir.

### Entrada #10

- **Fecha:** 2026-11-06
- **Integrante:** Juan Uribe
- **Herramienta:** Claude
- **Objetivo:** Integrar el mapa, calcular rutas y mostrar la distancia y duración.
- **Prompt:** "Necesito mostrar el mapa del conductor, marcar dónde está el pasajero y después cambiar la ruta para llegar al destino. También necesito distancia y tiempo estimado. ¿Qué diferencia hay entre mostrar el mapa y pedir una ruta?"
- **Resumen de la respuesta:** La IA explicó que el mapa muestra el área y los marcadores, mientras que un servicio de direcciones calcula el recorrido entre dos puntos. Recomendó consultar la ruta cuando se crea o acepta el viaje y no cada vez que cambia la ubicación del conductor.
- **Qué se usó / modificó / descartó:** Se usó la separación entre mapa, marcadores y servicio de rutas. Se tomó como referencia Google Maps SDK y Directions / Distance Matrix API. Se descartó consultar Distance Matrix en cada actualización del GPS para evitar consumo innecesario de cuota.
- **Archivos y commit:** `src/components/DriverMap.js`, `src/services/mapsService.js`, configuración de Google Maps — [agregar hash real].
- **Verificación:** Probar una ruta con origen y destino conocidos, comprobar que aparezcan los marcadores y revisar que la ruta cambie al pasar de recoger al pasajero a llevarlo al destino. Comparar la distancia y duración mostradas con la respuesta del servicio.
- **Aprendizaje:** Entendí que actualizar la ubicación y calcular una ruta son operaciones distintas. No es necesario volver a calcular todo el recorrido en cada movimiento del conductor.

### Entrada #11

- **Fecha:** 2026-11-07
- **Integrante:** Juan Uribe
- **Herramienta:** Claude
- **Objetivo:** Comprender el cálculo de tarifa, comisión y ganancia neta.
- **Prompt:** "En el documento dice que hay tarifa base, kilómetros, minutos y multiplicador por categoría. La plataforma cobra 20 %. ¿Cómo puedo organizar el cálculo para que la estimación y el cobro final no den valores diferentes? También hay propina."
- **Resumen de la respuesta:** La IA recomendó centralizar los valores en una configuración y usar una sola función de cálculo tanto para estimar como para cerrar el viaje. Explicó que la tarifa se redondea al múltiplo de 100 más cercano antes de calcular la comisión y que la propina va completa al conductor.
- **Qué se usó / modificó / descartó:** Se usó la idea de una función única y parámetros configurables. Se tuvo en cuenta que los valores son didácticos y están expresados en pesos colombianos enteros. Se descartó duplicar fórmulas en distintas pantallas.
- **Archivos y commit:** `src/config/pricing.js`, `src/utils/calculateFare.js`, pantallas de solicitud y resumen — [agregar hash real].
- **Verificación:** Usar el ejemplo del documento: 8,5 km y 22 minutos. Revisar la categoría Económico y XL, la comisión del 20 % y que una propina no aumente la comisión de la plataforma.
- **Aprendizaje:** Aprendí que las reglas de negocio deben estar centralizadas. Si se cambia una tarifa o comisión, no debería ser necesario corregir la fórmula en varias pantallas. También entendí por qué se guarda el porcentaje aplicado en cada viaje.

### Entrada #12

- **Fecha:** 2026-11-08
- **Integrante:** Juan Uribe
- **Herramienta:** Claude
- **Objetivo:** Comprender el flujo de cobro con pasarela de pago y la alternativa de efectivo.
- **Prompt:** "Después de terminar el viaje necesito cobrar. El documento recomienda Mercado Pago, pero no entiendo qué hace el backend y qué hace la aplicación. ¿Puedo poner el access token directamente en React Native para probar más rápido? ¿Y cómo manejo efectivo?"
- **Resumen de la respuesta:** La IA indicó que la aplicación debe enviar el identificador del viaje y el monto al backend; el backend crea la operación con la llave secreta y la pasarela informa el resultado. Aclaró que las credenciales secretas nunca deben estar en el código móvil. Para efectivo, el conductor registra que recibió el dinero y la comisión se descuenta de su saldo.
- **Qué se usó / modificó / descartó:** Se usó la separación entre aplicación, backend y pasarela. Se decidió trabajar únicamente con credenciales de prueba. Se descartó incluir tokens secretos en el repositorio o en el código de React Native. Se mantuvo el efectivo como un flujo separado.
- **Archivos y commit:** `src/services/paymentService.js`, backend o función de servidor, `.env.example`, `.gitignore` — [agregar hash real].
- **Verificación:** Hacer una operación con cuenta y tarjeta de prueba, comprobar el estado devuelto y revisar que el viaje se actualice a pagado solo después de recibir confirmación. Probar también el caso rechazado y el pago en efectivo.
- **Aprendizaje:** Entendí que la aplicación no debe decidir por sí sola que un pago fue aprobado. La confirmación debe venir de la pasarela a través del backend. También aprendí que las llaves privadas no se deben publicar.

### Entrada #13

- **Fecha:** 2026-11-09
- **Integrante:** Juan Uribe
- **Herramienta:** Claude
- **Objetivo:** Mostrar ganancias del día, semana y mes y calcular el saldo del conductor.
- **Prompt:** "Quiero una pantalla donde el conductor vea cuánto lleva hoy, esta semana y este mes. No solo el total: también número de viajes, comisiones, propinas y promedio por viaje. ¿Cómo evito hacer cálculos cada vez que se actualiza la pantalla?"
- **Resumen de la respuesta:** La IA explicó que se puede partir del historial de viajes y agrupar los registros según el período seleccionado. Recomendó usar `useMemo` para recalcular los totales cuando cambie el historial, y separar las ganancias pagadas por pasarela de las comisiones pendientes por efectivo.
- **Qué se usó / modificó / descartó:** Se usó el historial como fuente de los totales y se consideró `useMemo` para los cálculos derivados. Se descartó guardar cifras duplicadas que podrían quedar desactualizadas respecto a los viajes.
- **Archivos y commit:** `src/hooks/useEarnings.js`, `src/screens/EarningsScreen.js`, `src/utils/dateRanges.js` — [agregar hash real].
- **Verificación:** Cargar viajes de diferentes fechas y métodos de pago. Comprobar los totales de hoy, semana y mes, el promedio por viaje y el saldo después de registrar un viaje en efectivo.
- **Aprendizaje:** Aprendí que los totales se pueden obtener de los datos existentes y no necesariamente guardarse por separado. También entendí que ganancia neta y saldo disponible no son exactamente lo mismo.

### Entrada #14

- **Fecha:** 2026-11-09
- **Integrante:** Juan Uribe
- **Herramienta:** Claude
- **Objetivo:** Construir el historial de carreras con filtros y detalle.
- **Prompt:** "En el historial necesito mostrar los viajes recientes primero y filtrar por hoy, semana, mes, rango de fechas y método de pago. Cuando toque uno quiero ver el mapa y todos los datos del viaje. ¿Qué debería tener cada registro para que después no falte información?"
- **Resumen de la respuesta:** La IA recomendó definir un modelo de viaje consistente que guarde conductor, pasajero, origen, destino, distancia, duración, categoría, tarifa, comisión, propina, método y estado del pago, fechas y calificación. También sugirió limitar o paginar la consulta y mostrar un mensaje cuando no existan resultados.
- **Qué se usó / modificó / descartó:** Se usó el modelo de datos propuesto como guía y se separó el listado del detalle. Se decidió conservar la comisión aplicada en cada viaje para que los cambios futuros no alteren registros anteriores.
- **Archivos y commit:** `src/screens/TripHistoryScreen.js`, `src/screens/TripDetailScreen.js`, `src/services/tripService.js` — [agregar hash real].
- **Verificación:** Crear viajes de prueba con fechas y métodos de pago diferentes. Revisar el orden descendente, cada filtro, el estado vacío y la información que aparece al abrir un viaje.
- **Aprendizaje:** Aprendí que un historial confiable depende de guardar bien la información desde el momento en que ocurre el viaje. Los filtros no pueden funcionar correctamente si faltan fechas o datos del pago.

### Entrada #15

- **Fecha:** 2026-11-10
- **Integrante:** Juan Uribe
- **Herramienta:** Claude
- **Objetivo:** Entender cómo recibir solicitudes cuando la aplicación está en segundo plano y mantener sincronizado el viaje.
- **Prompt:** "Si el conductor deja la aplicación en segundo plano, ¿cómo se entera de que llegó una solicitud? Y si el pasajero cambia el estado del viaje, ¿cómo hago para que al conductor también le aparezca sin tener que actualizar manualmente?"
- **Resumen de la respuesta:** La IA diferenció las notificaciones push de la sincronización en tiempo real. Explicó que Firebase Cloud Messaging puede avisar de una solicitud y que una suscripción a los cambios del documento puede mantener actualizada la pantalla mientras la aplicación está activa.
- **Qué se usó / modificó / descartó:** Se usó la separación entre notificaciones y datos en tiempo real. Se consideró Firestore con suscripciones para cambios de estado y ubicación. Se descartó usar notificaciones como única fuente de información del viaje.
- **Archivos y commit:** `src/services/notificationService.js`, `src/hooks/useTripRequests.js`, `src/services/realtimeService.js` — [agregar hash real].
- **Verificación:** Enviar una solicitud de prueba con la app abierta y luego en segundo plano. Cambiar el estado del viaje desde el entorno de prueba y comprobar que la aplicación refleje el cambio. Revisar permisos de notificaciones.
- **Aprendizaje:** Una notificación sirve para avisar, pero la información real debe consultarse o sincronizarse desde la base de datos. Así se evita depender de un mensaje que pudo llegar tarde o no mostrarse.

### Entrada #16

- **Fecha:** 2026-11-10
- **Integrante:** Juan Uribe
- **Herramienta:** Claude
- **Objetivo:** Completar perfil, configuración, cierre de sesión y persistencia del idioma.
- **Prompt:** "Me falta la parte de perfil y configuración. El conductor debe poder revisar sus datos, vehículo, documentos, cambiar idioma y cerrar sesión. ¿Qué cosas sí puedo guardar en AsyncStorage y qué cosas no debería guardar ahí?"
- **Resumen de la respuesta:** La IA explicó que `AsyncStorage` puede conservar preferencias como idioma o último estado de disponibilidad, pero no debe almacenar números bancarios, tarjetas ni credenciales sensibles. También recomendó que los datos editables se actualicen en la base de datos y que el cierre de sesión limpie el estado local de la sesión.
- **Qué se usó / modificó / descartó:** Se usó la persistencia de preferencias y la separación entre datos de perfil y sesión. Se descartó guardar información de tarjetas o cuentas bancarias en el dispositivo. Se mantuvo el idioma mediante un diccionario de traducciones.
- **Archivos y commit:** `src/screens/ProfileScreen.js`, `src/screens/SettingsScreen.js`, `src/data/translations.js`, servicio de sesión — [agregar hash real].
- **Verificación:** Cambiar idioma, cerrar y abrir la aplicación, revisar que la preferencia se conserve. Editar un dato del perfil, cerrar sesión y comprobar que no se muestre información de la cuenta anterior.
- **Aprendizaje:** Aprendí que persistir información no significa guardar todo en el teléfono. Hay que distinguir preferencias, sesión y datos sensibles, y escoger dónde corresponde almacenar cada uno.

### Entrada #17

- **Fecha:** 2026-11-11
- **Integrante:** Juan Uribe
- **Herramienta:** Claude
- **Objetivo:** Revisar errores y preparar pruebas del flujo completo.
- **Prompt:** "Ya tengo varias pantallas, pero no sé cómo comprobar que todo el proceso funciona y no solamente que cada pantalla abre. ¿Me puedes dar un orden de pruebas y decirme qué errores debería intentar provocar?"
- **Resumen de la respuesta:** La IA recomendó probar el flujo de principio a fin y también probar errores intencionales: registro incompleto, cuenta pendiente, permisos denegados, solicitud vencida, pérdida de conexión, pago rechazado y filtros sin resultados. Sugirió revisar advertencias de dependencias y ejecutar las herramientas de análisis disponibles en el proyecto.
- **Qué se usó / modificó / descartó:** Se usó la lista de escenarios como guía de pruebas. Se corrigieron los problemas encontrados durante la ejecución. Se descartó dar por terminada una funcionalidad únicamente porque la pantalla se veía correctamente.
- **Archivos y commit:** Archivos corregidos durante las pruebas, pruebas manuales y configuración del proyecto — [agregar hash real].
- **Verificación:** Recorrer el proceso desde el registro hasta el historial con datos de prueba. Registrar los errores encontrados, repetir cada escenario después del ajuste y comprobar que no se rompa una función anterior.
- **Aprendizaje:** Aprendí que una prueba completa debe revisar cómo se conectan los módulos. Un botón puede funcionar por separado y aun así fallar cuando depende de la autenticación, la base de datos o el estado de un viaje.

### Entrada #18

- **Fecha:** 2026-11-12
- **Integrante:** Juan Uribe
- **Herramienta:** Claude
- **Objetivo:** Preparar la documentación y los elementos finales de entrega.
- **Prompt:** "Para entregar el proyecto nos piden el repositorio, README, archivo de variables de ejemplo, bitácora y un video de máximo cinco minutos. ¿Qué debería explicar el README y qué orden puedo seguir para mostrar el funcionamiento sin pasarme del tiempo?"
- **Resumen de la respuesta:** La IA recomendó documentar requisitos, instalación, ejecución, configuración de variables de entorno y uso de la aplicación. Para el video sugirió mostrar el registro, aprobación de prueba, disponibilidad, solicitud, recorrido, pago y consulta del historial.
- **Qué se usó / modificó / descartó:** Se usó el orden propuesto como guía. Se revisó que el `.env.example` contenga nombres de variables pero no valores secretos. Se descartó incluir credenciales reales, tokens o datos personales en el repositorio y en el video.
- **Archivos y commit:** `README.md`, `.env.example`, `docs/AI_LOG.md`, exportación PDF de la bitácora — [agregar hash real].
- **Verificación:** Clonar el repositorio en un entorno limpio, seguir las instrucciones del README y comprobar que el proyecto pueda iniciarse con las variables de prueba configuradas. Revisar el video y confirmar que no supere cinco minutos.
- **Aprendizaje:** Aprendí que documentar también hace parte del desarrollo. Una persona que no participó en el proyecto debería poder entender cómo instalarlo, configurarlo y probarlo.

---

## Observaciones finales

Durante el desarrollo se utilizó la IA como apoyo para entender requisitos, comparar alternativas, identificar casos límite y organizar pruebas. Las recomendaciones se revisaron y adaptaron al proyecto; no se consideró que una respuesta de IA fuera correcta automáticamente.

La aplicación debe probarse con datos ficticios y credenciales de prueba. Nunca se deben compartir claves privadas, tokens, contraseñas ni información personal real en las conversaciones con herramientas de IA.