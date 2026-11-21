import { StyleSheet, Text, View } from 'react-native';

import { COLORES, ESPACIADO, RADIO, TAMANO_TEXTO } from '@/constants/tema';

type Tipo = 'exito' | 'aviso' | 'error' | 'neutro';

type Props = {
  texto: string;
  tipo?: Tipo;
};

// Etiqueta chica con forma de píldora (por ejemplo "3 disponibles").
export function Insignia({ texto, tipo = 'neutro' }: Props) {
  return (
    <View style={[styles.base, fondos[tipo]]}>
      <Text style={[styles.texto, textos[tipo]]}>{texto}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    alignSelf: 'flex-start',
    paddingHorizontal: ESPACIADO.sm,
    paddingVertical: ESPACIADO.xs / 2,
    borderRadius: RADIO.pildora,
  },
  texto: {
    fontSize: TAMANO_TEXTO.mini,
    fontWeight: 'bold',
  },
});

const fondos = StyleSheet.create({
  exito: { backgroundColor: COLORES.exitoClaro },
  aviso: { backgroundColor: COLORES.avisoClaro },
  error: { backgroundColor: COLORES.errorClaro },
  neutro: { backgroundColor: COLORES.primarioClaro },
});

const textos = StyleSheet.create({
  exito: { color: COLORES.exito },
  aviso: { color: COLORES.aviso },
  error: { color: COLORES.error },
  neutro: { color: COLORES.primario },
});
