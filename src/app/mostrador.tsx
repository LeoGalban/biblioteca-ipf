import { StyleSheet, Text } from 'react-native';

import { Pantalla } from '@/components/Pantalla';
import { COLORES, TAMANO_TEXTO } from '@/constants/tema';

export default function Mostrador() {
  return (
    <Pantalla centrada>
      <Text style={styles.texto}>Mostrador: libros con lista de espera</Text>
    </Pantalla>
  );
}

const styles = StyleSheet.create({
  texto: {
    fontSize: TAMANO_TEXTO.subtitulo,
    color: COLORES.texto,
  },
});
