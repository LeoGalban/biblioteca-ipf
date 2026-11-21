import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text } from 'react-native';

import {
  AREA_TACTIL_MINIMA,
  COLORES,
  ESPACIADO,
  TAMANO_TEXTO,
} from '@/constants/tema';

// Link "Personal" del header del Catálogo: lleva al ingreso del personal.
export function LinkPersonal() {
  return (
    <Link href="/login" asChild>
      <Pressable accessibilityRole="button" style={styles.boton}>
        <Text style={styles.texto}>Personal</Text>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  boton: {
    minHeight: AREA_TACTIL_MINIMA,
    minWidth: AREA_TACTIL_MINIMA,
    paddingHorizontal: ESPACIADO.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  texto: {
    fontSize: TAMANO_TEXTO.normal,
    fontWeight: 'bold',
    color: COLORES.primario,
  },
});
