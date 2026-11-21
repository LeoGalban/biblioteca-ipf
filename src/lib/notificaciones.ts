// Notificaciones locales de la app (no hay notificaciones push).

import {
  cancelScheduledNotificationAsync,
  scheduleNotificationAsync,
  SchedulableTriggerInputTypes,
  setNotificationHandler,
} from 'expo-notifications';

import { CANAL_PRESTAMOS, SEGUNDOS_RECORDATORIO } from '@/constants/biblioteca';
import { crearCanalPrestamos } from '@/lib/permisos';

// Sin esto, una notificación que llega con la app abierta no se muestra.
export function configurarNotificaciones() {
  setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

// Canal a usar: "prestamos" si se pudo crear; si no, el canal por defecto.
async function canalDisponible(): Promise<string | undefined> {
  return (await crearCanalPrestamos()) ? CANAL_PRESTAMOS : undefined;
}

// Programa el recordatorio de devolución y devuelve su identificador
// (hace falta guardarlo para poder cancelarlo después).
export async function programarRecordatorio(titulo: string): Promise<string> {
  const channelId = await canalDisponible();
  return scheduleNotificationAsync({
    content: {
      title: 'Recordatorio de devolución',
      body: `Acordate de devolver "${titulo}" a la biblioteca.`,
    },
    trigger: {
      type: SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: SEGUNDOS_RECORDATORIO,
      channelId,
    },
  });
}

export function cancelarRecordatorio(id: string) {
  return cancelScheduledNotificationAsync(id);
}

// Notificación inmediata (por ejemplo, "ya podés retirar tu libro").
export async function notificarAhora(titulo: string, cuerpo: string) {
  const channelId = await canalDisponible();
  return scheduleNotificationAsync({
    content: { title: titulo, body: cuerpo },
    trigger: channelId ? { channelId } : null,
  });
}
