import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator, StyleSheet } from 'react-native';
import { useWorkerProfile } from '@/shared/hooks/useWorkerProfile';
import Header from '@/components/Header';
import Button from '@/components/Button';
import InputField from '@/components/InputField';
import { Camera, Trash } from 'iconsax-react-native';
import { SPACING } from '@/constants/theme/Spacing';
import { COLOR_VARIABLES } from '@/constants/theme/ColorVariables';
import { TEXT_STYLES } from '@/constants/theme/Typography';
import { useRouter } from 'expo-router';

export default function WorkerEditProfileContent() {
  const router = useRouter();
  const { user, updateProfile, pickImage, deletePortfolioItem, loading, isUploading, loadingItemId } = useWorkerProfile();

  const [profileName, setProfileName] = useState(user?.name || '');
  const [aboutMe, setAboutMe] = useState(user?.bio || '');
  const [location, setLocation] = useState(user?.location || '');

  const handleSave = () => {
    updateProfile({ name: profileName, about_me: aboutMe, location });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: SPACING.xl }}>
      <Header title="Edit Profile" />

      <View style={styles.profileImageContainer}>
        <Image
          source={user?.profile_photo ? { uri: user.profile_photo } : require('@/assets/images/images/user.png')}
          style={styles.profileImage}
        />
        {isUploading && (
          <View style={styles.overlay}>
            <ActivityIndicator size="small" color={COLOR_VARIABLES.textSurfacePrimary} />
          </View>
        )}
        <TouchableOpacity style={styles.cameraIcon} onPress={pickImage}>
          <Camera size={18} color={COLOR_VARIABLES.textSurfacePrimary} />
        </TouchableOpacity>
      </View>

      <View style={styles.fieldsContainer}>
        <InputField
          label="Name"
          placeholder="Enter your name"
          value={profileName}
          onChangeText={setProfileName}
        />

        <InputField
          label="Email Address"
          placeholder="Email Address"
          value={user?.email || ''}
          onChangeText={() => {}}
          editable={false}
        />

        <InputField
          label="Phone Number"
          placeholder="Phone Number"
          value={user?.phone_number || ''}
          onChangeText={() => {}}
          editable={false}
        />

        <InputField
          label="About Me"
          placeholder="Write something about yourself"
          value={aboutMe}
          onChangeText={setAboutMe}
          multiline
          maxLength={200}
          showCharacterCount
        />

        <InputField
          label="Location"
          placeholder="Your location"
          value={location}
          onChangeText={setLocation}
        />
      </View>

      <View style={styles.portfolioHeader}>
        <Text style={styles.portfolioTitle}>Portfolio</Text>
        <TouchableOpacity onPress={() => router.push('/profile/EditProfile/UploadPortfolio')}>
          <Text style={styles.addImageText}>Add new image</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.portfolioContainer}>
        {user?.user_portfolio && user.user_portfolio.length > 0 ? (
          user.user_portfolio.map((item) => (
            <View key={item.id} style={styles.portfolioItem}>
              <Image source={{ uri: item.image }} style={styles.portfolioImage} />
              <Text style={styles.portfolioLabel}>{item.title}</Text>
              {loadingItemId === item.id ? (
                <ActivityIndicator size="small" color={COLOR_VARIABLES.surfaceDanger} />
              ) : (
                <TouchableOpacity style={styles.deleteIcon} onPress={() => deletePortfolioItem(item.id)}>
                  <Trash size={16} color={COLOR_VARIABLES.surfaceDanger} />
                </TouchableOpacity>
              )}
            </View>
          ))
        ) : (
          <Text style={styles.emptyPortfolioText}>No portfolio images yet. Add your first image!</Text>
        )}
      </View>

      <Button
        text="Save Changes"
        onPress={handleSave}
        loading={loading}
        disabled={loading}
        variant="secondary"
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR_VARIABLES.surfacePrimary,
    paddingHorizontal: SPACING.md,
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLOR_VARIABLES.surfacePrimary,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
  },
  cameraIcon: {
    backgroundColor: COLOR_VARIABLES.surfaceTertiary,
    width: 32,
    height: 32,
    borderRadius: 16,
    position: 'absolute',
    bottom: 0,
    right: SPACING.xl + 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fieldsContainer: {
    marginBottom: SPACING.lg,
  },
  portfolioHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  portfolioContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: SPACING.xl,
  },
  portfolioItem: {
    width: '32%',
    marginBottom: SPACING.md,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  portfolioImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  portfolioLabel: {
    ...TEXT_STYLES.caption,
    textAlign: 'center',
    marginTop: SPACING.xs,
  },
  deleteIcon: {
    position: 'absolute',
    top: SPACING.xs,
    right: SPACING.xs,
    backgroundColor: COLOR_VARIABLES.surfacePrimary,
    borderRadius: 15,
    padding: SPACING.xs,
  },
  emptyPortfolioText: {
    ...TEXT_STYLES.body,
    textAlign: 'center',
    color: COLOR_VARIABLES.textShade,
    marginBottom: SPACING.md,
  },
  addImageText: {
    ...TEXT_STYLES.caption,
    color: COLOR_VARIABLES.surfaceGen,
  },
  portfolioTitle: {
    ...TEXT_STYLES.title,
    fontSize: 18,
    fontWeight: '600',
  },
});
