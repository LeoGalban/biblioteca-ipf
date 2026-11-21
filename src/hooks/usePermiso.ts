import type { PermissionResponse } from 'expo';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { AppState } from 'react-native';

import {
  abrirAjustes,
  consultar,
  estadoDe,
  pedir as pedirPermiso,
  type Recurso,
} from '@/lib/permisos';

// Estado de un permiso con los 4 valores de la app:
// cargando → concedido | preguntable | bloqueado.
// Se actualiza solo al entrar a la pantalla (foco) y al volver de Ajustes (AppState).
export function usePermiso(recurso: Recurso) {
  // null = todavía no se consultó → 'cargando'
  const [respuesta, setRespuesta] = useState<PermissionResponse | null>(null);

  useFocusEffect(
    useCallback(() => {
      let vigente = true;

      function revisar() {
        consultar(recurso).then((nueva) => {
          if (vigente) setRespuesta(nueva);
        });
      }

      // 1. Cada vez que la pantalla gana el foco.
      revisar();

      // 2. Cada vez que la app vuelve a primer plano (por ejemplo, desde
      //    Ajustes), mientras esta pantalla tiene el foco.
      const suscripcion = AppState.addEventListener('change', (estadoApp) => {
        if (estadoApp === 'active') revisar();
      });

      // Limpieza: al perder el foco o desmontar se corta la suscripción y se
      // ignoran las consultas que todavía no respondieron.
      return () => {
        vigente = false;
        suscripcion.remove();
      };
    }, [recurso]),
  );

  async function pedir() {
    const nueva = await pedirPermiso(recurso);
    setRespuesta(nueva);
    return nueva;
  }

  return {
    estado: estadoDe(respuesta),
    pedir,
    abrirAjustes,
  };
}
