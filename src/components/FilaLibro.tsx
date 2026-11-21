import Ionicons from '@expo/vector-icons/Ionicons';
import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import {
  AREA_TACTIL_MINIMA,
  COLORES,
  ESPACIADO,
  ICONO,
  RADIO,
  TAMANO_TEXTO,
} from '@/constants/tema';
import type { Libro } from '@/types';

type Props = {
  libro: Libro;
};

// Una fila del Catálogo o del buscador: al tocarla abre el detalle del libro.
export function FilaLibro({ libro }: Props) {
  return (
    <Link
      href={{ pathname: '/libro/[isbn]', params: { isbn: libro.isbn } }}
      asChild
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${libro.titulo}, de ${libro.autor}`}
        style={({ pressed }) => [styles.fila, pressed && styles.presionada]}
      >
        <View style={styles.textos}>
          <Text style={styles.titulo}>{libro.titulo}</Text>
          <Text style={styles.autor}>
            {libro.autor} · {libro.anio}
          </Text>
        </View>
        <Ionicons
          name="chevron-forward"
          size={ICONO.chico}
          color={COLORES.textoSuave}
        />
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  fila: {
    minHeight: AREA_TACTIL_MINIMA,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORES.superficie,
    borderRadius: RADIO.normal,
    borderWidth: 1,
    borderColor: COLORES.borde,
    padding: ESPACIADO.md,
  },
  presionada: {
    backgroundColor: COLORES.primarioClaro,
  },
  textos: {
    flex: 1,
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
});
