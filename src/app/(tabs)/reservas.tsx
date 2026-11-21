import { ScrollView, StyleSheet, View } from 'react-native';

import { EstadoCargando } from '@/components/EstadoCargando';
import { EstadoError } from '@/components/EstadoError';
import { EstadoVacio } from '@/components/EstadoVacio';
import { TarjetaAviso } from '@/components/TarjetaAviso';
import { TarjetaEspera } from '@/components/TarjetaEspera';
import { TarjetaPrestamo } from '@/components/TarjetaPrestamo';
import { TituloSeccion } from '@/components/TituloSeccion';
import { COLORES, ESPACIADO } from '@/constants/tema';
import { useBiblioteca } from '@/hooks/useBiblioteca';
import { useLibros } from '@/hooks/useLibros';

export default function MisReservas() {
  const {
    prestamos,
    misEsperas,
    avisos,
    devolver,
    cambiarRecordatorio,
    descartarAviso,
  } = useBiblioteca();
  // El catálogo hace falta para mostrar el título de cada lista de espera.
  const { libros, cargando, error, reintentar } = useLibros();

  if (cargando) {
    return <EstadoCargando mensaje="Cargando tus reservas…" />;
  }

  if (error) {
    return (
      <EstadoError mensaje={error} textoAccion="Reintentar" onAccion={reintentar} />
    );
  }

  function tituloDe(isbn: string) {
    return libros.find((l) => l.isbn === isbn)?.titulo ?? `Libro ${isbn}`;
  }

  return (
    <ScrollView style={styles.fondo} contentContainerStyle={styles.contenido}>
      {avisos.length > 0 && (
        <View style={styles.lista}>
          {avisos.map((aviso) => (
            <TarjetaAviso
              key={aviso.id}
              aviso={aviso}
              onDescartar={() => descartarAviso(aviso.id)}
            />
          ))}
        </View>
      )}

      <TituloSeccion texto="Mis préstamos" />
      {prestamos.length === 0 ? (
        <EstadoVacio mensaje="No tenés libros prestados." />
      ) : (
        <View style={styles.lista}>
          {prestamos.map((prestamo) => (
            <TarjetaPrestamo
              key={prestamo.isbn}
              prestamo={prestamo}
              onCambiarRecordar={(activo) =>
                cambiarRecordatorio(prestamo.isbn, activo)
              }
              onDevolver={() => devolver(prestamo.isbn)}
            />
          ))}
        </View>
      )}

      <TituloSeccion texto="En lista de espera" />
      {misEsperas.length === 0 ? (
        <EstadoVacio mensaje="No estás esperando ningún libro." />
      ) : (
        <View style={styles.lista}>
          {misEsperas.map((espera) => (
            <TarjetaEspera
              key={espera.isbn}
              titulo={tituloDe(espera.isbn)}
              posicion={espera.posicion}
              total={espera.total}
            />
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  fondo: {
    backgroundColor: COLORES.fondo,
  },
  contenido: {
    padding: ESPACIADO.lg,
  },
  lista: {
    gap: ESPACIADO.sm,
  },
});
