
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { useRegistro } from '../context/RegistroContext';
import { translate } from '../data/translations';
import DatosScreen from '../screens/DatosScreen';
import VehiculoScreen from '../screens/VehiculoScreen';
import DocumentosScreen from '../screens/DocumentosScreen';

const Tab = createBottomTabNavigator();

export default function RegistroTabs() {
  // El idioma sale del selector "Idioma" (por defecto, español)
  const { tab1 } = useRegistro();
  const t = (k) => translate(tab1.language || 'es', k);

  return (
    // headerShown: false porque el título ya lo muestra el Stack (RootNavigator)
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarIcon: () => null,
        tabBarIconStyle: { display: 'none' },
        tabBarActiveTintColor: '#000000',
        tabBarInactiveTintColor: '#9A9A9A',
        tabBarLabelStyle: { fontSize: 14, fontWeight: '700', marginBottom: 12 },
        tabBarStyle: { height: 60, borderTopColor: '#E3E3E3' },
      }}
    >
      <Tab.Screen
        name="Datos"
        component={DatosScreen}
        options={{ title: t('tab.datos') }}
      />
      <Tab.Screen
        name="Vehiculo"
        component={VehiculoScreen}
        options={{ title: t('tab.vehiculo') }}
      />
      <Tab.Screen
        name="Documentos"
        component={DocumentosScreen}
        options={{ title: t('tab.docs') }}
      />
    </Tab.Navigator>
  );
}
