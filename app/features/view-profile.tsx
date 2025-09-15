import React from "react";
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Rating, AirbnbRating } from "react-native-ratings";
import { COLOR_VARIABLES } from "@/constants/theme/ColorVariables";
import { SPACING } from "@/constants/theme/Spacing";
import { TEXT_STYLES } from "@/constants/theme/Typography";
import  Header from '@/components/Header';
import { Star1,  } from 'iconsax-react-native';
import  Button  from '@/components/Button';
import {useWorkerStore} from '@/shared/stores/useWorkerStore';
import { useJobStore } from "@/shared/stores/useJobStore";



export default function ViewProfileScreen() {
 const { job, worker, bid, setJobContext } = useJobStore();

if (!worker) {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>No worker data found.</Text>
    </View>
  );
}

  const calculateAverageRating = (reviews: any[]) => {
    if (!reviews || reviews.length === 0) return 0;
    const totalRating = reviews.reduce((sum, review) => sum + parseFloat(review.rating), 0);
    return totalRating / reviews.length;
  };

  const averageRating = calculateAverageRating(worker?.reviews || []);
  console.log(`is worker:`, worker)
  return (
    <FlatList
      data={worker.reviews?.slice(0, 2) || []}
      keyExtractor={(item) => item.id?.toString()}
      style={{ backgroundColor: COLOR_VARIABLES.surfacePrimary }}
      ListHeaderComponent={(
        <View style={styles.container}>
          {/* Header */}
          <Header title="Worker Profile" />

          {/* Profile Section */}
          <View style={styles.profileHeader}>
            <Image
          source={
            worker.profile_photo
              ? { uri: worker.profile_photo }
              : require('@/assets/images/images/user.png')
          }
              style={styles.profileImage}
            />
            <View style={styles.profileInfo}>
              <Text style={styles.name}>{worker.name}</Text>
              <Text style={styles.jobsCompleted}>
                {worker?.reviews?.length || 0} jobs completed
              </Text>
            <View style={styles.ratingContainer}>
                <Star1 
                    size={14} 
                    color={COLOR_VARIABLES.surfaceWarning} 
                    variant="Bold"
                />
                <Text style={styles.ratingText}>
                    {averageRating.toFixed(1)}
                </Text>
            </View>
            </View>
          </View>

          {/* About Section */}
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.bio}>{worker.bio?.trim() || "This worker has not added a bio yet."}</Text>

          {/* Portfolio Section */}
          <Text style={styles.sectionTitle}>Portfolio</Text>
          <Text style={styles.bio}>Here are pictures from my previous works</Text>
          {worker.user_portfolio?.length ? (
           <FlatList
           
  data={worker.user_portfolio}

  keyExtractor={(item, index) => index.toString()}
  numColumns={3}
  renderItem={({ item }) => {
    console.log("Portfolio item:", item);
    return (
      <View style={styles.portfolioItem}>
        <Image
          source={
            item.image && String(item.image).startsWith("http")
              ? { uri: String(item.image) }
              : require("@/assets/images/images/user.png")
          }
          style={styles.portfolioImage}
          resizeMode="cover"
        />
        <Text style={styles.portfolioText}>{item.title || "Untitled"}</Text>
      </View>
    );
  }}
/>
          ) : (
            <Text style={styles.emptyStateText}>No portfolio items available.</Text>
          )}

          {/* Reviews Header */}
          <View style={styles.reviewSectionTitleContainer}>
            <View>
              <Text style={styles.reviewsSectionTitle}>Reviews</Text>
              <Text style={styles.bio}>Here’s what my previous clients have to say</Text>
            </View>
            {(worker.reviews && worker.reviews.length > 2) && (
              <TouchableOpacity
                onPress={() => {
                  router.push("/features/review");
                }}
              >
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>

            )}
          </View>
        </View>
      )}
      renderItem={({ item }) => (
        <View style={{ padding: SPACING.md }}>
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
                <Text style={styles.reviewerName}>{item.reviewer.name || "Anonymous"}</Text>
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
        </View>
      )}
      ListEmptyComponent={<Text style={styles.emptyStateText}>No reviews yet.</Text>}
      ListFooterComponent={(
       <View style={styles.hireButton}>
          <Button
            variant="secondary"
            text="Hire Professional"
            onPress={() => {
              setJobContext(job!, worker, bid!);
              router.push("/features/hire");
            }}
          />
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR_VARIABLES.surfacePrimary,
    padding: SPACING.md,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.lg,
    marginTop: SPACING.xl,
    padding: SPACING.md,
    gap: SPACING.xl,
  },
  backButton: {
    padding: SPACING.xs,
    borderRadius: 50,
    backgroundColor: COLOR_VARIABLES.surfaceSecondary,
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    ...TEXT_STYLES.header,
    color: COLOR_VARIABLES.textSurfaceGen,
    marginLeft: SPACING.lg,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.lg,
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginHorizontal: SPACING.md,
    backgroundColor: COLOR_VARIABLES.borderSec,
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    ...TEXT_STYLES.header,
    fontFamily: "ManropeBold",
    color: COLOR_VARIABLES.textSurfaceGen,
  },
  jobsCompleted: {
    ...TEXT_STYLES.body,
    color: COLOR_VARIABLES.textShade,
    marginTop: SPACING.xs,
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
    marginRight: SPACING.xs,
  },
  sectionTitle: {
    ...TEXT_STYLES.subHeader,
    marginTop: SPACING.lg,
    marginLeft: SPACING.md,
    color: COLOR_VARIABLES.textSurfaceSecondary,
  },
  bio: {
    ...TEXT_STYLES.label,
    color: COLOR_VARIABLES.textShade,
    marginVertical: SPACING.sm,
    marginLeft: SPACING.md,
    marginBottom: SPACING.lg,
  },
  portfolioItem: {
    width: "30%",
    margin: SPACING.xs,
    alignItems: "center",
  },
  portfolioImage: {
    width: 110,
    height: 110,
    borderRadius: 5,
    backgroundColor: COLOR_VARIABLES.borderSec,
  },
  portfolioText: {
    ...TEXT_STYLES.caption,
    color: COLOR_VARIABLES.textShade,
    textAlign: "center",
    marginTop: SPACING.xs,
  },
  reviewSectionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
   
  },
  reviewsSectionTitle: {
    ...TEXT_STYLES.subHeader,
    marginLeft: SPACING.md,
    color: COLOR_VARIABLES.textSurfaceSecondary,
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
  viewAllText: {
    ...TEXT_STYLES.caption,
    color: COLOR_VARIABLES.surfaceGen,
    textAlign: "center",
    marginRight: SPACING.md,
    marginBottom: SPACING.xl,
  },
  reviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.xs,
    gap: 15,

  },
  reviewRatingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.xs,
  },
  rateText: {
    ...TEXT_STYLES.caption,
    color: COLOR_VARIABLES.textSurfaceSecondary,
    marginLeft: SPACING.xs,
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
  hireButton: {
    padding: SPACING.md,
    marginVertical: SPACING.xl,
  },
 
});