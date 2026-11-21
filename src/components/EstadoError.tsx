import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Text, View } from 'react-native';

import { BotonPrincipal } from '@/components/BotonPrincipal';
import { Pantalla } from '@/components/Pantalla';
import { COLORES, ESPACIADO, ICONO, TAMANO_TEXTO } from '@/constants/tema';

type Props = {
  mensaje: string;
  textoAccion: string;
  onAccion: () => void;
};

// Pantalla completa de error: siempre ofrece una acción para salir de él.
export function EstadoError({ mensaje, textoAccion, onAccion }: Props) {
  return (
    <Pantalla centrada>
      <Ionicons
        name="cloud-offline-outline"
        size={ICONO.grande}
        color={COLORES.error}
      />
      <Text style={styles.mensaje}>{mensaje}</Text>
      <View style={styles.accion}>
        <BotonPrincipal texto={textoAccion} onPress={onAccion} />
      </View>
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
  accion: {
    marginTop: ESPACIADO.lg,
  },
});
