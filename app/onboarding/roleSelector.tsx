import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRoleStore } from '@/shared/stores/useRoleStore';
import { TEXT_STYLES } from '@/constants/theme/Typography';
import { COLOR_VARIABLES } from '@/constants/theme/ColorVariables';
import { SPACING } from '@/constants/theme/Spacing';
import Construction from "@/assets/icons/Construction.svg"
import PersonSearch from "@/assets/icons/PersonSearch.svg"

const RoleSelector = () => {
  const { selectedRole, setSelectedRole } = useRoleStore();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>How Will You Be Using Workdistro Today?</Text>
      <Text style={styles.subtitle}>Don't worry, you can switch later in settings.</Text>

      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={[
            styles.roleButton,
            selectedRole === 'worker' && styles.activeRoleButton,
          ]}
          onPress={() => setSelectedRole('worker')}
        >
        <Construction width={50} height={50} />
          <Text
            style={[
              styles.roleText,
              selectedRole === 'worker' && styles.activeRoleText,
            ]}
          >
            As A Worker
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.roleButton,
            selectedRole === 'client' && styles.activeRoleButton,
          ]}
          onPress={() => setSelectedRole('client')}
        >
        <PersonSearch width={50} height={50} />
          <Text
            style={[
              styles.roleText,
              selectedRole === 'client' && styles.activeRoleText,
            ]}
          >
            To Find A Worker
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    marginTop: SPACING.xl,
  },
  title: {
    ...TEXT_STYLES.title,
    textAlign: 'center',
    color: COLOR_VARIABLES.textSurfaceGen,
    marginBottom: SPACING.sm,
    marginTop: SPACING.xl,
    width: 311,
  },
  subtitle: {
    ...TEXT_STYLES.description,
    textAlign: 'center',
    marginBottom: SPACING.lg,
    width: 298,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent:'center',
    gap: SPACING.md,
    width: '100%',
  },
  roleButton: {
    flexDirection: 'column',
    borderWidth: 1,
    borderColor: COLOR_VARIABLES.borderSec,
    paddingVertical: SPACING.md,
    paddingHorizontal:SPACING.md,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent:'center',
   
  },
  activeRoleButton: {
    backgroundColor: COLOR_VARIABLES.surfacePrimary,
    borderColor: COLOR_VARIABLES.borderPrimary,
  },
  roleText: {
    ...TEXT_STYLES.body,
    color: COLOR_VARIABLES.textSurfaceGen,
    marginTop:SPACING.md,
  },
  activeRoleText: {
    color: COLOR_VARIABLES.textSurfaceGen,
   
  },
});

export default RoleSelector;
