import Ionicons from '@expo/vector-icons/Ionicons';
import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Insignia } from '@/components/Insignia';
import { PortadaLibro } from '@/components/PortadaLibro';
import {
  AREA_TACTIL_MINIMA,
  COLORES,
  ESPACIADO,
  ICONO,
  RADIO,
  SOMBRA,
  TAMANO_TEXTO,
} from '@/constants/tema';
import { useBiblioteca } from '@/hooks/useBiblioteca';
import type { Libro } from '@/types';

type Props = {
  libro: Libro;
};

// Una fila del Catálogo o del buscador: tapa, datos y disponibilidad.
// Al tocarla abre el detalle del libro.
export function FilaLibro({ libro }: Props) {
  const { disponibles, personasEnEspera } = useBiblioteca();
  const enEstante = disponibles(libro);
  const enEspera = personasEnEspera(libro.isbn);

  let insignia = <Insignia texto="Sin ejemplares" tipo="error" />;
  if (enEstante > 0) {
    insignia = (
      <Insignia
        texto={enEstante === 1 ? '1 disponible' : `${enEstante} disponibles`}
        tipo="exito"
      />
    );
  } else if (enEspera > 0) {
    insignia = <Insignia texto={`${enEspera} en espera`} tipo="aviso" />;
  }

  return (
    <Link
      href={{ pathname: '/libro/[isbn]', params: { isbn: libro.isbn } }}
      asChild
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${libro.titulo}, de ${libro.autor}`}
        style={({ pressed }) => [styles.fila, pressed && styles.presionada]}
      >
        <PortadaLibro isbn={libro.isbn} titulo={libro.titulo} />
        <View style={styles.textos}>
          <Text style={styles.titulo} numberOfLines={2}>
            {libro.titulo}
          </Text>
          <Text style={styles.autor} numberOfLines={1}>
            {libro.autor} · {libro.anio}
          </Text>
          {insignia}
        </View>
        <Ionicons
          name="chevron-forward"
          size={ICONO.chico}
          color={COLORES.textoSuave}
        />
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  fila: {
    minHeight: AREA_TACTIL_MINIMA,
    flexDirection: 'row',
    alignItems: 'center',
    gap: ESPACIADO.md,
    backgroundColor: COLORES.superficie,
    borderRadius: RADIO.grande,
    padding: ESPACIADO.md,
    ...SOMBRA,
  },
  presionada: {
    backgroundColor: COLORES.primarioClaro,
  },
  textos: {
    flex: 1,
    gap: ESPACIADO.xs,
  },
  titulo: {
    fontSize: TAMANO_TEXTO.normal,
    fontWeight: 'bold',
    color: COLORES.texto,
  },
  autor: {
    fontSize: TAMANO_TEXTO.chico,
    color: COLORES.textoSuave,
  },
});
