
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { useRegistro } from '../context/RegistroContext';
import { translate } from '../data/translations';
import DatosScreen from '../screens/DatosScreen';
import VehiculoScreen from '../screens/VehiculoScreen';

const Tab = createBottomTabNavigator();

export default function RegistroTabs() {
  const { tab1 } = useRegistro();
  const t = (k) => translate(tab1.language || 'es', k);

  return (
    <Tab.Navigator screenOptions={{ tabBarIcon: () => null }}>
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
    </Tab.Navigator>
  );
}
