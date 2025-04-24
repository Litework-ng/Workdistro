import React from "react";
import { View,  TouchableOpacity, StyleSheet } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useRouter, useSegments } from "expo-router";
import { COLOR_VARIABLES } from "@/constants/theme/ColorVariables";
import { SPACING } from "@/constants/theme/Spacing";

const Header = () => {
  const router = useRouter();
  const segments = useSegments(); // Get the current route segments

  const showBackButton = segments.length > 1; // Hide back button on the first screen

  return (
    <View style={styles.header}>
      {showBackButton && (
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <AntDesign name="left" size={24} color={COLOR_VARIABLES.textSurfacePrimary} />
            </TouchableOpacity>
      )}

    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    paddingVertical: SPACING.md,
    backgroundColor: COLOR_VARIABLES.surfacePrimary,
  },
  backButton: {
    marginLeft: SPACING.md,
    marginTop:SPACING.lg,
  },
 
});

export default Header;
