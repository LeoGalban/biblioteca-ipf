import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { BotonPrincipal } from '@/components/BotonPrincipal';
import { EstadoCargando } from '@/components/EstadoCargando';
import { Pantalla } from '@/components/Pantalla';
import { COLORES, ESPACIADO, ICONO, TAMANO_TEXTO } from '@/constants/tema';
import { usePermiso } from '@/hooks/usePermiso';
import { INFO_PERMISOS, type Recurso } from '@/lib/permisos';

type Props = {
  recurso: Recurso;
};

const ICONOS = {
  camara: 'camera-outline',
  notificaciones: 'notifications-outline',
} as const;

function volver() {
  router.back();
}

// Pantalla previa al diálogo del sistema: el beneficio en una frase y un
// único botón ("Continuar", o "Abrir Ajustes" si el permiso quedó bloqueado).
export function PantallaPreviaPermiso({ recurso }: Props) {
  const { estado, pedir, abrirAjustes } = usePermiso(recurso);
  const info = INFO_PERMISOS[recurso];

  async function continuar() {
    const respuesta = await pedir();
    // Si lo concedió, volvemos a la pantalla que lo necesitaba.
    if (respuesta.granted) volver();
  }

  if (estado === 'cargando') {
    return <EstadoCargando mensaje="Revisando el permiso…" />;
  }

  let detalle = info.alternativa;
  let boton = <BotonPrincipal texto="Continuar" onPress={continuar} />;
  if (estado === 'concedido') {
    detalle = 'Ya diste este permiso. ¡Gracias!';
    boton = <BotonPrincipal texto="Volver" onPress={volver} />;
  } else if (estado === 'bloqueado') {
    detalle = `El permiso está desactivado. Activalo en Ajustes (${info.nombre}) y volvé a la app. ${info.alternativa}`;
    boton = <BotonPrincipal texto="Abrir Ajustes" onPress={abrirAjustes} />;
  }

  return (
    <Pantalla centrada>
      <Ionicons name={ICONOS[recurso]} size={ICONO.grande} color={COLORES.primario} />
      <Text style={styles.titulo}>{info.nombre}</Text>
      <Text style={styles.beneficio}>{info.beneficio}</Text>
      <Text style={styles.detalle}>{detalle}</Text>
      <View style={styles.boton}>{boton}</View>
    </Pantalla>
  );
}

const styles = StyleSheet.create({
  titulo: {
    marginTop: ESPACIADO.md,
    fontSize: TAMANO_TEXTO.titulo,
    fontWeight: 'bold',
    color: COLORES.texto,
  },
  beneficio: {
    marginTop: ESPACIADO.md,
    fontSize: TAMANO_TEXTO.subtitulo,
    color: COLORES.texto,
    textAlign: 'center',
  },
  detalle: {
    marginTop: ESPACIADO.md,
    fontSize: TAMANO_TEXTO.normal,
    color: COLORES.textoSuave,
    textAlign: 'center',
  },
  boton: {
    marginTop: ESPACIADO.xl,
    alignSelf: 'stretch',
  },
});
