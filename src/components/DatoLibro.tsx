import { StyleSheet, Text, View } from 'react-native';

import { COLORES, ESPACIADO, TAMANO_TEXTO } from '@/constants/tema';

type Props = {
  etiqueta: string;
  valor: string;
};

// Una línea "etiqueta: valor" del detalle de un libro.
export function DatoLibro({ etiqueta, valor }: Props) {
  return (
    <View style={styles.fila}>
      <Text style={styles.etiqueta}>{etiqueta}</Text>
      <Text style={styles.valor}>{valor}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  fila: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: ESPACIADO.sm,
  },
  etiqueta: {
    fontSize: TAMANO_TEXTO.normal,
    color: COLORES.textoSuave,
  },
  valor: {
    fontSize: TAMANO_TEXTO.normal,
    fontWeight: 'bold',
    color: COLORES.texto,
  },
});
