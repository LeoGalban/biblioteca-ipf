import { StyleSheet, Text, View } from 'react-native';

import { Insignia } from '@/components/Insignia';
import { PortadaLibro } from '@/components/PortadaLibro';
import { COLORES, ESPACIADO, RADIO, SOMBRA, TAMANO_TEXTO } from '@/constants/tema';

type Props = {
  isbn: string;
  titulo: string;
  posicion: number;
  total: number;
};

// Una reserva en lista de espera, con la posición de la persona usuaria.
export function TarjetaEspera({ isbn, titulo, posicion, total }: Props) {
  const texto =
    posicion === 1
      ? `Sos el próximo en la fila (esperan ${total}).`
      : `Estás en el puesto ${posicion} de ${total}.`;

  return (
    <View style={styles.tarjeta}>
      <PortadaLibro isbn={isbn} titulo={titulo} />
      <View style={styles.textos}>
        <Text style={styles.titulo} numberOfLines={2}>
          {titulo}
        </Text>
        <Insignia texto={`Puesto ${posicion}`} tipo={posicion === 1 ? 'exito' : 'aviso'} />
        <Text style={styles.posicion}>{texto}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tarjeta: {
    flexDirection: 'row',
    gap: ESPACIADO.md,
    padding: ESPACIADO.lg,
    borderRadius: RADIO.grande,
    backgroundColor: COLORES.superficie,
    ...SOMBRA,
  },
  textos: {
    flex: 1,
    gap: ESPACIADO.xs,
  },
  titulo: {
    fontSize: TAMANO_TEXTO.subtitulo,
    fontWeight: 'bold',
    color: COLORES.texto,
  },
  posicion: {
    fontSize: TAMANO_TEXTO.chico,
    color: COLORES.textoSuave,
  },
});
