
import { useState } from 'react';
import { View } from 'react-native';
import { Button, HelperText } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';

// future = true: sirve para fechas de vencimiento (solo desde mañana en adelante)
// future = false (por defecto): fechas de nacimiento (no permite fechas futuras)
export default function DateField({ label, value, onChange, error, locale, future = false }) {

  const [show, setShow] = useState(false);

  // Mañana: la fecha de vencimiento debe ser posterior a hoy
  const manana = new Date();
  manana.setDate(manana.getDate() + 1);

  return (
    <View>
      <Button mode="outlined" onPress={() => setShow(true)}>
        {value ? value.toLocaleDateString(locale) : label}
      </Button>

      {show && (
        <DateTimePicker
          value={value || (future ? manana : new Date(2000, 0, 1))}
          mode="date"
          maximumDate={future ? undefined : new Date()} 
          minimumDate={future ? manana : undefined} 
          onChange={(_, d) => {
            setShow(false);
            if (d) onChange(d);
          }}
        />
      )}
      <HelperText type="error" visible={!!error}>
        {error}
      </HelperText>
    </View>
  );
}
