import { CajaMensaje } from '@/components/CajaMensaje';
import type { EstadoPermiso } from '@/lib/permisos';

type Props = {
  estado: EstadoPermiso;
};

// Línea de "Mis reservas" que dice si las notificaciones están permitidas.
export function EstadoNotificaciones({ estado }: Props) {
  if (estado === 'cargando') {
    return null;
  }

  if (estado === 'concedido') {
    return (
      <CajaMensaje
        texto="Notificaciones activadas: te avisamos aunque la app esté cerrada."
        tipo="exito"
      />
    );
  }

  return (
    <CajaMensaje
      texto="Notificaciones desactivadas: los recordatorios y avisos te aparecen acá."
      tipo="info"
    />
  );
}
