import { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  Text,
  Image,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useMutation } from '@tanstack/react-query';
import { Location, Wallet } from 'iconsax-react-native';
import { useServiceStore } from '@/shared/stores/useServiceStore';
import { usePostTaskStore } from '@/shared/stores/usePostTaskStore';
import { taskService } from '@/services/task';
import Header from '@/components/Header';
import Button from '@/components/Button';
import { Alert } from '@/components/Alert';
import { COLOR_VARIABLES } from '@/constants/theme/ColorVariables';
import { TEXT_STYLES } from '@/constants/theme/Typography';
import { SPACING } from '@/constants/theme/Spacing';

export default function ReviewScreen() {
  const [isPosting, setIsPosting] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertProps, setAlertProps] = useState<any>(null);

  const { edit, jobId } = useLocalSearchParams();
  const { subject, description, budget, location, images, getFormData } = usePostTaskStore();
  const { services } = useServiceStore();

  const serviceName = subject || 'Unknown Service';

  const createTaskMutation = useMutation({
    mutationFn: taskService.createTask,
    onSuccess: (newTask) => {
      const taskId = String(newTask.response.id);
      setAlertProps({
        visible: true,
        title: "Task Posted Successfully",
       description: (
          <Text style={styles.description}>
            Workers will be notified of your task.{"\n\n"}
            <Text style={{ fontStyle: "italic" }}>
              Accepting bids outside the Workdistro app comes at client’s risk, we won’t be liable for any outcomes. 
              This may also lead to account suspension/deactivation.
            </Text>
          </Text>
        ),
        variant: "action",
        primaryAction: {
          label: "OK",
          onPress: () => {
            setAlertVisible(false);
            router.replace({
              pathname: "/(tabs)/tasks",
              params: { focusTab: "pending", highlightTaskId: taskId },
            });
          },
        },
        onClose: () => setAlertVisible(false),
      });
      setAlertVisible(true);
    },
    onError: (error: any) => {
      setAlertProps({
        visible: true,
        title: "Failed to Post Task",
        description: error?.message || "Please try again",
        variant: "action",
        primaryAction: {
          label: "Close",
          onPress: () => setAlertVisible(false),
        },
        onClose: () => setAlertVisible(false),
      });
      setAlertVisible(true);
    },
  });

  const handlePostTask = async () => {
    setIsPosting(true);
    try {
      if (edit === 'true' && jobId) {
        const id = Array.isArray(jobId) ? jobId[0] : jobId;
        await taskService.updateTask(id, getFormData());
        setAlertProps({
          visible: true,
          title: "Task Updated",
          description: (
            <>
              Your task has been updated successfully.{"\n\n"}
              <Text style={{ fontWeight: "600", color: COLOR_VARIABLES.textShade }}>
                Accepting bids outside the Workdistro app comes at client’s risk, 
                we won’t be liable for any outcomes. This may also lead to account suspension/deactivation.
              </Text>
            </>
          ),
          variant: "action",
          primaryAction: {
            label: "OK",
            onPress: () => {
              setAlertVisible(false);
              router.replace("/(tabs)/tasks");
            },
          },
          onClose: () => setAlertVisible(false),
        });
        setAlertVisible(true);
      } else {
        await createTaskMutation.mutateAsync(getFormData());
      }
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Review Task" showBackButton={true} onBackPress={() => router.back()} />

      <View style={styles.progressHeader}>
        <View style={styles.progressBar}>
          <View style={styles.progressFill} />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Task Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Task Details</Text>
          <View style={styles.detailContainer}>
            <Text style={styles.label}>Service Type</Text>
            <Text style={styles.value}>{serviceName}</Text>
          </View>
          <View style={styles.detailContainer}>
            <Text style={styles.label}>Description</Text>
            <Text style={styles.value}>{description}</Text>
          </View>
        </View>

        {/* Budget & Location */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Budget & Location</Text>
          <View style={styles.row}>
            <Wallet size={20} color={COLOR_VARIABLES.textShade} />
            <Text style={styles.value}>₦{Number(budget).toLocaleString()}</Text>
          </View>
          <View style={styles.row}>
            <Location size={20} color={COLOR_VARIABLES.textShade} />
            <Text style={styles.value}>{location}</Text>
          </View>
        </View>

        {/* Photos */}
        {images && images.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Photos</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.photosContainer}
            >
              {images.map((uri, index) => (
                <Image 
                  key={index}
                  source={{ uri: typeof uri === 'string' ? uri : URL.createObjectURL(uri) }} 
                  style={styles.photo} 
                />
              ))}
            </ScrollView>
          </View>
        )}
      </ScrollView>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <Button
          text="Edit Task"
          variant="outline"
          onPress={() => router.back()}
          disabled={isPosting}
        />
        <Button
          text="Post Task"
          variant="secondary"
          onPress={handlePostTask}
          loading={isPosting}
          disabled={isPosting}
        />
      </View>

      {/* Custom Alert */}
      {alertProps && (
        <Alert {...alertProps} visible={alertVisible} onClose={() => setAlertVisible(false)} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR_VARIABLES.surfacePrimary,
    padding: SPACING.lg,
  },
  progressHeader: {
    marginVertical: SPACING.xl,
  },
  progressBar: {
    height: 2,
    backgroundColor: COLOR_VARIABLES.borderSec,
    borderRadius: 2,
  },
  progressFill: {
    width: '100%',
    height: '100%',
    backgroundColor: COLOR_VARIABLES.surfaceGen,
    borderRadius: 2,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    ...TEXT_STYLES.label,
    color: COLOR_VARIABLES.textSurfaceGen,
    marginBottom: SPACING.md,
  },
  detailContainer: {
    marginBottom: SPACING.md,
  },
  description: {
  ...TEXT_STYLES.description,
  textAlign: 'center',
  marginBottom: SPACING.md,
  fontStyle: 'italic', 
},
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  label: {
    ...TEXT_STYLES.caption,
    color: COLOR_VARIABLES.textShade,
    marginBottom: SPACING.xs,
  },
  value: {
    ...TEXT_STYLES.body,
    color: COLOR_VARIABLES.textSurfaceGen,
  },
  photosContainer: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  photo: {
    width: 120,
    height: 120,
    borderRadius: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginTop: SPACING.lg,
  },
});
