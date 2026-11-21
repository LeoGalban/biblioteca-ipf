import { StyleSheet, Text, View } from 'react-native';

import { COLORES, TAMANO_TEXTO } from '@/constants/tema';

export default function Inicio() {
  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>Biblioteca IPF</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORES.fondo,
  },
  titulo: {
    fontSize: TAMANO_TEXTO.grande,
    fontWeight: 'bold',
    color: COLORES.primario,
  },
});
