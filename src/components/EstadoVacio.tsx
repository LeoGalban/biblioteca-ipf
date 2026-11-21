import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Text, View } from 'react-native';

import { COLORES, ESPACIADO, ICONO, TAMANO_TEXTO } from '@/constants/tema';

type Props = {
  mensaje: string;
};

// Mensaje para una lista sin elementos (se usa en ListEmptyComponent).
export function EstadoVacio({ mensaje }: Props) {
  return (
    <View style={styles.contenedor}>
      <Ionicons name="book-outline" size={ICONO.grande} color={COLORES.textoSuave} />
      <Text style={styles.mensaje}>{mensaje}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    alignItems: 'center',
    paddingVertical: ESPACIADO.xxl,
  },
  mensaje: {
    marginTop: ESPACIADO.md,
    fontSize: TAMANO_TEXTO.normal,
    color: COLORES.textoSuave,
    textAlign: 'center',
  },
});
