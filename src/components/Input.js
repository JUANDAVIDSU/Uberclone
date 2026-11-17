import { TextInput } from 'react-native-paper';

export default function Input({ style, ...props }) {
  return (
    <TextInput mode="outlined" style={[{ backgroundColor: '#FFFFFF' }, style]} {...props} />
  );
}
