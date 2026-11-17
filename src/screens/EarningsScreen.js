import { useCallback, useState } from 'react';
import { Alert, ScrollView, View } from 'react-native';
import { ActivityIndicator, Button, Card, Divider, Text } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';

import useT from '../hooks/useT';
import useEarnings from '../hooks/useEarnings';
import { useSession } from '../context/SessionContext';
import { getDriverTrips } from '../services/tripService';
import { createWithdrawalRequest, getWithdrawalRequests } from '../services/withdrawalService';
import { formatCOP } from '../utils/format';

export default function EarningsScreen() {
  const { t, lang } = useT();
  const { driver, refreshDriver } = useSession();
  const uid = driver?.uid;
  const [trips, setTrips] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [withdrawing, setWithdrawing] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    if (!uid) return;
    setLoading(true);
    try {
      const [list, requests] = await Promise.all([
        getDriverTrips(uid),
        getWithdrawalRequests(),
      ]);
      setTrips(list);
      setWithdrawals(requests.withdrawals || []);
    } catch (e) {
      // Si el backend aún no está desplegado, se conservan las ganancias visibles.
      setError(e.message === 'WITHDRAWAL_API_NOT_CONFIGURED'
        ? (lang === 'en' ? 'Withdrawal service is not configured yet.' : 'El servicio de retiros aún no está configurado.')
        : (lang === 'en' ? 'Could not load withdrawal requests.' : 'No se pudieron cargar las solicitudes de retiro.'));
      getDriverTrips(uid).then(setTrips).catch(() => {});
    } finally {
      setLoading(false);
    }
  }, [uid, lang]);

  useFocusEffect(useCallback(() => { load(); }, [load]));
  useFocusEffect(useCallback(() => { refreshDriver(); }, []));

  const earnings = useEarnings(trips);
  const wallet = driver?.wallet || {};
  const balance = Number(wallet.balance || earnings.balance || 0);
  const reserved = Number(wallet.reservedBalance || 0);
  const available = Math.max(0, balance - reserved);

  const withdraw = async () => {
    if (available < 1000) {
      Alert.alert(
        lang === 'en' ? 'Minimum withdrawal' : 'Retiro mínimo',
        lang === 'en' ? 'You need at least $1,000 COP available.' : 'Necesitas tener al menos $1.000 COP disponibles.'
      );
      return;
    }
    setWithdrawing(true);
    setError('');
    try {
      const result = await createWithdrawalRequest();
      Alert.alert(
        lang === 'en' ? 'Request created' : 'Solicitud creada',
        (lang === 'en' ? 'Your withdrawal request for ' : 'Tu solicitud de retiro por ') +
          formatCOP(result.amount) +
          (lang === 'en' ? ' was sent. The transfer will be made manually to your Mercado Pago account.' : ' fue enviada. La transferencia se realizará manualmente a tu cuenta de Mercado Pago.')
      );
      await load();
    } catch (e) {
      const messages = {
        INSUFFICIENT_BALANCE: lang === 'en' ? 'There is no available balance to withdraw.' : 'No tienes saldo disponible para retirar.',
        MP_EMAIL_MISSING: lang === 'en' ? 'Register your Mercado Pago email first.' : 'Primero registra tu correo de Mercado Pago.',
        DRIVER_NOT_APPROVED: lang === 'en' ? 'Your driver account is not approved.' : 'Tu cuenta de conductor no está aprobada.',
        WITHDRAWAL_API_NOT_CONFIGURED: lang === 'en' ? 'Withdrawal service is not configured.' : 'El servicio de retiros no está configurado.',
      };
      Alert.alert(lang === 'en' ? 'Could not request withdrawal' : 'No se pudo solicitar el retiro', messages[e.message] || e.message);
    } finally {
      setWithdrawing(false);
    }
  };

  const row = (label, value, bold = false) => (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 3 }}>
      <Text variant="bodyMedium" style={{ color: bold ? '#000000' : '#5C5C5C' }}>{label}</Text>
      <Text variant={bold ? 'titleMedium' : 'bodyMedium'} style={{ fontWeight: bold ? '800' : '500' }}>{value}</Text>
    </View>
  );

  const period = (title, d) => (
    <Card mode="outlined">
      <Card.Content>
        <Text variant="titleMedium" style={{ fontWeight: '800', marginBottom: 8 }}>{title}</Text>
        {row(t('earn.net'), formatCOP(d.net), true)}
        <Divider style={{ marginVertical: 8 }} />
        {row(t('earn.trips'), String(d.count))}
        {row(t('earn.billed'), formatCOP(d.billed))}
        {row(t('earn.commissions'), formatCOP(d.commissions))}
        {row(t('earn.tips'), formatCOP(d.tips))}
        {row(t('earn.average'), formatCOP(d.average))}
      </Card.Content>
    </Card>
  );

  if (loading) return <ActivityIndicator style={{ marginTop: 40 }} />;

  return (
    <ScrollView contentContainerStyle={{ padding: 20, gap: 16 }}>
      <Card mode="contained" style={{ backgroundColor: '#000000' }}>
        <Card.Content style={{ paddingVertical: 8 }}>
          <Text variant="labelLarge" style={{ color: '#BDBDBD' }}>{t('earn.balance')}</Text>
          <Text style={{ color: '#FFFFFF', fontSize: 38, fontWeight: '800', marginVertical: 4 }}>{formatCOP(balance)}</Text>
          <Text variant="bodySmall" style={{ color: '#BDBDBD' }}>
            {lang === 'en' ? 'Available to withdraw: ' : 'Disponible para retirar: '}{formatCOP(available)}
          </Text>
          {reserved > 0 && (
            <Text variant="bodySmall" style={{ color: '#FFD580', marginTop: 4 }}>
              {lang === 'en' ? 'Reserved in pending requests: ' : 'Reservado en solicitudes pendientes: '}{formatCOP(reserved)}
            </Text>
          )}
          <Text variant="labelSmall" style={{ color: '#8A8A8A', marginTop: 8 }}>{t('earn.balanceNote')}</Text>
        </Card.Content>
      </Card>

      <Card mode="outlined">
        <Card.Content style={{ gap: 8 }}>
          <Text variant="titleMedium" style={{ fontWeight: '800' }}>
            {lang === 'en' ? 'Withdraw to Mercado Pago' : 'Retirar a Mercado Pago'}
          </Text>
          <Text>{lang === 'en' ? 'Account: ' : 'Cuenta: '}{driver?.payments?.mercadoPagoEmail  || (lang === 'en' ? 'Not registered' : 'No registrada')}</Text>
          <Text variant="bodySmall">
            {lang === 'en'
              ? 'The request reserves your available balance. The platform administrator will make the Mercado Pago transfer manually.'
              : 'La solicitud reserva tu saldo disponible. El administrador de la plataforma realizará manualmente la transferencia por Mercado Pago.'}
          </Text>
          <Button mode="contained" icon="cash-multiple" onPress={withdraw}
            loading={withdrawing} disabled={withdrawing || available < 1000 || !driver?.payments?.mercadoPagoEmail}>
            {lang === 'en' ? 'Request withdrawal' : 'Solicitar retiro'}
          </Button>
          {!!error && <Text style={{ color: '#B00020' }}>{error}</Text>}
        </Card.Content>
      </Card>

      <Card mode="outlined">
        <Card.Content>
          <Text variant="titleMedium" style={{ fontWeight: '800', marginBottom: 8 }}>
            {lang === 'en' ? 'Withdrawal history' : 'Historial de retiros'}
          </Text>
          {withdrawals.length === 0 ? (
            <Text>{lang === 'en' ? 'No withdrawal requests yet.' : 'Aún no tienes solicitudes de retiro.'}</Text>
          ) : withdrawals.map((item) => (
            <View key={item.id} style={{ paddingVertical: 9, borderBottomWidth: 1, borderBottomColor: '#EEEEEE' }}>
              {row(formatCOP(item.amount), item.status === 'pending'
                ? (lang === 'en' ? 'Pending' : 'Pendiente')
                : item.status === 'paid'
                  ? (lang === 'en' ? 'Paid' : 'Pagado')
                  : (lang === 'en' ? 'Rejected' : 'Rechazado'))}
              {!!item.createdAt && <Text variant="labelSmall" style={{ color: '#777777' }}>{new Date(item.createdAt).toLocaleString(lang === 'en' ? 'en-US' : 'es-CO')}</Text>}
            </View>
          ))}
        </Card.Content>
      </Card>

      {period(t('earn.today'), earnings.today)}
      {period(t('earn.week'), earnings.week)}
      {period(t('earn.month'), earnings.month)}
    </ScrollView>
  );
}
