import type { Libro } from '../types';

// Catálogo inicial de la biblioteca.
// Los dos últimos son libros reales (ISBN de la contratapa) para probar el escáner.
// El resto usa ISBN simulados de 13 dígitos con dígito verificador válido.
export const LIBROS: Libro[] = [
  { isbn: '9789870001010', titulo: 'Ficciones', autor: 'Jorge Luis Borges', anio: 1944, ejemplares: 3 },
  { isbn: '9789870001027', titulo: 'El Aleph', autor: 'Jorge Luis Borges', anio: 1949, ejemplares: 0 },
  { isbn: '9789870001034', titulo: 'Rayuela', autor: 'Julio Cortázar', anio: 1963, ejemplares: 2 },
  { isbn: '9789870001041', titulo: 'Bestiario', autor: 'Julio Cortázar', anio: 1951, ejemplares: 1 },
  { isbn: '9789870001058', titulo: 'Martín Fierro', autor: 'José Hernández', anio: 1872, ejemplares: 4 },
  { isbn: '9789870001065', titulo: 'Don Segundo Sombra', autor: 'Ricardo Güiraldes', anio: 1926, ejemplares: 0 },
  { isbn: '9789870001072', titulo: 'Sobre héroes y tumbas', autor: 'Ernesto Sabato', anio: 1961, ejemplares: 1 },
  { isbn: '9789870001089', titulo: 'El túnel', autor: 'Ernesto Sabato', anio: 1948, ejemplares: 0 },
  { isbn: '9789870001096', titulo: 'Cien años de soledad', autor: 'Gabriel García Márquez', anio: 1967, ejemplares: 2 },
  { isbn: '9789870001102', titulo: 'Pedro Páramo', autor: 'Juan Rulfo', anio: 1955, ejemplares: 1 },
  { isbn: '9789870001119', titulo: 'Código limpio', autor: 'Robert C. Martin', anio: 2008, ejemplares: 2 },
  { isbn: '9789870001126', titulo: 'El programador pragmático', autor: 'Andrew Hunt y David Thomas', anio: 1999, ejemplares: 1 },
  { isbn: '9789870001133', titulo: 'Estructuras de datos y algoritmos', autor: 'Alfred V. Aho', anio: 1983, ejemplares: 0 },
  { isbn: '9789870001140', titulo: 'Operación masacre', autor: 'Rodolfo Walsh', anio: 1957, ejemplares: 2 },
  { isbn: '9789870001157', titulo: 'Historias de cronopios y de famas', autor: 'Julio Cortázar', anio: 1962, ejemplares: 1 },
  { isbn: '9789870001164', titulo: 'Mi libro real 1', autor: 'Autor del libro 1', anio: 2000, ejemplares: 1 },
  { isbn: '9789870001171', titulo: 'Mi libro real 2', autor: 'Autor del libro 2', anio: 2000, ejemplares: 0 },
];

// Personas que ya estaban esperando cuando arranca la app, por ISBN.
// Solo tienen lista de espera libros sin ejemplares en el estante.
export const ESPERAS_INICIALES: Record<string, string[]> = {
  '9789870001027': ['Ana Pérez', 'Bruno Díaz'],
  '9789870001065': ['Carla Gómez'],
};
