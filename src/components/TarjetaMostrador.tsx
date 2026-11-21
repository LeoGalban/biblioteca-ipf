import { StyleSheet, Text, View } from 'react-native';

import { BotonPrincipal } from '@/components/BotonPrincipal';
import { Insignia } from '@/components/Insignia';
import { PortadaLibro } from '@/components/PortadaLibro';
import { USUARIO_ACTUAL } from '@/constants/biblioteca';
import { COLORES, ESPACIADO, RADIO, SOMBRA, TAMANO_TEXTO } from '@/constants/tema';

type Props = {
  isbn: string;
  titulo: string;
  frente: string | undefined;
  total: number;
  onEntregar: () => void;
};

// Un libro con lista de espera en el mostrador: quién sigue y cuántos esperan.
export function TarjetaMostrador({ isbn, titulo, frente, total, onEntregar }: Props) {
  const nombreFrente = frente === USUARIO_ACTUAL ? `${frente} (vos)` : frente;
  const vacia = frente === undefined;

  return (
    <View style={styles.tarjeta}>
      <View style={styles.cabecera}>
        <PortadaLibro isbn={isbn} titulo={titulo} />
        <View style={styles.textos}>
          <Text style={styles.titulo} numberOfLines={2}>
            {titulo}
          </Text>
          {vacia ? (
            <Text style={styles.dato}>Nadie está esperando este libro.</Text>
          ) : (
            <>
              <Text style={styles.dato}>Al frente: {nombreFrente}</Text>
              <Insignia
                texto={total === 1 ? 'Espera 1 persona' : `Esperan ${total} personas`}
                tipo="aviso"
              />
            </>
          )}
        </View>
      </View>
      {/* Con la lista vacía el botón queda deshabilitado (no hay a quién entregar). */}
      <BotonPrincipal
        texto="Entregar al siguiente"
        icono="hand-right-outline"
        onPress={onEntregar}
        deshabilitado={vacia}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  tarjeta: {
    padding: ESPACIADO.lg,
    borderRadius: RADIO.grande,
    backgroundColor: COLORES.superficie,
    gap: ESPACIADO.md,
    ...SOMBRA,
  },
  cabecera: {
    flexDirection: 'row',
    gap: ESPACIADO.md,
  },
  textos: {
    flex: 1,
    gap: ESPACIADO.xs,
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
