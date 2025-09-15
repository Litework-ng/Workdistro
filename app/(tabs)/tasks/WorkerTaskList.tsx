import { FlatList, Text, ActivityIndicator, View, StyleSheet } from 'react-native';
import { useState } from 'react';
import { TaskType } from '@/shared/types/job';
import JobCard from '@/components/JobCard';
import { useWorkerTasks } from '@/shared/hooks/useWorkerTasks';
import { bidService } from '@/services/bid';
import { useAuthStore } from '@/shared/stores/useAuthStore';
import { Alert } from '@/components/Alert';
import { Trash } from 'iconsax-react-native';
import { COLOR_VARIABLES } from '@/constants/theme/ColorVariables';
import Toast from 'react-native-toast-message';

export default function WorkerTaskList({ type }: { type: TaskType }) {
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [showWithdrawAlert, setShowWithdrawAlert] = useState(false);
  const [selectedBidId, setSelectedBidId] = useState<string | null>(null);
  const { token } = useAuthStore();

  const {
    tasks,
    isLoading,
    isFetching,
    onRefresh,
    loadMore,
    hasNextPage,
    isFetchingNextPage,
  } = useWorkerTasks(type);

  const handleWithdrawBid = (bidId: string) => {
    setSelectedBidId(bidId);
    setShowWithdrawAlert(true);
  };

  const confirmWithdrawBid = async () => {
    if (!selectedBidId) return;

    try {
      setIsDeleting(selectedBidId);
      setShowWithdrawAlert(false);

      await bidService.withdrawBid(selectedBidId);

      // Refresh the list
      onRefresh();

      Toast.show({
        type: 'success',
        text1: 'Bid Withdrawn',
        text2: 'Your bid has been successfully withdrawn',
        position: 'top',
      });

    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Failed to Withdraw Bid',
        text2: error instanceof Error ? error.message : 'Please try again later',
        position: 'top',
      });
    } finally {
      setIsDeleting(null);
      setSelectedBidId(null);
    }
  };

  return (
    <>
      <FlatList
        data={tasks}
        renderItem={({ item }) => (
          <View style={styles.cardContainer}>
            <JobCard
              job={item}
              viewerType="worker"
              showUserCard={type !== 'bids'}
              variant="default"
              type={type}
              onWithdrawBid={handleWithdrawBid}
              isDeleting={isDeleting === item.bid_id}
            />
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) loadMore();
        }}
        onEndReachedThreshold={0.5}
        refreshing={isFetching}
        onRefresh={onRefresh}
        ListEmptyComponent={
          !isLoading && !isFetching ? (
            <Text>No tasks found</Text>
          ) : null
        }
        ListFooterComponent={
          isFetchingNextPage ? (
            <View style={styles.footer}>
              <ActivityIndicator size="small" color="#000" />
            </View>
          ) : null
        }
      />

      <Alert
        visible={showWithdrawAlert}
        variant="delete"
        icon={<Trash size={48} color={COLOR_VARIABLES.dangerText} />}
        title="Withdraw Bid"
        description="Are you sure you want to withdraw your bid? This action cannot be undone."
        onClose={() => setShowWithdrawAlert(false)}
        primaryAction={{
          label: 'Withdraw Bid',
          onPress: confirmWithdrawBid,
          loading: isDeleting !== null,
          disabled: isDeleting !== null,
        }}
        secondaryAction={{
          label: 'Keep Bid',
          onPress: () => setShowWithdrawAlert(false),
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    padding: 12,
  },
  footer: {
    padding: 16,
    alignItems: 'center',
  },
});