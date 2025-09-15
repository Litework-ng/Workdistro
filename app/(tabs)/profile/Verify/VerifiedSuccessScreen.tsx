import React from "react";
import { View, Text, Image } from "react-native";
import { useRouter } from "expo-router";
import Header from "@/components/Header";
import Button from "@/components/Button";
import { SPACING } from "@/constants/theme/Spacing";
import { COLOR_VARIABLES } from "@/constants/theme/ColorVariables";
import { TEXT_STYLES } from "@/constants/theme/Typography";

export default function VerifiedSuccessScreen() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, backgroundColor: COLOR_VARIABLES.surfacePrimary }}>
      <Header title="Verification Successful" showBackButton={false} />
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: SPACING.lg }}>
        <Image
          source={require("@/assets/images/images/accepted.png")}
          style={{ width: 100, height: 100, marginBottom: SPACING.xl }}
          resizeMode="contain"
        />
        <Text style={[TEXT_STYLES.header, { color: COLOR_VARIABLES.textSurfacePrimary, marginBottom: SPACING.md }]}>
          Wallet Activated!
        </Text>
        <Text style={[TEXT_STYLES.body, { color: COLOR_VARIABLES.textSurfaceGen, textAlign: "center", marginBottom: SPACING.xl }]}>
          Your identity has been verified and your wallet is now active. You can now enjoy all features of Workdistro!
        </Text>
        <Button
          text="Go to Home"
          onPress={() => router.replace("/(tabs)/home")}
          variant="primary"
        />
      </View>
    </View>
  );
}