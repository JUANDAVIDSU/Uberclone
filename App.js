// ============================================================
// APP: el componente principal.
// Envuelve la app con todo lo que las pantallas necesitan.
// ============================================================
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider } from 'react-native-paper';

import { RegistroProvider } from './src/context/RegistroContext';
import { SessionProvider } from './src/context/SessionContext';
import { DriverProvider } from './src/context/DriverContext';
import RootNavigator from './src/navigation/RootNavigator';
import { navTheme, theme } from './src/theme/theme';

export default function App() {
  return (
    // De afuera hacia adentro: Registro -> Sesión -> Conductor -> SafeArea -> Paper -> navegación
    <RegistroProvider>
      <SessionProvider>
        <DriverProvider>
          <SafeAreaProvider>
            <PaperProvider theme={theme}>
              <StatusBar style="dark" />
              <NavigationContainer theme={navTheme}>
                <RootNavigator />
              </NavigationContainer>
            </PaperProvider>
          </SafeAreaProvider>
        </DriverProvider>
      </SessionProvider>
    </RegistroProvider>
  );
}
