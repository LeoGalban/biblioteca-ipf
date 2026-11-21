import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, TextInput, View } from 'react-native';

import {
  AREA_TACTIL_MINIMA,
  COLORES,
  ESPACIADO,
  ICONO,
  RADIO,
  TAMANO_TEXTO,
} from '@/constants/tema';

type Props = {
  valor: string;
  onCambiar: (texto: string) => void;
};

// Campo de búsqueda controlado: muestra "valor" y avisa cada cambio.
export function BarraBusqueda({ valor, onCambiar }: Props) {
  return (
    <View style={styles.barra}>
      <Ionicons name="search-outline" size={ICONO.chico} color={COLORES.textoSuave} />
      <TextInput
        style={styles.campo}
        value={valor}
        onChangeText={onCambiar}
        placeholder="Título o autor"
        placeholderTextColor={COLORES.textoSuave}
        accessibilityLabel="Buscar por título o autor"
        autoCorrect={false}
        autoFocus
        returnKeyType="search"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  barra: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ESPACIADO.sm,
    margin: ESPACIADO.lg,
    paddingHorizontal: ESPACIADO.md,
    borderRadius: RADIO.normal,
    borderWidth: 1,
    borderColor: COLORES.borde,
    backgroundColor: COLORES.superficie,
  },
  campo: {
    flex: 1,
    minHeight: AREA_TACTIL_MINIMA,
    fontSize: TAMANO_TEXTO.normal,
    color: COLORES.texto,
  },
});
