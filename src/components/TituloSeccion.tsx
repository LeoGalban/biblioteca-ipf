import { StyleSheet, Text } from 'react-native';

import { COLORES, ESPACIADO, TAMANO_TEXTO } from '@/constants/tema';

type Props = {
  texto: string;
};

// Título de una sección dentro de una pantalla.
export function TituloSeccion({ texto }: Props) {
  return (
    <Text style={styles.titulo} accessibilityRole="header">
      {texto}
    </Text>
  );
}

const styles = StyleSheet.create({
  titulo: {
    marginTop: ESPACIADO.lg,
    marginBottom: ESPACIADO.sm,
    fontSize: TAMANO_TEXTO.subtitulo,
    fontWeight: 'bold',
    color: COLORES.texto,
  },
});
