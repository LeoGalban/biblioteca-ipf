import { ActivityIndicator, StyleSheet, Text } from 'react-native';

import { Pantalla } from '@/components/Pantalla';
import { COLORES, ESPACIADO, TAMANO_TEXTO } from '@/constants/tema';

type Props = {
  mensaje: string;
};

// Pantalla completa de "cargando": ruedita + qué se está cargando.
export function EstadoCargando({ mensaje }: Props) {
  return (
    <Pantalla centrada>
      <ActivityIndicator size="large" color={COLORES.primario} />
      <Text style={styles.mensaje}>{mensaje}</Text>
    </Pantalla>
  );
}

const styles = StyleSheet.create({
  mensaje: {
    marginTop: ESPACIADO.md,
    fontSize: TAMANO_TEXTO.normal,
    color: COLORES.texto,
    textAlign: 'center',
  },
});
