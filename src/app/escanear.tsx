import { CameraView } from 'expo-camera';
import { StyleSheet, Text, View } from 'react-native';

import { EscanerSinPermiso } from '@/components/EscanerSinPermiso';
import { EstadoCargando } from '@/components/EstadoCargando';
import { COLORES, ESPACIADO, TAMANO_TEXTO } from '@/constants/tema';
import { usePermiso } from '@/hooks/usePermiso';

export default function Escanear() {
  const { estado, abrirAjustes } = usePermiso('camara');

  // Los cuatro estados del permiso de cámara.
  if (estado === 'cargando') {
    return <EstadoCargando mensaje="Revisando el permiso de la cámara…" />;
  }

  if (estado === 'preguntable' || estado === 'bloqueado') {
    return (
      <EscanerSinPermiso
        bloqueado={estado === 'bloqueado'}
        onAbrirAjustes={abrirAjustes}
      />
    );
  }

  // estado === 'concedido'
  return (
    <View style={styles.pantalla}>
      <CameraView
        style={styles.camara}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ['ean13'] }}
      />
      <Text style={styles.ayuda}>
        Apuntá al código de barras de la contratapa del libro.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pantalla: {
    flex: 1,
    backgroundColor: COLORES.fondo,
  },
  camara: {
    flex: 1,
  },
  ayuda: {
    padding: ESPACIADO.lg,
    fontSize: TAMANO_TEXTO.normal,
    color: COLORES.texto,
    textAlign: 'center',
  },
});
