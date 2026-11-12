import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Button, Card, HelperText, Text } from 'react-native-paper';
import TextInput from '../components/Input';

import useT from '../hooks/useT';
import { useRegistro } from '../context/RegistroContext';
import { useSession } from '../context/SessionContext';
import { useDriver } from '../context/DriverContext';
import { updateDriverProfile } from '../services/driverService';
import { validateProfile } from '../utils/validations';
import { saveLanguage } from '../utils/storage';
import { toDate } from '../utils/format';

export default function ProfileScreen({ navigation }) {
  const { t, lang, locale } = useT();
  const { tab1, setTab1 } = useRegistro();
  const { driver, setDriver, logout } = useSession();
  const { setAvailable } = useDriver();

  const [fullName, setFullName] = useState(driver?.fullName || '');
  const [phone, setPhone] = useState(driver?.phone || '');
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  if (!driver) return null;

  const guardar = async () => {
    const e = validateProfile({ fullName, phone });
    setErrors(e);
    setSaved(false);
    if (Object.keys(e).length > 0) return;
    setBusy(true);
    try {
      await updateDriverProfile(driver.uid, { fullName: fullName.trim(), phone });
      setDriver({ ...driver, fullName: fullName.trim(), phone });
      setSaved(true);
    } catch (err) {
      setErrors({ general: 'err.general' });
    } finally {
      setBusy(false);
    }
  };

  const cambiarIdioma = (next) => {
    setTab1({ ...tab1, language: next });
    saveLanguage(next); // preferencia local
    updateDriverProfile(driver.uid, { language: next }).catch(() => {});
  };

  const salir = async () => {
    await setAvailable(false); // al salir queda No disponible
    await logout();
    // El Drawer está dentro del Stack: se reinicia el Stack para volver al login
    (navigation.getParent() || navigation).reset({ index: 0, routes: [{ name: 'Login' }] });
  };

  // Si el color quedó guardado como texto (registros antiguos), se muestra tal cual
  const colorKey = t('color.' + driver.color);
  const colorName = colorKey.startsWith('color.') ? driver.color : colorKey;

  const fecha = (ts) => {
    const d = toDate(ts);
    return d ? d.toLocaleDateString(locale) : '-';
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20, gap: 16 }}>
      <Card mode="outlined">
        <Card.Title title={t('profile.data')} />
        <Card.Content>
          <TextInput label={t('f.fullName')} value={fullName} onChangeText={setFullName} error={!!errors.fullName} />
          <HelperText type="error" visible={!!errors.fullName}>{t(errors.fullName)}</HelperText>
          <TextInput label={t('f.phone')} value={phone} onChangeText={setPhone} keyboardType="phone-pad" error={!!errors.phone} />
          <HelperText type="error" visible={!!errors.phone}>{t(errors.phone)}</HelperText>
          <Button mode="contained" onPress={guardar} disabled={busy} loading={busy}>
            {t('profile.save')}
          </Button>
          <HelperText type="error" visible={!!errors.general}>{t(errors.general)}</HelperText>
          <HelperText type="info" visible={saved}>{t('profile.saved')}</HelperText>
        </Card.Content>
      </Card>

      <Card mode="outlined">
        <Card.Title title={t('tab.vehiculo')} />
        <Card.Content>
          <Text>{driver.brand} {driver.model} ({driver.year})</Text>
          <Text>{driver.plate} · {colorName}</Text>
          <Text>{t('cat.' + driver.category)} · {driver.capacity} pax</Text>
        </Card.Content>
      </Card>

      <Card mode="outlined">
        <Card.Title title={t('tab.docs')} />
        <Card.Content>
          <Text>{t('f.licenseExpiry')}: {fecha(driver.licenseExpiry)}</Text>
          <Text>{t('f.soatExpiry')}: {fecha(driver.soatExpiry)}</Text>
          {driver.rtmExpiry && <Text>{t('f.rtmExpiry')}: {fecha(driver.rtmExpiry)}</Text>}
        </Card.Content>
      </Card>

      <Card mode="outlined">
        <Card.Title title={t('f.language')} />
        <Card.Content>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Button mode={lang === 'es' ? 'contained' : 'outlined'} onPress={() => cambiarIdioma('es')}>Español</Button>
            <Button mode={lang === 'en' ? 'contained' : 'outlined'} onPress={() => cambiarIdioma('en')}>English</Button>
          </View>
        </Card.Content>
      </Card>

      <Button mode="outlined" onPress={salir}>
        {t('btn.logout')}
      </Button>
    </ScrollView>
  );
}
