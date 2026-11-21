import { Link, usePathname } from 'expo-router';
import { StyleSheet, Text } from 'react-native';

import { Pantalla } from '@/components/Pantalla';
import {
  AREA_TACTIL_MINIMA,
  COLORES,
  ESPACIADO,
  TAMANO_TEXTO,
} from '@/constants/tema';

export default function NoEncontrada() {
  const ruta = usePathname();

  return (
    <Pantalla centrada>
      <Text style={styles.titulo}>No encontramos esta página</Text>
      <Text style={styles.ruta}>{ruta}</Text>
      <Link href="/" style={styles.link} accessibilityRole="button">
        Volver al Catálogo
      </Link>
    </Pantalla>
  );
}

const styles = StyleSheet.create({
  titulo: {
    fontSize: TAMANO_TEXTO.titulo,
    fontWeight: 'bold',
    color: COLORES.texto,
    textAlign: 'center',
  },
  ruta: {
    marginTop: ESPACIADO.sm,
    fontSize: TAMANO_TEXTO.normal,
    color: COLORES.textoSuave,
    textAlign: 'center',
  },
  link: {
    marginTop: ESPACIADO.xl,
    minHeight: AREA_TACTIL_MINIMA,
    paddingVertical: ESPACIADO.md,
    paddingHorizontal: ESPACIADO.lg,
    fontSize: TAMANO_TEXTO.normal,
    fontWeight: 'bold',
    color: COLORES.primario,
  },
});
