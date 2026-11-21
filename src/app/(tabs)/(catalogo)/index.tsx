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

// La key de cada fila es el ISBN: es estable y único (nunca el índice).
function claveLibro(libro: Libro) {
  return libro.isbn;
}

function renderizarLibro({ item }: ListRenderItemInfo<Libro>) {
  return <FilaLibro libro={item} />;
}

export default function Catalogo() {
  const { libros, cargando, error, reintentar } = useLibros();
  const { recientes } = useBiblioteca();

  if (cargando) {
    return <EstadoCargando mensaje="Cargando el catálogo…" />;
  }

  if (error) {
    return (
      <EstadoError mensaje={error} textoAccion="Reintentar" onAccion={reintentar} />
    );
  }

  // La Pila guarda ISBN; acá se buscan los libros completos (del más reciente
  // al más antiguo) en la lista que ya trajo useLibros.
  const vistos = recientes
    .map((isbn) => libros.find((l) => l.isbn === isbn))
    .filter((libro): libro is Libro => libro !== undefined);

  return (
    <FlatList
      style={styles.fondo}
      data={libros}
      keyExtractor={claveLibro}
      renderItem={renderizarLibro}
      ListHeaderComponent={
        <EncabezadoCatalogo vistos={vistos} cantidad={libros.length} />
      }
      ListEmptyComponent={
        <EstadoVacio mensaje="Todavía no hay libros en el catálogo." />
      }
      ListFooterComponent={
        <Text style={styles.creditos}>Tapas de los libros: Open Library</Text>
      }
      contentContainerStyle={styles.lista}
    />
  );
}

const styles = StyleSheet.create({
  fondo: {
    backgroundColor: COLORES.fondo,
  },
  lista: {
    padding: ESPACIADO.lg,
    gap: ESPACIADO.md,
  },
  creditos: {
    marginTop: ESPACIADO.md,
    fontSize: TAMANO_TEXTO.mini,
    color: COLORES.textoSuave,
    textAlign: 'center',
  },
});
