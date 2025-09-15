import { View, Text, StyleSheet } from 'react-native';
import { COLOR_VARIABLES } from '@/constants/theme/ColorVariables';
import { TEXT_STYLES } from '@/constants/theme/Typography';
import { SPACING } from '@/constants/theme/Spacing';
import Header from '@/components/Header';
import { useRoleStore } from '@/shared/stores/useRoleStore';
import ClientHomeContent from '@/app/(tabs)/home/ClientHomeContent';
import WorkerHomeContent from '@/app/(tabs)/home/WorkerHomeContent';

export default function HomeScreen() {
  const { selectedRole } = useRoleStore();

  return (
    <View style={styles.container}>
      {selectedRole === 'worker' ? <WorkerHomeContent /> : <ClientHomeContent />}
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