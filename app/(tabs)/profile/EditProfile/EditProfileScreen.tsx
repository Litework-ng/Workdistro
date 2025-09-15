import { View, StyleSheet } from 'react-native';
import { COLOR_VARIABLES } from '@/constants/theme/ColorVariables';
import { useRoleStore } from '@/shared/stores/useRoleStore';
import ClientEditProfileContent from '@/app/(tabs)/profile/EditProfile/ClientEditProfile';
import WorkerEditProfileContent from '@/app/(tabs)/profile/EditProfile/WorkerEditProfile';

export default function EditProfileScreen() {
  const { selectedRole } = useRoleStore();

  return (
    <View style={styles.container}>
      {selectedRole === 'worker' ? <WorkerEditProfileContent /> : <ClientEditProfileContent />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR_VARIABLES.surfacePrimary,
    padding: 16,
  },
});
