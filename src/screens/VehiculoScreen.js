import { useState } from 'react';
import { ScrollView } from 'react-native';
import { Button, HelperText, TextInput } from 'react-native-paper';
import { useRegistro } from '../context/RegistroContext';
import { validateTab1, validateTab2 } from '../utils/validations';
import { registerDriver } from '../services/driverService';
import { translate } from '../data/translations';
import Selector from '../components/Selector';
import PhotoField from '../components/PhotoField';

export default function VehiculoScreen({ navigation }) {
  const { tab1, tab2, setTab2, serverErrors, setServerErrors } = useRegistro();

  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false); 
  const [done, setDone] = useState(false); 

  // Idioma elegido en la pestaña 1 (español por defecto)
  const t = (k) => translate(tab1.language || 'es', k);

  const all = validateTab2(tab2);
  const err = (k) => (touched[k] ? all[k] : undefined);

  const set = (k, v) => {
    setTab2({ ...tab2, [k]: v });
    setTouched({ ...touched, [k]: true });
  };

  const valido =
    Object.keys(validateTab1(tab1)).length === 0 &&
    Object.keys(all).length === 0;
  const field = (k, label, extra = {}) => (
    <>
      <TextInput
        label={label}
        value={tab2[k]}
        onChangeText={(t) => set(k, t)}
        error={!!err(k)}
        {...extra}
      />
      <HelperText type="error" visible={!!err(k)}>
        {t(err(k))}
      </HelperText>
    </>
  );

  const enviar = async () => {
    setLoading(true);
    setServerErrors({});
    try {
      const { password, confirmPassword, ...datos } = tab1;
      await registerDriver({ ...datos, ...tab2 }, password);
      setDone(true);
    } catch (e) {
      if (e.message === 'DOCUMENT_EXISTS') {
        setServerErrors({ documentId: 'err.docExists' });
        navigation.navigate('Datos');
      } else if (e.code === 'auth/email-already-in-use') {
        setServerErrors({ email: 'err.emailExists' });
        navigation.navigate('Datos');
      } else {
        setServerErrors({ general: 'err.general' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Selector
        label={t('f.category')}
        value={tab2.category}
        onSelect={(v) => set('category', v)}
        error={t(err('category'))}
        options={[
          { value: 'economy', label: t('cat.economy') },
          { value: 'xl', label: t('cat.xl') },
          { value: 'premium', label: t('cat.premium') },
        ]}
      />

      {field('plate', t('f.plate'), { autoCapitalize: 'characters' })}
      {field('brand', t('f.brand'))}
      {field('model', t('f.model'))}
      {field('year', t('f.year'), { keyboardType: 'numeric' })}

      <Selector
        label={t('f.color')}
        value={tab2.color}
        onSelect={(v) => set('color', v)}
        error={t(err('color'))}
        options={['white', 'black', 'gray', 'red', 'blue'].map((c) => ({
          value: c,
          label: t('color.' + c),
        }))}
      />

      {field('capacity', t('f.capacity'), { keyboardType: 'numeric' })}

      <PhotoField
        label={t('f.vehiclePhoto')}
        uri={tab2.vehiclePhoto}
        onChange={(u) => set('vehiclePhoto', u)}
        error={t(err('vehiclePhoto'))}
        cameraLabel={t('btn.camera')}
        galleryLabel={t('btn.gallery')}
      />

      <Button
        mode="contained"
        onPress={enviar}
        disabled={!valido || loading || done}
        loading={loading}
      >
        {t('btn.send')}
      </Button>

      <HelperText type="error" visible={!!serverErrors.general}>
        {t(serverErrors.general)}
      </HelperText>
      
      <HelperText type="info" visible={done}>
        {t('msg.success')}
      </HelperText>
    </ScrollView>
  );
}
