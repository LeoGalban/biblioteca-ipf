import { StyleSheet, View } from 'react-native';

import { BotonAcceso } from '@/components/BotonAcceso';
import { ESPACIADO } from '@/constants/tema';

// Fila con los accesos a "Buscar" y "Escanear" arriba del Catálogo.
export function AccesosCatalogo() {
  return (
    <View style={styles.fila}>
      <BotonAcceso
        href="/buscar"
        icono="search"
        texto="Buscar"
        descripcion="Por título o autor"
      />
      <BotonAcceso
        href="/escanear"
        icono="barcode-outline"
        texto="Escanear"
        descripcion="El código de la contratapa"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  fila: {
    flexDirection: 'row',
    gap: ESPACIADO.md,
    marginBottom: ESPACIADO.sm,
  },
});
