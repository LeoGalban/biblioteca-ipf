import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Text, View } from 'react-native';

import { COLORES, ESPACIADO, ICONO, RADIO, TAMANO_TEXTO } from '@/constants/tema';

type Tipo = 'info' | 'exito' | 'aviso';

type Props = {
  texto: string;
  tipo?: Tipo;
};

const ICONOS = {
  info: 'information-circle-outline',
  exito: 'checkmark-circle-outline',
  aviso: 'alert-circle-outline',
} as const;

// Recuadro con un mensaje para la persona usuaria (informativo, éxito o aviso).
export function CajaMensaje({ texto, tipo = 'info' }: Props) {
  return (
    <View style={[styles.caja, styles[tipo]]}>
      <Ionicons name={ICONOS[tipo]} size={ICONO.normal} color={COLORES.texto} />
      <Text style={styles.texto}>{texto}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  caja: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ESPACIADO.sm,
    padding: ESPACIADO.md,
    borderRadius: RADIO.normal,
  },
  info: {
    backgroundColor: COLORES.primarioClaro,
  },
  exito: {
    backgroundColor: COLORES.exitoClaro,
  },
  aviso: {
    backgroundColor: COLORES.avisoClaro,
  },
  texto: {
    flex: 1,
    fontSize: TAMANO_TEXTO.normal,
    color: COLORES.texto,
  },
});
