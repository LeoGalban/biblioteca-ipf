import { Pressable, StyleSheet, Text } from 'react-native';

import {
  AREA_TACTIL_MINIMA,
  COLORES,
  ESPACIADO,
  RADIO,
  TAMANO_TEXTO,
} from '@/constants/tema';

type Props = {
  texto: string;
  onPress: () => void;
  secundario?: boolean;
  deshabilitado?: boolean;
};

// Botón con texto que usa toda la app. Área táctil mínima de 44 × 44.
export function BotonPrincipal({
  texto,
  onPress,
  secundario = false,
  deshabilitado = false,
}: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: deshabilitado }}
      disabled={deshabilitado}
      onPress={onPress}
      style={({ pressed }) => [
        styles.boton,
        secundario && styles.secundario,
        deshabilitado && styles.deshabilitado,
        pressed && styles.presionado,
      ]}
    >
      <Text style={[styles.texto, secundario && styles.textoSecundario]}>
        {texto}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  boton: {
    minHeight: AREA_TACTIL_MINIMA,
    minWidth: AREA_TACTIL_MINIMA,
    paddingHorizontal: ESPACIADO.xl,
    borderRadius: RADIO.normal,
    backgroundColor: COLORES.primario,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secundario: {
    backgroundColor: COLORES.superficie,
    borderWidth: 1,
    borderColor: COLORES.primario,
  },
  deshabilitado: {
    opacity: 0.5,
  },
  presionado: {
    opacity: 0.8,
  },
  texto: {
    fontSize: TAMANO_TEXTO.normal,
    fontWeight: 'bold',
    color: COLORES.textoSobrePrimario,
  },
  textoSecundario: {
    color: COLORES.primario,
  },
});
