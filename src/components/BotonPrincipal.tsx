import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import {
  AREA_TACTIL_MINIMA,
  COLORES,
  ESPACIADO,
  ICONO,
  RADIO,
  TAMANO_TEXTO,
} from '@/constants/tema';

type Props = {
  texto: string;
  onPress: () => void;
  icono?: ComponentProps<typeof Ionicons>['name'];
  secundario?: boolean;
  deshabilitado?: boolean;
};

// Botón con texto (y un ícono opcional) que usa toda la app.
// Área táctil mínima de 44 × 44.
export function BotonPrincipal({
  texto,
  onPress,
  icono,
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
      {icono && (
        <Ionicons
          name={icono}
          size={ICONO.chico}
          color={secundario ? COLORES.primario : COLORES.textoSobrePrimario}
        />
      )}
      <Text style={[styles.texto, secundario && styles.textoSecundario]}>
        {texto}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  boton: {
    minHeight: AREA_TACTIL_MINIMA + ESPACIADO.xs,
    minWidth: AREA_TACTIL_MINIMA,
    flexDirection: 'row',
    gap: ESPACIADO.sm,
    paddingHorizontal: ESPACIADO.xl,
    borderRadius: RADIO.grande,
    backgroundColor: COLORES.primario,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secundario: {
    backgroundColor: COLORES.superficie,
    borderWidth: 1.5,
    borderColor: COLORES.primario,
  },
  deshabilitado: {
    opacity: 0.45,
  },
  presionado: {
    opacity: 0.85,
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
