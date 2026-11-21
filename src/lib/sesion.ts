import { CLAVE_PERSONAL, USUARIO_PERSONAL } from '@/constants/biblioteca';

// Compara con las credenciales fijas del personal (sin distinguir espacios al borde).
export function credencialesValidas(usuario: string, clave: string): boolean {
  return usuario.trim() === USUARIO_PERSONAL && clave === CLAVE_PERSONAL;
}
