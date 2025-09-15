import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { userService } from '@/services/user';
import { useAuthStore } from '@/shared/stores/useAuthStore';
import api from '@/lib/api';

export const useWorkerProfile = () => {
  const { user, setUser } = useAuthStore();

  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [loadingItemId, setLoadingItemId] = useState<number | null>(null);

  const updateProfile = useCallback(async (data: { name: string; about_me?: string; location: string }) => {
    try {
      setLoading(true);
      await userService.updateUser(data);
      const updatedUser = await userService.getUser();
      setUser(updatedUser);
      Alert.alert('Success', 'Profile updated successfully.');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  }, [setUser]);

  const pickImage = useCallback(async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission required to access gallery.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled) {
        await uploadProfilePhoto(result.assets[0].uri);
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  const uploadProfilePhoto = useCallback(async (imageUri: string) => {
    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('image', {
        uri: imageUri,
        name: 'profile.jpg',
        type: 'image/jpeg',
      } as any);

      const response = await api.patch('user/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.status === 201 || response.status === 200) {
        const updatedUser = await userService.getUser();
        setUser(updatedUser);
        Alert.alert('Success', 'Profile photo updated.');
      }
    } catch (error) {
      console.error('Failed to upload profile photo', error);
      Alert.alert('Error', 'Failed to upload profile photo.');
    } finally {
      setIsUploading(false);
    }
  }, [setUser]);

  const uploadPortfolioItem = useCallback(async (title: string, imageUri: string) => {
    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('title', title);
      formData.append('media', {
        uri: imageUri,
        name: 'portfolio_image.jpg',
        type: 'image/jpeg',
      } as any);

      const response = await api.post('/user/project/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.status === 201 || response.status === 200) {
        const updatedUser = await userService.getUser();
        setUser(updatedUser);
      } else {
        throw new Error(`Upload failed with status ${response.status}`);
      }
    } catch (error) {
      console.error('Failed to upload portfolio item', error);
      Alert.alert('Error', 'Failed to upload portfolio item. Please try again.');
      throw error; // rethrow so UI screen can handle with finally
    } finally {
      setIsUploading(false);
    }
  }, [setUser]);

  const deletePortfolioItem = useCallback(async (id: number) => {
    try {
      const confirmDelete = await new Promise<boolean>((resolve) =>
        Alert.alert(
          'Delete Portfolio',
          'Are you sure you want to delete this image?',
          [
            { text: 'Cancel', onPress: () => resolve(false), style: 'cancel' },
            { text: 'Yes', onPress: () => resolve(true) },
          ],
          { cancelable: false }
        )
      );

      if (!confirmDelete) return;

      setLoadingItemId(id);
      const response = await api.delete(`/user/project/${id}/`);

      if (response.status === 200 || response.status === 204) {
        const updatedUser = await userService.getUser();
        setUser(updatedUser);
        Alert.alert('Success', 'Portfolio item deleted.');
      }
    } catch (error) {
      console.error('Failed to delete portfolio item', error);
      Alert.alert('Error', 'Failed to delete portfolio item.');
    } finally {
      setLoadingItemId(null);
    }
  }, [setUser]);

  return {
    user,
    loading,
    isUploading,
    loadingItemId,
    updateProfile,
    pickImage,
    uploadProfilePhoto,
    uploadPortfolioItem, // added here
    deletePortfolioItem,
  };
};
