import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ViewStyle,
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { COLOR_VARIABLES } from '@/constants/theme/ColorVariables';
import { TEXT_STYLES } from '@/constants/theme/Typography';
import { SPACING } from '@/constants/theme/Spacing';
import { Trash } from 'iconsax-react-native';
import UploadIcon from '@/assets/icons/Upload.svg';

interface UploadInputProps {
  label?: string;
  onImageSelect: (uris: string[]) => void;
  error?: string;
  style?: ViewStyle;
  selectedImages?: string[];
  maxImages?: number;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
const DEFAULT_MAX_IMAGES = 3;

const UploadInput: React.FC<UploadInputProps> = ({
  label,
  onImageSelect,
  error,
  style,
  selectedImages = [],
  maxImages = DEFAULT_MAX_IMAGES,
}) => {
  const [previews, setPreviews] = useState<string[]>([]);

  const checkFileSize = async (uri: string): Promise<boolean> => {
    const response = await fetch(uri);
    const blob = await response.blob();
    return blob.size <= MAX_FILE_SIZE;
  };

  const handleUpload = async () => {
    if (previews.length >= maxImages) {
      alert(`You can only upload up to ${maxImages} images`);
      return;
    }

    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      alert('Permission to access photos is required!');
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const newImage = result.assets[0].uri;

        const isValidSize = await checkFileSize(newImage);
        if (!isValidSize) {
          alert('Image size must be less than 5MB');
          return;
        }

        const newPreviews = [...previews, newImage];
        setPreviews(newPreviews);
        onImageSelect(newPreviews);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      alert('Failed to pick image. Please try again.');
    }
  };

  useEffect(() => {
    setPreviews(selectedImages || []);
  }, [selectedImages]);

  const handleRemoveImage = (index: number) => {
    const newPreviews = [...previews].filter((_, i) => i !== index);
    setPreviews(newPreviews);
    onImageSelect(newPreviews);
  };

  return (
    <View style={[styles.container, style]}>
      {label && (
        <View style={styles.labelContainer}>
          <Text style={styles.label}>{label}</Text>
          <Text style={styles.imageCount}>
            {previews.length}/{maxImages}
          </Text>
        </View>
      )}

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.previewsContainer}
      >
        {previews.length < maxImages && (
          <TouchableOpacity
            style={[styles.uploadButton, error && styles.errorBorder]}
            onPress={handleUpload}
          >
            <UploadIcon width={24} height={24} color={COLOR_VARIABLES.textShade} />
            <Text style={styles.uploadText}>Upload Photo</Text>
          </TouchableOpacity>
        )}

        {previews.map((uri, index) => (
          <View key={`${uri}-${index}`} style={styles.previewWrapper}>
            <Image source={{ uri }} style={styles.preview} />
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => handleRemoveImage(index)}
            >
              <Trash size={20} color={COLOR_VARIABLES.dangerText} />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.lg,
  },
  label: {
    ...TEXT_STYLES.body,
    color: COLOR_VARIABLES.textSurfaceGen,
    marginBottom: SPACING.xs,
  },
  errorBorder: {
    borderColor: COLOR_VARIABLES.borderDanger,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  imageCount: {
    ...TEXT_STYLES.caption,
    color: COLOR_VARIABLES.textShade,
  },
  previewsContainer: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  uploadButton: {
    width: 120,
    height: 120,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    padding: SPACING.md,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: COLOR_VARIABLES.borderSec,
    borderRadius: 8,
    backgroundColor: COLOR_VARIABLES.surfacePrimary,
  },
  previewWrapper: {
    width: 120,
    height: 120,
    borderRadius: 8,
    overflow: 'hidden',
  },
  preview: {
    width: '100%',
    height: '100%',
  },
  removeButton: {
    position: 'absolute',
    top: SPACING.xs,
    right: SPACING.xs,
    backgroundColor: COLOR_VARIABLES.surfacePrimary,
    padding: SPACING.xs,
    borderRadius: 4,
  },
  uploadText: {
    ...TEXT_STYLES.caption,
    color: COLOR_VARIABLES.textShade,
    textAlign: 'center',
  },
  errorText: {
    ...TEXT_STYLES.caption,
    color: COLOR_VARIABLES.dangerText,
    marginTop: SPACING.xs,
  },
});

export default UploadInput;
