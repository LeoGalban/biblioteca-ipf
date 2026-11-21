// Toda la lógica de permisos de la app vive acá. Las pantallas no llaman
// directo a expo-camera / expo-notifications para pedir permisos: usan el
// hook usePermiso, que usa estas funciones por dentro.

import type { PermissionResponse } from 'expo';
import { Camera } from 'expo-camera';
import {
  AndroidImportance,
  getPermissionsAsync,
  requestPermissionsAsync,
  setNotificationChannelAsync,
} from 'expo-notifications';
import { Linking, Platform } from 'react-native';

import { CANAL_PRESTAMOS } from '@/constants/biblioteca';

export type Recurso = 'camara' | 'notificaciones';

// Los 4 estados que maneja toda la app.
export type EstadoPermiso = 'cargando' | 'concedido' | 'preguntable' | 'bloqueado';

const RECURSOS: Recurso[] = ['camara', 'notificaciones'];

export function esRecurso(valor: unknown): valor is Recurso {
  return typeof valor === 'string' && (RECURSOS as string[]).includes(valor);
}

// Textos de la pantalla previa (/permisos/[recurso]).
export const INFO_PERMISOS: Record<
  Recurso,
  { nombre: string; beneficio: string; alternativa: string }
> = {
  camara: {
    nombre: 'Cámara',
    beneficio:
      'Usamos tu cámara para leer el código de barras del libro y abrirlo al instante.',
    alternativa: 'Si preferís, podés escribir el ISBN a mano.',
  },
  notificaciones: {
    nombre: 'Notificaciones',
    beneficio:
      'Usamos tus notificaciones para recordarte cuándo devolver un libro y avisarte cuando te toca uno reservado.',
    alternativa: 'Si no las activás, los avisos igual aparecen en "Mis reservas".',
  },
};

// En Android 13+ el diálogo de notificaciones no aparece si la app no tiene
// ningún canal: por eso se crea ANTES de pedir el permiso.
export async function crearCanalPrestamos() {
  if (Platform.OS === 'android') {
    await setNotificationChannelAsync(CANAL_PRESTAMOS, {
      name: 'Préstamos',
      importance: AndroidImportance.HIGH,
    });
  }
}

// Consultar: NUNCA muestra el diálogo del sistema.
export function consultar(recurso: Recurso): Promise<PermissionResponse> {
  if (recurso === 'camara') {
    return Camera.getCameraPermissionsAsync();
  }
  return getPermissionsAsync();
}

// Pedir: PUEDE mostrar el diálogo del sistema (si todavía se puede preguntar).
export async function pedir(recurso: Recurso): Promise<PermissionResponse> {
  if (recurso === 'camara') {
    return Camera.requestCameraPermissionsAsync();
  }
  await crearCanalPrestamos();
  return requestPermissionsAsync();
}

// Traduce la respuesta del sistema a los 4 estados de la app.
// Es LA función que decide entre "Continuar" y "Abrir Ajustes".
export function estadoDe(respuesta: PermissionResponse | null): EstadoPermiso {
  if (respuesta === null) return 'cargando';
  if (respuesta.granted) return 'concedido';
  // status solo dice "denied", tanto la primera vez como cuando ya quedó
  // bloqueado: canAskAgain es lo que distingue los dos casos.
  if (respuesta.canAskAgain) return 'preguntable';
  return 'bloqueado';
}

export function abrirAjustes() {
  return Linking.openSettings();
}
