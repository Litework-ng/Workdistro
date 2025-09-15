import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import { COLOR_VARIABLES } from '@/constants/theme/ColorVariables';
import { TEXT_STYLES } from '@/constants/theme/Typography';
import { SPACING } from '@/constants/theme/Spacing';
import Header from '@/components/Header';
import { User, Key, MessageQuestion, Messages2, Lock1, InfoCircle, Logout, ArrowRight2 } from 'iconsax-react-native';
import { useAuthStore } from '@/shared/stores/useAuthStore';
import { router } from 'expo-router';
import { useRoleStore } from '@/shared/stores/useRoleStore';

function MenuItem({ text, saxIcon, onPress, color }: { text: string; saxIcon: React.ReactNode; onPress?: () => void; color?: string }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.menuItem}>
      <View style={styles.menuItemLeft}>
        {saxIcon}
        <Text style={[styles.menuItemText, color ? { color } : undefined]}>{text}</Text>
      </View>
      <ArrowRight2 size={18} color={COLOR_VARIABLES.surfaceTertiary} />
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: logout },
      ]
    );
  };

  // Get selectedRole from the store
  const { selectedRole, setSelectedRole } = useRoleStore();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Header title="Profile" showBackButton={false} />
      <View style={styles.profileHeader}>
        <Image
          source={user?.profile_photo ? { uri: user.profile_photo } : require('@/assets/images/images/user.png')}
          style={styles.profileImage}
        />
        <View>
          <Text style={styles.name}>{user?.name || 'User'}</Text>
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/profile/EditProfile/EditProfileScreen')}
            style={styles.editProfileBtn}
          >
            <Text style={styles.editProfileText}>Edit Profile</Text>
            <ArrowRight2 size={16} color={COLOR_VARIABLES.surfaceNeautral} />  
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <MenuItem
          saxIcon={<User size={20} color={COLOR_VARIABLES.surfaceTertiary} />}
          text="Account Settings"
          onPress={() => router.push('/(tabs)/profile/Account')}
        />
      </View>

      <Text style={styles.sectionLabel}>Preferences</Text>
      <View style={styles.section}>
        <MenuItem
          saxIcon={<Key size={20} color={COLOR_VARIABLES.surfaceTertiary} />}
          text="Security"
          onPress={() => router.push('/(tabs)/profile/Verify/Verify')}
        />
      </View>

      <Text style={styles.sectionLabel}>Resources</Text>
      <View style={styles.section}>
        <MenuItem
          saxIcon={<MessageQuestion size={20} color={COLOR_VARIABLES.surfaceTertiary} />}
          text="FAQ"
          onPress={() => router.push('/(tabs)/profile/faq')}
        />
        <MenuItem
          saxIcon={<Messages2 size={20} color={COLOR_VARIABLES.surfaceTertiary} />}
          text="Support"
          onPress={() => router.push('/(tabs)/profile/support')}
        />
        <MenuItem
          saxIcon={<Lock1 size={20} color={COLOR_VARIABLES.surfaceTertiary} />}
          text="Privacy"
          onPress={() => router.push('/(tabs)/profile/privacy')}
        />
        <MenuItem
          saxIcon={<InfoCircle size={20} color={COLOR_VARIABLES.surfaceTertiary} />}
          text="About Us"
          onPress={() => router.push('/(tabs)/profile/about')}
        />
      </View>

      <TouchableOpacity style={styles.signOutBtn} onPress={handleLogout}>
        <View style={styles.menuItemLeft}>
          <Logout size={20} color={COLOR_VARIABLES.dangerText} />
          <Text style={[styles.menuItemText, { color: COLOR_VARIABLES.dangerText }]}>Sign Out</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
      style={styles.switchBtn}
      onPress={() => {
        const nextRole = selectedRole === 'worker' ? 'client' : 'worker';
        setSelectedRole(nextRole);
        router.replace(`/(auth)/login`);
      }}
    >
      <Text style={styles.workerBtnText}>
        {selectedRole === 'worker' ? 'Become a Client' : 'Become a Worker'}
      </Text>
    </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR_VARIABLES.surfacePrimary,
  },
  content: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.xl,
    marginTop: SPACING.xl,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: SPACING.md,
    backgroundColor: COLOR_VARIABLES.avatarBg,
  },
  name: {
    ...TEXT_STYLES.header,
    color: COLOR_VARIABLES.textSurfaceGen,
    marginBottom: SPACING.xs,
  },
  editProfileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  editProfileText: {
    ...TEXT_STYLES.caption,
    color: COLOR_VARIABLES.textShade,
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionLabel: {
    ...TEXT_STYLES.caption,
    color: COLOR_VARIABLES.textShade,
    marginTop: SPACING.md,
    marginBottom: SPACING.xs,
    fontWeight: '600',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
   
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  menuItemText: {
    ...TEXT_STYLES.body,
    color: COLOR_VARIABLES.textSurfaceGen,
  },
  signOutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.xl,
    marginBottom: SPACING.md,
  },
  switchBtn: {
    borderWidth: 1,
    borderColor: COLOR_VARIABLES.surfaceTertiary,
    borderRadius: 8,
    alignSelf: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.xl,
    marginTop: SPACING.xxl,
  },
  workerBtnText: {
    ...TEXT_STYLES.body,
    color: COLOR_VARIABLES.textSurfaceGen,
    textAlign: 'center',
  },
});