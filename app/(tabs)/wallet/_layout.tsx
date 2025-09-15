import { Stack } from 'expo-router';
import { COLOR_VARIABLES } from '@/constants/theme/ColorVariables';
import { TEXT_STYLES } from '@/constants/theme/Typography';

export default function WalletLayout() {
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
          title: 'Wallet',
        }}
      />
      
     
    </Stack>
  );
}