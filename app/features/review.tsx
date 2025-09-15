import React from "react";
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { COLOR_VARIABLES } from "@/constants/theme/ColorVariables";
import { SPACING } from "@/constants/theme/Spacing";
import { TEXT_STYLES } from "@/constants/theme/Typography";
import { Star1 } from "iconsax-react-native";
import Header from "@/components/Header";
import { useWorkerStore } from "@/shared/stores/useWorkerStore";

export default function AllReviewsScreen() {
  const { selectedWorker } = useWorkerStore();
  const reviews = selectedWorker?.reviews || [];

  return (
    <View style={styles.container}>
      <Header title="All Reviews" />
      <FlatList
        data={reviews}
        keyExtractor={(item) => item.id?.toString()}
        contentContainerStyle={{ paddingBottom: SPACING.xl }}
        renderItem={({ item }) => (
          <View style={styles.reviewCard}>
            <View style={styles.reviewHeader}>
              <Image
                source={
                  item.reviewer?.profile_photo
                    ? { uri: item.reviewer.profile_photo }
                    : require("@/assets/images/images/user.png")
                }
                style={styles.reviewAvatar}
              />
              <View>
                <Text style={styles.reviewerName}>{item.reviewer?.name || "Anonymous"}</Text>
                <View style={styles.ratingContainer}>
                  <Star1
                    size={14}
                    color={COLOR_VARIABLES.surfaceWarning}
                    variant="Bold"
                  />
                  <Text style={styles.ratingText}>
                    {parseFloat(item.rating).toFixed(1)}
                  </Text>
                </View>
              </View>
              <Text style={styles.reviewDate}>
                {new Date(item.date_created).toDateString()}
              </Text>
            </View>
            <Text style={styles.reviewText}>{item.message}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyStateText}>No reviews yet.</Text>
        }
      />
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text >Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR_VARIABLES.surfacePrimary,
    padding: SPACING.md,
  },
  reviewCard: {
    backgroundColor: COLOR_VARIABLES.surfacePrimary,
    padding: SPACING.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLOR_VARIABLES.borderSec,
    marginVertical: SPACING.xs,
    elevation: 2,
  },
  reviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.xs,
    gap: 15,
  },
  reviewAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: SPACING.md,
    backgroundColor: COLOR_VARIABLES.surfaceNeautral,
  },
  reviewerName: {
    ...TEXT_STYLES.body,
    color: COLOR_VARIABLES.textSurfaceGen,
    fontFamily: "ManropeSemiBold",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: SPACING.xs,
    gap: SPACING.xs,
  },
  ratingText: {
    ...TEXT_STYLES.body,
    color: COLOR_VARIABLES.textSurfaceSecondary,
    marginLeft: SPACING.xs,
  },
  reviewDate: {
    ...TEXT_STYLES.caption,
    color: COLOR_VARIABLES.textShade,
    marginLeft: SPACING.xxl,
  },
  reviewText: {
    ...TEXT_STYLES.label,
    color: COLOR_VARIABLES.textShade,
    marginTop: SPACING.xs,
    lineHeight: 20,
  },
  emptyStateText: {
    ...TEXT_STYLES.caption,
    color: COLOR_VARIABLES.textShade,
    textAlign: "center",
    marginVertical: SPACING.md,
  },
  backButton: {
    marginTop: SPACING.lg,
    alignSelf: "center",
    backgroundColor: COLOR_VARIABLES.surfacePrimary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.sm,
  }
})