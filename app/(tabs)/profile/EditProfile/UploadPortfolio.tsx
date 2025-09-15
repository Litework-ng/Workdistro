import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Keyboard, TouchableWithoutFeedback, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { DocumentUpload } from 'iconsax-react-native';
import Header from '@/components/Header';
import InputField from '@/components/InputField';
import Button from '@/components/Button';
import { SPACING } from '@/constants/theme/Spacing';
import { COLOR_VARIABLES } from '@/constants/theme/ColorVariables';
import { TEXT_STYLES } from '@/constants/theme/Typography';
import { useWorkerProfile } from '@/shared/hooks/useWorkerProfile';

export default function UploadPortfolioScreen() {
  const router = useRouter();
  const { uploadPortfolioItem, loading } = useWorkerProfile();

  const [title, setTitle] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleImagePicker = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission Denied', 'You need to grant media access to upload files.');
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!pickerResult.canceled && pickerResult.assets.length > 0) {
      setSelectedImage(pickerResult.assets[0].uri);
    }
  };

  const handleUpload = async () => {
    if (!title.trim()) {
      Alert.alert('Missing Title', 'Please enter a document title.');
      return;
    }

    if (!selectedImage) {
      Alert.alert('No Image Selected', 'Please select an image to upload.');
      return;
    }

    try {
      setIsUploading(true);
      await uploadPortfolioItem(title, selectedImage);
      Alert.alert('Success', 'Your portfolio item has been uploaded successfully.');
      router.back();
    } catch (error) {
      console.error('Error uploading portfolio:', error);
      Alert.alert('Upload Failed', 'An unexpected error occurred. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Header title="Add Portfolio Item" showBackButton />

        <Text style={styles.subtitle}>Upload new images to your portfolio</Text>

        <InputField
          label="Title"
          placeholder="Enter portfolio title"
          value={title}
          onChangeText={setTitle}
        />

        <Text style={styles.label}>Attach Image</Text>

        <TouchableOpacity style={styles.imageUpload} onPress={handleImagePicker}>
          {selectedImage ? (
            <Image source={{ uri: selectedImage }} style={styles.previewImage} />
          ) : (
            <View style={styles.uploadPlaceholder}>
              <DocumentUpload size={20} color={COLOR_VARIABLES.textShade} />
              <Text style={styles.uploadText}>Upload Image</Text>
            </View>
          )}
        </TouchableOpacity>

        <Text style={styles.note}>JPEGs and PNGs only (not more than 20MB)</Text>

        <Button
          text={isUploading ? 'Uploading...' : 'Upload'}
          onPress={handleUpload}
          loading={isUploading || loading}
          disabled={isUploading || loading}
          variant="secondary"
        />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR_VARIABLES.surfacePrimary,
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.lg,
  },
  subtitle: {
    ...TEXT_STYLES.body,
    color: COLOR_VARIABLES.textSurfaceSecondary,
    marginBottom: SPACING.lg,
  },
  label: {
    ...TEXT_STYLES.label,
    marginBottom: SPACING.xs,
    marginTop: SPACING.md,
  },
  imageUpload: {
    borderWidth: 1,
    borderColor: COLOR_VARIABLES.borderSec,
    borderRadius: 8,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  uploadPlaceholder: {
    flexDirection: 'row',
    gap: SPACING.xs,
    alignItems: 'center',
  },
  uploadText: {
    ...TEXT_STYLES.caption,
    color: COLOR_VARIABLES.textShade,
  },
  previewImage: {
    width: '50%',
    height: '80%',
    borderRadius: 8,
    resizeMode: 'cover',
  },
  note: {
    ...TEXT_STYLES.caption,
    color: COLOR_VARIABLES.textSurfaceSecondary,
    marginBottom: SPACING.xl,
  },
});
