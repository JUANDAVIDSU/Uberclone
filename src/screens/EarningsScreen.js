
import { useCallback, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { ActivityIndicator, Card, Divider, Text } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';

import useT from '../hooks/useT';
import useEarnings from '../hooks/useEarnings';
import { useSession } from '../context/SessionContext';
import { getDriverTrips } from '../services/tripService';
import { formatCOP } from '../utils/format';

export default function EarningsScreen() {
  const { t } = useT();
  const { driver, refreshDriver } = useSession();
  const uid = driver?.uid;
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  useFocusEffect(
    useCallback(() => {
      refreshDriver();
    
    }, [])
  );


  useFocusEffect(
    useCallback(() => {
      if (!uid) return undefined;
      let active = true;
      getDriverTrips(uid)
        .then((list) => active && setTrips(list))
        .catch(() => {})
        .finally(() => active && setLoading(false));
      return () => {
        active = false;
      };
    }, [uid])
  );

  const earnings = useEarnings(trips);

  const wallet = driver?.wallet;
  const balance = wallet ? wallet.balance || 0 : earnings.balance;

  const row = (label, value, bold = false) => (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 3 }}>
      <Text variant="bodyMedium" style={{ color: bold ? '#000000' : '#5C5C5C' }}>{label}</Text>
      <Text variant={bold ? 'titleMedium' : 'bodyMedium'} style={{ fontWeight: bold ? '800' : '500' }}>
        {value}
      </Text>
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
      {/* Saldo del usuario */}
      <Card mode="contained" style={{ backgroundColor: '#000000' }}>
        <Card.Content style={{ paddingVertical: 8 }}>
          <Text variant="labelLarge" style={{ color: '#BDBDBD' }}>{t('earn.balance')}</Text>
          <Text style={{ color: '#FFFFFF', fontSize: 38, fontWeight: '800', marginVertical: 4 }}>
            {formatCOP(balance)}
          </Text>
          {wallet && (
            <Text variant="bodySmall" style={{ color: '#BDBDBD' }}>
              {t('earn.totalEarned')}: {formatCOP(wallet.totalEarned || 0)} · {t('earn.trips')}: {wallet.tripsPaid || 0}
            </Text>
          )}
          <Text variant="labelSmall" style={{ color: '#8A8A8A', marginTop: 8 }}>
            {t('earn.balanceNote')}
          </Text>
        </Card.Content>
      </Card>

      {period(t('earn.today'), earnings.today)}
      {period(t('earn.week'), earnings.week)}
      {period(t('earn.month'), earnings.month)}
    </ScrollView>
  );
}
