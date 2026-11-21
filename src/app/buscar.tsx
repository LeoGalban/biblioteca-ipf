import { router, useLocalSearchParams } from 'expo-router';
import type { ReactNode } from 'react';
import { FlatList, type ListRenderItemInfo, StyleSheet, View } from 'react-native';

import { BarraBusqueda } from '@/components/BarraBusqueda';
import { EstadoCargando } from '@/components/EstadoCargando';
import { EstadoError } from '@/components/EstadoError';
import { EstadoVacio } from '@/components/EstadoVacio';
import { FilaLibro } from '@/components/FilaLibro';
import { COLORES, ESPACIADO } from '@/constants/tema';
import { useBusqueda } from '@/hooks/useBusqueda';
import type { Libro } from '@/types';

function claveLibro(libro: Libro) {
  return libro.isbn;
}

function renderizarLibro({ item }: ListRenderItemInfo<Libro>) {
  return <FilaLibro libro={item} />;
}

export default function Buscar() {
  // La búsqueda vive en la URL: /buscar?q=borges
  const { q } = useLocalSearchParams<{ q?: string }>();
  const texto = q ?? '';
  const { sinTexto, cargando, error, resultados, reintentar } = useBusqueda(texto);

  // setParams cambia el q de la URL de ESTA pantalla, sin apilar otra.
  function cambiarTexto(nuevo: string) {
    router.setParams({ q: nuevo });
  }

  let contenido: ReactNode;
  if (sinTexto) {
    contenido = <EstadoVacio mensaje="Escribí el título o el autor del libro que buscás." />;
  } else if (cargando) {
    contenido = <EstadoCargando mensaje="Buscando…" />;
  } else if (error) {
    contenido = (
      <EstadoError mensaje={error} textoAccion="Reintentar" onAccion={reintentar} />
    );
  } else {
    contenido = (
      <FlatList
        data={resultados}
        keyExtractor={claveLibro}
        renderItem={renderizarLibro}
        ListEmptyComponent={
          <EstadoVacio mensaje={`No encontramos libros para "${texto.trim()}".`} />
        }
        contentContainerStyle={styles.lista}
        keyboardShouldPersistTaps="handled"
      />
    );
  }

  return (
    <View style={styles.pantalla}>
      <BarraBusqueda valor={texto} onCambiar={cambiarTexto} />
      {contenido}
    </View>
  );
}

const styles = StyleSheet.create({
  pantalla: {
    flex: 1,
    backgroundColor: COLORES.fondo,
  },
  lista: {
    paddingHorizontal: ESPACIADO.lg,
    paddingBottom: ESPACIADO.lg,
    gap: ESPACIADO.sm,
  },
});
