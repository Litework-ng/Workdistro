import { useEffect } from 'react';
import { View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { COLOR_VARIABLES } from '@/constants/theme/ColorVariables';

export default function Index() {
  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const hasOnboarded = await AsyncStorage.getItem('hasOnboarded');
      
      if (hasOnboarded === 'true') {
        // User has completed onboarding
        router.replace('/onboarding');
      } else {
        // User hasn't completed onboarding
        router.replace('/onboarding');
      }
    } catch (error) {
      // If there's an error reading from storage, default to onboarding
      router.replace('/onboarding');
    }
  };

  // Show a blank screen while checking status
  return (
    <View style={{ flex: 1, backgroundColor: COLOR_VARIABLES.surfacePrimary }} />
  );
}