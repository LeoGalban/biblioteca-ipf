import Ionicons from '@expo/vector-icons/Ionicons';
import { type Href, Link } from 'expo-router';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import {
  AREA_TACTIL_MINIMA,
  COLORES,
  ESPACIADO,
  ICONO,
  RADIO,
  SOMBRA,
  TAMANO_TEXTO,
} from '@/constants/tema';

type Props = {
  href: Href;
  icono: ComponentProps<typeof Ionicons>['name'];
  texto: string;
  descripcion: string;
};

// Acceso rápido con ícono, texto y una línea de ayuda ("Buscar", "Escanear").
export function BotonAcceso({ href, icono, texto, descripcion }: Props) {
  return (
    <Link href={href} asChild>
      <Pressable
        accessibilityRole="button"
        accessibilityHint={descripcion}
        style={({ pressed }) => [styles.boton, pressed && styles.presionado]}
      >
        <View style={styles.circulo}>
          <Ionicons name={icono} size={ICONO.normal} color={COLORES.primario} />
        </View>
        <Text style={styles.texto}>{texto}</Text>
        <Text style={styles.descripcion} numberOfLines={2}>
          {descripcion}
        </Text>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  boton: {
    flex: 1,
    minHeight: AREA_TACTIL_MINIMA,
    gap: ESPACIADO.xs,
    padding: ESPACIADO.md,
    borderRadius: RADIO.grande,
    backgroundColor: COLORES.superficie,
    ...SOMBRA,
  },
  presionado: {
    backgroundColor: COLORES.primarioClaro,
  },
  circulo: {
    width: AREA_TACTIL_MINIMA,
    height: AREA_TACTIL_MINIMA,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: ESPACIADO.xs,
    borderRadius: RADIO.pildora,
    backgroundColor: COLORES.acentoClaro,
  },
  texto: {
    fontSize: TAMANO_TEXTO.normal,
    fontWeight: 'bold',
    color: COLORES.texto,
  },
  descripcion: {
    fontSize: TAMANO_TEXTO.chico,
    color: COLORES.textoSuave,
  },
});
