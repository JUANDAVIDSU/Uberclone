import { useState } from 'react';
import { ScrollView } from 'react-native';
import { Button, HelperText } from 'react-native-paper';
import TextInput from '../components/Input';
import { useRegistro } from '../context/RegistroContext';
import { validateTab2 } from '../utils/validations';
import { translate } from '../data/translations';
import Selector from '../components/Selector';
import PhotoField from '../components/PhotoField';

export default function VehiculoScreen({ navigation }) {
  const { tab1, tab2, setTab2 } = useRegistro();

  const [touched, setTouched] = useState({});

  // Idioma elegido en la pestaña 1 (español por defecto)
  const t = (k) => translate(tab1.language || 'es', k);

  const all = validateTab2(tab2);
  const err = (k) => (touched[k] ? all[k] : undefined);

  const set = (k, v) => {
    setTab2((prev) => ({ ...prev, [k]: v }));
    setTouched((prev) => ({ ...prev, [k]: true }));
  };

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

      {field('color', t('f.color'))}
      {field('capacity', t('f.capacity'), { keyboardType: 'numeric' })}

      <PhotoField
        label={t('f.vehiclePhoto')}
        uri={tab2.vehiclePhoto}
        onChange={(u) => set('vehiclePhoto', u)}
        error={t(err('vehiclePhoto'))}
        cameraLabel={t('btn.camera')}
        galleryLabel={t('btn.gallery')}
      />

      {/* Siguiente: solo se activa si toda la pestaña 2 es válida */}
      <Button
        mode="contained"
        onPress={() => navigation.navigate('Documentos')}
        disabled={Object.keys(all).length > 0}
      >
        {t('btn.next')}
      </Button>
    </ScrollView>
  );
}
