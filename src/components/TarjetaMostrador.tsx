import { StyleSheet, Text, View } from 'react-native';

import { BotonPrincipal } from '@/components/BotonPrincipal';
import { USUARIO_ACTUAL } from '@/constants/biblioteca';
import { COLORES, ESPACIADO, RADIO, TAMANO_TEXTO } from '@/constants/tema';

type Props = {
  titulo: string;
  frente: string | undefined;
  total: number;
  onEntregar: () => void;
};

// Un libro con lista de espera en el mostrador: quién sigue y cuántos esperan.
export function TarjetaMostrador({ titulo, frente, total, onEntregar }: Props) {
  const nombreFrente = frente === USUARIO_ACTUAL ? `${frente} (vos)` : frente;

  return (
    <View style={styles.tarjeta}>
      <Text style={styles.titulo}>{titulo}</Text>
      {frente === undefined ? (
        <Text style={styles.dato}>Nadie está esperando este libro.</Text>
      ) : (
        <>
          <Text style={styles.dato}>Al frente: {nombreFrente}</Text>
          <Text style={styles.dato}>
            {total === 1 ? 'Espera 1 persona.' : `Esperan ${total} personas.`}
          </Text>
        </>
      )}
      <BotonPrincipal
        texto="Entregar al siguiente"
        onPress={onEntregar}
        deshabilitado={frente === undefined}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  tarjeta: {
    padding: ESPACIADO.md,
    borderRadius: RADIO.normal,
    borderWidth: 1,
    borderColor: COLORES.borde,
    backgroundColor: COLORES.superficie,
    gap: ESPACIADO.sm,
  },
  titulo: {
    fontSize: TAMANO_TEXTO.subtitulo,
    fontWeight: 'bold',
    color: COLORES.texto,
  },
  dato: {
    fontSize: TAMANO_TEXTO.normal,
    color: COLORES.textoSuave,
  },
});
