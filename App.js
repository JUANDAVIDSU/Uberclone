
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider } from 'react-native-paper';

import { RegistroProvider } from './src/context/RegistroContext';
import RegistroTabs from './src/navigation/RegistroTabs';

export default function App() {
  return (
    <RegistroProvider>
      <SafeAreaProvider>
        <PaperProvider>
          <NavigationContainer>
            <RegistroTabs />
          </NavigationContainer>
        </PaperProvider>
      </SafeAreaProvider>
    </RegistroProvider>
  );
}
