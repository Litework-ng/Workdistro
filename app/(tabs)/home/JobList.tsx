import { useCallback } from 'react';
import { 
  FlatList, 
  RefreshControl, 
  StyleSheet, 
  Text,
  View,
  ActivityIndicator
} from 'react-native';
import { useJobs } from '@/shared/hooks/useJobs';
import JobCard from '@/components/JobCard';
import { Job } from '@/shared/types/job';
import { COLOR_VARIABLES } from '@/constants/theme/ColorVariables';
import { SPACING } from '@/constants/theme/Spacing';
import { router } from 'expo-router';

interface JobListProps {
  type: 'bestMatches' | 'mostRecent';
  onRefresh: () => Promise<void>;
  refreshing: boolean;
}

export default function JobList({ type, onRefresh, refreshing, location, locationVersion }: JobListProps & { location: string, locationVersion: number }) {
  const { 
    jobs, 
    loading, 
    error, 
    hasNextPage, 
    fetchNextPage,
    isFetchingNextPage 
  } = useJobs({ type, location, locationVersion }); // Pass location and version

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage]);

  const renderFooter = () => {
    if (!isFetchingNextPage) return null;
    
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color={COLOR_VARIABLES.surfaceSecondary} />
      </View>
    );
  };

  const renderItem = useCallback(({ item }: { item: Job }) => (
 <JobCard 
      job={item} 
      viewerType="worker" 
      onPress={() => item.user && handleJobPress(item)}
      showEllipses
      showUserCard={false}
      actionButton={{
        label: "Bid",
        onPress: (job) => job.user && handleBidPress(item),
        variant: "primary",
      }}
    />  ), []);

  const handleJobPress = (job: Job) => {

  };
    const handleBidPress = (job: Job) => {
      console.log(job.id)
    router.push({
      pathname: '/features/post-bid/placeBid',
       params: { 
        job: JSON.stringify(job) // Serialize job object for navigation
      }
    });
  };

  if (loading && jobs.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLOR_VARIABLES.surfaceSecondary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>Error loading jobs</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={jobs}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl 
          refreshing={refreshing} 
          onRefresh={onRefresh}
        />
      }
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={renderFooter}
      ListEmptyComponent={
        <View style={styles.centered}>
          <Text>No jobs available</Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: SPACING.md,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  footer: {
    paddingVertical: SPACING.lg,
    alignItems: 'center',
  }
});