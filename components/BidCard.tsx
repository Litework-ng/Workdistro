import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Briefcase, Location } from 'iconsax-react-native';
import { useRouter } from 'expo-router';
import { COLOR_VARIABLES } from '@/constants/theme/ColorVariables';
import { SPACING } from '@/constants/theme/Spacing';
import { TEXT_STYLES } from '@/constants/theme/Typography';
import { useJobStore } from "@/shared/stores/useJobStore";
import type {  Job, WorkerBid } from '@/shared/types/job';

interface BidCardProps {
  bid: WorkerBid;
  onPress?: () => void;
  task: Job;
}

export default function BidCard({ bid, onPress, task }: BidCardProps) {

  console.log(task)
   const router = useRouter();
  const worker = bid.worker || {};
  const averageRating =
    worker.reviews && worker.reviews.length
      ? worker.reviews.reduce((sum: number, r: any) => sum + Number(r.rating), 0) / worker.reviews.length
      : 0;
  const formattedTimeAgo = bid.date_created
    ? new Date(bid.date_created).toLocaleDateString()
    : '';

 return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Image
          source={
            worker.profile_photo
              ? { uri: worker.profile_photo }
              : require('../assets/images/images/user.png')
          }
          style={styles.avatar}
        />
        <View style={styles.flex1}>
          <View style={styles.rowSpaceBetween}>
            <Text style={styles.workerName}>{worker.name || 'Unnamed'}</Text>
            <Text style={styles.timeAgo}>{formattedTimeAgo}</Text>
          </View>
          <View style={styles.ratingContainer}>
          
          </View>
          <View style={styles.row}>
            <Briefcase size={11} style={styles.icon} color={COLOR_VARIABLES.textShade} />
            <Text style={styles.jobsCompleted}>
              {worker.jobs_completed || 0} jobs completed
            </Text>
          </View>
          <Text style={styles.bidAmount}>Bid: ₦{bid.bid?.toLocaleString()}</Text>
        </View>
      </View>

      <View style={[styles.row, styles.locationRow]}>
        <Location size={11} style={styles.icon} color={COLOR_VARIABLES.textShade} />
        <Text style={styles.locationText}>{worker.location || 'N/A'}</Text>
      </View>

      <Text style={styles.coverLetterHeader}>Cover Letter</Text>
      <Text style={styles.coverLetterText}>{bid.cover_letter}</Text>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.viewProfileButton}
          onPress={() => {
            useJobStore.getState().setJobContext(task, bid.worker, bid);
            router.push("/features/view-profile");
          }}

          >
          <Text style={styles.viewProfileButtonText}>View Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.hireButton}
          onPress={() => {
            useJobStore.getState().setJobContext(task, bid.worker, bid);
            router.push("/features/hire");
          }}
        >
          <Text style={styles.hireButtonText}>Hire</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLOR_VARIABLES.surfacePrimary,
    borderTopWidth:1,
    borderBottomWidth:1,
    borderColor: COLOR_VARIABLES.borderSec,
    paddingVertical: SPACING.lg,
    marginVertical: SPACING.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  rowSpaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  flex1: {
    flex: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    marginRight: SPACING.md,
    borderRadius: 25,
    
  },
  icon: {
    marginTop: 2,
    marginRight: SPACING.xs,
  },
  ratingContainer: {
    alignItems: 'flex-start',
    paddingHorizontal: 2,
    marginBottom: SPACING.xs,
  },
  workerName: {
    ...TEXT_STYLES.body,
    fontWeight: '500',
    fontFamily: 'Manrope',
    fontSize: 14,
    color: COLOR_VARIABLES.textSurfaceGen,
  },
  timeAgo: {
    ...TEXT_STYLES.caption,
    color: COLOR_VARIABLES.textShade,
    fontFamily: 'Manrope',
    fontSize: 10,
    right: 10,
  },
  jobsCompleted: {
    ...TEXT_STYLES.caption,
    color: COLOR_VARIABLES.textShade,
    fontFamily: 'Manrope',
    fontSize: 12,
    marginLeft: SPACING.xs,
  },
  bidAmount: {
    ...TEXT_STYLES.body,
    fontWeight: '600',
    alignSelf: 'flex-start',
    fontFamily: 'Manrope',
    fontSize: 14,
    marginTop: SPACING.xs,
    color: COLOR_VARIABLES.textSurfaceGen,
  },
  locationRow: {
    marginTop: SPACING.md,
  },
  locationText: {
    ...TEXT_STYLES.caption,
    color: COLOR_VARIABLES.textShade,
    fontFamily: 'Manrope',
    fontSize: 12,
    marginLeft: SPACING.xs,
  },
  coverLetterHeader: {
    ...TEXT_STYLES.body,
    fontWeight: '600',
    marginTop: SPACING.lg,
    fontFamily: 'Manrope',
    fontSize: 14,
    color: COLOR_VARIABLES.textSurfaceGen,
  },
  coverLetterText: {
    ...TEXT_STYLES.caption,
    color: COLOR_VARIABLES.textSurfaceGen,
    marginTop: SPACING.sm,
    width: '100%',
    fontSize: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.lg,
    marginTop: SPACING.xl,
  },
  viewProfileButton: {
    backgroundColor: COLOR_VARIABLES.surfacePrimary,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    borderRadius: 8,
    borderWidth:1,
    borderColor:COLOR_VARIABLES.surfaceSecondary,
  },
  viewProfileButtonText: {
    color: COLOR_VARIABLES.textSurfaceSecondary,
    fontWeight: '600',
    fontFamily: 'Manrope',
  },
  hireButton: {
    backgroundColor: COLOR_VARIABLES.surfaceSecondary,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.xl,
    borderRadius: 8,
    borderWidth:1,
    borderColor:COLOR_VARIABLES.surfacePrimary,
  },
  hireButtonText: {
    color: COLOR_VARIABLES.textSurfacePrimary,
    fontWeight: '600',
    fontFamily: 'Manrope',
  },
});