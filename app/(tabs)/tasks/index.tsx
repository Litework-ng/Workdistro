import { View, StyleSheet } from 'react-native';
import { COLOR_VARIABLES } from '@/constants/theme/ColorVariables';
import { useAuthStore } from '@/shared/stores/useAuthStore';
import ClientTaskScreen from '@/app/(tabs)/tasks/ClientTaskScreen';
import WorkerTaskScreen from '@/app/(tabs)/tasks/WorkerTaskScreen';
import { useRoleStore } from '@/shared/stores/useRoleStore';

export default function TaskScreen() {
  const { selectedRole } = useRoleStore();

  if (selectedRole === 'client') {
    return <ClientTaskScreen />;
  }
  return <WorkerTaskScreen />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR_VARIABLES.surfacePrimary,
  },
});