import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text } from 'react-native';

import {
  AREA_TACTIL_MINIMA,
  COLORES,
  ESPACIADO,
  RADIO,
  TAMANO_TEXTO,
} from '@/constants/tema';
import type { Libro } from '@/types';

type Props = {
  libro: Libro;
};

// Tarjeta chica de un libro visto hace poco: al tocarla vuelve a su detalle.
export function TarjetaReciente({ libro }: Props) {
  return (
    <Link
      href={{ pathname: '/libro/[isbn]', params: { isbn: libro.isbn } }}
      asChild
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Visto recientemente: ${libro.titulo}`}
        style={({ pressed }) => [styles.tarjeta, pressed && styles.presionada]}
      >
        <Text style={styles.titulo} numberOfLines={2}>
          {libro.titulo}
        </Text>
        <Text style={styles.autor} numberOfLines={1}>
          {libro.autor}
        </Text>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  tarjeta: {
    flex: 1,
    minHeight: AREA_TACTIL_MINIMA,
    padding: ESPACIADO.sm,
    borderRadius: RADIO.normal,
    backgroundColor: COLORES.primarioClaro,
  },
  presionada: {
    opacity: 0.7,
  },
  titulo: {
    fontSize: TAMANO_TEXTO.chico,
    fontWeight: 'bold',
    color: COLORES.texto,
  },
  autor: {
    marginTop: ESPACIADO.xs,
    fontSize: TAMANO_TEXTO.chico,
    color: COLORES.textoSuave,
  },
});
