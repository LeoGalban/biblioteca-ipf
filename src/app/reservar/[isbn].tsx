import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { BotonPrincipal } from '@/components/BotonPrincipal';
import { CajaMensaje } from '@/components/CajaMensaje';
import { EstadoCargando } from '@/components/EstadoCargando';
import { EstadoError } from '@/components/EstadoError';
import { LibroNoEncontrado } from '@/components/LibroNoEncontrado';
import { Pantalla } from '@/components/Pantalla';
import { DIAS_PRESTAMO } from '@/constants/biblioteca';
import { COLORES, ESPACIADO, TAMANO_TEXTO } from '@/constants/tema';
import { useBiblioteca } from '@/hooks/useBiblioteca';
import { useLibros } from '@/hooks/useLibros';
import { esIsbnValido } from '@/lib/isbn';

// dismissTo: cierra este modal (y lo que haya encima de las tabs) y deja
// enfocada la tab "Mis reservas". La confirmación sale de la pila, así que
// "atrás" nunca vuelve a ella.
function irAMisReservas() {
  router.dismissTo('/reservas');
}

function cancelar() {
  router.back();
}

export default function ConfirmarReserva() {
  const { isbn } = useLocalSearchParams<{ isbn: string }>();
  const { libros, cargando, error, reintentar } = useLibros();
  const { disponibles, personasEnEspera, posicionEnEspera, tienePrestamo, reservar } =
    useBiblioteca();
  // true apenas se confirma: evita reservar dos veces con un doble toque y
  // muestra "Listo" mientras se cierra el modal (en vez del aviso de repetida).
  const [confirmado, setConfirmado] = useState(false);

  if (confirmado) {
    return <EstadoCargando mensaje="¡Listo! Te llevamos a tus reservas…" />;
  }

  if (!esIsbnValido(isbn)) {
    return <LibroNoEncontrado mensaje={`"${isbn}" no es un ISBN válido.`} />;
  }

  if (cargando) {
    return <EstadoCargando mensaje="Preparando la reserva…" />;
  }

  if (error) {
    return (
      <EstadoError mensaje={error} textoAccion="Reintentar" onAccion={reintentar} />
    );
  }

  const libro = libros.find((l) => l.isbn === isbn);
  if (!libro) {
    return (
      <LibroNoEncontrado mensaje="No encontramos ese libro en la biblioteca." />
    );
  }

  // No se puede reservar dos veces el mismo libro.
  const posicionActual = posicionEnEspera(libro.isbn);
  if (tienePrestamo(libro.isbn) || posicionActual !== null) {
    const mensaje =
      posicionActual !== null
        ? `Ya estás en la lista de espera de este libro, en el puesto ${posicionActual}.`
        : 'Ya tenés este libro prestado.';
    return (
      <Pantalla>
        <Text style={styles.titulo}>{libro.titulo}</Text>
        <View style={styles.mensaje}>
          <CajaMensaje texto={mensaje} tipo="aviso" />
        </View>
        <BotonPrincipal texto="Ver mis reservas" onPress={irAMisReservas} />
      </Pantalla>
    );
  }

  const hayEjemplares = disponibles(libro) > 0;
  const explicacion = hayEjemplares
    ? `Hay ejemplares en el estante: te lo prestamos por ${DIAS_PRESTAMO} días.`
    : `No hay ejemplares en el estante. Vas a entrar a la lista de espera en el puesto ${personasEnEspera(libro.isbn) + 1}.`;

  function confirmar() {
    if (!libro || confirmado) return;
    setConfirmado(true);
    reservar(libro);
    irAMisReservas();
  }

  return (
    <Pantalla>
      <Text style={styles.titulo}>{libro.titulo}</Text>
      <Text style={styles.autor}>{libro.autor}</Text>
      <View style={styles.mensaje}>
        <CajaMensaje texto={explicacion} tipo={hayEjemplares ? 'exito' : 'info'} />
      </View>
      <View style={styles.botones}>
        <BotonPrincipal
          texto={hayEjemplares ? 'Confirmar préstamo' : 'Anotarme en la lista'}
          onPress={confirmar}
        />
        <BotonPrincipal texto="Cancelar" onPress={cancelar} secundario />
      </View>
    </Pantalla>
  );
}

const styles = StyleSheet.create({
  titulo: {
    fontSize: TAMANO_TEXTO.titulo,
    fontWeight: 'bold',
    color: COLORES.texto,
  },
  autor: {
    marginTop: ESPACIADO.xs,
    fontSize: TAMANO_TEXTO.subtitulo,
    color: COLORES.textoSuave,
  },
  mensaje: {
    marginVertical: ESPACIADO.xl,
  },
  botones: {
    gap: ESPACIADO.md,
  },
});
