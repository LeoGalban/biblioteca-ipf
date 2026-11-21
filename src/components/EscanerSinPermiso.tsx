import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { BotonPrincipal } from '@/components/BotonPrincipal';
import { COLORES, ESPACIADO, ICONO, TAMANO_TEXTO } from '@/constants/tema';

type Props = {
  bloqueado: boolean;
  onAbrirAjustes: () => void;
};

// Antes del diálogo del sistema se muestra la pantalla previa /permisos/camara.
function irAPantallaPrevia() {
  router.push({ pathname: '/permisos/[recurso]', params: { recurso: 'camara' } });
}

// Lo que ve la persona en /escanear cuando la app no tiene la cámara:
// "preguntable" → explicar y ofrecer la pantalla previa;
// "bloqueado"   → explicar y ofrecer Ajustes.
export function EscanerSinPermiso({ bloqueado, onAbrirAjustes }: Props) {
  const mensaje = bloqueado
    ? 'La cámara está desactivada para esta app. Podés activarla en Ajustes o escribir el ISBN a mano.'
    : 'Para leer el código de barras del libro necesitamos usar la cámara.';

  return (
    <View style={styles.contenedor}>
      <Ionicons
        name={bloqueado ? 'videocam-off-outline' : 'camera-outline'}
        size={ICONO.grande}
        color={bloqueado ? COLORES.aviso : COLORES.primario}
      />
      <Text style={styles.mensaje}>{mensaje}</Text>
      {bloqueado ? (
        <BotonPrincipal texto="Abrir Ajustes" onPress={onAbrirAjustes} />
      ) : (
        <BotonPrincipal texto="Usar la cámara" onPress={irAPantallaPrevia} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: ESPACIADO.lg,
    gap: ESPACIADO.lg,
  },
  mensaje: {
    fontSize: TAMANO_TEXTO.normal,
    color: COLORES.texto,
    textAlign: 'center',
  },
});
