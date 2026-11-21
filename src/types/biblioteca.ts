// Tipos propios de la app (src/types/index.ts queda tal cual lo dio la consigna).

export type Prestamo = {
  isbn: string;
  titulo: string;
  vence: number; // fecha de devolución, en milisegundos (Date.getTime())
  desdeEspera: boolean; // true si llegó por la lista de espera (no salió del estante)
  recordar: boolean; // interruptor "Recordarme"
};

// Un libro en cuya lista de espera estoy anotado.
export type EsperaPropia = {
  isbn: string;
  posicion: number; // 1 = al frente
  total: number; // cuántas personas esperan en total
};

// Mensaje que se muestra dentro de la app (en "Mis reservas").
export type Aviso = {
  id: string;
  texto: string;
};

export type ResultadoReserva =
  | { tipo: 'prestamo'; vence: number }
  | { tipo: 'espera'; posicion: number }
  | { tipo: 'repetida' };
