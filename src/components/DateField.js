
import { useState } from 'react';
import { View } from 'react-native';
import { Button, HelperText } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function DateField({ label, value, onChange, error, locale }) {

  const [show, setShow] = useState(false);

  return (
    <View>
      <Button mode="outlined" onPress={() => setShow(true)}>
        {value ? value.toLocaleDateString(locale) : label}
      </Button>

      {show && (
        <DateTimePicker
          value={value || new Date(2000, 0, 1)}
          mode="date"
          maximumDate={new Date()} // no permite fechas futuras
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
