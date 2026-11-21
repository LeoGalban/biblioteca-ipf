import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text } from 'react-native';

import { Pantalla } from '@/components/Pantalla';
import { COLORES, TAMANO_TEXTO } from '@/constants/tema';

export default function PantallaPreviaPermiso() {
  const { recurso } = useLocalSearchParams<{ recurso: string }>();

  return (
    <Pantalla centrada>
      <Text style={styles.texto}>Permiso de {recurso}</Text>
    </Pantalla>
  );
}

const styles = StyleSheet.create({
  texto: {
    fontSize: TAMANO_TEXTO.subtitulo,
    color: COLORES.texto,
  },
});
