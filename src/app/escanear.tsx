import { type BarcodeScanningResult, CameraView } from 'expo-camera';
import { router } from 'expo-router';
import { type ReactNode, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { CajaMensaje } from '@/components/CajaMensaje';
import { EscanerSinPermiso } from '@/components/EscanerSinPermiso';
import { EstadoCargando } from '@/components/EstadoCargando';
import { EstadoError } from '@/components/EstadoError';
import { IngresoManualIsbn } from '@/components/IngresoManualIsbn';
import { COLORES, ESPACIADO, TAMANO_TEXTO } from '@/constants/tema';
import { useLibros } from '@/hooks/useLibros';
import { usePermiso } from '@/hooks/usePermiso';
import { esIsbnValido } from '@/lib/isbn';

export default function Escanear() {
  const { estado, abrirAjustes } = usePermiso('camara');
  const { libros, cargando, error, reintentar } = useLibros();
  const [aviso, setAviso] = useState<string | null>(null);

  // useRef y no useState: onBarcodeScanned se llama muchas veces por segundo.
  // Un ref cambia AL INSTANTE y lo ven todos los llamados siguientes; un
  // useState recién cambiaría en el próximo render, y mientras tanto los
  // llamados que ya estaban en camino seguirían viendo el valor viejo.
  const yaNavego = useRef(false);
  const ultimoIsbnAvisado = useRef<string | null>(null);

  function existe(isbn: string) {
    return libros.some((l) => l.isbn === isbn);
  }

  // replace: el escáner sale de la pila, así "atrás" desde el detalle no
  // vuelve a la cámara (que leería el código otra vez).
  function irAlDetalle(isbn: string) {
    yaNavego.current = true;
    router.replace({ pathname: '/libro/[isbn]', params: { isbn } });
  }

  function avisarQueNoExiste(isbn: string) {
    setAviso(
      `El ISBN ${isbn} no está en el catálogo de la biblioteca. Podés probar con otro libro.`,
    );
  }

  function alEscanear(resultado: BarcodeScanningResult) {
    const isbn = resultado.data.trim();
    if (yaNavego.current || !esIsbnValido(isbn)) return;

    if (existe(isbn)) {
      irAlDetalle(isbn);
      return;
    }

    // Mismo código desconocido frente a la cámara: no repetimos el aviso.
    if (ultimoIsbnAvisado.current === isbn) return;
    ultimoIsbnAvisado.current = isbn;
    avisarQueNoExiste(isbn);
  }

  function alIngresarManual(isbn: string) {
    if (yaNavego.current) return;
    if (existe(isbn)) {
      irAlDetalle(isbn);
    } else {
      avisarQueNoExiste(isbn);
    }
  }

  // Zona de arriba: depende del catálogo y del permiso de cámara.
  let zona: ReactNode;
  if (cargando) {
    zona = <EstadoCargando mensaje="Cargando el catálogo…" />;
  } else if (error) {
    zona = (
      <EstadoError mensaje={error} textoAccion="Reintentar" onAccion={reintentar} />
    );
  } else if (estado === 'cargando') {
    zona = <EstadoCargando mensaje="Revisando el permiso de la cámara…" />;
  } else if (estado === 'preguntable' || estado === 'bloqueado') {
    zona = (
      <EscanerSinPermiso
        bloqueado={estado === 'bloqueado'}
        onAbrirAjustes={abrirAjustes}
      />
    );
  } else {
    zona = (
      <>
        <CameraView
          style={styles.camara}
          facing="back"
          barcodeScannerSettings={{ barcodeTypes: ['ean13'] }}
          onBarcodeScanned={alEscanear}
        />
        <Text style={styles.ayuda}>
          Apuntá al código de barras de la contratapa del libro.
        </Text>
      </>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.pantalla}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.zona}>{zona}</View>
      {aviso && (
        <View style={styles.aviso}>
          <CajaMensaje texto={aviso} tipo="aviso" />
        </View>
      )}
      {/* El ingreso manual está siempre, con o sin permiso de cámara. */}
      <IngresoManualIsbn onAbrir={alIngresarManual} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  pantalla: {
    flex: 1,
    backgroundColor: COLORES.fondo,
  },
  zona: {
    flex: 1,
  },
  camara: {
    flex: 1,
  },
  ayuda: {
    padding: ESPACIADO.md,
    fontSize: TAMANO_TEXTO.normal,
    color: COLORES.texto,
    textAlign: 'center',
  },
  aviso: {
    paddingHorizontal: ESPACIADO.lg,
    paddingTop: ESPACIADO.md,
  },
});
