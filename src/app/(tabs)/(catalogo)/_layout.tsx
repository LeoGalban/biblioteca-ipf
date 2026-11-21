import { Stack } from 'expo-router';
import { StyleSheet } from 'react-native';

import { LinkPersonal } from '@/components/LinkPersonal';
import { COLORES } from '@/constants/tema';

function botonPersonal() {
  return <LinkPersonal />;
}

// La tab "Catálogo" tiene su propia pila: Catálogo → Detalle del libro.
// anchor: si se abre directo un /libro/..., el Catálogo queda debajo.
export const unstable_settings = {
  anchor: 'index',
};

export default function LayoutCatalogo() {
  return (
    <Stack
      screenOptions={{
        headerStyle: styles.header,
        headerTintColor: COLORES.textoSobrePrimario,
        headerTitleStyle: styles.tituloHeader,
        headerShadowVisible: false,
        contentStyle: styles.contenido,
      }}
    >
      <Stack.Screen
        name="index"
        options={{ title: 'Catálogo', headerRight: botonPersonal }}
      />
      <Stack.Screen name="libro/[isbn]" options={{ title: 'Libro' }} />
    </Stack>
  );
}

const styles = StyleSheet.create({
  contenido: {
    backgroundColor: COLORES.fondo,
  },
  header: {
    backgroundColor: COLORES.primario,
  },
  tituloHeader: {
    fontWeight: 'bold',
  },
});
