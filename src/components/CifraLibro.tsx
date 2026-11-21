import { StyleSheet, Text, View } from 'react-native';

import { COLORES, ESPACIADO, RADIO, SOMBRA, TAMANO_TEXTO } from '@/constants/tema';

type Props = {
  valor: number;
  etiqueta: string;
  destacada?: boolean;
};

// Número grande con su etiqueta (por ejemplo "2 · disponibles").
export function CifraLibro({ valor, etiqueta, destacada = false }: Props) {
  return (
    <View style={styles.caja}>
      <Text style={[styles.valor, destacada && styles.valorDestacado]}>{valor}</Text>
      <Text style={styles.etiqueta}>{etiqueta}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  caja: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: ESPACIADO.md,
    borderRadius: RADIO.grande,
    backgroundColor: COLORES.superficie,
    ...SOMBRA,
  },
  valor: {
    fontSize: TAMANO_TEXTO.grande,
    fontWeight: 'bold',
    color: COLORES.textoSuave,
  },
  valorDestacado: {
    color: COLORES.exito,
  },
  etiqueta: {
    fontSize: TAMANO_TEXTO.chico,
    color: COLORES.textoSuave,
  },
});
