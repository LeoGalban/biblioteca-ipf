import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import {
  COLORES,
  COLORES_TAPA,
  ESPACIADO,
  ICONO,
  RADIO,
  SOMBRA,
  TAMANO_TEXTO,
  TAPA,
} from '@/constants/tema';
import { indiceColorTapa, urlPortada } from '@/lib/portadas';

type Props = {
  isbn: string;
  titulo: string;
  tamano?: keyof typeof TAPA;
};

// Tapa del libro: la imagen de Open Library si existe y carga; si no (sin
// conexión, sin tapa o error), una tapa de respaldo con el título.
export function PortadaLibro({ isbn, titulo, tamano = 'chica' }: Props) {
  const [fallo, setFallo] = useState(false);
  const url = urlPortada(isbn);
  const medidas = styles[tamano];

  if (url && !fallo) {
    return (
      <Image
        source={{ uri: url }}
        style={[styles.base, medidas]}
        resizeMode="cover"
        onError={() => setFallo(true)}
        accessible={false}
      />
    );
  }

  return (
    <View
      style={[styles.base, medidas, styles.respaldo, ESTILOS_COLOR[indiceColorTapa(isbn)]]}
      accessible={false}
    >
      <View style={styles.lomo} />
      <Ionicons
        name="book"
        size={tamano === 'chica' ? ICONO.chico : ICONO.normal}
        color={COLORES.acento}
      />
      {tamano !== 'chica' && (
        <Text style={styles.tituloRespaldo} numberOfLines={4}>
          {titulo}
        </Text>
      )}
    </View>
  );
}

const colores = StyleSheet.create({
  tapa0: { backgroundColor: COLORES_TAPA[0] },
  tapa1: { backgroundColor: COLORES_TAPA[1] },
  tapa2: { backgroundColor: COLORES_TAPA[2] },
  tapa3: { backgroundColor: COLORES_TAPA[3] },
  tapa4: { backgroundColor: COLORES_TAPA[4] },
  tapa5: { backgroundColor: COLORES_TAPA[5] },
});

const ESTILOS_COLOR = [
  colores.tapa0,
  colores.tapa1,
  colores.tapa2,
  colores.tapa3,
  colores.tapa4,
  colores.tapa5,
];

const styles = StyleSheet.create({
  base: {
    borderRadius: RADIO.chico,
    backgroundColor: COLORES.borde,
    ...SOMBRA,
  },
  chica: {
    width: TAPA.chica.ancho,
    height: TAPA.chica.alto,
  },
  mediana: {
    width: TAPA.mediana.ancho,
    height: TAPA.mediana.alto,
  },
  grande: {
    width: TAPA.grande.ancho,
    height: TAPA.grande.alto,
  },
  respaldo: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: ESPACIADO.sm,
    gap: ESPACIADO.sm,
    overflow: 'hidden',
  },
  lomo: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: ESPACIADO.sm,
    backgroundColor: COLORES.primarioOscuro,
    opacity: 0.4,
  },
  tituloRespaldo: {
    fontSize: TAMANO_TEXTO.chico,
    fontWeight: 'bold',
    color: COLORES.textoSobrePrimario,
    textAlign: 'center',
  },
});
