// Tipos propios de la app (src/types/index.ts queda tal cual lo dio la consigna).

export type Prestamo = {
  isbn: string;
  titulo: string;
  vence: number; // fecha de devolución, en milisegundos (Date.getTime())
  desdeEspera: boolean; // true si llegó por la lista de espera (no salió del estante)
};

export type ResultadoReserva =
  | { tipo: 'prestamo'; vence: number }
  | { tipo: 'espera'; posicion: number }
  | { tipo: 'repetida' };
