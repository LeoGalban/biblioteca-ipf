import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import {
  AREA_TACTIL_MINIMA,
  COLORES,
  ESPACIADO,
  ICONO,
  RADIO,
  TAMANO_TEXTO,
} from '@/constants/tema';
import type { Aviso } from '@/types/biblioteca';

type Props = {
  aviso: Aviso;
  onDescartar: () => void;
};

// Aviso dentro de la app, con un botón (solo ícono) para descartarlo.
export function TarjetaAviso({ aviso, onDescartar }: Props) {
  return (
    <View style={styles.tarjeta}>
      <Ionicons name="notifications-outline" size={ICONO.normal} color={COLORES.aviso} />
      <Text style={styles.texto}>{aviso.texto}</Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Descartar aviso"
        onPress={onDescartar}
        style={styles.cerrar}
      >
        <Ionicons name="close" size={ICONO.chico} color={COLORES.textoSuave} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  tarjeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ESPACIADO.sm,
    paddingLeft: ESPACIADO.md,
    borderRadius: RADIO.normal,
    backgroundColor: COLORES.avisoClaro,
  },
  texto: {
    flex: 1,
    paddingVertical: ESPACIADO.sm,
    fontSize: TAMANO_TEXTO.normal,
    color: COLORES.texto,
  },
  cerrar: {
    width: AREA_TACTIL_MINIMA,
    height: AREA_TACTIL_MINIMA,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
