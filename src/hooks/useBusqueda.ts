import { useEffect, useState } from 'react';

import { buscarLibros } from '@/lib/api';
import type { Libro } from '@/types';

const MENSAJE_ERROR =
  'No pudimos completar la búsqueda. Revisá tu conexión y probá de nuevo.';

// Cada respuesta se guarda junto con el texto que se buscó.
type Respuesta = {
  texto: string;
  libros: Libro[];
  fallo: boolean;
};

// Busca libros por título o autor. Solo muestra la respuesta de la ÚLTIMA
// búsqueda, aunque las respuestas de buscarLibros lleguen desordenadas.
export function useBusqueda(texto: string) {
  const busqueda = texto.trim();
  const [respuesta, setRespuesta] = useState<Respuesta | null>(null);
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    if (busqueda === '') return;

    let vigente = true;

    buscarLibros(busqueda)
      .then((libros) => {
        if (!vigente) return; // respuesta vieja: se descarta
        setRespuesta({ texto: busqueda, libros, fallo: false });
      })
      .catch(() => {
        if (!vigente) return;
        setRespuesta({ texto: busqueda, libros: [], fallo: true });
      });

    // Limpieza: corre cuando "busqueda" cambia (antes del efecto nuevo) o al
    // desmontar. Marca este pedido como viejo; si su respuesta llega después,
    // el if (!vigente) la ignora.
    return () => {
      vigente = false;
    };
  }, [busqueda, intento]);

  // La respuesta guardada sirve solo si es del texto que se ve ahora.
  const actual = respuesta?.texto === busqueda ? respuesta : null;

  function reintentar() {
    setRespuesta(null);
    setIntento((anterior) => anterior + 1);
  }

  return {
    sinTexto: busqueda === '',
    cargando: busqueda !== '' && actual === null,
    error: actual?.fallo ? MENSAJE_ERROR : null,
    resultados: actual?.libros ?? [],
    reintentar,
  };
}
