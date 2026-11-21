import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router/js-tabs';
import { StyleSheet } from 'react-native';

import { COLORES, ESPACIADO } from '@/constants/tema';

type IconoTabProps = {
  focused: boolean;
  size: number;
};

// El color sale de tema.ts según si la pestaña está seleccionada.
function colorDeTab(focused: boolean) {
  return focused ? COLORES.primario : COLORES.textoSuave;
}

// La pestaña seleccionada muestra el ícono "lleno"; las otras, el contorno.
function iconoCatalogo({ focused, size }: IconoTabProps) {
  return (
    <Ionicons
      name={focused ? 'library' : 'library-outline'}
      color={colorDeTab(focused)}
      size={size}
    />
  );
}

function iconoReservas({ focused, size }: IconoTabProps) {
  return (
    <Ionicons
      name={focused ? 'bookmark' : 'bookmark-outline'}
      color={colorDeTab(focused)}
      size={size}
    />
  );
}

// En SDK 58 las tabs de JavaScript se importan desde 'expo-router/js-tabs'
// (importar Tabs desde 'expo-router' quedó deprecado).
export default function LayoutTabs() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: COLORES.primario,
        tabBarInactiveTintColor: COLORES.textoSuave,
        tabBarStyle: styles.barra,
        tabBarLabelStyle: styles.etiqueta,
        headerStyle: styles.header,
        headerTintColor: COLORES.textoSobrePrimario,
        headerTitleStyle: styles.tituloHeader,
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="(catalogo)"
        options={{
          title: 'Catálogo',
          headerShown: false,
          tabBarIcon: iconoCatalogo,
        }}
      />
      <Tabs.Screen
        name="reservas"
        options={{
          title: 'Mis reservas',
          tabBarIcon: iconoReservas,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  barra: {
    backgroundColor: COLORES.superficie,
    borderTopColor: COLORES.borde,
    paddingTop: ESPACIADO.xs,
  },
  etiqueta: {
    fontWeight: 'bold',
  },
  header: {
    backgroundColor: COLORES.primario,
  },
  tituloHeader: {
    fontWeight: 'bold',
  },
});
