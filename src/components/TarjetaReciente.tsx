import { router } from 'expo-router';
import { Pressable, StyleSheet, Text } from 'react-native';

import { PortadaLibro } from '@/components/PortadaLibro';
import { COLORES, ESPACIADO, TAMANO_TEXTO, TAPA } from '@/constants/tema';
import type { Libro } from '@/types';

type Props = {
  libro: Libro;
};

// Tapa + título de un libro visto hace poco: al tocarla vuelve a su detalle.
export function TarjetaReciente({ libro }: Props) {
  function abrirDetalle() {
    router.push({ pathname: '/libro/[isbn]', params: { isbn: libro.isbn } });
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Visto recientemente: ${libro.titulo}`}
      onPress={abrirDetalle}
      style={({ pressed }) => [styles.tarjeta, pressed && styles.presionada]}
    >
      <PortadaLibro isbn={libro.isbn} titulo={libro.titulo} tamano="mediana" />
      <Text style={styles.titulo} numberOfLines={2}>
        {libro.titulo}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tarjeta: {
    width: TAPA.mediana.ancho,
    gap: ESPACIADO.xs,
  },
  presionada: {
    opacity: 0.7,
  },
  titulo: {
    fontSize: TAMANO_TEXTO.chico,
    fontWeight: 'bold',
    color: COLORES.texto,
  },
});
