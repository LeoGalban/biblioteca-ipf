import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { COLORES, ESPACIADO } from '@/constants/tema';

type Props = {
  children: ReactNode;
  centrada?: boolean;
};

// Contenedor común de todas las pantallas: mismo fondo y mismos márgenes.
export function Pantalla({ children, centrada = false }: Props) {
  return (
    <View style={[styles.base, centrada && styles.centrada]}>{children}</View>
  );
}

const styles = StyleSheet.create({
  base: {
    flex: 1,
    backgroundColor: COLORES.fondo,
    padding: ESPACIADO.lg,
  },
  centrada: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
