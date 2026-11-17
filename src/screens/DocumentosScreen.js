
import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { Button, HelperText, Text } from 'react-native-paper';
import TextInput from '../components/Input';

import { useRegistro } from '../context/RegistroContext';
import {
  validateTab1,
  validateTab2,
  validateTab3,
  rtmApplies,
} from '../utils/validations';
import { registerDriver } from '../services/driverService';
import { translate } from '../data/translations';
import { PRICING } from '../config/pricing';
import PhotoField from '../components/PhotoField';
import DateField from '../components/DateField';

export default function DocumentosScreen({ navigation }) {
  const { tab1, tab2, tab3, setTab3, serverErrors, setServerErrors, reset } =
    useRegistro();

  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  
  const lang = tab1.language || 'es';
  const t = (k) => translate(lang, k);
  const locale = lang === 'en' ? 'en-US' : 'es-CO';

    const rtmAplica = rtmApplies(tab2.year);

  const all = validateTab3(tab3, tab2.year);
  const err = (k) => (touched[k] ? all[k] : undefined);

  const set = (k, v) => {
    setTab3((prev) => ({ ...prev, [k]: v }));
    setTouched((prev) => ({ ...prev, [k]: true }));
  };

  const valido =
    Object.keys(validateTab1(tab1)).length === 0 &&
    Object.keys(validateTab2(tab2)).length === 0 &&
    Object.keys(all).length === 0;

  const doc = (photoKey, expiryKey, photoLabel, expiryLabel) => (
    <>
      <PhotoField
        label={t(photoLabel)}
        uri={tab3[photoKey]}
        onChange={(u) => set(photoKey, u)}
        error={t(err(photoKey))}
        cameraLabel={t('btn.camera')}
        galleryLabel={t('btn.gallery')}
      />
      <DateField
        label={t(expiryLabel)}
        value={tab3[expiryKey]}
        onChange={(d) => set(expiryKey, d)}
        error={t(err(expiryKey))}
        locale={locale}
        future
      />
    </>
  );

  const enviar = async () => {
    setLoading(true);
    setServerErrors({});
    try {
      const { password, confirmPassword, ...datos } = tab1;
      const docs = rtmAplica
        ? tab3
        : { ...tab3, rtmPhoto: null, rtmExpiry: null };
      await registerDriver(
        {
          ...datos,
          ...tab2,
          ...docs,
          acceptedCommissionRate: PRICING.commissionRate,
        },
        password
      );
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
      {/* Licencia: número + foto + vencimiento */}
      <TextInput
        label={t('f.licenseNumber')}
        value={tab3.licenseNumber}
        onChangeText={(x) => set('licenseNumber', x)}
        error={!!err('licenseNumber')}
        keyboardType="numeric"
      />
      <HelperText type="error" visible={!!err('licenseNumber')}>
        {t(err('licenseNumber'))}
      </HelperText>
      {doc('licensePhoto', 'licenseExpiry', 'f.licensePhoto', 'f.licenseExpiry')}

      {/* SOAT: foto + vencimiento */}
      {doc('soatPhoto', 'soatExpiry', 'f.soatPhoto', 'f.soatExpiry')}

      {/* Revisión técnico-mecánica: solo si aplica según el año del vehículo */}
      {rtmAplica ? (
        doc('rtmPhoto', 'rtmExpiry', 'f.rtmPhoto', 'f.rtmExpiry')
      ) : (
        <HelperText type="info" visible>
          {t('msg.rtmNotRequired')}
        </HelperText>
      )}

      {/* Correo donde se recibirían los pagos (Mercado Pago) */}
      <TextInput
        label={t('f.mpEmail')}
        value={tab3.mpEmail}
        onChangeText={(x) => set('mpEmail', x)}
        error={!!err('mpEmail')}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <HelperText type="error" visible={!!err('mpEmail')}>
        {t(err('mpEmail'))}
      </HelperText>

      {/* Términos con el porcentaje de comisión visible */}
      <Pressable
        onPress={() => set('terms', !tab3.terms)}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: tab3.terms }}
        style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12, paddingVertical: 10 }}
      >
        {/* Casilla propia: queda marcada hasta que se vuelva a tocar */}
        <View
          style={{
            width: 26,
            height: 26,
            borderRadius: 7,
            borderWidth: 2,
            borderColor: '#000000',
            backgroundColor: tab3.terms ? '#000000' : '#FFFFFF',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {tab3.terms && (
            <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '800', lineHeight: 20 }}>✓</Text>
          )}
        </View>
        <Text style={{ flex: 1 }}>{t('f.terms').replace('{pct}', PRICING.commissionRate * 100)}</Text>
      </Pressable>
      <HelperText type="error" visible={!!err('terms')}>
        {t(err('terms'))}
      </HelperText>

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

      {/* Después de registrarse: limpia el formulario y vuelve al login */}
      {done && (
        <Button
          mode="outlined"
          onPress={() => {
            reset();
            navigation.navigate('Login');
          }}
        >
          {t('btn.goLogin')}
        </Button>
      )}
    </ScrollView>
  );
}
