import { COLORES_TAPA } from '@/constants/tema';
import { PORTADAS } from '@/data/portadas';

// URL de la tapa en Open Library, o null si el libro no tiene tapa cargada.
export function urlPortada(isbn: string): string | null {
  const id = PORTADAS[isbn];
  return id === undefined ? null : `https://covers.openlibrary.org/b/id/${id}-M.jpg`;
}

// Índice del color de la tapa de respaldo: siempre el mismo para el mismo ISBN.
export function indiceColorTapa(isbn: string): number {
  let suma = 0;
  for (const digito of isbn) {
    suma += Number(digito) || 0;
  }
  return suma % COLORES_TAPA.length;
}
