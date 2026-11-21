import { useEffect, useState } from 'react';

import { obtenerLibros } from '@/lib/api';
import type { Libro } from '@/types';

const MENSAJE_ERROR =
  'No pudimos cargar el catálogo. Revisá tu conexión y probá de nuevo.';

// Trae el catálogo y expone los tres estados de la pantalla:
// cargando, error (con reintentar) y la lista (que puede venir vacía).
export function useLibros() {
  const [libros, setLibros] = useState<Libro[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Cada vez que cambia "intento", el efecto se vuelve a ejecutar.
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    // Si el Catálogo se desmonta (o se reintenta) antes de que llegue la
    // respuesta, "vigente" pasa a false y esa respuesta vieja se ignora.
    let vigente = true;

    // useEffect no acepta una función async (tendría que devolver una
    // Promise en vez de la limpieza), así que usamos .then/.catch.
    obtenerLibros()
      .then((datos) => {
        if (!vigente) return;
        setLibros(datos);
        setCargando(false);
      })
      .catch(() => {
        if (!vigente) return;
        setError(MENSAJE_ERROR);
        setCargando(false);
      });

    return () => {
      vigente = false;
    };
  }, [intento]);

  function reintentar() {
    setError(null);
    setCargando(true);
    setIntento((anterior) => anterior + 1);
  }

  return { libros, cargando, error, reintentar };
}
