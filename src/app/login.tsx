import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { BotonPrincipal } from '@/components/BotonPrincipal';
import { CajaMensaje } from '@/components/CajaMensaje';
import { Pantalla } from '@/components/Pantalla';
import {
  AREA_TACTIL_MINIMA,
  COLORES,
  ESPACIADO,
  ICONO,
  RADIO,
  TAMANO_TEXTO,
} from '@/constants/tema';
import { useBiblioteca } from '@/hooks/useBiblioteca';
import { credencialesValidas } from '@/lib/sesion';

export default function Login() {
  const { iniciarSesion } = useBiblioteca();
  const [usuario, setUsuario] = useState('');
  const [clave, setClave] = useState('');
  const [error, setError] = useState<string | null>(null);

  function ingresar() {
    if (!credencialesValidas(usuario, clave)) {
      setError('El usuario o la clave no son correctos. Revisalos y probá de nuevo.');
      return;
    }
    // No hace falta navegar: al cambiar la sesión, el guard de /login pasa a
    // false y este modal se cierra solo.
    iniciarSesion();
  }

  return (
    <Pantalla>
      <View style={styles.encabezado}>
        <View style={styles.circulo}>
          <Ionicons name="id-card-outline" size={ICONO.grande} color={COLORES.primario} />
        </View>
        <Text style={styles.titulo}>Personal de biblioteca</Text>
        <Text style={styles.texto}>
          Ingresá para entregar libros desde el mostrador.
        </Text>
      </View>

      <View style={styles.campos}>
        <TextInput
          style={styles.campo}
          value={usuario}
          onChangeText={setUsuario}
          placeholder="Usuario"
          placeholderTextColor={COLORES.textoSuave}
          autoCapitalize="none"
          autoCorrect={false}
          accessibilityLabel="Usuario"
        />
        <TextInput
          style={styles.campo}
          value={clave}
          onChangeText={setClave}
          placeholder="Clave"
          placeholderTextColor={COLORES.textoSuave}
          secureTextEntry
          accessibilityLabel="Clave"
          onSubmitEditing={ingresar}
        />
      </View>

      {error && (
        <View style={styles.error}>
          <CajaMensaje texto={error} tipo="aviso" />
        </View>
      )}

      <BotonPrincipal texto="Ingresar" icono="log-in-outline" onPress={ingresar} />
    </Pantalla>
  );
}

const styles = StyleSheet.create({
  encabezado: {
    alignItems: 'center',
    gap: ESPACIADO.sm,
    marginTop: ESPACIADO.lg,
  },
  circulo: {
    padding: ESPACIADO.lg,
    borderRadius: RADIO.pildora,
    backgroundColor: COLORES.acentoClaro,
  },
  titulo: {
    fontSize: TAMANO_TEXTO.titulo,
    fontWeight: 'bold',
    color: COLORES.texto,
  },
  texto: {
    fontSize: TAMANO_TEXTO.normal,
    color: COLORES.textoSuave,
    textAlign: 'center',
  },
  campos: {
    marginVertical: ESPACIADO.lg,
    gap: ESPACIADO.md,
  },
  campo: {
    minHeight: AREA_TACTIL_MINIMA,
    paddingHorizontal: ESPACIADO.md,
    borderRadius: RADIO.grande,
    borderWidth: 1,
    borderColor: COLORES.borde,
    backgroundColor: COLORES.superficie,
    fontSize: TAMANO_TEXTO.normal,
    color: COLORES.texto,
  },
  error: {
    marginBottom: ESPACIADO.lg,
  },
});
