import { useState } from 'react';
import { FlatList, type ListRenderItemInfo, StyleSheet, View } from 'react-native';

import { BotonPrincipal } from '@/components/BotonPrincipal';
import { CajaMensaje } from '@/components/CajaMensaje';
import { EstadoCargando } from '@/components/EstadoCargando';
import { EstadoError } from '@/components/EstadoError';
import { EstadoVacio } from '@/components/EstadoVacio';
import { TarjetaMostrador } from '@/components/TarjetaMostrador';
import { COLORES, ESPACIADO } from '@/constants/tema';
import { useBiblioteca } from '@/hooks/useBiblioteca';
import { useLibros } from '@/hooks/useLibros';
import type { ListaEspera } from '@/types/biblioteca';

function claveLista(lista: ListaEspera) {
  return lista.isbn;
}

export default function Mostrador() {
  const { listasDeEspera, entregarAlSiguiente, cerrarSesion } = useBiblioteca();
  const { libros, cargando, error, reintentar } = useLibros();
  const [mensaje, setMensaje] = useState<string | null>(null);

  if (cargando) {
    return <EstadoCargando mensaje="Cargando las listas de espera…" />;
  }

  if (error) {
    return (
      <EstadoError mensaje={error} textoAccion="Reintentar" onAccion={reintentar} />
    );
  }

  function tituloDe(isbn: string) {
    return libros.find((l) => l.isbn === isbn)?.titulo ?? `Libro ${isbn}`;
  }

  async function entregar(isbn: string) {
    setMensaje(await entregarAlSiguiente(isbn, tituloDe(isbn)));
  }

  function renderizarLista({ item }: ListRenderItemInfo<ListaEspera>) {
    return (
      <TarjetaMostrador
        isbn={item.isbn}
        titulo={tituloDe(item.isbn)}
        frente={item.frente}
        total={item.total}
        onEntregar={() => entregar(item.isbn)}
      />
    );
  }

  return (
    <View style={styles.pantalla}>
      <FlatList
        data={listasDeEspera}
        keyExtractor={claveLista}
        renderItem={renderizarLista}
        ListHeaderComponent={
          mensaje ? <CajaMensaje texto={mensaje} tipo="exito" /> : undefined
        }
        ListEmptyComponent={
          <EstadoVacio mensaje="Ningún libro tiene lista de espera." />
        }
        contentContainerStyle={styles.lista}
      />
      {/* Al cerrar sesión, el guard de /mostrador pasa a false y la pantalla
          sale del historial (no se puede volver con "atrás"). */}
      <View style={styles.pie}>
        <BotonPrincipal texto="Cerrar sesión" onPress={cerrarSesion} secundario />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  pantalla: {
    flex: 1,
    backgroundColor: COLORES.fondo,
  },
  lista: {
    padding: ESPACIADO.lg,
    gap: ESPACIADO.md,
  },
  pie: {
    padding: ESPACIADO.lg,
    borderTopWidth: 1,
    borderTopColor: COLORES.borde,
    backgroundColor: COLORES.superficie,
  },
});
