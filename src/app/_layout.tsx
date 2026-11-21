import { PilaRaiz } from '@/components/PilaRaiz';
import { BibliotecaProvider } from '@/context/BibliotecaContext';
import { configurarNotificaciones } from '@/lib/notificaciones';

// Se ejecuta una sola vez, al cargar la app: define cómo se muestran las
// notificaciones que llegan mientras la app está abierta.
configurarNotificaciones();

// anchor: si la app se abre directo en /buscar (deep link), Expo Router
// pone primero las tabs debajo en la pila, así "atrás" vuelve al Catálogo.
export const unstable_settings = {
  anchor: '(tabs)',
};

// El provider envuelve TODO el Stack: así cualquier pantalla (tabs, modales,
// mostrador) lee y cambia los mismos préstamos, esperas, recientes y sesión.
export default function LayoutRaiz() {
  return (
    <BibliotecaProvider>
      <PilaRaiz />
    </BibliotecaProvider>
  );
}
