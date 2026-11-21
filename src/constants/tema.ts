// Todos los colores, tamaños y espaciados de la app viven acá.
// Las pantallas y componentes nunca escriben un color o un número "suelto":
// usan estas constantes dentro de StyleSheet.create.

export const COLORES = {
  primario: '#1F4E8C',
  primarioClaro: '#E3ECF8',
  fondo: '#F5F6F8',
  superficie: '#FFFFFF',
  texto: '#1B1F24',
  textoSuave: '#5C6670',
  textoSobrePrimario: '#FFFFFF',
  borde: '#D8DDE3',
  exito: '#2E7D32',
  exitoClaro: '#E6F4E7',
  error: '#C62828',
  errorClaro: '#FDECEC',
  aviso: '#B26A00',
  avisoClaro: '#FFF4E0',
} as const;

export const ESPACIADO = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const TAMANO_TEXTO = {
  chico: 13,
  normal: 16,
  subtitulo: 18,
  titulo: 22,
  grande: 28,
} as const;

export const RADIO = {
  chico: 6,
  normal: 10,
  grande: 16,
} as const;

export const ICONO = {
  chico: 20,
  normal: 24,
  grande: 48,
} as const;

// Área táctil mínima recomendada (44 × 44) para cualquier botón.
export const AREA_TACTIL_MINIMA = 44;
