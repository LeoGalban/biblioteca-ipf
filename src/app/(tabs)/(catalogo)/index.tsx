import {
  ActivityIndicator,
  FlatList,
  type ListRenderItemInfo,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Pantalla } from '@/components/Pantalla';
import {
  AREA_TACTIL_MINIMA,
  COLORES,
  ESPACIADO,
  RADIO,
  TAMANO_TEXTO,
} from '@/constants/tema';
import { useLibros } from '@/hooks/useLibros';
import type { Libro } from '@/types';

// La key de cada fila es el ISBN: es estable y único (nunca el índice).
function claveLibro(libro: Libro) {
  return libro.isbn;
}

function renderizarLibro({ item }: ListRenderItemInfo<Libro>) {
  return (
    <View style={styles.fila}>
      <Text style={styles.titulo}>{item.titulo}</Text>
      <Text style={styles.autor}>
        {item.autor} · {item.anio}
      </Text>
    </View>
  );
}

export default function Catalogo() {
  const { libros, cargando, error, reintentar } = useLibros();

  if (cargando) {
    return (
      <Pantalla centrada>
        <ActivityIndicator size="large" color={COLORES.primario} />
        <Text style={styles.mensaje}>Cargando el catálogo…</Text>
      </Pantalla>
    );
  }

  if (error) {
    return (
      <Pantalla centrada>
        <Text style={styles.mensaje}>{error}</Text>
        <Pressable
          accessibilityRole="button"
          onPress={reintentar}
          style={styles.boton}
        >
          <Text style={styles.textoBoton}>Reintentar</Text>
        </Pressable>
      </Pantalla>
    );
  }

  return (
    <FlatList
      data={libros}
      keyExtractor={claveLibro}
      renderItem={renderizarLibro}
      ListEmptyComponent={
        <Text style={styles.mensaje}>Todavía no hay libros en el catálogo.</Text>
      }
      contentContainerStyle={styles.lista}
    />
  );
}

const styles = StyleSheet.create({
  lista: {
    padding: ESPACIADO.lg,
    gap: ESPACIADO.sm,
  },
  fila: {
    backgroundColor: COLORES.superficie,
    borderRadius: RADIO.normal,
    borderWidth: 1,
    borderColor: COLORES.borde,
    padding: ESPACIADO.md,
  },
  titulo: {
    fontSize: TAMANO_TEXTO.normal,
    fontWeight: 'bold',
    color: COLORES.texto,
  },
  autor: {
    marginTop: ESPACIADO.xs,
    fontSize: TAMANO_TEXTO.chico,
    color: COLORES.textoSuave,
  },
  mensaje: {
    marginTop: ESPACIADO.md,
    fontSize: TAMANO_TEXTO.normal,
    color: COLORES.texto,
    textAlign: 'center',
  },
  boton: {
    marginTop: ESPACIADO.lg,
    minHeight: AREA_TACTIL_MINIMA,
    minWidth: AREA_TACTIL_MINIMA,
    paddingHorizontal: ESPACIADO.xl,
    borderRadius: RADIO.normal,
    backgroundColor: COLORES.primario,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoBoton: {
    fontSize: TAMANO_TEXTO.normal,
    fontWeight: 'bold',
    color: COLORES.textoSobrePrimario,
  },
});
