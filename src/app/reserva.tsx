import { Redirect } from 'expo-router';

// /reserva era la URL de la versión anterior de la app.
// Quien entre por un link viejo termina en /reservas.
export default function ReservaVieja() {
  return <Redirect href="/reservas" />;
}
