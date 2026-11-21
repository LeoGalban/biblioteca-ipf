import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { BotonPrincipal } from '@/components/BotonPrincipal';
import { CifraLibro } from '@/components/CifraLibro';
import { DatoLibro } from '@/components/DatoLibro';
import { PortadaLibro } from '@/components/PortadaLibro';
import {
  COLORES,
  ESPACIADO,
  RADIO,
  SOMBRA,
  TAMANO_TEXTO,
  TAPA,
} from '@/constants/tema';
import type { Libro } from '@/types';

type Props = {
  libro: Libro;
  enEstante: number;
  enEspera: number;
  onReservar: () => void;
};

// Vista del detalle de un libro: tapa, datos, cifras y botón "Reservar".
export function FichaLibro({ libro, enEstante, enEspera, onReservar }: Props) {
  return (
    <ScrollView style={styles.fondo} contentContainerStyle={styles.contenido}>
      <View style={styles.franja} />
      <View style={styles.tapa}>
        <PortadaLibro isbn={libro.isbn} titulo={libro.titulo} tamano="grande" />
      </View>

      <Text style={styles.titulo}>{libro.titulo}</Text>
      <Text style={styles.autor}>{libro.autor}</Text>

      <View style={styles.cuerpo}>
        <View style={styles.cifras}>
          <CifraLibro
            valor={enEstante}
            etiqueta="disponibles"
            destacada={enEstante > 0}
          />
          <CifraLibro valor={enEspera} etiqueta="en lista de espera" />
        </View>

        <View style={styles.datos}>
          <DatoLibro etiqueta="Año" valor={String(libro.anio)} />
          <DatoLibro etiqueta="ISBN" valor={libro.isbn} />
        </View>

        <BotonPrincipal texto="Reservar" icono="bookmark" onPress={onReservar} />
      </View>
    </ScrollView>
  );
}

const ALTO_FRANJA = TAPA.grande.alto / 2 + ESPACIADO.xl;

const styles = StyleSheet.create({
  fondo: {
    backgroundColor: COLORES.fondo,
  },
  contenido: {
    paddingBottom: ESPACIADO.xxl,
  },
  franja: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: ALTO_FRANJA,
    backgroundColor: COLORES.primario,
  },
  tapa: {
    alignItems: 'center',
    paddingTop: ESPACIADO.xl,
  },
  titulo: {
    marginTop: ESPACIADO.lg,
    paddingHorizontal: ESPACIADO.lg,
    fontSize: TAMANO_TEXTO.titulo,
    fontWeight: 'bold',
    color: COLORES.texto,
    textAlign: 'center',
  },
  autor: {
    marginTop: ESPACIADO.xs,
    fontSize: TAMANO_TEXTO.subtitulo,
    color: COLORES.textoSuave,
    textAlign: 'center',
  },
  cuerpo: {
    padding: ESPACIADO.lg,
    gap: ESPACIADO.lg,
  },
  cifras: {
    flexDirection: 'row',
    gap: ESPACIADO.md,
  },
  datos: {
    paddingHorizontal: ESPACIADO.lg,
    paddingVertical: ESPACIADO.sm,
    borderRadius: RADIO.grande,
    backgroundColor: COLORES.superficie,
    ...SOMBRA,
  },
});
