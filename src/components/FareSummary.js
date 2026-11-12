
import { View } from 'react-native';
import { Text } from 'react-native-paper';

import useT from '../hooks/useT';
import { formatCOP } from '../utils/format';

export default function FareSummary({ fare, commission, tip, driverEarnings, rate }) {
  const { t } = useT();

  const row = (label, value, bold = false) => (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 2 }}>
      <Text variant={bold ? 'titleMedium' : 'bodyMedium'}>{label}</Text>
      <Text variant={bold ? 'titleMedium' : 'bodyMedium'}>{value}</Text>
    </View>
  );

  const pct = rate != null ? ` (${Math.round(rate * 100)}%)` : '';

  return (
    <View>
      {row(t('fare.fare'), formatCOP(fare))}
      {row(t('fare.commission') + pct, '- ' + formatCOP(commission))}
      {row(t('fare.tip'), formatCOP(tip || 0))}
      {row(t('fare.net'), formatCOP(driverEarnings), true)}
    </View>
  );
}
