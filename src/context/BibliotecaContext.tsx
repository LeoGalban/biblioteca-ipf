import {
  createContext,
  type ReactNode,
  useCallback,
  useRef,
  useState,
} from 'react';

import {
  CANTIDAD_RECIENTES,
  DIAS_PRESTAMO,
  USUARIO_ACTUAL,
} from '@/constants/biblioteca';
import { ESPERAS_INICIALES } from '@/data/libros';
import { Cola } from '@/estructuras/Cola';
import { Pila } from '@/estructuras/Pila';
import { formatearFecha } from '@/lib/fechas';
import { cancelarRecordatorio, programarRecordatorio } from '@/lib/notificaciones';
import { consultar, pedir } from '@/lib/permisos';
import type { Libro } from '@/types';
import type {
  Aviso,
  EsperaPropia,
  Prestamo,
  ResultadoReserva,
} from '@/types/biblioteca';

type Esperas = Record<string, Cola<string>>;

export type ValorBiblioteca = {
  prestamos: Prestamo[];
  misEsperas: EsperaPropia[];
  avisos: Aviso[];
  recientes: string[]; // ISBN, del más reciente al más antiguo
  sesionIniciada: boolean;
  disponibles: (libro: Libro) => number;
  personasEnEspera: (isbn: string) => number;
  posicionEnEspera: (isbn: string) => number | null;
  tienePrestamo: (isbn: string) => boolean;
  registrarVisto: (isbn: string) => void;
  reservar: (libro: Libro) => ResultadoReserva;
  devolver: (isbn: string) => void;
  cambiarRecordatorio: (isbn: string, activo: boolean) => Promise<void>;
  agregarAviso: (texto: string) => void;
  descartarAviso: (id: string) => void;
  iniciarSesion: () => void;
  cerrarSesion: () => void;
};

export const BibliotecaContext = createContext<ValorBiblioteca | null>(null);

const MS_POR_DIA = 24 * 60 * 60 * 1000;

// Convierte las listas iniciales de src/data en una Cola por libro.
function crearEsperasIniciales(): Esperas {
  const esperas: Esperas = {};
  for (const [isbn, personas] of Object.entries(ESPERAS_INICIALES)) {
    const cola = new Cola<string>();
    for (const persona of personas) {
      cola.encolar(persona);
    }
    esperas[isbn] = cola;
  }
  return esperas;
}

type Props = {
  children: ReactNode;
};

// Estado compartido de toda la app. El provider está en el layout raíz.
// Regla: Pila y Cola son mutables, así que NUNCA mutamos las que están en el
// estado. Copiamos (copiar()), cambiamos la copia y la guardamos con setState.
export function BibliotecaProvider({ children }: Props) {
  const [prestamos, setPrestamos] = useState<Prestamo[]>([]);
  const [esperas, setEsperas] = useState<Esperas>(crearEsperasIniciales);
  const [pilaRecientes, setPilaRecientes] = useState(() => new Pila<string>());
  const [sesionIniciada, setSesionIniciada] = useState(false);
  const [avisos, setAvisos] = useState<Aviso[]>([]);
  // Contador para darle a cada aviso un id único (se usa como key).
  const proximoIdAviso = useRef(1);

  // ── Datos calculados (no se guardan: se derivan del estado) ──────────────

  // Libros en cuya Cola estoy anotado, con mi posición.
  const misEsperas: EsperaPropia[] = Object.entries(esperas).flatMap(
    ([isbn, cola]) => {
      const indice = cola.aArray().indexOf(USUARIO_ACTUAL);
      return indice === -1
        ? []
        : [{ isbn, posicion: indice + 1, total: cola.tamanio }];
    },
  );

  // Los 3 del tope de la pila: aArray() va de la base al tope, así que se invierte.
  const recientes = pilaRecientes
    .aArray()
    .reverse()
    .slice(0, CANTIDAD_RECIENTES);

  function tienePrestamo(isbn: string) {
    return prestamos.some((p) => p.isbn === isbn);
  }

  // Ejemplares en el estante = los iniciales menos los que me llevé del estante.
  function disponibles(libro: Libro) {
    const prestados = prestamos.filter(
      (p) => p.isbn === libro.isbn && !p.desdeEspera,
    ).length;
    return Math.max(0, libro.ejemplares - prestados);
  }

  function personasEnEspera(isbn: string) {
    return esperas[isbn]?.tamanio ?? 0;
  }

  // Posición (1 = al frente) del usuario en la lista de un libro, o null.
  function posicionEnEspera(isbn: string) {
    const indice = esperas[isbn]?.aArray().indexOf(USUARIO_ACTUAL) ?? -1;
    return indice === -1 ? null : indice + 1;
  }

  // ── Acciones ─────────────────────────────────────────────────────────────

  // useCallback con [] → siempre es la MISMA función. El detalle la usa en las
  // dependencias de su useEffect: si cambiara en cada render del provider, el
  // efecto se volvería a ejecutar (y un detalle que quedó debajo en la pila
  // volvería a apilar su libro).
  const registrarVisto = useCallback((isbn: string) => {
    setPilaRecientes((actual) => {
      // Si ya está en el tope, no se apila de nuevo (y no hay re-render).
      if (actual.tope() === isbn) return actual;
      const nueva = actual.copiar();
      nueva.push(isbn);
      return nueva;
    });
  }, []);

  function agregarAviso(texto: string) {
    const id = String(proximoIdAviso.current);
    proximoIdAviso.current += 1;
    // El más nuevo primero.
    setAvisos((actuales) => [{ id, texto }, ...actuales]);
  }

  function descartarAviso(id: string) {
    setAvisos((actuales) => actuales.filter((a) => a.id !== id));
  }

  function reservar(libro: Libro): ResultadoReserva {
    if (tienePrestamo(libro.isbn) || posicionEnEspera(libro.isbn) !== null) {
      return { tipo: 'repetida' };
    }

    if (disponibles(libro) > 0) {
      const vence = Date.now() + DIAS_PRESTAMO * MS_POR_DIA;
      setPrestamos((actuales) => [
        ...actuales,
        {
          isbn: libro.isbn,
          titulo: libro.titulo,
          vence,
          desdeEspera: false,
          recordar: false,
          recordatorioId: null,
        },
      ]);
      agregarAviso(
        `Te llevás "${libro.titulo}". Devolvelo antes del ${formatearFecha(vence)}.`,
      );
      return { tipo: 'prestamo', vence };
    }

    const posicion = personasEnEspera(libro.isbn) + 1;
    setEsperas((actuales) => {
      const cola = actuales[libro.isbn]?.copiar() ?? new Cola<string>();
      cola.encolar(USUARIO_ACTUAL);
      return { ...actuales, [libro.isbn]: cola };
    });
    agregarAviso(
      `Quedaste en el puesto ${posicion} de la lista de espera de "${libro.titulo}".`,
    );
    return { tipo: 'espera', posicion };
  }

  function devolver(isbn: string) {
    const prestamo = prestamos.find((p) => p.isbn === isbn);
    if (!prestamo) return;
    // Si había un recordatorio programado, se cancela: el libro ya se devolvió.
    if (prestamo.recordatorioId) {
      cancelarRecordatorio(prestamo.recordatorioId);
    }
    setPrestamos((actuales) => actuales.filter((p) => p.isbn !== isbn));
    agregarAviso(`Devolviste "${prestamo.titulo}". ¡Gracias!`);
  }

  function actualizarPrestamo(isbn: string, cambios: Partial<Prestamo>) {
    setPrestamos((actuales) =>
      actuales.map((p) => (p.isbn === isbn ? { ...p, ...cambios } : p)),
    );
  }

  // Interruptor "Recordarme". El permiso de notificaciones se pide SOLO acá,
  // cuando la persona activa el recordatorio (pedido en contexto).
  async function cambiarRecordatorio(isbn: string, activo: boolean) {
    const prestamo = prestamos.find((p) => p.isbn === isbn);
    if (!prestamo) return;

    if (!activo) {
      if (prestamo.recordatorioId) {
        await cancelarRecordatorio(prestamo.recordatorioId);
      }
      actualizarPrestamo(isbn, { recordar: false, recordatorioId: null });
      return;
    }

    // El interruptor responde al instante; la notificación se agrega después.
    actualizarPrestamo(isbn, { recordar: true });

    try {
      let permiso = await consultar('notificaciones');
      if (!permiso.granted && permiso.canAskAgain) {
        permiso = await pedir('notificaciones'); // crea el canal y pide
      }

      if (!permiso.granted) {
        // Sin permiso la app no se bloquea: el aviso aparece dentro de la app.
        agregarAviso(
          `Las notificaciones están desactivadas, así que te lo recordamos acá: devolvé "${prestamo.titulo}" antes del ${formatearFecha(prestamo.vence)}.`,
        );
        return;
      }

      const id = await programarRecordatorio(prestamo.titulo);
      actualizarPrestamo(isbn, { recordatorioId: id });
    } catch {
      actualizarPrestamo(isbn, { recordar: false, recordatorioId: null });
      agregarAviso('No pudimos programar el recordatorio. Probá de nuevo en un rato.');
    }
  }

  function iniciarSesion() {
    setSesionIniciada(true);
  }

  function cerrarSesion() {
    setSesionIniciada(false);
  }

  const valor: ValorBiblioteca = {
    prestamos,
    misEsperas,
    avisos,
    recientes,
    sesionIniciada,
    disponibles,
    personasEnEspera,
    posicionEnEspera,
    tienePrestamo,
    registrarVisto,
    reservar,
    devolver,
    cambiarRecordatorio,
    agregarAviso,
    descartarAviso,
    iniciarSesion,
    cerrarSesion,
  };

  return <BibliotecaContext value={valor}>{children}</BibliotecaContext>;
}
