import { Stack } from "expo-router";
import Header from "./header";

export default function OnboardingLayout() {
  return (
    <>
      <Header />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
       
      </Stack>
    </>
  );
}
