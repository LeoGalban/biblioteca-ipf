import { StyleSheet, Text, View } from 'react-native';

import { COLORES, ESPACIADO, RADIO, TAMANO_TEXTO } from '@/constants/tema';

type Props = {
  titulo: string;
  posicion: number;
  total: number;
};

// Una reserva en lista de espera, con la posición de la persona usuaria.
export function TarjetaEspera({ titulo, posicion, total }: Props) {
  const texto =
    posicion === 1
      ? `Sos el próximo en la fila (esperan ${total}).`
      : `Estás en el puesto ${posicion} de ${total}.`;

  return (
    <View style={styles.tarjeta}>
      <Text style={styles.titulo}>{titulo}</Text>
      <Text style={styles.posicion}>{texto}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tarjeta: {
    padding: ESPACIADO.md,
    borderRadius: RADIO.normal,
    borderWidth: 1,
    borderColor: COLORES.borde,
    backgroundColor: COLORES.superficie,
    gap: ESPACIADO.xs,
  },
  titulo: {
    fontSize: TAMANO_TEXTO.subtitulo,
    fontWeight: 'bold',
    color: COLORES.texto,
  },
  posicion: {
    fontSize: TAMANO_TEXTO.normal,
    color: COLORES.textoSuave,
  },
});
