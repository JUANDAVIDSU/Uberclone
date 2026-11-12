import { useCallback, useMemo, useState } from 'react';
import { FlatList, View } from 'react-native';
import { ActivityIndicator, Card, Chip, Text } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';

import useT from '../hooks/useT';
import DateField from '../components/DateField';
import { useSession } from '../context/SessionContext';
import { getDriverTrips } from '../services/tripService';
import { filterTrips, tripDate } from '../utils/dates';
import { formatCOP } from '../utils/format';
import { PAGE_SIZE } from '../config/pricing';

const PERIODS = ['all', 'today', 'week', 'month', 'range'];
const METHODS = ['all', 'cash', 'mercadopago', 'stripe'];
const SHOWN = ['completed', 'paid', 'cancelled'];

export default function HistoryScreen({ navigation }) {
  const { t, locale } = useT();
  const { driver } = useSession();

  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('all');
  const [method, setMethod] = useState('all');
  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);
  const [limit, setLimit] = useState(PAGE_SIZE);

  useFocusEffect(
    useCallback(() => {
      if (!driver) return undefined;
      let active = true;
      getDriverTrips(driver.uid)
        .then((list) => active && setTrips(list.filter((x) => SHOWN.includes(x.status))))
        .catch(() => {})
        .finally(() => active && setLoading(false));
      return () => {
        active = false;
      };
    }, [driver])
  );

  const filtered = useMemo(
    () => filterTrips(trips, { period, method, from, to }),
    [trips, period, method, from, to]
  );
  const visible = filtered.slice(0, limit);

  const chips = (values, current, onPick, prefix) => (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
      {values.map((v) => (
        <Chip
          key={v}
          selected={current === v}
          onPress={() => {
            onPick(v);
            setLimit(PAGE_SIZE);
          }}
        >
          {t(prefix + v)}
        </Chip>
      ))}
    </View>
  );

  const header = (
    <View style={{ paddingBottom: 8 }}>
      {chips(PERIODS, period, setPeriod, 'hist.period.')}
      {period === 'range' && (
        <View>
          <DateField label={t('hist.from')} value={from} onChange={setFrom} locale={locale} />
          <DateField label={t('hist.to')} value={to} onChange={setTo} locale={locale} />
        </View>
      )}
      {chips(METHODS, method, setMethod, 'method.')}
    </View>
  );

  const renderItem = ({ item }) => {
    const d = tripDate(item);
    return (
      <Card mode="outlined"
        style={{ marginBottom: 8 }}
        onPress={() => navigation.navigate('DetalleViaje', { tripId: item.id })}
      >
        <Card.Content>
          <Text variant="labelLarge">
            {d ? `${d.toLocaleDateString(locale)} ${d.toLocaleTimeString(locale)}` : '-'}
          </Text>
          <Text>
            {item.origin.address} → {item.destination.address}
          </Text>
          <Text>
            {t('cat.' + item.category)} · {t('pay.' + (item.paymentStatus || 'pending'))}
          </Text>
          <Text>
            {t('fare.fare')}: {formatCOP(item.fare)} · {t('fare.net')}: {formatCOP(item.driverEarnings)}
          </Text>
          {item.status === 'cancelled' && <Text>{t('hist.cancelled')}</Text>}
        </Card.Content>
      </Card>
    );
  };

  if (loading) return <ActivityIndicator style={{ marginTop: 40 }} />;

  return (
    <FlatList
      contentContainerStyle={{ padding: 16 }}
      data={visible}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      ListHeaderComponent={header}
      ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 24 }}>{t('hist.empty')}</Text>}
      onEndReached={() => {
        if (visible.length < filtered.length) setLimit((l) => l + PAGE_SIZE);
      }}
      onEndReachedThreshold={0.3}
    />
  );
}
