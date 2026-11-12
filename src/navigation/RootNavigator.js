import { createNativeStackNavigator } from '@react-navigation/native-stack';

import useT from '../hooks/useT';
import LoginScreen from '../screens/LoginScreen';
import RequestScreen from '../screens/RequestScreen';
import TripScreen from '../screens/TripScreen';
import PaymentScreen from '../screens/PaymentScreen';
import TripDetailScreen from '../screens/TripDetailScreen';
import RegistroTabs from './RegistroTabs';
import MainDrawer from './MainDrawer';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { t } = useT();

  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShadowVisible: false,
        headerTitleStyle: { fontWeight: '700' },
        headerBackTitle: '',
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />

      {/* La flecha de la barra regresa al login */}
      <Stack.Screen name="Registro" component={RegistroTabs} options={{ title: t('reg.title') }} />

      {/* El Drawer trae su propia barra */}
      <Stack.Screen
        name="Main"
        component={MainDrawer}
        options={{ headerShown: false, gestureEnabled: false }}
      />

      {/* Flujo del viaje */}
      <Stack.Screen name="Solicitud" component={RequestScreen} options={{ title: t('req.title'), headerBackVisible: false, gestureEnabled: false }} />
      <Stack.Screen name="Viaje" component={TripScreen} options={{ title: t('trip.title'), headerBackVisible: false, gestureEnabled: false }} />
      <Stack.Screen name="Cobro" component={PaymentScreen} options={{ title: t('pay.title'), headerBackVisible: false, gestureEnabled: false }} />
      <Stack.Screen name="DetalleViaje" component={TripDetailScreen} options={{ title: t('detail.title') }} />
    </Stack.Navigator>
  );
}
