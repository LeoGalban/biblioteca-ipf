import { StyleSheet, Switch, Text, View } from 'react-native';

import { BotonPrincipal } from '@/components/BotonPrincipal';
import { SEGUNDOS_RECORDATORIO } from '@/constants/biblioteca';
import {
  AREA_TACTIL_MINIMA,
  COLORES,
  ESPACIADO,
  RADIO,
  TAMANO_TEXTO,
} from '@/constants/tema';
import { formatearFecha } from '@/lib/fechas';
import type { Prestamo } from '@/types/biblioteca';

type Props = {
  prestamo: Prestamo;
  onCambiarRecordar: (activo: boolean) => void;
  onDevolver: () => void;
};

// Un préstamo: fecha de devolución, interruptor "Recordarme" y botón "Devolver".
export function TarjetaPrestamo({ prestamo, onCambiarRecordar, onDevolver }: Props) {
  return (
    <View style={styles.tarjeta}>
      <Text style={styles.titulo}>{prestamo.titulo}</Text>
      <Text style={styles.vence}>
        Devolvelo antes del {formatearFecha(prestamo.vence)}
      </Text>

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

      <BotonPrincipal texto="Devolver" onPress={onDevolver} secundario />
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
  vence: {
    fontSize: TAMANO_TEXTO.normal,
    color: COLORES.textoSuave,
  },
  recordar: {
    minHeight: AREA_TACTIL_MINIMA,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textoRecordar: {
    fontSize: TAMANO_TEXTO.normal,
    color: COLORES.texto,
  },
  estadoRecordatorio: {
    fontSize: TAMANO_TEXTO.chico,
    color: COLORES.exito,
  },
});
