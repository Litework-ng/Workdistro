
import { View, Text } from 'react-native';
import { Link } from 'expo-router';
import { TEXT_STYLES } from "@/constants/theme/Typography";

export default function NotFoundScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 8 }}>
      <Text style={TEXT_STYLES.title}>This screen doesn't exist.</Text>
      <Link href="/">
        <Text style={TEXT_STYLES.description}>Go to home screen!</Text>
      </Link>
    </View>
  );
}