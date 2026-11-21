import { View } from 'react-native';

import { AccesosCatalogo } from '@/components/AccesosCatalogo';
import { VistosRecientes } from '@/components/VistosRecientes';
import type { Libro } from '@/types';

type Props = {
  vistos: Libro[];
};

// Lo que va arriba de la lista del Catálogo: accesos y vistos recientemente.
export function EncabezadoCatalogo({ vistos }: Props) {
  return (
    <View>
      <AccesosCatalogo />
      <VistosRecientes libros={vistos} />
    </View>
  );
}
