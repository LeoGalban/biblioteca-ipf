import { Stack } from 'expo-router';
import { StyleSheet } from 'react-native';

import { COLORES } from '@/constants/tema';
import { BibliotecaProvider } from '@/context/BibliotecaContext';

// anchor: si la app se abre directo en /buscar (deep link), Expo Router
// pone primero las tabs debajo en la pila, así "atrás" vuelve al Catálogo.
export const unstable_settings = {
  anchor: '(tabs)',
};

export default function LayoutRaiz() {
  // El provider envuelve TODO el Stack: así cualquier pantalla (tabs, modales,
  // mostrador) lee y cambia los mismos préstamos, esperas, recientes y sesión.
  return (
    <BibliotecaProvider>
      <Stack
        screenOptions={{
          headerTintColor: COLORES.primario,
          contentStyle: styles.contenido,
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="buscar" options={{ title: 'Buscar' }} />
        <Stack.Screen name="escanear" options={{ title: 'Escanear' }} />
        <Stack.Screen
          name="reservar/[isbn]"
          options={{ title: 'Confirmar reserva', presentation: 'modal' }}
        />
        <Stack.Screen
          name="permisos/[recurso]"
          options={{ title: 'Permiso', presentation: 'modal' }}
        />
        <Stack.Screen
          name="login"
          options={{ title: 'Ingreso del personal', presentation: 'modal' }}
        />
        <Stack.Screen name="mostrador" options={{ title: 'Mostrador' }} />
        <Stack.Screen
          name="+not-found"
          options={{ title: 'Página no encontrada' }}
        />
      </Stack>
    </BibliotecaProvider>
  );
}

const styles = StyleSheet.create({
  contenido: {
    backgroundColor: COLORES.fondo,
  },
});
