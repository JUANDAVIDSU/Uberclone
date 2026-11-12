import { createDrawerNavigator } from '@react-navigation/drawer';

import useT from '../hooks/useT';
import HomeScreen from '../screens/HomeScreen';
import EarningsScreen from '../screens/EarningsScreen';
import HistoryScreen from '../screens/HistoryScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Drawer = createDrawerNavigator();

export default function MainDrawer() {
  const { t } = useT();
  return (
    <Drawer.Navigator
      initialRouteName="Inicio"
      screenOptions={{
        headerShadowVisible: false,
        headerTitleStyle: { fontWeight: '700' },
        drawerActiveTintColor: '#000000',
        drawerActiveBackgroundColor: '#F4F4F4',
        drawerInactiveTintColor: '#5C5C5C',
        drawerLabelStyle: { fontWeight: '600' },
      }}
    >
      <Drawer.Screen name="Inicio" component={HomeScreen} options={{ title: t('home.title') }} />
      <Drawer.Screen name="Ganancias" component={EarningsScreen} options={{ title: t('earn.title') }} />
      <Drawer.Screen name="Historial" component={HistoryScreen} options={{ title: t('hist.title') }} />
      <Drawer.Screen name="Perfil" component={ProfileScreen} options={{ title: t('profile.title') }} />
    </Drawer.Navigator>
  );
}
