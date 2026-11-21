import Ionicons from '@expo/vector-icons/Ionicons';
import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text } from 'react-native';

import { Pantalla } from '@/components/Pantalla';
import {
  AREA_TACTIL_MINIMA,
  COLORES,
  ESPACIADO,
  ICONO,
  RADIO,
  TAMANO_TEXTO,
} from '@/constants/tema';

type Props = {
  mensaje: string;
};

// Pantalla para un ISBN inválido o inexistente: explica qué pasó y
// ofrece volver al Catálogo (nunca queda una pantalla sin salida).
export function LibroNoEncontrado({ mensaje }: Props) {
  return (
    <Pantalla centrada>
      <Ionicons name="help-circle-outline" size={ICONO.grande} color={COLORES.aviso} />
      <Text style={styles.mensaje}>{mensaje}</Text>
      {/* dismissTo: vuelve al Catálogo que ya está en la pila, sin apilar otro. */}
      <Link href="/" dismissTo asChild>
        <Pressable accessibilityRole="button" style={styles.boton}>
          <Text style={styles.textoBoton}>Volver al Catálogo</Text>
        </Pressable>
      </Link>
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
  boton: {
    marginTop: ESPACIADO.lg,
    minHeight: AREA_TACTIL_MINIMA,
    paddingHorizontal: ESPACIADO.xl,
    borderRadius: RADIO.normal,
    backgroundColor: COLORES.primario,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoBoton: {
    fontSize: TAMANO_TEXTO.normal,
    fontWeight: 'bold',
    color: COLORES.textoSobrePrimario,
  },
});
