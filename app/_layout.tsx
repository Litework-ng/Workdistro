import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { useRoleStore } from '@/shared/stores/useRoleStore';
import "react-native-reanimated";
import {
  Manrope_400Regular,
  Manrope_600SemiBold,
  Manrope_700Bold,
} from "@expo-google-fonts/manrope";
import { useAuthStore } from '@/shared/stores/useAuthStore';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Toast, { BaseToast, ToastProps, ErrorToast } from 'react-native-toast-message';
import { COLOR_VARIABLES } from '@/constants/theme/ColorVariables';

const toastConfig = {
  success: (props: ToastProps) => (
    <BaseToast
      {...props}
      style={{ 
        borderLeftColor: COLOR_VARIABLES.surfaceGen,
        borderLeftWidth: 5,
        backgroundColor: COLOR_VARIABLES.surfacePrimary
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 15,
        fontFamily: 'ManropeSemiBold',
        color: COLOR_VARIABLES.textSurfaceGen
      }}
      text2Style={{
        fontSize: 13,
        fontFamily: 'ManropeRegular',
        color: COLOR_VARIABLES.greyedOutText,
      }}
    />
  ),
  error: (props: ToastProps) => (
    <BaseToast
      {...props}
      style={{ 
        borderLeftColor: COLOR_VARIABLES.dangerText,
        borderLeftWidth: 5,
        backgroundColor: COLOR_VARIABLES.surfacePrimary
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 15,
        fontFamily: 'ManropeSemiBold',
        color: COLOR_VARIABLES.textSurfaceGen
      }}
      text2Style={{
        fontSize: 13,
        fontFamily: 'ManropeRegular',
        color: COLOR_VARIABLES.greyedOutText,
      }}
    />
  )
};

export { ErrorBoundary } from "expo-router";

// Prevent splash screen from hiding too soon
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

export default function RootLayout() {
  const [fontsLoaded, error] = useFonts({
    ManropeRegular: Manrope_400Regular,
    ManropeSemiBold: Manrope_600SemiBold,
    ManropeBold: Manrope_700Bold,
  });
  const { selectedRole } = useRoleStore();
  const { isAuthenticated } = useAuthStore();
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen 
          name="(client)" 
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen 
          name="(worker)" 
          options={{
            headerShown: false,
          }}
        />
      </Stack>
      <Toast config={toastConfig} />
    </QueryClientProvider>
  );
}
