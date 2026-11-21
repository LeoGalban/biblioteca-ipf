# Respuestas — TP N° 4 "Biblioteca IPF"

Alumno: **Galban Rojas, Leonel** · Expo SDK 58

Las referencias son `archivo:línea` sobre el código de este repositorio.
Las filas marcadas con **Comprobado en** se completan después de probarlas en el teléfono.

---

## Parte B — Estado, efectos y renderizado

### B1. El ciclo de vida de `useLibros`

Código: `src/hooks/useLibros.ts:11-49`.

```ts
const [libros, setLibros] = useState<Libro[]>([]);        // :12
const [cargando, setCargando] = useState(true);            // :13
const [error, setError] = useState<string | null>(null);  // :14
const [intento, setIntento] = useState(0);                 // :16
```

**a) Render por render**

Caso feliz (se monta el Catálogo, `src/app/(tabs)/(catalogo)/index.tsx:22-60`):

| Render | `libros` | `cargando` | `error` | Qué lo provoca | Qué se ve |
|---|---|---|---|---|---|
| 1 | `[]` | `true` | `null` | El montaje (valores iniciales de `useState`) | `EstadoCargando` "Cargando el catálogo…" |
| — | | | | Después del render 1 corre el efecto (`:18-40`) y llama a `obtenerLibros()`. No hay render nuevo. | |
| 2 | 17 libros | `false` | `null` | A los 800 ms se resuelve la promesa: `setLibros(datos)` y `setCargando(false)` (`:28-29`). React agrupa los dos cambios (*batching*) en **un solo** render. | La `FlatList` con los libros |

Son **2 renders**. El efecto no se vuelve a ejecutar porque `intento` no cambió.

Caso con falla y "Reintentar":

| Render | `libros` | `cargando` | `error` | Qué lo provoca |
|---|---|---|---|---|
| 1 | `[]` | `true` | `null` | Montaje → efecto → `obtenerLibros()` |
| 2 | `[]` | `false` | `"No pudimos cargar el catálogo…"` | La promesa se rechaza: `.catch` hace `setError` y `setCargando(false)` (`:33-34`), en un solo render. Se ve `EstadoError` con "Reintentar". |
| 3 | `[]` | `true` | `null` | Tocar "Reintentar" (`:42-46`): `setError(null)`, `setCargando(true)` y `setIntento(+1)`, agrupados en un render. Se ve la ruedita. |
| — | | | | Como cambió `intento`, React ejecuta la **limpieza** del efecto anterior (`vigente = false`, `:37-39`) y después el efecto nuevo, que vuelve a pedir. |
| 4 | 17 libros | `false` | `null` | Llega la respuesta (o otro error, y se repite desde el render 2). |

**b) ¿Se desmonta el Catálogo?**

- **Al cambiar a "Mis reservas": no.** El navegador de tabs mantiene montadas las pestañas que ya se visitaron. Solo cambia cuál se ve.
- **Al abrir un detalle: no.** El detalle se apila **encima** en el Stack de la tab Catálogo (`src/app/(tabs)/(catalogo)/_layout.tsx`), y el Catálogo queda montado debajo.

Para comprobarlo se agrega un `console.log` temporal en la limpieza (`useLibros.ts:37-39`) y se borra después de probar.

Ojo: `useLibros` también lo usan el detalle, `/reservar`, `/escanear`, `/reservas` y `/mostrador`. El log aparece cuando se desmonta **cualquiera** de ellos, por ejemplo al volver atrás desde un detalle, pero nunca por el Catálogo al cambiar de pestaña o al abrir un libro.

En mi app, la limpieza se ejecuta en estas situaciones reales:
1. **Al tocar "Reintentar"**: cambia `intento` y se limpia el efecto anterior antes del nuevo.
2. **Al desmontar una pantalla que usa el hook**: volver atrás desde un detalle, cerrar el modal de reserva, el `replace` del escáner al detalle, cerrar sesión en el mostrador.
3. **Al recargar la app** (por ejemplo con `r` en Metro): ahí sí se desmonta el Catálogo.

> Comprobado en: ____________ (dispositivo y lo que mostró el `console.log`)

**c) ¿Por qué no `async` directo en `useEffect`?**

Una función `async` **siempre devuelve una Promise**. `useEffect` espera que el efecto devuelva `undefined` o la **función de limpieza**. Si le paso una función `async`, React recibe una Promise en lugar de la limpieza: no la puede ejecutar, y la limpieza que escribí (`vigente = false`) se perdería.

Lo resolví usando la promesa con `.then/.catch` dentro de un efecto común, que sí devuelve la limpieza (`useLibros.ts:23-39`):

```ts
useEffect(() => {
  let vigente = true;
  obtenerLibros()
    .then((datos) => { if (!vigente) return; setLibros(datos); setCargando(false); })
    .catch(() => { if (!vigente) return; setError(MENSAJE_ERROR); setCargando(false); });
  return () => { vigente = false; };
}, [intento]);
```

(La otra forma válida es declarar una función `async` **adentro** del efecto y llamarla.)

**d) ¿Cómo implementé "reintentar"?**

Con un contador en el estado, `intento` (`:16`), que está en el array de dependencias (`:40`). `reintentar()` (`:42-46`) suma 1. Como el valor cambió, React vuelve a ejecutar el efecto, y eso hace el pedido de nuevo.

¿Por qué `intento` y no otro valor?
- Con **`error`** no sirve: si fallara dos veces seguidas con el mismo mensaje, el valor sería igual y el efecto no se repetiría. Además, en `reintentar` lo pongo en `null`.
- Con **`cargando`** tampoco: el efecto se dispararía también cuando pasa a `false` al llegar los datos, y haría un pedido de más.
- Con **`libros`** se armaría un bucle: cada respuesta trae un array nuevo, eso cambia `libros`, y el cambio dispara otro pedido.
- **`intento` solo cambia cuando la persona pide reintentar**, que es exactamente cuándo quiero repetir el pedido.

`setCargando(true)` está en `reintentar` y no dentro del efecto, porque la regla `react-hooks/set-state-in-effect` del lint del SDK 58 no permite cambiar el estado directamente en el cuerpo de un efecto.

---

### B2. La condición de carrera del buscador

Código: `src/hooks/useBusqueda.ts:18-61` y `src/app/buscar.tsx:22-31`.

| Momento | Qué pasa | Sin limpieza: qué se ve | Con mi código: qué se ve |
|---|---|---|---|
| t = 0 ms | Escribe "bor" → se pide `buscarLibros("bor")` (1.400 ms) | "Buscando…" | "Buscando…" |
| t = 200 ms | Escribe "borges" → se pide `buscarLibros("borges")` (300 ms) | "Buscando…" | "Buscando…". Además, **en este momento** corre la limpieza del efecto de "bor" y su `vigente` pasa a `false`. |
| t = 500 ms | Llega la respuesta de "borges" | *Ficciones* y *El Aleph* | *Ficciones* y *El Aleph* |
| t = 1.400 ms | Llega la respuesta de "bor" | Se **pisan** los resultados con los de "bor". En mi catálogo "bor" coincide con los mismos 2 libros de Borges, así que se ve igual, pero con otra palabra se verían resultados de una búsqueda vieja mientras el campo dice otra cosa. (Con mi forma de guardar la respuesta junto con su texto, sin limpieza la pantalla volvería a "Buscando…" para siempre, porque la respuesta guardada sería de "bor" y no de "borges".) | Nada cambia: `if (!vigente) return;` (`useBusqueda.ts:30`) descarta la respuesta de "bor". Siguen *Ficciones* y *El Aleph*. |

**a) ¿Qué hace la limpieza y cuándo se ejecuta?**

Cada ejecución del efecto crea su propia variable `vigente = true` (`:26`). La limpieza (`:41-43`) la pone en `false`.

React ejecuta esa limpieza **antes de volver a ejecutar el efecto**, es decir, cuando cambia `busqueda` (al escribir una letra) o `intento`, y también **al desmontar** la pantalla. El `.then` del pedido viejo sigue esperando, pero cuando llega lee **su** `vigente`, que ya es `false`, y no llama a `setRespuesta`. La promesa no se cancela: se ignora su resultado.

**b) La propuesta del compañero (`if (texto === q)` dentro del `.then`)**

**No funciona.** El `.then` es una **clausura**: guarda las variables del render en que se creó el efecto. Ese render tenía `q = "bor"`, y el pedido se hizo con `texto = "bor"`. Cuando la respuesta llega a los 1.400 ms, la función sigue "viendo" `q = "bor"`, el valor de *ese* render y no el actual "borges". Entonces `texto === q` da **siempre** `true` y el resultado viejo se guarda igual.

Para que funcione, el valor tendría que leerse "en vivo" (por ejemplo, desde un `useRef` con el texto actual). La limpieza resuelve lo mismo de una forma más simple.

**c) La URL y el botón atrás mientras se escribe**

Con `router.setParams({ q: nuevo })` (`buscar.tsx:29-31`), cada letra cambia el parámetro de **la misma pantalla**: la URL pasa por `/buscar?q=b`, `/buscar?q=bo`, … hasta `/buscar?q=borges`, pero no se apila nada. "Atrás" sale del buscador con un solo toque y vuelve al Catálogo.

Con `router.push` se apilaría **una pantalla `/buscar` por cada letra**. Para salir habría que tocar "atrás" seis veces, pasando por "borge", "borg", … Además, cada pantalla apilada tendría su propio efecto y su propio pedido.

---

### B3. Mutar o reemplazar

**a) Toca "Anotarme" tres veces: el texto sigue diciendo 0.**
`espera.encolar('Ana')` cambia la cola **por dentro**, pero no llama a ningún `setState`. Además, `espera` sigue siendo el **mismo objeto**, y React solo vuelve a renderizar cuando se llama a un setter con un valor distinto (comparado con `Object.is`). Sin render nuevo, el `<Text>` sigue mostrando el `tamanio` que leyó en el último render.

**b) Escribe en un `TextInput` controlado y el número "salta" a 3.**
El `TextInput` sí llama a un `setState`. Eso provoca un render de **todo** el componente, y en ese render se vuelve a leer `espera.tamanio`, que ya vale 3 porque las mutaciones estaban ahí. El número aparece de golpe, por una causa que no tiene nada que ver con la cola.

Un error que aparece **a veces** es peor que uno que aparece siempre: depende de que *otra cosa* provoque un render, así que no se puede reproducir a voluntad. Además, en las pruebas puede parecer que funciona (si justo había otro render) y fallar en manos de la persona usuaria. Uno que aparece siempre se ve en la primera prueba.

**c) Cómo lo resolví en mi Context y comparación**

Elegí **no mutar nunca la estructura que está en el estado**: creo una cola **nueva** a partir de la anterior, cambio la nueva y la guardo con `setEsperas`. Para eso agregué `copiar()` a las clases (`src/estructuras/Cola.ts:50-56`, y lo mismo en `Pila.ts`):

```ts
// src/context/BibliotecaContext.tsx:187-191 (encolar en "reservar")
setEsperas((actuales) => {
  const cola = actuales[libro.isbn]?.copiar() ?? new Cola<string>();
  cola.encolar(USUARIO_ACTUAL);
  return { ...actuales, [libro.isbn]: cola };
});
```

Hago lo mismo al desencolar en el mostrador (`:264-266`) y al apilar en recientes (`:141-149`, donde además devuelvo **la misma** pila si el libro ya está en el tope, para que no haya render).

| Estrategia | Ventaja | Costo |
|---|---|---|
| **Copia nueva** (la mía) | React ve una referencia nueva y vuelve a renderizar siempre. Los estados anteriores no cambian, así que no hay "saltos" como el de b). Funciona bien con el React Compiler y con `useMemo`. | Copiar es O(n) en cada cambio. En listas de espera de 1 a 5 personas no se nota. |
| **Contador de versión** (mutar + `setVersion(v + 1)`) | Es O(1), no copia nada. | El objeto sigue siendo el mismo: cualquier `useMemo`, `React.memo` o el Compiler que dependa de la cola no ve el cambio. Es fácil olvidarse el `setVersion` en algún lugar y volver al error de B3. |
| **`useReducer`** | Junta todas las operaciones en un solo lugar (`'ENCOLAR'`, `'ENTREGAR'`…) y se testea fácil. | Más código. Igual hay que devolver un estado nuevo dentro del reducer, así que no evita copiar. |

---

### B4. ¿Dónde vive cada dato?

| Dato | Dónde vive en mi app | Por qué ahí y no en otro lugar |
|---|---|---|
| Texto del buscador | **URL** (`q` en `/buscar?q=…`, `buscar.tsx:24` y `:30`) | Así un deep link (`bibliotecaipf://buscar?q=borges`) abre la búsqueda hecha, se puede compartir y sobrevive si la pantalla se vuelve a montar. En estado local se perdería al salir. |
| Préstamos y reservas | **Context** (`prestamos`, `BibliotecaContext.tsx:82`) | Los usan varias pantallas que no son padre e hijo: el detalle, el modal de reserva, Mis reservas y el mostrador. |
| Listas de espera | **Context** (`esperas: Record<isbn, Cola>`, `:83`) | Las modifican la reserva (encolar) y el mostrador (desencolar), y las leen el detalle y Mis reservas. |
| Vistos recientemente | **Context** (`pilaRecientes`, `:84`) | El detalle escribe y el Catálogo lee. Son pantallas distintas, y además el detalle se desmonta al volver. |
| Sesión del personal | **Context** (`sesionIniciada`, `:85`) | La necesita el `Stack.Protected` del Stack raíz (`PilaRaiz.tsx:41` y `:49`) y el link "Personal". |
| Ejemplares disponibles | **Se calcula** (`disponibles(libro)`, `:118-123`) | Se deriva de `libro.ejemplares` menos los préstamos que salieron del estante. Si lo guardara, viviría en dos lugares y podría quedar desactualizado (ver E4d). |
| Estado del permiso de cámara | **Sistema operativo**. La pantalla tiene una copia local en `usePermiso` (`usePermiso.ts:19`). | La verdad la tiene el SO: la persona lo puede cambiar en Ajustes. Por eso la copia se vuelve a consultar al ganar el foco y al volver a primer plano (`:21-47`). |
| Identificador de la notificación programada | **Context**, dentro del préstamo (`recordatorioId`, `:247`) | Hace falta para cancelarla al desactivar "Recordarme" o al devolver (`:202-204`, `:222-224`), y esas acciones viven en el Context. |

**¿Qué componentes se vuelven a renderizar cuando cambia el `value`?**

**Todos** los que llaman a `useBiblioteca()`, porque el `value` (`:303-325`) es un objeto nuevo cada vez que cambia algún estado del provider. React no mira qué propiedad usa cada componente.

Por eso **sí**: el Catálogo, que solo usa `recientes`, se vuelve a renderizar cuando se activa un recordatorio en Mis reservas (cambia `prestamos`).

Para evitarlo se podría dividir el Context en varios (por ejemplo, uno solo para `recientes`) o usar un selector. **En esta app no vale la pena**: son pocos componentes y los renders son baratos. Lo comprobaría con el Profiler de React DevTools antes de complicar el código.

---

## Parte C — Navegación y rutas

### C1. La pila en tu app

| # | Acción | Pilas resultantes (base → tope) |
|---|---|---|
| 1 | Abre la app | **Stack raíz**: `[(tabs)]`. **Stack de la tab Catálogo**: `[index]`. Tab activa: Catálogo. |
| 2 | Toca un libro | Stack raíz: `[(tabs)]`. Stack Catálogo: `[index, libro/[isbn]]`. |
| 3 | Toca "Reservar" | Stack raíz: `[(tabs), reservar/[isbn] (modal)]`. Stack Catálogo: `[index, libro/[isbn]]`. |
| 4 | Toca "Confirmar" | Stack raíz: `[(tabs)]` (el modal salió con `dismissTo`). Tab activa: **Mis reservas**. Stack Catálogo sin cambios: `[index, libro/[isbn]]`. |
| 5 | Toca atrás (Android) | Stack raíz: `[(tabs)]`. Las tabs usan `backBehavior = 'firstRoute'`: "atrás" vuelve a la **tab Catálogo**, que todavía muestra `libro/[isbn]`. |
| 6 | Toca la tab "Catálogo" | Como la tab ya está activa, tocarla vuelve al inicio de su Stack: Stack Catálogo `[index]`. |

> Comprobado en: ____________

**a) ¿Qué método usé en el paso 4?**

`router.dismissTo('/reservas')` (`src/app/reservar/[isbn].tsx:21-23`).

- **Con `push`**: `/reservas` se apilaría **encima** del modal. "Atrás" volvería a la confirmación y se podría confirmar dos veces.
- **Con `replace`**: el modal se cambiaría por `/reservas` dentro del Stack raíz, así que quedaría una segunda copia de las tabs encima de la primera. El historial quedaría raro y "atrás" mostraría otra vez el detalle con otras tabs.
- **Con `dismissTo`**: hace `POP_TO`. Saca de la pila todo lo que está encima de las tabs, incluido el modal, y enfoca la pestaña Mis reservas que ya existía. La confirmación desaparece del historial.

Lo elegí porque es el único que cumple "atrás no vuelve a la confirmación" sin duplicar pantallas.

**b) En el paso 6, ¿qué ve la persona?**

Después del paso 5 ve el **detalle**, porque cada tab conserva su propio Stack. En el paso 6, como toca la tab que ya está activa, el navegador vuelve al inicio de ese Stack y ve el **Catálogo**.

Me parece correcto: conservar el Stack al cambiar de pestaña permite seguir donde la persona estaba, y tocar la pestaña activa para "volver al principio" es lo que hacen la mayoría de las apps.

### C2. El escáner que dispara de más

Código: `src/app/escanear.tsx:22-123`.

**a)** `onBarcodeScanned` puede llamarse muchas veces por segundo. Con `router.push` sin protección, cada llamada **encola una acción de navegación** (la cola de acciones del TP 2). Antes de que se procese la primera ya hay varias esperando, así que se apilarían varios detalles iguales. La persona tendría que tocar "atrás" muchas veces, y cada detalle además repetiría su pedido a la API.

**b) Usé `useRef`** (`escanear.tsx:31`):

```ts
const yaNavego = useRef(false);
// ...
function irAlDetalle(isbn: string) {
  yaNavego.current = true;                                   // :41
  router.replace({ pathname: '/libro/[isbn]', params: { isbn } });
}
function alEscanear(resultado: BarcodeScanningResult) {
  const isbn = resultado.data.trim();
  if (yaNavego.current || !esIsbnValido(isbn)) return;       // :53
```

Un `useState` puesto en `true` no alcanza: `setState` **no cambia la variable al instante**, sino que programa un render nuevo. Las llamadas a `onBarcodeScanned` que llegan antes de ese render son funciones creadas en el render anterior y leen el valor viejo (`false`) por su clausura, así que vuelven a navegar.

`ref.current` es el **mismo objeto** en todos los renders y se modifica al instante. La segunda llamada ya ve `true`.

**c)** Con `replace` (`:42`) el escáner **sale de la pila** y lo reemplaza el detalle. Con `push`, al tocar "atrás" desde el detalle la persona volvería a la **cámara**. Si el libro sigue frente al celular, la cámara leería el código de nuevo y la mandaría otra vez al detalle, un bucle del que es difícil salir.

**d)** Si el ISBN no está en el catálogo, muestro un aviso ("El ISBN … no está en el catálogo de la biblioteca…", `:45-49`) y **la cámara sigue escaneando**.

Para que no aparezca diez veces, guardo el último ISBN avisado en otro ref (`ultimoIsbnAvisado`, `:32`). Si el mismo código vuelve a pasar frente a la cámara, la función sale antes de llamar a `setAviso` (`:61-62`). Si se escanea un código desconocido **distinto**, sí se avisa.

### C3. Deep links y rutas protegidas

| Link | Qué ve la persona | Qué queda debajo en la pila | Qué parte de mi código lo decide |
|---|---|---|---|
| `bibliotecaipf://libro/9789870001010` | Detalle de *Ficciones* (título en el header) | En el Stack de la tab Catálogo, el **Catálogo** (`index`), y en el raíz las `(tabs)` | `unstable_settings = { anchor: 'index' }` en `src/app/(tabs)/(catalogo)/_layout.tsx:13-15` y `anchor: '(tabs)'` en `src/app/_layout.tsx:11-13` |
| `bibliotecaipf://libro/123` | La pantalla de detalle con "ISBN inválido" y el botón "Volver al Catálogo" | El Catálogo (mismo anchor) | `esIsbnValido` en `src/app/(tabs)/(catalogo)/libro/[isbn].tsx:18` y `:32-41` |
| `bibliotecaipf://buscar?q=borges` | El buscador con "borges" escrito y *Ficciones* y *El Aleph* | Las `(tabs)` con el Catálogo | `anchor: '(tabs)'` (`src/app/_layout.tsx:11-13`) y `useLocalSearchParams` (`buscar.tsx:24`) |
| `bibliotecaipf://mostrador` (sin sesión) | No ve el mostrador: queda en el Catálogo | Nada encima de las `(tabs)` | `<Stack.Protected guard={sesionIniciada}>` (`src/components/PilaRaiz.tsx:49-51`): sin sesión la ruta no está disponible |
| `bibliotecaipf://reserva` | La pestaña **Mis reservas** | Las `(tabs)` | `<Redirect href="/reservas" />` en `src/app/reserva.tsx` |
| `bibliotecaipf://escanear` (cámara bloqueada) | "La cámara está desactivada…", el botón "Abrir Ajustes" y el ingreso manual del ISBN | Las `(tabs)` con el Catálogo | `estadoDe` (`src/lib/permisos.ts:86-93`) vía `usePermiso`, y la rama `bloqueado` de `escanear.tsx:85-91` |

> Comprobado en: ____________ (con `exp://IP:8081/--/…`)

**¿Por qué `/libro/123` llega a mi pantalla de detalle?**

El segmento `[isbn]` es **dinámico**: el router acepta cualquier texto en esa posición y se lo pasa a la pantalla como parámetro. El router solo sabe de la **forma** de la URL, no de qué libros existen. La responsabilidad de responder bien es de la **pantalla**: valida que sean 13 dígitos (`:32`) y que el libro exista (`:54-63`), y si no, muestra un mensaje claro con salida al Catálogo.

### C4. Foco, montaje y primer plano

**a)**
- **`useEffect` con `[]`** detecta el **montaje** del componente (y su desmontaje, en la limpieza). Se ejecuta una sola vez mientras la pantalla siga montada.
- **`useFocusEffect`** detecta cuándo la pantalla **gana el foco de navegación**: al abrirla, al volver a ella con "atrás" o al cambiar a su pestaña. La limpieza corre al perder el foco.
- **`AppState`** detecta cuándo **la app entera** pasa a primer o segundo plano (`active` / `background`), por ejemplo al ir a Ajustes y volver.

**b)**
- **Sale a Ajustes, habilita las notificaciones y vuelve: se entera solo `AppState`.** Para la navegación, "Mis reservas" nunca perdió el foco y tampoco se desmontó.
- **Va a la pestaña Catálogo y vuelve a "Mis reservas": se entera solo `useFocusEffect`.** La pantalla no se desmonta, así que `useEffect` no vuelve a correr, y la app no cambió de plano, así que `AppState` no dispara.

**c)** Usé **las dos juntas** dentro de `usePermiso` (`src/hooks/usePermiso.ts:21-47`):

```ts
useFocusEffect(useCallback(() => {
  let vigente = true;
  function revisar() { consultar(recurso).then((nueva) => { if (vigente) setRespuesta(nueva); }); }
  revisar();                                                          // al ganar el foco
  const suscripcion = AppState.addEventListener('change', (estadoApp) => {
    if (estadoApp === 'active') revisar();                            // al volver de Ajustes
  });
  return () => { vigente = false; suscripcion.remove(); };
}, [recurso]));
```

"Mis reservas" muestra el estado de las notificaciones con ese hook (`src/app/(tabs)/reservas.tsx:28`), así que se actualiza en los dos casos de b). La suscripción a `AppState` solo existe mientras la pantalla tiene el foco, y se limpia al perderlo.

Si hubiera usado solo `useFocusEffect`, el caso que fallaría es volver de Ajustes: la pantalla seguiría diciendo "Notificaciones desactivadas" hasta cambiar de pestaña y volver.

---

## Parte D — Permisos en tu app

### D1. Recorrido completo de la cámara (Android 14, app recién instalada)

| # | Acción | Qué muestra mi app | status | canAskAgain |
|---|---|---|---|---|
| 1 | Toca "Escanear" por primera vez | Un instante "Revisando el permiso de la cámara…", después "Para leer el código de barras del libro necesitamos usar la cámara" con el botón **Usar la cámara**, y abajo el ingreso manual del ISBN. Ese botón abre la pantalla previa `/permisos/camara` con el beneficio y **Continuar**. | `undetermined` | `true` |
| 2 | "Continuar" → "No permitir" | La pantalla previa vuelve a mostrar **Continuar** (sigue preguntable), con la alternativa "podés escribir el ISBN a mano". | `denied` | `true` |
| 3 | Toca "Escanear" otra vez | Otra vez "Usar la cámara" + ingreso manual (`preguntable`). | `denied` | `true` |
| 4 | "Continuar" → "No permitir" | Android no vuelve a preguntar después del segundo rechazo. La pantalla previa cambia a "El permiso está desactivado…" con **Abrir Ajustes**. | `denied` | `false` |
| 5 | Toca "Escanear" otra vez | "La cámara está desactivada para esta app…" con **Abrir Ajustes**, y el ingreso manual sigue disponible (`bloqueado`). | `denied` | `false` |
| 6 | "Abrir Ajustes" → habilita la cámara → vuelve a la app | Sin tocar nada, la pantalla pasa a mostrar la **cámara** (`concedido`). | `granted` | `true` |

> Comprobado en: ____________. En Expo Go el permiso es de la app Expo Go: para repetir el recorrido hay que quitárselo en Ajustes → Apps → Expo Go → Permisos.

**a) En iOS** el sistema muestra el diálogo **una sola vez**. El resultado cambia en el **paso 2**: después del primer "No permitir" queda `status: denied` y `canAskAgain: false`. Mi pantalla previa pasa directamente a **Abrir Ajustes**, y en el paso 3 Escanear ya muestra el estado `bloqueado`. Los pasos 3 a 5 se ven igual que el 5 de Android.

**b)** La línea que decide es `src/lib/permisos.ts:91`:

```ts
if (respuesta.canAskAgain) return 'preguntable';
```

Usa **`canAskAgain`**. Mirar solo `status` no alcanza porque después de un rechazo `status` vale `denied` tanto si el sistema todavía puede mostrar el diálogo (paso 2) como si ya no lo va a mostrar nunca (paso 4). Con `status` solo, mostraría "Continuar" en el paso 5, y la persona tocaría un botón que no hace nada.

**c)** Se entera la suscripción a `AppState` de `usePermiso` (`src/hooks/usePermiso.ts:36-38`): al volver a `active` llama a `revisar()`, que consulta el permiso y actualiza el estado.

Si no existiera, la app seguiría mostrando "La cámara está desactivada… Abrir Ajustes" aunque el permiso ya esté dado, hasta salir de la pantalla y volver a entrar (`useFocusEffect`). La persona pensaría que el cambio en Ajustes no funcionó.

### D2. Notificaciones y consistencia

**a)** Si no cancelara la notificación, a los 15 segundos llegaría "Acordate de devolver "…" a la biblioteca" **de un libro que ya devolvió**. Es un aviso falso, y hace que la persona deje de confiar en los recordatorios. Por eso `devolver` cancela con el identificador guardado (`BibliotecaContext.tsx:202-204`), y también al desactivar el interruptor (`:222-224`).

**b)** El identificador se guarda en el **Context**, dentro del préstamo (`recordatorioId`, `:247`), o sea **en memoria**.

Si la app se cierra antes de que llegue:
- **La notificación** ya está programada en el **sistema operativo**, que la entrega igual.
- **El identificador** se pierde junto con todo el estado del Context. Al reabrir, la app no tiene préstamos ni ids.

El problema: la notificación llega aunque en la app no figure ningún préstamo, y si la persona "devuelve" el libro ya no hay forma de cancelarla.

Lo resolvería guardando préstamos e ids con `@react-native-async-storage/async-storage` (desafío A6) y, al iniciar, conciliando con `getAllScheduledNotificationsAsync()`: cancelar las notificaciones cuyo préstamo ya no existe.

**c)** En Android 13 o superior las notificaciones necesitan el permiso en tiempo de ejecución `POST_NOTIFICATIONS`, y el sistema **no muestra el diálogo si la app no tiene ningún canal de notificaciones**. Por eso `pedir('notificaciones')` crea el canal "prestamos" **antes** de pedir (`src/lib/permisos.ts:76-82`, con `crearCanalPrestamos` en `:52-67`).

En **Android 12** no existe ese permiso: las notificaciones vienen permitidas al instalar la app, y `requestPermissionsAsync()` devuelve `granted` sin mostrar ningún diálogo. El canal igual hace falta desde Android 8 para poder **mostrar** la notificación, por eso también se intenta crear antes de programarla (`canalDisponible` en `src/lib/notificaciones.ts`).

**d)** Me entero por un **aviso dentro de la app**, en "Mis reservas": "Ya podés retirar "…" en el mostrador. Devolvelo antes del …".

El código que decide es `src/context/BibliotecaContext.tsx:279-291`:

```ts
const permiso = await consultar('notificaciones');
if (permiso.granted) {
  await notificarAhora('¡Tu libro está listo!', texto);
} else {
  agregarAviso(texto);
}
```

**Consulta el permiso en ese momento**: `consultar` llama a `getPermissionsAsync()`. No usa un valor guardado. Importa porque la persona puede haber cambiado el permiso en Ajustes después de la última vez que la app lo miró. Con un valor viejo, la app podría "mandar" una notificación que el sistema descarta (y el aviso se pierde), o mostrar solo el aviso interno cuando ya podía notificar.

### D3. Lo que tu app pide y lo que no

| Plataforma | Permiso o clave declarada | Función de la app que lo justifica | ¿Quién lo agrega? |
|---|---|---|---|
| Android | `android.permission.CAMERA` | Leer el código de barras en `/escanear` | Plugin de `expo-camera` |
| Android | `android.permission.POST_NOTIFICATIONS` | Recordatorio de devolución y aviso de "libro listo" | `expo-notifications` |
| Android | `android.permission.RECEIVE_BOOT_COMPLETED` | Que las notificaciones programadas sobrevivan a un reinicio | `expo-notifications` |
| Android | `android.permission.VIBRATE` | Vibración de la notificación | `expo-notifications` / configuración base de Expo |
| Android | `android.permission.INTERNET` | Conexión con el servidor de desarrollo (Metro) | Configuración base de React Native / Expo |
| iOS | `NSCameraUsageDescription` = "Usamos tu cámara para leer el código de barras del libro y abrirlo al instante." | Escáner | Plugin de `expo-camera` (`cameraPermission` en `app.json:49`) |
| iOS | — (las notificaciones locales no necesitan clave en `Info.plist`, se piden en tiempo de ejecución) | Recordatorios | — |

Todo lo demás se bloquea con `blockedPermissions` (`app.json:18-30`, justificado en el README). Para ver la lista exacta, se genera el proyecto nativo con `npx expo prebuild --platform android` y se lee `android/app/src/main/AndroidManifest.xml`.

**a)** No declara `RECORD_AUDIO` porque el plugin de la cámara se configuró sin micrófono. Además lo bloqueo por las dudas:

```json
["expo-camera", {
  "cameraPermission": "Usamos tu cámara para leer el código de barras del libro y abrirlo al instante.",
  "microphonePermission": false,
  "recordAudioAndroid": false,
  "barcodeScannerEnabled": true
}]
```

(`app.json:46-54`; además `"android.permission.RECORD_AUDIO"` en `blockedPermissions`, `app.json:19`). La app solo lee códigos, no graba video con sonido, así que pedir el micrófono iría contra el mínimo privilegio.

**b)** Usaría **`expo-image-picker`** con `launchImageLibraryAsync()`:
- **Permisos:** en Android 13+ abre el selector de fotos del sistema (*Photo Picker*), que **no requiere permiso**. En iOS 14+ usa `PHPicker`, que tampoco pide acceso a toda la galería. Solo para acceso completo habría que declarar `NSPhotoLibraryUsageDescription` con el molde "Usamos tus fotos para…".
- **Actualización:** **no alcanza con una actualización OTA**. `expo-image-picker` tiene **código nativo** que no está en el binario instalado, y las OTA solo cambian JavaScript y assets. Hace falta una **build nueva** (y sacar `READ_MEDIA_IMAGES` de `blockedPermissions` solo si se pidiera acceso completo).

**c)** En Expo Go no pude verificar del todo:
- **El texto de propósito de la cámara**: Expo Go muestra su propio diálogo, con el texto de Expo Go.
- **El nombre de la app en Ajustes**: los permisos aparecen bajo "Expo Go", no bajo "Biblioteca IPF".
- **`blockedPermissions`**: el manifiesto que se usa es el de Expo Go.
- **El color del ícono de las notificaciones y el canal por defecto** del plugin.
- **El canal "prestamos"**: en el emulador (Android 16, Expo Go SDK 58), `setNotificationChannelAsync` falla **dentro de Expo Go** con un `NullPointerException` nativo. Por eso `crearCanalPrestamos` (`src/lib/permisos.ts:52-67`) devuelve `false` en vez de cortar todo: la app igual pide el permiso y programa el recordatorio en el canal por defecto de Expo Go (la notificación llegó a los 15 s, captura 12).

La razón es que Expo Go es un binario ya compilado: los plugins de `app.json` solo se aplican cuando se genera **mi** proyecto nativo. Lo verificaría con una **development build** (`npx expo run:android` o `eas build --profile development`), viendo el diálogo con mi texto (desafío A6) y revisando el `AndroidManifest.xml` y el `Info.plist` generados con `npx expo prebuild`.

---

## Parte E — Buenas prácticas y decisiones de diseño

### E1. Revisión de código

**a) Problemas encontrados**

| # | Línea | Clasificación | Por qué sucede | Corrección |
|---|---|---|---|---|
| 1 | 10 (y 22) | Mala práctica | `useState<any[]>` y `libro: any` apagan TypeScript: un error de tipeo como `libro.titlo` compila y falla en ejecución. | `useState<Libro[]>` con el tipo de `src/types`. |
| 2 | 13-16 | Mala práctica (y riesgo de rechazo en tienda) | Pide cámara y notificaciones **al abrir el Catálogo**, sin contexto ni pantalla previa. La persona no sabe para qué son y las niega. | Pedir la cámara recién al tocar "Escanear", pasando por `/permisos/camara`, y las notificaciones al activar "Recordarme". |
| 3 | 15 | Error de ejecución (funcional) | En Android 13+ el diálogo de notificaciones no aparece si no hay un canal creado. Además la promesa no se espera ni se maneja. | Crear el canal antes de pedir (`crearCanalPrestamos`) y manejar la respuesta. |
| 4 | 16 | Advertencia | `pedirPermiso` se usa adentro del efecto y no está en las dependencias (`react-hooks/exhaustive-deps`). | Sacar el pedido del efecto (punto 2), o completar las dependencias. |
| 5 | 18-20 | Rendimiento / error grave | El efecto **no tiene array de dependencias**: corre después de **cada** render, y como cada respuesta trae un array nuevo, se arma un bucle infinito de pedidos (ver b). | Array de dependencias: `[intento]` en mi `useLibros`. |
| 6 | 19 | Error de ejecución | `obtenerLibros()` falla 1 de cada 5 veces y no hay `.catch`: queda un *unhandled promise rejection* y la persona ve la lista vacía sin explicación. | `.catch` que guarde un mensaje claro y un botón "Reintentar". |
| 7 | 19 | Advertencia / condición de carrera | No hay limpieza: si la pantalla se desmonta o llega una respuesta vieja, igual hace `setLibros`. | Bandera `vigente` en la limpieza, como en `useLibros.ts:21-39`. |
| 8 | 9-41 | Mala práctica | No hay estados de **cargando**, **error** ni **vacío**: mientras carga o si falla, la pantalla se ve vacía. | `EstadoCargando`, `EstadoError` y `ListEmptyComponent`. |
| 9 | 22-30 | Rendimiento (y error de lint `react-hooks/static-components`) | `Fila` se **declara adentro** de `Catalogo`. En cada render es un componente *distinto*, así que React desmonta y monta todas las filas y pierden su estado. | Declararlo a nivel de módulo, en su propio archivo (`src/components/FilaLibro.tsx`). |
| 10 | 25 | Mala práctica | Estilos en línea con números y colores sueltos (`'#333'`, `16`, `12`). Se crea un objeto nuevo en cada render y no hay un tema común. | `StyleSheet.create` con valores de `src/constants/tema.ts`. |
| 11 | 33-36 | Rendimiento | `ScrollView` + `map` dibuja **todos** los libros aunque no se vean. Con un catálogo grande la pantalla se pone lenta. | `FlatList`, que solo renderiza lo visible. |
| 12 | 35 | Advertencia / mala práctica | `key={i}`: si la lista cambia de orden o se filtra, React asocia mal las filas. | `keyExtractor={(l) => l.isbn}`. |
| 13 | 24 | Mala práctica | `'/libro/' + libro.isbn`: concatenar rutas se saltea las rutas tipadas, y un error en la ruta no lo detecta TypeScript. | `href={{ pathname: '/libro/[isbn]', params: { isbn } }}`. |
| 14 | 37-39 | Mala práctica (accesibilidad) | Botón con **solo un ícono**, sin `accessibilityRole` ni `accessibilityLabel`: el lector de pantalla dice "botón" sin explicar qué hace. El área táctil es de 28 px, menos de 44. | `accessibilityRole="button"`, `accessibilityLabel="Escanear código de barras"` y área de 44 × 44. |
| 15 | 5-6 | Mala práctica (acoplamiento) | El Catálogo importa `expo-camera` y `expo-notifications`, que no necesita para mostrar libros. | Lógica de permisos en `src/lib/permisos.ts` y en el hook `usePermiso`. |

**b) El efecto sin dependencias, durante el primer minuto**

1. **Render 1** (`libros = []`) → corre el efecto → `obtenerLibros()` (800 ms).
2. Llega la respuesta → `setLibros(copia nueva)` → como el array es **otro** objeto, React renderiza → **render 2**.
3. Después del render 2 el efecto corre **otra vez** (no tiene dependencias) → otro pedido → a los 800 ms otra copia → otro render → otro pedido…
4. Resultado: un pedido cada ~0,8 s, **unos 75 pedidos por minuto**, y la lista se vuelve a dibujar todo el tiempo. Uno de cada cinco falla y deja un rechazo sin manejar. Con una API real gastaría datos y batería y podría saturar el servidor.

**Sí cambiaría** si `obtenerLibros()` devolviera **siempre el mismo array**: en el segundo pedido, `setLibros(mismoArray)` recibe un valor igual (`Object.is`) al que ya está, React **no renderiza** y el bucle se corta. Serían 2 pedidos en lugar de infinitos. Pero el error sigue ahí, escondido: depende de un detalle de la API y no del componente.

**c) Reescritura con mis hooks y componentes** (es mi `src/app/(tabs)/(catalogo)/index.tsx`):

```tsx
import { FlatList, type ListRenderItemInfo, StyleSheet, Text } from 'react-native';

import { EncabezadoCatalogo } from '@/components/EncabezadoCatalogo';
import { EstadoCargando } from '@/components/EstadoCargando';
import { EstadoError } from '@/components/EstadoError';
import { EstadoVacio } from '@/components/EstadoVacio';
import { FilaLibro } from '@/components/FilaLibro';
import { COLORES, ESPACIADO, TAMANO_TEXTO } from '@/constants/tema';
import { useBiblioteca } from '@/hooks/useBiblioteca';
import { useLibros } from '@/hooks/useLibros';
import type { Libro } from '@/types';

function claveLibro(libro: Libro) {
  return libro.isbn;
}

function renderizarLibro({ item }: ListRenderItemInfo<Libro>) {
  return <FilaLibro libro={item} />;
}

export default function Catalogo() {
  const { libros, cargando, error, reintentar } = useLibros();
  const { recientes } = useBiblioteca();

  if (cargando) return <EstadoCargando mensaje="Cargando el catálogo…" />;
  if (error) {
    return <EstadoError mensaje={error} textoAccion="Reintentar" onAccion={reintentar} />;
  }

  const vistos = recientes
    .map((isbn) => libros.find((l) => l.isbn === isbn))
    .filter((libro): libro is Libro => libro !== undefined);

  return (
    <FlatList
      style={styles.fondo}
      data={libros}
      keyExtractor={claveLibro}
      renderItem={renderizarLibro}
      // Bienvenida, accesos a Buscar y Escanear (con texto, rol y 44 × 44)
      // y vistos recientemente con sus tapas.
      ListHeaderComponent={<EncabezadoCatalogo vistos={vistos} cantidad={libros.length} />}
      ListEmptyComponent={<EstadoVacio mensaje="Todavía no hay libros en el catálogo." />}
      ListFooterComponent={
        <Text style={styles.creditos}>Tapas de los libros: Open Library</Text>
      }
      contentContainerStyle={styles.lista}
    />
  );
}

const styles = StyleSheet.create({
  fondo: { backgroundColor: COLORES.fondo },
  lista: { padding: ESPACIADO.lg, gap: ESPACIADO.md },
  creditos: {
    marginTop: ESPACIADO.md,
    fontSize: TAMANO_TEXTO.mini,
    color: COLORES.textoSuave,
    textAlign: 'center',
  },
});
```

Los permisos ya no están acá. La cámara se pide desde `/escanear` (`usePermiso('camara')`) pasando por `/permisos/camara`, y las notificaciones al activar "Recordarme".

**d)**
- **Rechazo en la tienda: pedir cámara y notificaciones al abrir la app (líneas 13-16).** Las guías de Apple (5.1.1) y la política de Google piden solicitar los permisos **en contexto**, cuando la función se usa, explicando para qué. Pedir la cámara en una pantalla que no la usa es un motivo típico de rechazo en la revisión.
- **Lo que haría que una persona la desinstale primero: el bucle del efecto sin dependencias (líneas 18-20).** La app consume datos y batería sin parar, la lista parpadea y, con 1 de cada 5 pedidos fallando, se vuelve lenta e inestable. Se nota en el primer minuto y no tiene solución desde el lado de la persona usuaria.

### E2. Organización y acoplamiento

**a) Qué carpetas importan a cuáles**

```
app ──────────► components, hooks, lib, constants, types, context (solo el layout raíz)
components ───► components, hooks, lib, constants, types
hooks ────────► lib, context, types
context ──────► estructuras, data, lib, constants, types
lib ──────────► data (solo api.ts), constants, types, módulos de Expo
data ─────────► types
estructuras, types, constants ─► (no importan nada del proyecto)
```

**No hay importaciones "hacia arriba"**: ningún archivo fuera de `src/app` importa algo de `src/app`.

Sería un problema porque `src/app` son **rutas**. Si un hook importara una pantalla, se formaría un ciclo (la pantalla usa el hook y el hook usa la pantalla), y Expo Router además trata como ruta cualquier archivo de esa carpeta. El código reutilizable quedaría atado a una pantalla concreta y no se podría mover ni testear por separado.

**b) Si el catálogo viniera de una API real**

Cambiaría **`src/lib/api.ts`**: `obtenerLibros` y `buscarLibros` harían `fetch` en vez de leer `LIBROS`. También cambiaría **`src/context/BibliotecaContext.tsx`**, solo en `crearEsperasIniciales`, porque las listas de espera iniciales también vendrían del servidor en lugar de `src/data/libros.ts`.

Ninguna pantalla cambia, porque todas usan `useLibros` y `useBusqueda`, que dependen de la **interfaz** de `api.ts` (funciones que devuelven `Promise<Libro[]>`), no de dónde salen los datos. Que sean 1 o 2 archivos dice que el acceso a datos está bien **aislado**. Si la lista fuera larga, sería señal de pantallas que leen datos directamente, lo que la consigna llama acoplamiento.

**c) Un componente `<ConPermiso recurso="camara">`**

- **Lo que ganaría:** menos código en cada pantalla que usa la cámara, porque el componente decide solo qué mostrar en cada uno de los cuatro estados.
- **Lo que perdería:**
  - **Flexibilidad:** en `/escanear` el ingreso manual del ISBN tiene que verse **en todos los estados**, y el aviso de "no está en el catálogo" vive fuera de la cámara. Con un envoltorio todo-o-nada habría que agregarle props y excepciones.
  - **La pantalla previa como ruta:** `/permisos/camara` existe como URL, se puede abrir por deep link y tiene su lugar en la pila. Un componente interno no.

**No me serviría para las notificaciones.** Ahí el permiso no se pide al **abrir** una pantalla sino en una **acción**: activar el interruptor "Recordarme" (`BibliotecaContext.tsx:233-236`). Un envoltorio decide al renderizar. Para una acción hace falta una **función** (`consultar` / `pedir` de `src/lib/permisos.ts`), que es justamente lo que `usePermiso` expone. Por eso prefiero el hook + `lib/permisos.ts`: sirven para los dos casos.

### E3. Mapa de fallas

| Situación | Qué ve la persona | Dónde se maneja |
|---|---|---|
| `obtenerLibros()` falla | Ícono de nube tachada, "No pudimos cargar el catálogo. Revisá tu conexión y probá de nuevo." y el botón **Reintentar** | `src/hooks/useLibros.ts:31-35` (mensaje en `:6-7`) y `src/app/(tabs)/(catalogo)/index.tsx:30-34` |
| Se abre `/libro/abc` | Header "ISBN inválido", ""abc" no es un ISBN válido: tiene que tener 13 números, sin guiones." y el botón **Volver al Catálogo** | `src/app/(tabs)/(catalogo)/libro/[isbn].tsx:32-41` y `src/components/LibroNoEncontrado.tsx` |
| Se escanea un ISBN que no está en el catálogo | Aviso amarillo "El ISBN … no está en el catálogo de la biblioteca. Podés probar con otro libro." (una sola vez), y la cámara sigue activa | `src/app/escanear.tsx:45-49` y `:60-63` |
| La cámara está bloqueada | "La cámara está desactivada para esta app. Podés activarla en Ajustes o escribir el ISBN a mano.", el botón **Abrir Ajustes** y el ingreso manual | `src/app/escanear.tsx:85-91`, `src/components/EscanerSinPermiso.tsx` y `src/components/IngresoManualIsbn.tsx` |
| Las notificaciones están denegadas | Al activar "Recordarme": aviso en Mis reservas "Las notificaciones están desactivadas, así que te lo recordamos acá: devolvé … antes del …". Arriba de la pestaña: "Notificaciones desactivadas: los recordatorios y avisos te aparecen acá." | `src/context/BibliotecaContext.tsx:238-243` y `:283-288`, `src/components/EstadoNotificaciones.tsx` |
| Se intenta reservar un libro ya reservado | "Ya tenés este libro prestado." o "Ya estás en la lista de espera de este libro, en el puesto N.", con el botón **Ver mis reservas** | `src/app/reservar/[isbn].tsx:63-79` (y doble control en `BibliotecaContext.tsx:163-165`) |
| "Entregar al siguiente" con la lista de espera vacía | "Nadie está esperando este libro." y el botón **deshabilitado**. Si igual se llamara, el mensaje "Nadie está esperando "…"." | `src/components/TarjetaMostrador.tsx:48` y `src/context/BibliotecaContext.tsx:258-261` |
| Login con clave incorrecta | "El usuario o la clave no son correctos. Revisalos y probá de nuevo." El modal sigue abierto para corregir. | `src/app/login.tsx:26-29` y `src/lib/sesion.ts` |

### E4. Decisiones con argumentos

**a) Identificador: ISBN como parámetro de ruta y key.**

Lo elegí porque es el dato que trae el **código de barras**: el escáner lee directamente el ISBN y navega con él, sin ninguna tabla de traducción. Además deja URLs que se entienden (`/libro/9789870001010`) y es único por edición. **Dos ediciones del mismo título tienen ISBN distinto**, y está bien que sean ítems distintos, porque tienen distinto año y distintos ejemplares.

Como `useLocalSearchParams` **siempre devuelve `string`** (ejercicio E1 del TP 2), el ISBN encaja sin conversiones: se valida con una expresión regular (`src/lib/isbn.ts`). Con un id numérico habría que hacer `Number(param)` y validar `NaN`. Además, un número pierde los ceros iniciales, y algunos ISBN-10 terminan en "X".

La contra son los **libros sin ISBN** (muy viejos o donaciones). Para esos usaría un código interno de 13 dígitos con prefijo propio, que respeta el mismo formato y el mismo tipo.

**b) Estructuras: clase `Pila` con `#items`.**

- **Lo que me dio:** encapsulamiento. Nadie puede hacer `pila.items.splice(...)` desde una pantalla, solo `push`/`pop`/`tope`. Las operaciones tienen nombres que dicen qué hacen, y la Cola sin `shift()` desencola en O(1).
- **Lo que me complicó:** es **mutable**, y React detecta cambios por referencia (B3). Tuve que agregar `copiar()` y acordarme de no mutar nunca la instancia del estado. Además, una instancia de clase no se guarda directo en AsyncStorage: habría que convertirla con `aArray()` y reconstruirla al leerla.
- **La alternativa** `[...pila, x]` + `slice` es más "natural" para React, pero deja la regla LIFO librada a que nadie toque el array por el medio.

**c) Memorización.**

El proyecto tiene activado el **React Compiler** (`app.json:65`, `"reactCompiler": true`), que memoriza automáticamente valores y funciones de los componentes. Por eso no envolví el `value` del Context en `useMemo`: el compilador ya lo reutiliza mientras no cambie el estado.

- **Dónde sí aporta:** `registrarVisto` con `useCallback([])` (`BibliotecaContext.tsx:141-149`). Es **dependencia de un efecto** del detalle (`libro/[isbn].tsx:25-29`). Si cambiara en cada render del provider, el efecto se volvería a ejecutar, y un detalle que quedó debajo en la pila podría volver a apilar su libro. Ahí la identidad estable es una cuestión de **corrección**, no solo de velocidad.
- **Dónde sería ruido:** un `useCallback` en `cancelar` o en `claveLibro` (ya están a nivel de módulo y nunca cambian), o un `useMemo` para `String(libro.anio)`. Cuesta más comparar las dependencias que recalcular.
- **Cómo lo comprobaría:** con el **Profiler de React DevTools** (vía `j` en la terminal de Expo), viendo cuántas veces y por qué se renderiza cada componente antes y después del cambio. También se puede contar renders con un `console.log` temporal.

**d) Datos duplicados: los "ejemplares disponibles" se calculan.**

`disponibles(libro)` (`BibliotecaContext.tsx:118-123`) resta a `libro.ejemplares` los préstamos que salieron del estante (`desdeEspera: false`).

Si guardara un contador `disponibles` aparte, el mismo dato viviría **en dos lugares**: el contador y la lista de préstamos. Cualquier acción que actualizara uno y olvidara el otro (por ejemplo, "Devolver" saca el préstamo pero no suma 1 al contador) dejaría el detalle mostrando 0 ejemplares con un libro en el estante. Peor aún, el error aparecería solo después de cierta secuencia de acciones.

Al calcularlo de una sola fuente (los préstamos), es **imposible** que se desincronice. Lo mismo hago con las personas en espera (`cola.tamanio`) y con mi posición en la lista (`misEsperas`, `:93-100`).
