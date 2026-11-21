import Ionicons from '@expo/vector-icons/Ionicons';
import { type Href, Link } from 'expo-router';
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
  href: Href;
  icono: ComponentProps<typeof Ionicons>['name'];
  texto: string;
};

// Acceso rápido con ícono y texto (por ejemplo "Buscar" o "Escanear").
export function BotonAcceso({ href, icono, texto }: Props) {
  return (
    <Link href={href} asChild>
      <Pressable
        accessibilityRole="button"
        style={({ pressed }) => [styles.boton, pressed && styles.presionado]}
      >
        <Ionicons name={icono} size={ICONO.normal} color={COLORES.primario} />
        <Text style={styles.texto}>{texto}</Text>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  boton: {
    flex: 1,
    minHeight: AREA_TACTIL_MINIMA,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: ESPACIADO.sm,
    paddingVertical: ESPACIADO.md,
    borderRadius: RADIO.normal,
    borderWidth: 1,
    borderColor: COLORES.primario,
    backgroundColor: COLORES.superficie,
  },
  presionado: {
    backgroundColor: COLORES.primarioClaro,
  },
  texto: {
    fontSize: TAMANO_TEXTO.normal,
    fontWeight: 'bold',
    color: COLORES.primario,
  },
});
