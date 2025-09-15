import { memo, useState } from 'react';
import JobCardMenu from './JobCardMenu';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import { router,  } from 'expo-router';
import {
  Location,
  Clock,
  Wallet,
  ArrowRight,
  More,
  Edit,
} from 'iconsax-react-native';
import { COLOR_VARIABLES } from '@/constants/theme/ColorVariables';
import { TEXT_STYLES } from '@/constants/theme/Typography';
import { SPACING } from '@/constants/theme/Spacing';
import type { Job } from "@/shared/types/job";
import MiniUserCard from './MiniUserCard';
import { useJobStore } from "@/shared/stores/useJobStore";








interface ActionButton {
  text: string;
  onPress: () => void;
  type?: 'primary' | 'secondary';
}

interface ActionButtonProps {
  icon?: React.ReactNode;
  label: string;
  onPress: (job: Job) => void;
  variant?: 'primary' | 'secondary';
}

interface JobCardProps {
   job: Job 
  viewerType: 'client' | 'worker';
  variant?: 'default' | 'compact';
  showUserCard?: boolean;
  type?: 'bids' | 'pending' | 'in-progress' | 'completed';
  onWithdrawBid?: (jobId: string) => void;
  onCancelTask?: (jobId: string) => void;
  showActions?: boolean;
  actionButton?: ActionButtonProps;
  showEditButton?: boolean;
  isDeleting?: boolean;
  showEllipses?: boolean;
  actions?: ActionButton[];
  onPress?: (job: Job) => void;
  bidAmount?: string;
  showCallButton?: boolean;
  onCallPress?: () => void;
  onViewBids?: (jobId: string) => void;
}
const JobCard = memo(
  ({
    job,
    viewerType,
    type,
    showCallButton = false,
    onCallPress,
    onWithdrawBid,
    onCancelTask,
    bidAmount,
    showUserCard = false,
    showActions = false,
    showEditButton = false,
    isDeleting = false,
    showEllipses = false,
    actions = [],
    onPress,
    variant = 'default',
    actionButton,
  }: JobCardProps) => {
    const [menuVisible, setMenuVisible] = useState(false);

    const handleReport = () => {
      setMenuVisible(false);
    };

    const handleNotBestFit = () => {
      setMenuVisible(false);
    };

    const { setJobContext } = useJobStore();

    const formattedDate = new Date(job.date_created).toLocaleDateString(
      'en-NG',
      {
        day: 'numeric',
        month: 'short',
      }
    );


    
    const handleImagePress = () => {
      if (!job.images || job.images.length === 0) return;
      setJobContext(job, job.worker, undefined);
      router.push("/features/task-image-viewer");
    };

    const renderActionButton = () => {
      if (!type) return null;

      switch (type) {
        case 'bids':
          return viewerType === 'worker' ? (
            <Text
              onPress={() => onWithdrawBid?.(job.id)}
              style={[
                styles.withdrawText,
                isDeleting && styles.disabledText,
              ]}
            >
              {isDeleting ? 'Withdrawing...' : 'Withdraw Bid'}
            </Text>
          ) : null;

        case 'pending':
          return viewerType === 'client' ? (
            <Text
              onPress={() => onCancelTask?.(job.id)}
              style={[
                styles.withdrawText,
                isDeleting && styles.disabledText,
              ]}
            >
              {isDeleting ? 'Canceling...' : 'Cancel Task'}
            </Text>
          ) : null;
      }
    };

    const renderCardActionButton = () => {
      if (viewerType === 'client') {
        if (type === 'pending') {
          return (
            <Pressable
              onPress={() =>
                router.push({
                  pathname: '/features/all-bids',
                  params: { jobId: job.id },
                })
              }
              style={({ pressed }) => [
                styles.actionButtonBase,
                styles.actionButtonPrimary,
                pressed && styles.actionButtonPressed,
              ]}
            >
              <Text style={styles.actionButtonText}>View Bids</Text>
            </Pressable>
          );
        }

        if (type === 'in-progress') {
          return (
            <Pressable
              onPress={() => actionButton?.onPress(job)}
              style={({ pressed }) => [
                styles.actionButtonBase,
                styles.actionButtonPrimary,
                pressed && styles.actionButtonPressed,
              ]}
            >
              <Text style={styles.actionButtonText}>Track Task</Text>
            </Pressable>
          );
        }

        if (type === 'completed') {
          return (
            <Pressable
              onPress={() => actionButton?.onPress(job)}
              style={({ pressed }) => [
                styles.actionButtonBase,
                styles.actionButtonPrimary,
                pressed && styles.actionButtonPressed,
              ]}
            >
              {actionButton?.icon}
              <Text style={styles.actionButtonText}>Re-Hire</Text>
            </Pressable>
          );
        }
      }

      if (viewerType === 'worker') {
        if (!type) {
          return (
            <Pressable
              onPress={() => actionButton?.onPress(job)}
              style={({ pressed }) => [
                styles.actionButtonBase,
                styles.actionButtonPrimary,
                pressed && styles.actionButtonPressed,
              ]}
            >
              <Text style={styles.actionButtonText}>
                {actionButton?.label || 'Place Bid'}
              </Text>
            </Pressable>
          );
        }
        if (type === 'in-progress') {
          return (
            <Pressable
              onPress={() => actionButton?.onPress(job)}
              style={({ pressed }) => [
                styles.actionButtonBase,
                styles.actionButtonPrimary,
                pressed && styles.actionButtonPressed,
              ]}
            >
              <Text style={styles.actionButtonText}>Update Task</Text>
            </Pressable>
          );
        }
        return null;
      }

      return null;
    };

    return (
      <View
        style={[
          styles.container,
          variant === 'compact' && styles.compactContainer,
        ]}
      >
        {/* HEADER WITH 3 COLUMNS */}
        <View style={styles.header}>
          {/* Column 1: Image */}
         {job.images?.[0]?.image && (
      <TouchableOpacity onPress={handleImagePress} activeOpacity={0.8}>
    <Image
      source={{ uri: job.images[0].image }}
      style={styles.serviceImage}
    />
  </TouchableOpacity>
)}

          {/* Column 2: Title + Description */}
          <View style={styles.middleColumn}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.title} numberOfLines={1}>
                {job.subject}
              </Text>
              {showEditButton && (
                <TouchableOpacity
                  onPress={() =>
                    router.push({
                      pathname: '/features/post-task/description',
                      params: { edit: 'true', taskId: job.id },
                    })
                  }
                >
                  <Edit size={17} color={COLOR_VARIABLES.textSurfaceGen} />
                </TouchableOpacity>
              )}
            </View>
            <Text style={styles.description} numberOfLines={2}>
              {job.description}
            </Text>
          </View>

          {/* Column 3: Ellipses / Cancel Button */}
          <View style={styles.rightColumn}>
            {showEllipses && (
              <TouchableOpacity
                style={styles.ellipses}
                onPress={() => setMenuVisible(true)}
              >
                <More size={18} color={COLOR_VARIABLES.textShade} />
              </TouchableOpacity>
            )}
            {renderActionButton()}
          </View>
        </View>

        <JobCardMenu
          visible={menuVisible}
          onClose={() => setMenuVisible(false)}
          onReport={handleReport}
          onNotBestFit={handleNotBestFit}
        />

        {/* Meta Info */}
        <View style={styles.metaRow}>
          <View style={styles.footerItemText}>
            <Location size={16} color={COLOR_VARIABLES.textShade} />
            <Text style={styles.footerText}>{job.location}</Text>
          </View>
          <View style={styles.footerItem}>
            <Clock size={16} color={COLOR_VARIABLES.textShade} />
            <Text style={styles.footerText}>{formattedDate}</Text>
          </View>
        </View>

        <View style={styles.budgetRow}>
          <View style={styles.amountItem}>
            <Text style={styles.amountText}>Budget: ₦{job.budget}</Text>
          </View>
          {job.bid_amount && (
            <View style={styles.amountItem}>
              <Text style={styles.amountText}>Bid: ₦{job.bid_amount}</Text>
            </View>
          )}
        </View>

        {/* Mini Profile */}
        {showUserCard &&
          (viewerType === 'client' ? job.worker : job.user) && (
            <MiniUserCard
              user={
                viewerType === 'client'
                  ? {
                      ...job.worker!,
                      is_worker: true,
                      profile_photo: job.worker?.profile_photo || '',
                      name: job.worker?.name || 'Worker',
                    }
                  : {
                      ...job.user!,
                      is_worker: false,
                      profile_photo: job.user?.profile_photo || '',
                      name: job.user?.name || 'Client',
                    }
              }
              showStats
              variant="compact"
              showCallButton={job.status === 'in_progress'}
              viewerType={viewerType}
            />
          )}

        {renderCardActionButton()}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLOR_VARIABLES.surfacePrimary,
    borderRadius: 8,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLOR_VARIABLES.borderSec,
  },
  compactContainer: {
    padding: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  middleColumn: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: SPACING.sm,
  },
  rightColumn: {
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    marginLeft: SPACING.sm,
  },
  withdrawText: {
    ...TEXT_STYLES.caption,
    color: COLOR_VARIABLES.dangerText,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
  },
  serviceImage: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: COLOR_VARIABLES.surfaceNeautral,
  },
  title: {
    ...TEXT_STYLES.title,
    color: COLOR_VARIABLES.textSurfaceGen,
    flexShrink: 1,
    marginRight: SPACING.xs,
  },
  ellipses: {
    padding: SPACING.xs,
  },
  disabledText: {
    opacity: 0.5,
  },
  description: {
    ...TEXT_STYLES.label,
    color: COLOR_VARIABLES.greyedOutText,
    width: 189,
    marginRight: SPACING.sm,
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  footerItemText: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    width: '70%',
  },
  footerText: {
    ...TEXT_STYLES.caption,
    color: COLOR_VARIABLES.textShade,
  },
  amountItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginTop: SPACING.md,
  },
  amountText: {
    ...TEXT_STYLES.title,
    fontSize: 14,
    color: COLOR_VARIABLES.textSurfaceGen,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: SPACING.sm,
  },
  budgetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  actionButtonBase: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm,
    borderRadius: 8,
    marginTop: SPACING.md,
  },
  actionButtonPrimary: {
    backgroundColor: COLOR_VARIABLES.surfaceSecondary,
    width: '60%',
    alignSelf: 'center',
  },
  actionButtonPressed: {
    opacity: 0.8,
  },
  actionButtonText: {
    ...TEXT_STYLES.buttonText,
    color: COLOR_VARIABLES.textSurfacePrimary,
  },
});

export default JobCard;
