import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Switch, Text, View } from 'react-native';

import { BotonPrincipal } from '@/components/BotonPrincipal';
import { PortadaLibro } from '@/components/PortadaLibro';
import { SEGUNDOS_RECORDATORIO } from '@/constants/biblioteca';
import {
  AREA_TACTIL_MINIMA,
  COLORES,
  ESPACIADO,
  ICONO,
  RADIO,
  SOMBRA,
  TAMANO_TEXTO,
} from '@/constants/tema';
import { formatearFecha } from '@/lib/fechas';
import type { Prestamo } from '@/types/biblioteca';

type Props = {
  prestamo: Prestamo;
  onCambiarRecordar: (activo: boolean) => void;
  onDevolver: () => void;
};

// Un préstamo: tapa, fecha de devolución, interruptor "Recordarme" y "Devolver".
export function TarjetaPrestamo({ prestamo, onCambiarRecordar, onDevolver }: Props) {
  return (
    <View style={styles.tarjeta}>
      <View style={styles.cabecera}>
        <PortadaLibro isbn={prestamo.isbn} titulo={prestamo.titulo} />
        <View style={styles.textos}>
          <Text style={styles.titulo} numberOfLines={2}>
            {prestamo.titulo}
          </Text>
          <View style={styles.vence}>
            <Ionicons name="calendar-outline" size={ICONO.chico} color={COLORES.acento} />
            <Text style={styles.textoVence}>
              Devolvelo antes del {formatearFecha(prestamo.vence)}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.recordar}>
        <Text style={styles.textoRecordar}>Recordarme</Text>
        <Switch
          value={prestamo.recordar}
          onValueChange={onCambiarRecordar}
          accessibilityLabel={`Recordarme devolver ${prestamo.titulo}`}
          trackColor={{ true: COLORES.primario, false: COLORES.borde }}
          thumbColor={COLORES.superficie}
        />
      </View>
      {prestamo.recordatorioId && (
        <Text style={styles.estadoRecordatorio}>
          Recordatorio programado: llega en {SEGUNDOS_RECORDATORIO} segundos (modo
          demostración).
        </Text>
      )}

      <BotonPrincipal
        texto="Devolver"
        icono="return-down-back"
        onPress={onDevolver}
        secundario
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
    gap: ESPACIADO.sm,
  },
  titulo: {
    fontSize: TAMANO_TEXTO.subtitulo,
    fontWeight: 'bold',
    color: COLORES.texto,
  },
  vence: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ESPACIADO.xs,
  },
  textoVence: {
    flex: 1,
    fontSize: TAMANO_TEXTO.chico,
    color: COLORES.textoSuave,
  },
  recordar: {
    minHeight: AREA_TACTIL_MINIMA,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: ESPACIADO.md,
    borderRadius: RADIO.normal,
    backgroundColor: COLORES.fondo,
  },
  textoRecordar: {
    fontSize: TAMANO_TEXTO.normal,
    fontWeight: 'bold',
    color: COLORES.texto,
  },
  estadoRecordatorio: {
    fontSize: TAMANO_TEXTO.chico,
    color: COLORES.exito,
  },
});
