import { StyleSheet, Text, View } from 'react-native';

import { TarjetaReciente } from '@/components/TarjetaReciente';
import { COLORES, ESPACIADO, TAMANO_TEXTO } from '@/constants/tema';
import type { Libro } from '@/types';

type Props = {
  libros: Libro[]; // del más reciente al más antiguo
};

// Sección "Vistos recientemente" del Catálogo (los 3 del tope de la Pila).
export function VistosRecientes({ libros }: Props) {
  if (libros.length === 0) {
    return null;
  }

  return (
    <View style={styles.seccion}>
      <Text style={styles.titulo}>Vistos recientemente</Text>
      <View style={styles.fila}>
        {libros.map((libro) => (
          <TarjetaReciente key={libro.isbn} libro={libro} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  seccion: {
    marginBottom: ESPACIADO.lg,
  },
  titulo: {
    marginBottom: ESPACIADO.sm,
    fontSize: TAMANO_TEXTO.subtitulo,
    fontWeight: 'bold',
    color: COLORES.texto,
  },
  fila: {
    flexDirection: 'row',
    gap: ESPACIADO.sm,
  },
});
