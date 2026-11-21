import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { BotonPrincipal } from '@/components/BotonPrincipal';
import {
  AREA_TACTIL_MINIMA,
  COLORES,
  ESPACIADO,
  RADIO,
  TAMANO_TEXTO,
} from '@/constants/tema';
import { esIsbnValido } from '@/lib/isbn';

type Props = {
  onAbrir: (isbn: string) => void;
};

// Alternativa al escáner, siempre disponible: escribir el ISBN a mano.
export function IngresoManualIsbn({ onAbrir }: Props) {
  const [texto, setTexto] = useState('');
  const [error, setError] = useState<string | null>(null);

  function abrir() {
    const isbn = texto.trim();
    if (!esIsbnValido(isbn)) {
      setError('El ISBN tiene que tener 13 números, sin guiones ni espacios.');
      return;
    }
    setError(null);
    onAbrir(isbn);
  }

  return (
    <View style={styles.contenedor}>
      <Text style={styles.etiqueta}>¿No podés escanear? Escribí el ISBN:</Text>
      <View style={styles.fila}>
        <TextInput
          style={styles.campo}
          value={texto}
          onChangeText={setTexto}
          placeholder="9789870001010"
          placeholderTextColor={COLORES.textoSuave}
          keyboardType="number-pad"
          maxLength={13}
          accessibilityLabel="ISBN de 13 números"
          onSubmitEditing={abrir}
        />
        <BotonPrincipal texto="Abrir" onPress={abrir} />
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    padding: ESPACIADO.lg,
    gap: ESPACIADO.sm,
    backgroundColor: COLORES.superficie,
    borderTopWidth: 1,
    borderTopColor: COLORES.borde,
  },
  etiqueta: {
    fontSize: TAMANO_TEXTO.normal,
    color: COLORES.texto,
  },
  fila: {
    flexDirection: 'row',
    gap: ESPACIADO.sm,
  },
  campo: {
    flex: 1,
    minHeight: AREA_TACTIL_MINIMA,
    paddingHorizontal: ESPACIADO.md,
    borderRadius: RADIO.normal,
    borderWidth: 1,
    borderColor: COLORES.borde,
    fontSize: TAMANO_TEXTO.normal,
    color: COLORES.texto,
  },
  error: {
    fontSize: TAMANO_TEXTO.chico,
    color: COLORES.error,
  },
});
