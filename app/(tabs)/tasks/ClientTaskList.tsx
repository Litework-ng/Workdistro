import { FlatList, Text, ActivityIndicator, View } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { TaskType } from '@/shared/types/job';
import JobCard from '@/components/JobCard';
import { useClientTasks } from '@/shared/hooks/useClientTasks';
import { taskService } from '@/services/task';
import { useAuthStore } from '@/shared/stores/useAuthStore';
import { Alert } from '@/components/Alert';
import { Trash } from 'iconsax-react-native';
import { COLOR_VARIABLES } from '@/constants/theme/ColorVariables';
import Toast from 'react-native-toast-message';
import Animated, {
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  useAnimatedStyle,
} from "react-native-reanimated";

function HighlightableJobCard({
  item,
  type,
  isDeleting,
  onCancelTask,
  isHighlighted,
}: any) {
  const opacity = useSharedValue(1);

  useEffect(() => {
    if (isHighlighted) {
      opacity.value = withRepeat(
        withSequence(
          withTiming(0.3, { duration: 500 }),
          withTiming(1, { duration: 500 })
        ),
        3, // pulse 3 times
        false
      );
    } else {
      opacity.value = 1; // reset when not highlighted
    }
  }, [isHighlighted]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[{ padding: 12 }, animatedStyle]}>
      <JobCard
        job={item}
        viewerType="client"
        showUserCard
        variant="default"
        type={type}
        showEditButton={type === 'pending'}
        onCancelTask={onCancelTask}
        isDeleting={isDeleting === item.id}
      />
    </Animated.View>
  );
}

export default function ClientTaskList({
  type,
  highlightTaskId,
}: {
  type: TaskType;
  highlightTaskId?: string;
}) {
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [showCancelAlert, setShowCancelAlert] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  const flatListRef = useRef<FlatList<any>>(null);

  const { token } = useAuthStore();
  const {
    tasks,
    loading,
    isFetching,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useClientTasks({ type });

  // 🔄 Reload tasks whenever highlightTaskId changes
  useEffect(() => {
    const reloadAndHighlight = async () => {
      if (highlightTaskId) {
        await refetch();

     
       
      }
    };
    reloadAndHighlight();
  }, [highlightTaskId]);

  const handleCancelTask = (jobId: string) => {
    setSelectedJobId(jobId);
    setShowCancelAlert(true);
  };

  const confirmCancelTask = async () => {
    if (!selectedJobId) return;

    try {
      setIsDeleting(selectedJobId);
      setShowCancelAlert(false);

      await taskService.deleteTask(selectedJobId);

      // Refresh the list
      await refetch();

      Toast.show({
        type: 'success',
        text1: 'Task Canceled',
        text2: 'Your task has been successfully canceled',
        position: 'top',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Failed to Cancel Task',
        text2:
          error instanceof Error ? error.message : 'Please try again later',
        position: 'top',
      });
    } finally {
      setIsDeleting(null);
      setSelectedJobId(null);
    }
  };

  return (
    <>
      <FlatList
        ref={flatListRef}
        data={tasks}
        extraData={highlightTaskId} // ✅ ensures highlight triggers re-render
        renderItem={({ item }) => (
          <HighlightableJobCard
            item={item}
            type={type}
            isDeleting={isDeleting}
            onCancelTask={handleCancelTask}
            isHighlighted={String(item.id) === highlightTaskId} // ✅ compare as string
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) fetchNextPage();
        }}
        onEndReachedThreshold={0.5}
        refreshing={isFetching}
        onRefresh={refetch}
        ListEmptyComponent={
          !loading && !isFetching ? (
            <View
              style={{
                flex: 1,
                padding: 106,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text>No tasks found</Text>
            </View>
          ) : null
        }
        ListFooterComponent={
          isFetchingNextPage ? (
            <View style={{ padding: 16, alignItems: 'center' }}>
              <ActivityIndicator size="small" color="#000" />
            </View>
          ) : null
        }
      />

      <Alert
        visible={showCancelAlert}
        variant="delete"
        icon={<Trash size={48} color={COLOR_VARIABLES.dangerText} />}
        title="Cancel Task"
        description="Are you sure you want to cancel this task? This action cannot be undone and any bids will be removed."
        onClose={() => setShowCancelAlert(false)}
        primaryAction={{
          label: 'Cancel Task',
          onPress: confirmCancelTask,
          loading: isDeleting !== null,
          disabled: isDeleting !== null,
        }}
        secondaryAction={{
          label: 'Keep Task',
          onPress: () => setShowCancelAlert(false),
        }}
      />
    </>
  );
}
