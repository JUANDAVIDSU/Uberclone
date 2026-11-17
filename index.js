// ============================================================
// PUNTO DE ENTRADA: lo primero que ejecuta Expo.
// La importación de gesture-handler debe ir primero (la necesita el Drawer).
// ============================================================
import 'react-native-gesture-handler';
import { registerRootComponent } from 'expo';

import App from './App';

registerRootComponent(App);
