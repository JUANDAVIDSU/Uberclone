import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveLanguage = (lang) =>
  AsyncStorage.setItem('language', lang).catch(() => {});

export const loadLanguage = async () => {
  try {
    return await AsyncStorage.getItem('language');
  } catch (e) {
    return null;
  }
};

export const saveAvailable = (uid, value) =>
  AsyncStorage.setItem('available:' + uid, String(value)).catch(() => {});

export const loadAvailable = async (uid) => {
  try {
    return (await AsyncStorage.getItem('available:' + uid)) === 'true';
  } catch (e) {
    return false;
  }
};
