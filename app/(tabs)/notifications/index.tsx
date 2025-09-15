import { View, Text, StyleSheet } from 'react-native';
import { COLOR_VARIABLES } from '@/constants/theme/ColorVariables';
import { TEXT_STYLES } from '@/constants/theme/Typography';
import { SPACING } from '@/constants/theme/Spacing';
import Header from '@/components/Header';

export default function NotificationScreen() {
  return (
    <View style={styles.container}>
      <Header title="Notification" />
      <View style={styles.content}>
        <Text style={styles.text}>Notification screen Screen</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR_VARIABLES.surfacePrimary,
  },
  content: {
    flex: 1,
    padding: SPACING.lg,
  },
  text: {
    ...TEXT_STYLES.body,
    color: COLOR_VARIABLES.textSurfaceGen,
  },
});