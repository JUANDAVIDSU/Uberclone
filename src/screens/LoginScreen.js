import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Button, HelperText, Text } from 'react-native-paper';

import Input from '../components/Input';
import useT from '../hooks/useT';
import { useRegistro } from '../context/RegistroContext';
import { useSession } from '../context/SessionContext';
import { saveLanguage } from '../utils/storage';

export default function LoginScreen({ navigation }) {
  const { tab1, setTab1 } = useRegistro();
  const { login } = useSession();
  const { t, lang } = useT();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(''); // clave del error (se traduce al mostrarla)

  // Cambia entre español e inglés; el registro hereda esta elección
  const cambiarIdioma = () => {
    const next = lang === 'es' ? 'en' : 'es';
    setTab1({ ...tab1, language: next });
    saveLanguage(next); // se recuerda como preferencia
  };

  const entrar = async () => {
    if (!email.trim() || !password) {
      setError('err.loginRequired');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      // reset: borra el historial para que "atrás" no vuelva al login
      navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
    } catch (e) {
      if (e.message === 'NO_DRIVER') setError('err.noDriver');
      else if (
        e.code === 'auth/invalid-credential' ||
        e.code === 'auth/user-not-found' ||
        e.code === 'auth/wrong-password' ||
        e.code === 'auth/invalid-email'
      )
        setError('err.badCredentials');
      else if (e.code === 'auth/too-many-requests') setError('err.tooMany');
      else if (e.code === 'auth/network-request-failed') setError('err.network');
      else setError('err.loginGeneral');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 28 }}
    >
      {/* Marca */}
      <View style={{ alignItems: 'center', marginBottom: 36 }}>
        <View
          style={{
            width: 76,
            height: 76,
            borderRadius: 22,
            backgroundColor: '#000000',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 16,
          }}
        >
          <Text style={{ color: '#FFFFFF', fontSize: 38, fontWeight: '800' }}>U</Text>
        </View>
        <Text variant="headlineMedium" style={{ fontWeight: '800' }}>
          UberClone
        </Text>
        <Text variant="bodyLarge" style={{ color: '#5C5C5C', marginTop: 4 }}>
          {t('login.title')}
        </Text>
      </View>

      <Input
        label={t('f.email')}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Input
        label={t('f.password')}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ marginTop: 12 }}
      />
      {/* Error debajo del campo de contraseña */}
      <HelperText type="error" visible={!!error}>
        {t(error)}
      </HelperText>

      <Button
        mode="contained"
        onPress={entrar}
        loading={loading}
        disabled={loading}
        contentStyle={{ height: 52 }}
        labelStyle={{ fontSize: 16, fontWeight: '700' }}
      >
        {t('btn.login')}
      </Button>

      <Button
        mode="outlined"
        onPress={() => navigation.navigate('Registro')}
        style={{ marginTop: 12 }}
        contentStyle={{ height: 52 }}
        labelStyle={{ fontSize: 16, fontWeight: '700' }}
      >
        {t('btn.register')}
      </Button>

      <Button mode="text" onPress={cambiarIdioma} style={{ marginTop: 16 }}>
        {t('lang.switch')}
      </Button>
    </ScrollView>
  );
}
