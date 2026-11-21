import { FlatList, type ListRenderItemInfo, StyleSheet } from 'react-native';

import { AccesosCatalogo } from '@/components/AccesosCatalogo';
import { EstadoCargando } from '@/components/EstadoCargando';
import { EstadoError } from '@/components/EstadoError';
import { EstadoVacio } from '@/components/EstadoVacio';
import { FilaLibro } from '@/components/FilaLibro';
import { COLORES, ESPACIADO } from '@/constants/tema';
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

  if (cargando) {
    return <EstadoCargando mensaje="Cargando el catálogo…" />;
  }

  if (error) {
    return (
      <EstadoError mensaje={error} textoAccion="Reintentar" onAccion={reintentar} />
    );
  }

  return (
    <FlatList
      style={styles.fondo}
      data={libros}
      keyExtractor={claveLibro}
      renderItem={renderizarLibro}
      ListHeaderComponent={<AccesosCatalogo />}
      ListEmptyComponent={
        <EstadoVacio mensaje="Todavía no hay libros en el catálogo." />
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
    gap: ESPACIADO.sm,
  },
});
