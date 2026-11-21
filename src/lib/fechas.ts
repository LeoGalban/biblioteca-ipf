// Fecha legible en español, por ejemplo "jueves 27 de noviembre".
export function formatearFecha(milisegundos: number): string {
  return new Date(milisegundos).toLocaleDateString('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}
