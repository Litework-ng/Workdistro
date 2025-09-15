import { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView,
  Pressable,
} from 'react-native';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { Job } from '@/shared/types/job';
import { COLOR_VARIABLES } from '@/constants/theme/ColorVariables';
import { SPACING } from '@/constants/theme/Spacing';
import { TEXT_STYLES } from '@/constants/theme/Typography';
import { Location } from 'iconsax-react-native';
import Input from '@/components/InputField';
import Button from '@/components/Button';
import ArrowBack from '@/assets/icons/ArrowBack.svg';
import { bidService } from '@/services/bid';
import { Alert } from '@/components/Alert';
import Toast from 'react-native-toast-message';
import Exclamation from '@/assets/icons/Exclamation.svg'; 
import { useAuthStore } from '@/shared/stores/useAuthStore';

export default function PlaceBid() {
  const { job: jobParam } = useLocalSearchParams();
  const job: Job = JSON.parse(jobParam as string);
  const [showFullDetails, setShowFullDetails] = useState(false);
  const [bidAmount, setBidAmount] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Alerts
  const [showConfirmAlert, setShowConfirmAlert] = useState(false);
  const [showVerifyAlert, setShowVerifyAlert] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  const { user } = useAuthStore();

  const submitBid = async () => {
    // Validate inputs
    if (!bidAmount.trim() || !coverLetter.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Missing Fields',
        text2: 'Please fill in both the bid amount and cover letter.',
        position: 'top',
        visibilityTime: 4000,
      });
      return;
    }

    try {
      setIsLoading(true);

      await bidService.createBid({
        job_id: job.id.toString(),
        cover_letter: coverLetter.trim(),
        bid: bidAmount.trim(),
      });

      // ✅ Show disclaimer alert instead of only toast
      setShowSuccessAlert(true);
    } catch (error: any) {
      if (error.status === 403) {
        Toast.show({
          type: 'error',
          text1: 'Already Bidded',
          text2: 'You have already placed a bid for this job.',
          position: 'top',
          visibilityTime: 4000,
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Failed to submit bid',
          text2: error.message || 'Please try again later',
          position: 'top',
          visibilityTime: 4000,
        });
      }
      console.error('Bid submission error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen 
        options={{
          title: "Place Bid",
          headerShown: true,
          headerLeft: () => (
            <Pressable 
              onPress={() => router.back()}
              style={({ pressed }) => [
                styles.backButton,
                pressed && { opacity: 0.7 }
              ]}
            >
              <ArrowBack/>
            </Pressable>
          ),
        }}
      />

      {/* Confirm Bid Alert */}
      <Alert
        visible={showConfirmAlert}
        onClose={() => setShowConfirmAlert(false)}
        variant="action2"
        title="Confirm Bid"
        icon={<Exclamation />}
        showBackIcon={true}
        description={`Are you sure you want to bid ₦${bidAmount} for this job?`}
        primaryAction={{
          label: "Confirm",
          onPress: submitBid,
          loading: isLoading,
        }}
        secondaryAction={{
          label: "Cancel",
          onPress: () => setShowConfirmAlert(false),
        }}
      />

      {/* Verify Account Alert */}
      <Alert
        visible={showVerifyAlert}
        variant="action"
        icon={<Exclamation />}
        showBackIcon={true}
        onClose={() => setShowVerifyAlert(false)}
        title="Account Not Verified"
        description="Please verify your account to place a bid."
        primaryAction={{
          label: 'Verify Now',
          onPress: () => {
            setShowVerifyAlert(false);
            router.push('/(tabs)/profile/Verify/Verify');
          },
        }}
      />

      {/* ✅ Success Disclaimer Alert */}
      <Alert
        visible={showSuccessAlert}
        variant="action"
        title="Bid Submitted"
        description={
          <Text style={{ fontStyle: "italic" }}>
            Your bid has been placed successfully.{"\n\n"}
            Accepting job offers or payments outside the Workdistro app comes at 
            worker’s own risk. We won’t be liable for any outcomes, and this may 
            also lead to account suspension/deactivation.
          </Text>
        }
        primaryAction={{
          label: "OK",
          onPress: () => {
            setShowSuccessAlert(false);
            router.replace("/(tabs)/home");
          },
        }}
        onClose={() => setShowSuccessAlert(false)}
      />

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Job Details Section */}
          <View style={styles.jobDetails}>
            <Text style={styles.title}>{job.subject}</Text>
            <Text 
              style={styles.description} 
              numberOfLines={showFullDetails ? undefined : 2}
            >
              {job.description}
            </Text>

            <Pressable 
              style={styles.viewDetailsButton}
              onPress={() => setShowFullDetails(!showFullDetails)}
            >
              <Text style={styles.viewDetailsText}>
                {showFullDetails ? 'Show less' : 'View full job'}
              </Text>
            </Pressable>

            {showFullDetails && (
              <View style={styles.details}>
                <View style={styles.detailsRow}>
                  <Location size={16} color={COLOR_VARIABLES.textShade} />
                  <Text style={styles.detailLocationText}>{job.location}</Text>
                </View>
                <Text style={styles.detailText}>Budget: ₦{job.budget}</Text>
              </View>
            )}
          </View>

          {/* Bid Form Section */}
          <View style={styles.bidForm}>
            <Input
              label="Your Bid Amount (₦)"
              value={bidAmount}
              onChangeText={setBidAmount}
              keyboardType="numeric"
              placeholder="Enter your bid amount"
            />

            <Input
              label="Cover Letter"
              value={coverLetter}
              onChangeText={setCoverLetter}
              multiline
              numberOfLines={4}
              placeholder="Explain why you're the best fit for this job"
              textAlignVertical="top"
              maxLength={500}
              showCharacterCount
            />
          </View>
        </ScrollView>

        {/* Submit Button Section */}
        <View style={styles.submitButtonContainer}>
          <Button
            onPress={() => setShowConfirmAlert(true)}
            text="Place Bid"
            variant="secondary"
            loading={isLoading}
            disabled={isLoading || !bidAmount.trim() || !coverLetter.trim()}
          />
        </View>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR_VARIABLES.surfacePrimary,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  backButton: {
    padding: SPACING.xs,
    marginLeft: -SPACING.xs,
  },
  jobDetails: {
    marginBottom: SPACING.xl,
  },
  title: {
    ...TEXT_STYLES.title,
    marginBottom: SPACING.xs,
  },
  description: {
    ...TEXT_STYLES.body,
    color: COLOR_VARIABLES.textShade,
    marginBottom: SPACING.md,
  },
  viewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  viewDetailsText: {
    ...TEXT_STYLES.title,
    color: COLOR_VARIABLES.surfaceGen,
    textDecorationLine: 'underline',
    textDecorationColor: COLOR_VARIABLES.surfaceGen,
  },
  details: {
    marginTop: SPACING.md,
    padding: SPACING.md,
    borderTopWidth: 1,
    borderColor: COLOR_VARIABLES.borderSec,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginBottom: SPACING.xs,
  },
  detailLocationText: {
    ...TEXT_STYLES.body,
    color: COLOR_VARIABLES.textShade,
  },
  detailText: {
    ...TEXT_STYLES.title,
    fontSize: 16,
  },
  bidForm: {
    gap: SPACING.lg,
  },
  submitButtonContainer: {
    padding: SPACING.md,
    paddingBottom: Platform.OS === 'ios' ? SPACING.xxl : SPACING.md,
  },
});
