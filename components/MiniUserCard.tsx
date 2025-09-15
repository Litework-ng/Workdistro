import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import { Star1, Call } from 'iconsax-react-native';
import call from 'react-native-phone-call';
import { TEXT_STYLES } from '@/constants/theme/Typography';
import { SPACING } from '@/constants/theme/Spacing';
import { COLOR_VARIABLES } from '@/constants/theme/ColorVariables';
import { useRoleStore } from '@/shared/stores/useRoleStore';
import type { User } from "@/shared/types/user";
interface MiniUserCardProps {
  user: User;
  variant?: 'default' | 'compact';
  showStats?: boolean;
  viewerType: 'client' | 'worker';
  customLabel?: string;
  showCallButton?: boolean;
}

const MiniUserCard = ({ 
  user, 
  variant = 'default',
  showStats = false,
  viewerType,
  customLabel,
  showCallButton = false,
}: MiniUserCardProps) => {
  const { selectedRole } = useRoleStore();
  if (!user) return null;

  const handleCallPress = () => {
    if (!user.phone_number) return;
    const args = {
      number: user.phone_number,
      prompt: true
    };
    call(args).catch(console.error);
  };

  const getProfileLabel = () => {
    if (customLabel) return customLabel;
    if (selectedRole === 'client') {
      return viewerType === 'client' ? 'DistroWorker' : 'Distro';
    }
    if (selectedRole === 'worker') {
      return viewerType === 'worker' ? 'Distro' : 'DistroWorker';
    }
    return 'Distro';
  };

 const getAverageRating = (): number => {
  if (user.rating !== undefined && user.rating !== null) {
    return Number(user.rating); 
  }
  if (user.reviews && user.reviews.length > 0) {
    const sum = user.reviews.reduce((acc, review) => acc + Number(review.rating), 0);
    return sum / user.reviews.length;
  }
  return 0;
};



  const renderStats = () => {
    if (!showStats) return null;

    return (
      <View style={styles.statsWrapper}>
        <View style={styles.ratingContainer}>
          <Star1 
            size={14} 
            color={COLOR_VARIABLES.surfaceWarning} 
            variant="Bold"
          />
          <Text style={styles.rating}>
            {getAverageRating().toFixed(1)}
          </Text>
        </View>
        
        {/* Only show jobs completed when viewing worker profile */}
        {selectedRole === 'client' && user.jobs_completed !== undefined && (
          <Text style={styles.jobCount}>
            {user.jobs_completed} jobs completed
          </Text>
        )}
      </View>
    );
  };

  return (
    <View style={[
      styles.container,
      variant === 'compact' && styles.compactContainer
    ]}>
      <Text style={styles.label}>{getProfileLabel()} :</Text>

      <View style={styles.contentContainer}>
        <View style={styles.userInfo}>
          <View style={styles.avatarContainer}>
            {user.profile_photo ? (
              <Image
                source={{ uri: user.profile_photo }}
                style={styles.profileImage}
              />
            ) : (
              <View style={styles.profilePlaceholder} />
            )}
          </View>

          <View style={styles.userDetails}>
            <Text style={styles.name}>{user.name}</Text>
            {renderStats()}
          </View>
        </View>

        {showCallButton && user.phone_number && (
          <Pressable
            style={styles.callButton}
            onPress={handleCallPress}
          >
            <Call size={20} color={COLOR_VARIABLES.surfaceGen} variant="Bold" />
          </Pressable>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLOR_VARIABLES.surfacePrimary,
    borderRadius: 8,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLOR_VARIABLES.borderSec,
  },
  compactContainer: {
    padding: SPACING.sm,
    borderWidth: 0,
  },
  label: {
    ...TEXT_STYLES.label,
    color: COLOR_VARIABLES.textShade,
    marginBottom: SPACING.xs,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  avatarContainer: {
    width: 40,
    height: 40,
  },
  profileImage: {
    width: '95%',
    height: '95%',
    borderRadius: 20,
  },
  profilePlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
    backgroundColor: COLOR_VARIABLES.borderSec,
  },
  userDetails: {
    flex: 1,
    gap: SPACING.xs,
    justifyContent:'center',
  },
  name: {
    ...TEXT_STYLES.body,
    color: COLOR_VARIABLES.textSurfaceGen,
    fontSize: 14 // Using a direct value, or you could use TEXT_STYLES.caption.fontSize
  },
  statsWrapper: {
    marginTop: 0,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  rating: {
    ...TEXT_STYLES.caption,
    color: COLOR_VARIABLES.textShade,
  },
  jobCount: {
    ...TEXT_STYLES.caption,
    color: COLOR_VARIABLES.textShade,
    marginTop: SPACING.xs,
  },
  contentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width:'90%',
    
  },
  callButton: {
    padding: SPACING.sm,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLOR_VARIABLES.borderSec,
    backgroundColor: COLOR_VARIABLES.surfacePrimary,
    marginRight: SPACING.lg,
  }
});

export default MiniUserCard;
