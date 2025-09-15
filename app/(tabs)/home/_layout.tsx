import { Stack } from 'expo-router';
import { COLOR_VARIABLES } from '@/constants/theme/ColorVariables';
import { TEXT_STYLES } from '@/constants/theme/Typography';

export default function HomeLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: COLOR_VARIABLES.surfacePrimary
        },
        animation: 'slide_from_right'
      }}
    >
      <Stack.Screen 
        name="index"
        options={{
          title: 'Home'
        }}
      />
      
          </Stack>
  );
}