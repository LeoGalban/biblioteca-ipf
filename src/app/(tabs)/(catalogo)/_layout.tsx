import { Stack } from 'expo-router';
import { StyleSheet } from 'react-native';

import { COLORES } from '@/constants/tema';

// La tab "Catálogo" tiene su propia pila: Catálogo → Detalle del libro.
// anchor: si se abre directo un /libro/..., el Catálogo queda debajo.
export const unstable_settings = {
  anchor: 'index',
};

export default function LayoutCatalogo() {
  return (
    <Stack
      screenOptions={{
        headerTintColor: COLORES.primario,
        contentStyle: styles.contenido,
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Catálogo' }} />
      <Stack.Screen name="libro/[isbn]" options={{ title: 'Libro' }} />
    </Stack>
  );
}

const styles = StyleSheet.create({
  contenido: {
    backgroundColor: COLORES.fondo,
  },
});
