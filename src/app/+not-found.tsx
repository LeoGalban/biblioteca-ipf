import Ionicons from '@expo/vector-icons/Ionicons';
import { Link, usePathname } from 'expo-router';
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

export default function NoEncontrada() {
  const ruta = usePathname();

  return (
    <Pantalla centrada>
      <Ionicons name="compass-outline" size={ICONO.grande} color={COLORES.acento} />
      <Text style={styles.titulo}>No encontramos esta página</Text>
      <Text style={styles.ruta}>{ruta}</Text>
      <Link href="/" dismissTo asChild>
        <Pressable accessibilityRole="button" style={styles.boton}>
          <Text style={styles.textoBoton}>Volver al Catálogo</Text>
        </Pressable>
      </Link>
    </Pantalla>
  );
}

const styles = StyleSheet.create({
  titulo: {
    marginTop: ESPACIADO.md,
    fontSize: TAMANO_TEXTO.titulo,
    fontWeight: 'bold',
    color: COLORES.texto,
    textAlign: 'center',
  },
  ruta: {
    marginTop: ESPACIADO.sm,
    paddingHorizontal: ESPACIADO.md,
    paddingVertical: ESPACIADO.xs,
    borderRadius: RADIO.pildora,
    backgroundColor: COLORES.primarioClaro,
    fontSize: TAMANO_TEXTO.normal,
    color: COLORES.primario,
    textAlign: 'center',
  },
  boton: {
    marginTop: ESPACIADO.xl,
    minHeight: AREA_TACTIL_MINIMA,
    paddingHorizontal: ESPACIADO.xl,
    borderRadius: RADIO.grande,
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
