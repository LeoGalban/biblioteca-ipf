import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router/js-tabs';

import { COLORES } from '@/constants/tema';

type IconoTabProps = {
  focused: boolean;
  size: number;
};

// El color sale de tema.ts según si la pestaña está seleccionada.
function colorDeTab(focused: boolean) {
  return focused ? COLORES.primario : COLORES.textoSuave;
}

function iconoCatalogo({ focused, size }: IconoTabProps) {
  return (
    <Ionicons name="library-outline" color={colorDeTab(focused)} size={size} />
  );
}

function iconoReservas({ focused, size }: IconoTabProps) {
  return (
    <Ionicons name="bookmark-outline" color={colorDeTab(focused)} size={size} />
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
        headerTintColor: COLORES.primario,
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
