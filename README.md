# Frontend - Automatic Correction

Frontend de la plataforma web de correccion automatica de preguntas en contexto educacional.

La idea de este README no es explicar cada archivo, sino ayudar a cualquier persona nueva a entender rapido como esta organizado el proyecto, donde mirar primero y como moverse dentro del codigo para seguir desarrollando.

## Que hace este proyecto

Este repositorio contiene la interfaz web del sistema. Desde aqui se cubren dos grandes areas:

- La parte publica del producto: landing, informacion, precios, FAQ, contacto y paginas legales.
- La parte privada de la plataforma: autenticacion, gestion de cursos, preguntas, respuestas, recorrecciones, creditos, pagos y vistas segun rol.

El frontend conversa con un backend por API REST y usa sesion con cookies para manejar autenticacion.

## Stack principal

- `React 19`
- `Vite`
- `React Router`
- `Axios`
- `Tailwind CSS 4`
- `i18next`
- `Mercado Pago`

Tambien hay librerias auxiliares para tablas, calendarios, graficos y animaciones.

## Como iniciar el proyecto

### 1. Instalar dependencias

```bash
yarn install
```
NUNCA usar npm.

### 2. Configurar variables de entorno

El frontend espera al menos esta variable:

```env
VITE_API_TARGET=http://tu-backend
```

Con eso, la app construye la base de la API en:

```txt
${VITE_API_TARGET}/api
```

Si se quiere usar el flujo de pago embebido con Mercado Pago, tambien se utiliza:

```env
VITE_MP_PUBLIC_KEY=tu_public_key
```

### 3. Levantar el entorno de desarrollo

```bash
yarn dev
```

### 4. Otros comandos utiles

```bash
yarn build
yarn preview
yarn lint
```

## Vista general de la arquitectura

El punto de entrada es `src/main.jsx`. Ahi se monta la aplicacion, se activa `BrowserRouter` y se envuelve todo con dos contextos globales:

- `AuthProvider`: mantiene la sesion, el usuario autenticado y las acciones de login, registro y logout.
- `CreditsProvider`: mantiene el saldo de creditos y su sincronizacion con el backend.

Despues de eso, `src/router.jsx` define las rutas principales del sistema.

## Mapa rapido de carpetas

```txt
frontend/
|- public/
|- src/
|  |- components/
|  |- context/
|  |- hooks/
|  |- lib/
|  |- pages/
|  `- utils/
|- index.html
|- package.json
|- vite.config.js
`- eslint.config.js
```

### `public/`

Aqui viven los assets estaticos que no pasan por React: imagenes, logos, videos y otros recursos visuales usados por la landing y otras vistas. Los videos son pesados por los que habría que integrarlos a un bucket a futuro.

### `src/`

Es el nucleo del proyecto. Casi todo el desarrollo ocurre aqui.

### `src/components/`

Contiene piezas reutilizables de interfaz y de comportamiento comun.

Ejemplos de lo que vive aqui:

- componentes de layout global como navbar y footer
- botones, tablas, formularios y popups
- componentes compartidos entre roles
- utilidades visuales o de estado como loaders, tarjetas y listeners globales

Regla practica: si una pieza se reutiliza en varias vistas o representa una unidad de UI independiente, probablemente debe vivir aqui. Hay cosas que se pueden converitir en componentes.

### `src/context/`

Guarda estado global de la aplicacion.

- `AuthProvider.jsx`: sesion, usuario y flujo de autenticacion.
- `CreditsContext.jsx`: saldo de creditos, recarga y reacciones a eventos como generacion de pautas.

Si una necesidad afecta a muchas paginas al mismo tiempo, este es uno de los primeros lugares que conviene revisar.

### `src/hooks/`

Incluye helpers orientados a datos y logica reutilizable. Hoy se usa sobre todo para encapsular llamadas simples hacia la API, como la obtencion de organizaciones en el registro.

### `src/lib/`

Contiene utilidades base compartidas por toda la app.

- `axios.js`: cliente HTTP centralizado
- `normalizeUser.js`: normalizacion de la forma del usuario que llega desde backend

Es una carpeta clave cuando hay que tocar integraciones o estandarizar datos.

### `src/utils/`

Espacio para funciones de apoyo o scripts acotados que no son componentes ni contexto.

### `src/pages/`

Aqui estan las pantallas del producto. La organizacion es principalmente por dominio funcional y por tipo de usuario.

Subgrupos importantes:

- paginas publicas: `home`, `About`, `Pricing`, `FAQ`, `Contact`, `Howitworks`
- autenticacion: `Login`, `register`
- legales: `legal/`
- pagos: `payments/`
- alumno: `student-profile/`
- profesor: `teacher-profile/`
- administracion: `admin-profile/`
- vista AC / supervision: `ac-super-view/`

La vista de admin y super view no tienen un acceso directo (hay que agregar el "/admin-profile" (a modo ejempl) en el navegador)
## Como leer `src/pages`

### `student-profile/`

Agrupa la experiencia del alumno.

En general aqui se maneja:

- listado de cursos inscritos
- vista de un curso
- vista de una pregunta
- envio de respuestas
- solicitud de recorreccion

Si el cambio afecta lo que hace un estudiante dentro de un curso, probablemente comienza aqui.

### `teacher-profile/`

Es una de las areas mas grandes del proyecto.

Aqui viven flujos como:

- listado de cursos del profesor
- creacion de cursos
- vista interna de un curso
- creacion de preguntas
- generacion de pautas
- revision de respuestas
- invitacion de estudiantes
- soporte

La mayor parte de la logica principal del negocio parece concentrarse en esta zona.

### `admin-profile/`

Agrupa vistas de administracion academica, como navegacion por facultades, profesores y cursos desde una mirada mas institucional.

### `ac-super-view/`

Parece estar orientada a supervision general y metricas financieras o de uso, distinta de la administracion academica tradicional.

### `payments/`

Contiene el flujo de compra y seguimiento de creditos:

- seleccion de paquetes
- carrito y confirmacion
- checkout
- historial

Es la carpeta a revisar cuando el cambio toca creditos, compra o integracion con Mercado Pago.

### `legal/`

Paginas legales del producto: terminos, privacidad y cookies.

## Flujo funcional del sistema

Para entender el proyecto rapido, conviene pensarlo asi:

1. La persona entra por las paginas publicas.
2. Se registra o inicia sesion.
3. `AuthProvider` consulta al backend quien es el usuario.
4. Segun el rol, el usuario navega a sus vistas de trabajo.
5. Las paginas consumen la API usando el cliente central en `src/lib/axios.js`.
6. Los creditos se consultan y actualizan desde `CreditsContext`.
7. Algunas acciones largas, como la generacion de pautas, disparan eventos globales que escucha `GuidelineStatusListener`.

## Rutas y navegacion

La definicion central de rutas esta en `src/router.jsx`.

Desde ahi se puede ver rapidamente:

- cuales paginas son publicas
- cuales pertenecen a cada rol
- como estan nombrados los paths
- que vistas dependen de parametros como `courseId`, `questionId` u `orderId`

Si se agrega una nueva pantalla, normalmente habra que tocar:

1. la carpeta correspondiente dentro de `src/pages`
2. algun componente compartido si aplica
3. `src/router.jsx`

## Estilos y sistema visual

El proyecto usa Tailwind CSS, pero tambien define tokens propios en `src/index.css`.

Ahi estan variables como:

- colores base
- colores de superficie
- bordes
- estados de exito y error
- soporte para preferencia light/dark

Si el cambio es visual y afecta a todo el producto, `src/index.css` es donde están todos los estilos globales.

## Internacionalizacion

Existe configuracion de `i18next` en `src/i18n.jsx`.

Actualmente ya hay soporte base para:

- `es`
- `en`

Todavia no todo el proyecto tiene esto internacionalizado, pero la infraestructura ya esta creada y debe servir solo para lo básico (google traductor del navegador hace los otros cambios).

## Integracion con backend

La comunicacion HTTP esta centralizada en `src/lib/axios.js`.

Aspectos importantes:

- usa `VITE_API_TARGET`
- construye la base como `/api`
- envia cookies con `withCredentials: true`
- tiene configuracion para CSRF

Si algo falla entre frontend y backend, normalmente conviene revisar primero:

1. `.env`
2. `src/lib/axios.js`
3. el componente o pagina que hace la llamada

## Integraciones especiales del proyecto

### Creditos

Los creditos son parte importante del producto, sobre todo en los flujos del profesor. El saldo se comparte globalmente por contexto y se refresca con eventos ligados a generacion de pautas, correcciones, ediciones de pauta y pagos.

### Pautas

La generacion de pautas tiene comportamiento global. No esta encerrada en una sola vista: hay un listener que sigue el estado y avisa cuando la pauta termina o falla pero requiere mejorarse (es limitado y debería avisar por correo o incluso si se cierra el navegador).

### Pagos

El proyecto ya tiene una integracion de compra de creditos con Mercado Pago, repartida entre el flujo de compra y el checkout pero está incompleta (su funcionamiento estaba corrupto), por lo que recomiendo rehacer siguiendo una lógica de suscripción (preguntar a clientes).

## Recomendaciones para alguien que entra por primera vez

Si quieres entender el proyecto sin perderte, este orden funciona bien:

1. `package.json` (dependencias)
2. `src/main.jsx`
3. `src/router.jsx`
4. `src/context/`
5. `src/pages/` segun el rol o flujo que te interese
6. `src/components/` para ver piezas reutilizadas
7. `src/lib/axios.js` para entender como habla con backend

## Donde tocar segun el tipo de cambio

- Cambio de navegacion o nuevas vistas: `src/router.jsx` y `src/pages/`
- Cambio visual global: `src/index.css`
- Cambio de autenticacion: `src/context/AuthProvider.jsx`
- Cambio de creditos: `src/context/CreditsContext.jsx`
- Cambio de llamadas al backend: `src/lib/axios.js` o la pagina/componente correspondiente
- Cambio por rol: carpeta especifica dentro de `src/pages/`
- Cambio de landing o marketing: paginas publicas y assets de `public/`

## Detalle mas especifico del repositorio

Esta seccion complementa lo anterior con un mapa mas concreto de las pantallas y piezas principales. La idea es que ayude abrir el repo y ubicar más rapido que hace cada bloque sin tener que deducirlo leyendo todo el codigo.

### Paginas publicas

- `src/pages/home.jsx`
  Landing principal. Ensambla el hero, secciones de presentacion del producto y bloques de marketing.
- `src/pages/About.jsx`
  Pagina institucional sobre el producto/equipo.
- `src/pages/Howitworks.jsx`
  Explica el flujo general de uso de la plataforma.
- `src/pages/Pricing.jsx`
  Vista comercial de precios o paquetes.
- `src/pages/FAQ.jsx`
  Preguntas frecuentes.
- `src/pages/Contact.jsx`
  Informacion o formulario de contacto.
- `src/pages/Login.jsx`
  Pantalla de inicio de sesion.
- `src/pages/register.jsx`
  Registro normal y tambien registro por invitacion usando token.
- `src/pages/color-guide.jsx`
  Pagina auxiliar para referencia visual/colores.
- `src/pages/legal/privacy.jsx`
  Politica de privacidad.
- `src/pages/legal/cookies.jsx`
  Politica de cookies.
- `src/pages/legal/terms&conditions.jsx`
  Terminos y condiciones.

### Paginas del alumno

- `src/pages/student-profile/index.jsx`
  Dashboard base del alumno. Lista los cursos en los que esta inscrito.
- `src/pages/student-profile/course-view/index.jsx`
  Vista de un curso del alumno. Lista preguntas publicadas, estados y fechas.
- `src/pages/student-profile/course-view/question/index.jsx`
  Vista detallada de una pregunta. Permite responder, ver estado de correccion y solicitar recorreccion.

En terminos funcionales, esta area cubre el flujo "entrar al curso -> abrir pregunta -> responder -> esperar correccion o pedir recorreccion".

### Paginas del profesor

- `src/pages/teacher-profile/index.jsx`
  Dashboard principal del profesor. Lista cursos, muestra creditos y accesos rapidos.
- `src/pages/teacher-profile/create-course/index.jsx`
  Flujo para crear un curso nuevo.
- `src/pages/teacher-profile/course-view/index.jsx`
  Vista interna de un curso del profesor. Lista preguntas, cantidad de respuestas, estado de correccion y recorrecciones.
- `src/pages/teacher-profile/course-view/create-question/index.jsx`
  Creacion de una pregunta, incluyendo fechas, duracion y texto base.
- `src/pages/teacher-profile/course-view/create-question/create-guideline/index.jsx`
  Flujo especifico para construir o completar la pauta asociada a una pregunta.
- `src/pages/teacher-profile/course-view/question-view/index.jsx`
  Vista de detalle de una pregunta ya creada desde la perspectiva del profesor.
- `src/pages/teacher-profile/course-view/question-view/answers-view/index.jsx`
  Vista centrada en respuestas/alumnos para una pregunta concreta.
- `src/pages/teacher-profile/course-view/add-users/index.jsx`
  Flujo para invitar o agregar estudiantes a un curso (falta conectar la eliminación de estudiantes/ayudantes)
- `src/pages/teacher-profile/Support.jsx`
  Vista de ayuda/soporte accesible para usuarios autenticados.

En la practica, esta carpeta representa el flujo principal del negocio: gestionar cursos, crear evaluaciones, generar pautas, revisar respuestas y administrar alumnos.

### Paginas de administracion

- `src/pages/admin-profile/index.jsx`
  Entrada al modulo de administracion academica.
- `src/pages/admin-profile/faculty/index.jsx`
  Vista de una facultad o unidad academica.
- `src/pages/admin-profile/faculty/course/index.jsx`
  Detalle de cursos dentro de una facultad.
- `src/pages/admin-profile/teacher/index.jsx`
  Vista de detalle o seguimiento de un profesor desde administracion.

Este modulo esta pensado mas desde la estructura institucional que desde el trabajo cotidiano del profesor.

### Vista AC / supervision

- `src/pages/ac-super-view/index.jsx`
  Vista separada del resto de administracion. Reune elementos de supervision, actividad y metricas financieras/de uso.

### Paginas de pagos

- `src/pages/payments/purchase.jsx`
  Seleccion de paquetes, carrito y creacion del flujo de compra.
- `src/pages/payments/checkout.jsx`
  Seguimiento de una orden de pago y puente con Mercado Pago.
- `src/pages/payments/history.jsx`
  Historial de compras o movimientos de pago.

### Componentes compartidos mas importantes

No es necesario memorizar todos los componentes, pero estos concentran buena parte del comportamiento reutilizable del sistema:

- `src/components/navbar.jsx`
  Navegacion superior global.
- `src/components/footer.jsx`
  Pie de pagina global.
- `src/components/PageHeader.jsx`
  Encabezado reutilizable para vistas internas.
- `src/components/ButtonPrimary.jsx`
  Boton principal reutilizado en distintas paginas.
- `src/components/QuestionForm.jsx`
  Formulario base para crear/editar preguntas. MUY IMPORTANTE (Evitar en lo posible modificar su funcionalidad)
- `src/components/TextAreaInput.jsx`
  Campo de texto largo reutilizable, usado por ejemplo en respuestas.
- `src/components/TableSimpleInCardTeacher.jsx`
  Tabla principal para vistas del profesor.
- `src/components/TableSimpleInCardStudent.jsx`
  Tabla principal para vistas del alumno.
- `src/components/TableSimpleInCardAdmin.jsx`
  Tabla reutilizable para administracion.
- `src/components/CreditOptionDisplay.jsx`
  Tarjeta o bloque visual para mostrar creditos disponibles.
- `src/components/PaymentsHistory.jsx`
  Componente auxiliar del historial de pagos.
- `src/components/FileUpload.jsx`
  Subida de archivos cuando una vista necesita adjuntos.
- `src/components/ConfirmPopUp.jsx`
  Modal reutilizable de confirmacion.
- `src/components/DeletePopUp.jsx`
  Confirmacion especifica para acciones de borrado.
- `src/components/ProtectedRoute.jsx`
  Protege rutas para usuarios autenticados.
- `src/components/RequiredRole.jsx`
  Restriccion por rol cuando una pantalla deberia ser exclusiva de ciertos perfiles.
- `src/components/GuidelineStatusListener.jsx`
  Listener global para avisar estados de generacion de pautas aunque el usuario cambie de vista.

### Contextos y modulos transversales

- `src/context/AuthProvider.jsx`
  Corazon de la autenticacion. Rehidrata sesion al montar, expone `signIn`, `signUp`, `signOut` y guarda el usuario actual.
- `src/context/CreditsContext.jsx`
  Maneja saldo de creditos, recarga desde backend y sincronizacion con eventos de pautas.
- `src/lib/axios.js`
  Cliente HTTP comun. Si cambia la URL base, cookies o CSRF, casi seguro hay que tocar este archivo.
- `src/lib/normalizeUser.js`
  Normaliza la estructura del usuario recibida desde backend.
- `src/hooks/api.js`
  Helper simple para llamadas puntuales como organizaciones.
- `src/i18n.jsx`
  Configuracion base de internacionalizacion.
- `src/main.jsx`
  Entrada de la app. Monta React, router y providers.
- `src/router.jsx`
  Tabla central de rutas.

### Assets y recursos visuales

- `public/feature-1.mp4`, `public/feature-2.mp4`, `public/feature-3.mp4`
  Videos usados en secciones visuales de la landing.
- `public/hero-1.mp4`, `public/hero-2.mp4`, `public/hero-3.mp4`
  Videos del hero principal.
- `public/logo.svg`
  Logo principal.

### Como se conectan estas piezas

Una forma util de leer el repo es pensar en capas:

1. `main.jsx` inicia la app.
2. `AuthProvider` y `CreditsProvider` ponen estado global disponible.
3. `router.jsx` decide que pagina se renderiza.
4. Cada pagina en `src/pages/` coordina el flujo de negocio de su pantalla.
5. Los componentes de `src/components/` resuelven la UI reutilizable.
6. `src/lib/axios.js` conecta cada flujo con el backend (permite usar axios en otras partes).


