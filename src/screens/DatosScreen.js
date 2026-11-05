
import { useState } from 'react';
import { ScrollView } from 'react-native';
import { Button, HelperText, TextInput } from 'react-native-paper';

import { useRegistro } from '../context/RegistroContext';
import { validateTab1 } from '../utils/validations';
import { translate } from '../data/translations';
import Selector from '../components/Selector';
import DateField from '../components/DateField';
import PhotoField from '../components/PhotoField';

export default function DatosScreen({ navigation }) {
  const { tab1, setTab1, serverErrors, setServerErrors } = useRegistro();

  const [touched, setTouched] = useState({});

  // Idioma elegido en el selector (español por defecto) y función de traducción
  const lang = tab1.language || 'es';
  const t = (k) => translate(lang, k);

  // Todos los errores de la pestaña según validations.js
  const all = validateTab1(tab1);

  const err = (k) => (touched[k] ? all[k] : undefined) || serverErrors[k];

  const set = (k, v) => {
    setTab1({ ...tab1, [k]: v });
    setTouched({ ...touched, [k]: true });
    setServerErrors({ ...serverErrors, [k]: undefined });
  };
  
  const field = (k, label, extra = {}) => (
    <>
      <TextInput
        label={label}
        value={tab1[k]}
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
      <PhotoField
        label={t('f.photo')}
        uri={tab1.photo}
        onChange={(u) => set('photo', u)}
        error={t(err('photo'))}
        cameraLabel={t('btn.camera')}
        galleryLabel={t('btn.gallery')}
      />

      {field('fullName', t('f.fullName'))}
      {field('documentId', t('f.documentId'), { keyboardType: 'numeric' })}
      {field('phone', t('f.phone'), { keyboardType: 'phone-pad' })}

      <DateField
        label={t('f.birthDate')}
        value={tab1.birthDate}
        onChange={(d) => set('birthDate', d)}
        error={t(err('birthDate'))}
        locale={lang === 'en' ? 'en-US' : 'es-CO'}
      />

      <Selector
        label={t('f.gender')}
        value={tab1.gender}
        onSelect={(v) => set('gender', v)}
        error={t(err('gender'))}
        options={[
          { value: 'male', label: t('gender.male') },
          { value: 'female', label: t('gender.female') },
          { value: 'other', label: t('gender.other') },
        ]}
      />

      {field('email', t('f.email'), {
        keyboardType: 'email-address',
        autoCapitalize: 'none',
      })}

      <Selector
        label={t('f.language')}
        value={tab1.language}
        onSelect={(v) => set('language', v)}
        error={t(err('language'))}
        options={[
          { value: 'es', label: t('lang.es') },
          { value: 'en', label: t('lang.en') },
        ]}
      />

      {field('password', t('f.password'), { secureTextEntry: true })}
      {field('confirmPassword', t('f.confirmPassword'), { secureTextEntry: true })}

      {/* Siguiente: solo se activa si toda la pestaña 1 es válida */}
      <Button
        mode="contained"
        onPress={() => navigation.navigate('Vehiculo')}
        disabled={Object.keys(all).length > 0}
      >
        {t('btn.next')}
      </Button>
    </ScrollView>
  );
}
