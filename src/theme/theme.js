
import { MD3LightTheme } from 'react-native-paper';
import { DefaultTheme } from '@react-navigation/native';

export const palette = {
  black: '#000000',
  white: '#FFFFFF',
  gray900: '#111111',
  gray600: '#5C5C5C',
  gray400: '#9A9A9A',
  gray200: '#E3E3E3',
  gray100: '#F4F4F4',
  error: '#C62828',
};

export const theme = {
  ...MD3LightTheme,
  roundness: 3,
  colors: {
    ...MD3LightTheme.colors,
    primary: palette.black,
    onPrimary: palette.white,
    primaryContainer: palette.gray100,
    onPrimaryContainer: palette.black,
    secondary: palette.gray900,
    onSecondary: palette.white,
    secondaryContainer: palette.gray200,
    onSecondaryContainer: palette.black,
    background: palette.white,
    onBackground: palette.black,
    surface: palette.white,
    onSurface: palette.black,
    surfaceVariant: palette.gray100,
    onSurfaceVariant: palette.gray600,
    outline: palette.gray400,
    outlineVariant: palette.gray200,
    error: palette.error,
    onError: palette.white,
    elevation: {
      level0: 'transparent',
      level1: palette.white,
      level2: palette.white,
      level3: palette.white,
      level4: palette.white,
      level5: palette.white,
    },
  },
};

export const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: palette.black,
    background: palette.white,
    card: palette.white,
    text: palette.black,
    border: palette.gray200,
    notification: palette.black,
  },
};
