import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text } from 'react-native';

import { Pantalla } from '@/components/Pantalla';
import { COLORES, TAMANO_TEXTO } from '@/constants/tema';

export default function DetalleLibro() {
  const { isbn } = useLocalSearchParams<{ isbn: string }>();

  return (
    <Pantalla centrada>
      <Text style={styles.texto}>Detalle del libro {isbn}</Text>
    </Pantalla>
  );
}

const styles = StyleSheet.create({
  texto: {
    fontSize: TAMANO_TEXTO.subtitulo,
    color: COLORES.texto,
  },
});
