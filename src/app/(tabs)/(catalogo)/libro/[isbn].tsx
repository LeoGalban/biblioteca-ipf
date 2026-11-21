import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';

import { EstadoCargando } from '@/components/EstadoCargando';
import { EstadoError } from '@/components/EstadoError';
import { FichaLibro } from '@/components/FichaLibro';
import { LibroNoEncontrado } from '@/components/LibroNoEncontrado';
import { useBiblioteca } from '@/hooks/useBiblioteca';
import { useLibros } from '@/hooks/useLibros';
import { esIsbnValido } from '@/lib/isbn';

export default function DetalleLibro() {
  // useLocalSearchParams devuelve SIEMPRE texto: hay que validarlo.
  const { isbn } = useLocalSearchParams<{ isbn: string }>();
  const { libros, cargando, error, reintentar } = useLibros();
  const { disponibles, personasEnEspera, registrarVisto } = useBiblioteca();

  const isbnValido = esIsbnValido(isbn);
  const libro = isbnValido ? libros.find((l) => l.isbn === isbn) : undefined;
  const isbnEncontrado = libro?.isbn;

  // Al abrir el detalle de un libro que existe, se apila en "Vistos recientemente".
  // Depende del ISBN (texto), no del objeto libro: así no se vuelve a ejecutar
  // cuando llega una copia nueva del mismo libro desde la API.
  useEffect(() => {
    if (isbnEncontrado) {
      registrarVisto(isbnEncontrado);
    }
  }, [isbnEncontrado, registrarVisto]);

  // 1. ¿El parámetro tiene forma de ISBN? (13 dígitos)
  if (!isbnValido) {
    return (
      <>
        <Stack.Screen options={{ title: 'ISBN inválido' }} />
        <LibroNoEncontrado
          mensaje={`"${isbn}" no es un ISBN válido: tiene que tener 13 números, sin guiones.`}
        />
      </>
    );
  }

  if (cargando) {
    return <EstadoCargando mensaje="Buscando el libro…" />;
  }

  if (error) {
    return (
      <EstadoError mensaje={error} textoAccion="Reintentar" onAccion={reintentar} />
    );
  }

  // 2. ¿Existe un libro con ese ISBN en el catálogo?
  if (!libro) {
    return (
      <>
        <Stack.Screen options={{ title: 'Libro no encontrado' }} />
        <LibroNoEncontrado
          mensaje={`No encontramos ningún libro con el ISBN ${isbn} en la biblioteca.`}
        />
      </>
    );
  }

  // Se calculan en el momento a partir del Context: no se guardan aparte.
  const enEstante = disponibles(libro);
  const enEspera = personasEnEspera(libro.isbn);

  function irAReservar() {
    router.push({ pathname: '/reservar/[isbn]', params: { isbn } });
  }

  return (
    <>
      {/* El título del header es el del libro. */}
      <Stack.Screen options={{ title: libro.titulo }} />
      <FichaLibro
        libro={libro}
        enEstante={enEstante}
        enEspera={enEspera}
        onReservar={irAReservar}
      />
    </>
  );
}
