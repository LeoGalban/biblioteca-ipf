// Todos los colores, tamaños y espaciados de la app viven acá.
// Las pantallas y componentes nunca escriben un color o un número "suelto":
// usan estas constantes dentro de StyleSheet.create.

export const COLORES = {
  primario: '#1E3A5F', // azul profundo (headers, botones principales)
  primarioOscuro: '#132840',
  primarioClaro: '#E6EEF7',
  acento: '#D99A1E', // dorado (detalles destacados)
  acentoClaro: '#FBF1DC',
  fondo: '#F5F2EB', // tono papel
  superficie: '#FFFFFF',
  texto: '#1C2430',
  textoSuave: '#667085',
  textoSobrePrimario: '#FFFFFF',
  textoSobrePrimarioSuave: '#C9D6E8',
  borde: '#E6E0D4',
  exito: '#2E7D32',
  exitoClaro: '#E6F4E7',
  error: '#C62828',
  errorClaro: '#FDECEC',
  aviso: '#B26A00',
  avisoClaro: '#FFF4E0',
  sombra: '#1C2430',
} as const;

// Colores de las tapas de respaldo (cuando no hay imagen o no carga).
export const COLORES_TAPA = [
  '#1E3A5F',
  '#7A3B2E',
  '#2F5D50',
  '#5B4B8A',
  '#8A5A12',
  '#344E6B',
] as const;

export const ESPACIADO = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const TAMANO_TEXTO = {
  mini: 11,
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
  pildora: 999,
} as const;

export const ICONO = {
  chico: 20,
  normal: 24,
  grande: 48,
} as const;

// Tamaños de las tapas de los libros (proporción 2:3, como un libro real).
export const TAPA = {
  chica: { ancho: 48, alto: 72 },
  mediana: { ancho: 96, alto: 144 },
  grande: { ancho: 150, alto: 225 },
} as const;

// Sombra suave para tarjetas (iOS usa shadow*, Android usa elevation).
export const SOMBRA = {
  shadowColor: COLORES.sombra,
  shadowOpacity: 0.08,
  shadowRadius: 8,
  shadowOffset: { width: 0, height: 3 },
  elevation: 3,
} as const;

// Área táctil mínima recomendada (44 × 44) para cualquier botón.
export const AREA_TACTIL_MINIMA = 44;
