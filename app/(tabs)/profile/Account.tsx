import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import Header from "@/components/Header";
import { ArrowRight2 } from "iconsax-react-native";
import { SPACING } from "@/constants/theme/Spacing";
import { COLOR_VARIABLES } from "@/constants/theme/ColorVariables";
import { TEXT_STYLES } from "@/constants/theme/Typography";

const AccountSetting = () => {
  const router = useRouter();

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            // TODO: Implement delete logic
            console.log("Account deleted");
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Account Settings" />

      <View style={styles.contentContainer}>
        <TouchableOpacity
          onPress={() => router.push("/profile/PaymentHistory")}
          style={styles.rowItem}
        >
          <Text style={styles.rowText}>Payment History</Text>
          <ArrowRight2 size={20} color={COLOR_VARIABLES.textSurfaceGen} />
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Account Control</Text>

        <TouchableOpacity onPress={handleDeleteAccount}>
          <Text style={styles.deleteText}>Delete Account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AccountSetting;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR_VARIABLES.surfacePrimary,
    padding:SPACING.md,
  },
  contentContainer: {
    padding: SPACING.md,
  },
  rowItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLOR_VARIABLES.borderSec,
  },
  rowText: {
    ...TEXT_STYLES.title,
    color: COLOR_VARIABLES.textSurfaceGen,
  },
  sectionTitle: {
    ...TEXT_STYLES.caption,
    color: COLOR_VARIABLES.textShade,
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  deleteText: {
    ...TEXT_STYLES.label,
    color: COLOR_VARIABLES.dangerText,
    
  },
});
