import { useContext } from 'react';

import { BibliotecaContext } from '@/context/BibliotecaContext';

// Acceso al estado compartido de la biblioteca desde cualquier pantalla.
export function useBiblioteca() {
  const valor = useContext(BibliotecaContext);
  if (valor === null) {
    throw new Error('useBiblioteca tiene que usarse dentro de BibliotecaProvider.');
  }
  return valor;
}
