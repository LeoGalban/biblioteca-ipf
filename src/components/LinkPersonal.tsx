import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text } from 'react-native';

import {
  AREA_TACTIL_MINIMA,
  COLORES,
  ESPACIADO,
  TAMANO_TEXTO,
} from '@/constants/tema';
import { useBiblioteca } from '@/hooks/useBiblioteca';

// Link "Personal" del header del Catálogo: sin sesión lleva al login,
// con sesión directo al mostrador.
export function LinkPersonal() {
  const { sesionIniciada } = useBiblioteca();

  return (
    <Link href={sesionIniciada ? '/mostrador' : '/login'} asChild>
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
