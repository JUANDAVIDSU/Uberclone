
import { useState } from 'react';
import { View } from 'react-native';
import { Button, HelperText, Menu } from 'react-native-paper';

export default function Selector({ label, value, options, onSelect, error }) {

  const [open, setOpen] = useState(false);

  
  const current = options.find((o) => o.value === value);

  return (
    <View>
      <Menu
        visible={open}
        onDismiss={() => setOpen(false)}
        anchor={
          <Button mode="outlined" onPress={() => setOpen(true)}>
            {current ? current.label : label}
          </Button>
        }
      >
        {options.map((o) => (
          <Menu.Item
            key={o.value}
            title={o.label}
            onPress={() => {
              onSelect(o.value);
              setOpen(false);
            }}
          />
        ))}
      </Menu>
      <HelperText type="error" visible={!!error}>
        {error}
      </HelperText>
    </View>
  );
}
