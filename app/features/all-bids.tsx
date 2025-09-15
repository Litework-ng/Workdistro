import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import Header from '@/components/Header';
import { COLOR_VARIABLES } from '@/constants/theme/ColorVariables';
import { SPACING } from '@/constants/theme/Spacing';
import { TEXT_STYLES } from '@/constants/theme/Typography';
import { bidService } from '@/services/bid';
import BidCard from '@/components/BidCard';
import { taskService } from '@/services/task';
import { useJobStore } from "@/shared/stores/useJobStore";

export default function AllBidsScreen() {
  const { jobId } = useLocalSearchParams();
  const [task, setTask] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const { data: bids, isLoading } = useQuery({
    queryKey: ['job-bids', jobId],
    queryFn: () => bidService.getJobBids(jobId as string),
  });

 
 useEffect(() => {
    if (!jobId) return;
    const fetchTask = async () => {
      try {
        const data = await taskService.getTask(jobId as string);
        setTask(data.data);
      } catch (e) {
        setTask(null);
      } finally {
        setLoading(false);
      }
    };
    fetchTask();
  }, [jobId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLOR_VARIABLES.surfaceSecondary} />
      </View>
    );
  }

  if (!task) {
    return <Text>Could not load job details.</Text>;
  }

  console.log('bids:', bids?.response?.[0]?.bids);
  if (isLoading) {
    return (
      <View style={styles.container}>
        <Header title="All Bids" showBackButton />
         

        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLOR_VARIABLES.surfaceSecondary} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="All Bids" showBackButton />

        <View style= {styles.jobDetailsContainer}>
          <Text style={styles.taskTitle}>{task.subject}</Text>
          <Text style={styles.taskDescription}>{task.description}</Text>
          
        </View>
      <FlatList
      data={bids?.response?.[0]?.bids || []}
      renderItem={({ item }) => (
        <View style={styles.bidCardContainer}>
        <BidCard bid={item} task={task} />
        </View>
      )}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.listContent}
      ListEmptyComponent={
        <Text style={styles.emptyText}>No bids available for this job</Text>
      }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR_VARIABLES.surfacePrimary
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  jobDetailsContainer: {
    padding: SPACING.lg,
    backgroundColor: COLOR_VARIABLES.surfacePrimary,
    borderBottomWidth: 1,
    borderColor: COLOR_VARIABLES.borderSec
  },

  taskTitle:{
    ...TEXT_STYLES.title,
    color: COLOR_VARIABLES.textSurfaceGen,
  },
  taskDescription: {
    ...TEXT_STYLES.label,
    color: COLOR_VARIABLES.textShade,
    marginTop: SPACING.sm
  },
  listContent: {
    padding: SPACING.lg
  },
  bidCardContainer: {
    marginBottom: SPACING.md
  },
  emptyText: {
    ...TEXT_STYLES.body,
    color: COLOR_VARIABLES.textShade,
    textAlign: 'center',
    marginTop: SPACING.xl
  }
});