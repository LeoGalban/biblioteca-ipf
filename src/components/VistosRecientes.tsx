import { StyleSheet, View } from 'react-native';

import { TarjetaReciente } from '@/components/TarjetaReciente';
import { TituloSeccion } from '@/components/TituloSeccion';
import { ESPACIADO } from '@/constants/tema';
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
    <View>
      <TituloSeccion texto="Vistos recientemente" />
      <View style={styles.fila}>
        {libros.map((libro) => (
          <TarjetaReciente key={libro.isbn} libro={libro} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fila: {
    flexDirection: 'row',
    gap: ESPACIADO.md,
  },
});
