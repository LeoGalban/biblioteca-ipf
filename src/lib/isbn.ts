// Un ISBN-13 válido para la app: exactamente 13 dígitos, sin guiones ni espacios.
export function esIsbnValido(texto: string): boolean {
  return /^\d{13}$/.test(texto);
}
