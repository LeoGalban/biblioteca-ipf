import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Text, View } from 'react-native';

import { AccesosCatalogo } from '@/components/AccesosCatalogo';
import { TituloSeccion } from '@/components/TituloSeccion';
import { VistosRecientes } from '@/components/VistosRecientes';
import {
  COLORES,
  ESPACIADO,
  ICONO,
  RADIO,
  SOMBRA,
  TAMANO_TEXTO,
} from '@/constants/tema';
import type { Libro } from '@/types';

type Props = {
  vistos: Libro[];
  cantidad: number;
};

// Lo que va arriba de la lista del Catálogo: bienvenida, accesos y
// "Vistos recientemente".
export function EncabezadoCatalogo({ vistos, cantidad }: Props) {
  return (
    <View>
      <View style={styles.bienvenida}>
        <View style={styles.textos}>
          <Text style={styles.titulo}>Biblioteca IPF</Text>
          <Text style={styles.subtitulo}>
            Encontrá, reservá y retirá tu próximo libro.
          </Text>
          <Text style={styles.cantidad}>
            {cantidad === 1 ? '1 título' : `${cantidad} títulos`} en el catálogo
          </Text>
        </View>
        <View style={styles.icono}>
          <Ionicons name="library" size={ICONO.grande} color={COLORES.acento} />
        </View>
      </View>

      <AccesosCatalogo />
      <VistosRecientes libros={vistos} />
      <TituloSeccion texto="Todo el catálogo" />
    </View>
  );
}

const styles = StyleSheet.create({
  bienvenida: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ESPACIADO.md,
    marginBottom: ESPACIADO.lg,
    padding: ESPACIADO.xl,
    borderRadius: RADIO.grande,
    backgroundColor: COLORES.primario,
    ...SOMBRA,
  },
  textos: {
    flex: 1,
    gap: ESPACIADO.xs,
  },
  titulo: {
    fontSize: TAMANO_TEXTO.grande,
    fontWeight: 'bold',
    color: COLORES.textoSobrePrimario,
  },
  subtitulo: {
    fontSize: TAMANO_TEXTO.normal,
    color: COLORES.textoSobrePrimarioSuave,
  },
  cantidad: {
    marginTop: ESPACIADO.sm,
    fontSize: TAMANO_TEXTO.chico,
    fontWeight: 'bold',
    color: COLORES.acento,
  },
  icono: {
    padding: ESPACIADO.md,
    borderRadius: RADIO.pildora,
    backgroundColor: COLORES.primarioOscuro,
  },
});
