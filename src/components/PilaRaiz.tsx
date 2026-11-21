import { router, Stack } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet } from 'react-native';

import { COLORES } from '@/constants/tema';
import { useBiblioteca } from '@/hooks/useBiblioteca';

// Stack raíz de la app. Está en un componente aparte porque necesita leer la
// sesión del Context, y el provider se crea justo afuera (en el layout raíz).
export function PilaRaiz() {
  const { sesionIniciada } = useBiblioteca();

  // Apenas se inicia sesión, se abre el mostrador. El login ya no existe en
  // ese momento (su guard pasó a false), así que se cerró solo.
  useEffect(() => {
    if (sesionIniciada) {
      router.push('/mostrador');
    }
  }, [sesionIniciada]);

  return (
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

      {/* /login solo existe SIN sesión: al iniciarla, sale del historial. */}
      <Stack.Protected guard={!sesionIniciada}>
        <Stack.Screen
          name="login"
          options={{ title: 'Ingreso del personal', presentation: 'modal' }}
        />
      </Stack.Protected>

      {/* /mostrador solo existe CON sesión: al cerrarla, sale del historial. */}
      <Stack.Protected guard={sesionIniciada}>
        <Stack.Screen name="mostrador" options={{ title: 'Mostrador' }} />
      </Stack.Protected>

      <Stack.Screen
        name="+not-found"
        options={{ title: 'Página no encontrada' }}
      />
    </Stack>
  );
}

const styles = StyleSheet.create({
  contenido: {
    backgroundColor: COLORES.fondo,
  },
});
