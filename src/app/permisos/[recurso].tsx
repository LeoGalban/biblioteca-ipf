import { Stack, useLocalSearchParams } from 'expo-router';

import { LibroNoEncontrado } from '@/components/LibroNoEncontrado';
import { PantallaPreviaPermiso } from '@/components/PantallaPreviaPermiso';
import { esRecurso, INFO_PERMISOS } from '@/lib/permisos';

export default function PermisoRecurso() {
  const { recurso } = useLocalSearchParams<{ recurso: string }>();

  // El parámetro llega como texto: solo aceptamos "camara" o "notificaciones".
  if (!esRecurso(recurso)) {
    return (
      <LibroNoEncontrado mensaje={`La app no usa ningún permiso llamado "${recurso}".`} />
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: `Permiso: ${INFO_PERMISOS[recurso].nombre}` }} />
      <PantallaPreviaPermiso recurso={recurso} />
    </>
  );
}
