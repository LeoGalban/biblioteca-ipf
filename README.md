# Biblioteca IPF

Trabajo Práctico N° 4 — Taller Complementario React Native II (IPF).
Alumno: **Galban Rojas, Leonel**.

App para consultar el catálogo de la biblioteca, reservar libros, recibir un recordatorio
de devolución y, para el personal, entregar libros respetando el orden de las reservas.

## Versión

- **Expo SDK 58** (`expo ~58.0.26`, `expo-router ~58.0.32`, React Native 0.88, React 19.3).
- Proyecto creado con `npx create-expo-app@latest` (TypeScript + Expo Router, rutas tipadas activas).
- Paquetes agregados solo con `npx expo install`: `@expo/vector-icons`, `expo-camera`, `expo-notifications`.

## Cómo ejecutar

```bash
npm install
npx expo start
```

Escanear el QR con **Expo Go** (teléfono y computadora en la misma red Wi-Fi).

- **Ingreso del personal** (`/login`): usuario `biblioteca`, clave `ipf2026`.
- **Libros con lista de espera inicial**: *El Aleph* (2 personas) y *Don Segundo Sombra* (1 persona).
- **Libros sin ejemplares**: *El Aleph*, *Don Segundo Sombra*, *El túnel*, *Estructuras de datos y algoritmos* y el segundo libro real.

## Diseño e imágenes

- Paleta en `src/constants/tema.ts`: azul profundo (headers y botones), dorado de acento y fondo
  color papel. Tarjetas con sombra suave, bordes redondeados y etiquetas de disponibilidad.
- **Tapas de los libros**: se cargan desde [Open Library](https://openlibrary.org)
  (`covers.openlibrary.org`), un catálogo abierto que permite usar sus tapas citando la fuente.
  Los identificadores están en `src/data/portadas.ts` y la URL se arma en `src/lib/portadas.ts`.
  El crédito aparece al pie del Catálogo.
- Si una tapa no existe o no carga (por ejemplo, sin conexión), `PortadaLibro` dibuja una tapa
  de respaldo con el título y un color fijo por ISBN. La app nunca muestra un hueco.
- Solo se usan componentes de React Native (`Image`, `View`…): no se agregaron módulos nativos
  como `expo-image` o `expo-linear-gradient`, porque la consigna limita los módulos nativos a
  `expo-camera` y `expo-notifications`.

## Árbol de rutas (`src/app`)

```
src/app
├── _layout.tsx               → Stack raíz (en src/components/PilaRaiz.tsx) + BibliotecaProvider
│                               anchor: '(tabs)'
├── (tabs)
│   ├── _layout.tsx           → Tabs (expo-router/js-tabs) con íconos de @expo/vector-icons
│   ├── (catalogo)
│   │   ├── _layout.tsx       → Stack propio de la tab "Catálogo" (anchor: 'index')
│   │   ├── index.tsx         → /                 Catálogo
│   │   └── libro
│   │       └── [isbn].tsx    → /libro/[isbn]     Detalle validado
│   └── reservas.tsx          → /reservas         Tab "Mis reservas"
├── buscar.tsx                → /buscar?q=        Buscador (q en la URL)
├── escanear.tsx              → /escanear         Escáner EAN-13 + ingreso manual
├── reservar
│   └── [isbn].tsx            → /reservar/[isbn]  Modal (presentation: 'modal')
├── permisos
│   └── [recurso].tsx         → /permisos/[recurso]  Modal: pantalla previa al permiso
├── login.tsx                 → /login            Modal, Stack.Protected guard={!sesionIniciada}
├── mostrador.tsx             → /mostrador        Stack.Protected guard={sesionIniciada}
├── reserva.tsx               → /reserva          <Redirect href="/reservas" />
└── +not-found.tsx            → cualquier otra    404 que muestra la URL
```

El resto del código está fuera de `src/app`: `components`, `hooks`, `lib`, `data`, `types`,
`context`, `estructuras` y `constants`.

## Plugins de `app.json` (comentado)

```jsonc
"plugins": [
  // Rutas basadas en archivos (src/app) y deep links con el scheme "bibliotecaipf".
  "expo-router",

  // Pantalla de carga al abrir la app.
  ["expo-splash-screen", {
    "backgroundColor": "#208AEF",
    "image": "./assets/images/splash-icon.png",
    "imageWidth": 76
  }],

  ["expo-camera", {
    // Texto de propósito (iOS NSCameraUsageDescription), con el molde de la consigna.
    "cameraPermission": "Usamos tu cámara para leer el código de barras del libro y abrirlo al instante.",
    // Mínimo privilegio: la app no graba video, así que no declara el micrófono.
    "microphonePermission": false,   // iOS: no agrega NSMicrophoneUsageDescription
    "recordAudioAndroid": false,     // Android: no agrega RECORD_AUDIO
    // Necesario para leer códigos de barras (EAN-13).
    "barcodeScannerEnabled": true
  }],

  ["expo-notifications", {
    // Color del ícono de la notificación en Android.
    "color": "#1F4E8C",
    // Canal por defecto: el mismo "prestamos" que la app crea antes de pedir el permiso.
    "defaultChannel": "prestamos"
  }]
]
```

## Permisos

| Recurso | Módulo | Cuándo se pide | Alternativa si se niega |
|---|---|---|---|
| Cámara | `expo-camera` | Al tocar "Escanear" → "Usar la cámara" → pantalla previa `/permisos/camara` → "Continuar". | Escribir el ISBN a mano (siempre visible en `/escanear`). |
| Notificaciones | `expo-notifications` | Solo al activar el interruptor "Recordarme" de un préstamo (antes se crea el canal "prestamos" en Android). | Los recordatorios y avisos aparecen dentro de la app, en "Mis reservas". |

La app no pide ningún otro permiso. No usa `expo-permissions`, `expo-location` ni `expo-image-picker`.

### Justificación de `blockedPermissions` (Android)

Algunas librerías y la configuración por defecto de Expo pueden sumar permisos al
`AndroidManifest.xml` final. `blockedPermissions` los quita aunque los agregue otra dependencia:

| Permiso bloqueado | Por qué la app no lo necesita |
|---|---|
| `RECORD_AUDIO` | La cámara solo lee códigos de barras, no graba video con sonido. Refuerza `recordAudioAndroid: false`. |
| `ACCESS_FINE_LOCATION`, `ACCESS_COARSE_LOCATION`, `ACCESS_BACKGROUND_LOCATION` | La app no usa la ubicación. |
| `READ_EXTERNAL_STORAGE`, `WRITE_EXTERNAL_STORAGE`, `READ_MEDIA_IMAGES`, `READ_MEDIA_VIDEO`, `READ_MEDIA_AUDIO` | La app no lee ni guarda archivos, fotos, videos ni audio. |
| `READ_CONTACTS` | La app no usa los contactos. |
| `SYSTEM_ALERT_WINDOW` | La app no dibuja ventanas encima de otras apps (solo lo usa el menú de desarrollo). |

Quedan los que sí hacen falta: `CAMERA` (escáner), `POST_NOTIFICATIONS` (recordatorios) y
los que agrega `expo-notifications` para programar notificaciones locales.

## Deep links de prueba

En Expo Go se usa la URL equivalente `exp://IP:8081/--/…`. La IP aparece debajo del QR al correr `npx expo start`.

| Link | Equivalente en Expo Go | Qué se ve |
|---|---|---|
| `bibliotecaipf://libro/9789870001010` | `exp://IP:8081/--/libro/9789870001010` | Detalle de *Ficciones* (Catálogo debajo) |
| `bibliotecaipf://libro/123` | `exp://IP:8081/--/libro/123` | "ISBN inválido" con link al Catálogo |
| `bibliotecaipf://buscar?q=borges` | `exp://IP:8081/--/buscar?q=borges` | Buscador con *Ficciones* y *El Aleph* |
| `bibliotecaipf://mostrador` | `exp://IP:8081/--/mostrador` | Sin sesión: no existe, queda el Catálogo |
| `bibliotecaipf://reserva` | `exp://IP:8081/--/reserva` | Redirige a "Mis reservas" |
| `bibliotecaipf://escanear` | `exp://IP:8081/--/escanear` | Escáner (con cámara bloqueada: "Abrir Ajustes" + ingreso manual) |
| `bibliotecaipf://cualquiercosa` | `exp://IP:8081/--/cualquiercosa` | Pantalla 404 con la URL |

## Lint y TypeScript

Salida en la versión entregada (los dos comandos terminan sin mostrar errores):

```
PS> npx tsc --noEmit
PS> npx expo lint
PS>
```

## Capturas

Pendientes de agregar en `docs/capturas/` (lo pide F2):

- [ ] Catálogo cargando
- [ ] Catálogo con error ("Reintentar")
- [ ] Catálogo con datos (y "Vistos recientemente")
- [ ] Buscador (`/buscar?q=borges`)
- [ ] Detalle inexistente (`/libro/123` o un ISBN que no existe)
- [ ] Reserva con ejemplares (préstamo a 7 días)
- [ ] Reserva sin ejemplares (lista de espera con posición)
- [ ] Escáner: cargando
- [ ] Escáner: concedido (cámara)
- [ ] Escáner: preguntable ("Usar la cámara")
- [ ] Escáner: bloqueado ("Abrir Ajustes" + ingreso manual)
- [ ] Notificación recibida (recordatorio a 15 s)
- [ ] Mostrador antes de "Entregar al siguiente"
- [ ] Mostrador después de "Entregar al siguiente"
- [ ] Pantalla 404
