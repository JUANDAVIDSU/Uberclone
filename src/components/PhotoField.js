
import { Image, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Button, HelperText } from 'react-native-paper';

export default function PhotoField({
  label,
  uri,
  onChange,
  error,
  cameraLabel = 'Cámara',
  galleryLabel = 'Galería',
}) {

  const pick = async (camera) => {
    // 1. Pedir permiso
    const perm = camera
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return;

    // 2. Abrir cámara o galería 
    const res = camera
      ? await ImagePicker.launchCameraAsync({ quality: 0.5 })
      : await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          quality: 0.5, // bajar el peso de la foto y la calidad
        });

    // 3. Si se devuelve
    if (!res.canceled) onChange(res.assets[0].uri);
  };

  return (
    <View style={{ marginBottom: 8 }}>
      {uri && (
        <Image
          source={{ uri }}
          style={{ width: 120, height: 120, marginBottom: 8 }}
        />
      )}
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <Button mode="outlined" onPress={() => pick(true)}>
          {cameraLabel}
        </Button>
        <Button mode="outlined" onPress={() => pick(false)}>
          {galleryLabel}
        </Button>
      </View>
      <HelperText type={error ? 'error' : 'info'} visible>
        {error || label}
      </HelperText>
    </View>
  );
}
