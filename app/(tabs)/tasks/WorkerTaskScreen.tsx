import { useState, useCallback, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { TabView, TabBar } from 'react-native-tab-view';
import { COLOR_VARIABLES } from '@/constants/theme/ColorVariables';
import { TEXT_STYLES } from '@/constants/theme/Typography';
import { SPACING } from '@/constants/theme/Spacing';
import Header from '@/components/Header';
import WorkerTaskList from './WorkerTaskList';

interface Route {
  key: 'bids' | 'in-progress' | 'completed';
  title: string;
}

export default function WorkerTaskScreen() {
  const [index, setIndex] = useState(0);
  const [routes] = useState<Route[]>([
    { key: 'bids', title: 'Bids' },
    { key: 'in-progress', title: 'In Progress' },
    { key: 'completed', title: 'Completed' },
  ]);

  // Pre-create components for each tab
  const BidsTab = useMemo(() => <WorkerTaskList type="bids" />, []);
  const InProgressTab = useMemo(() => <WorkerTaskList type="in-progress" />, []);
  const CompletedTab = useMemo(() => <WorkerTaskList type="completed" />, []);

  const renderTabBar = (props: any) => (
    <TabBar
      {...props}
      indicatorStyle={styles.tabIndicator}
      style={styles.tabBar}
      labelStyle={styles.tabLabel}
      activeColor={COLOR_VARIABLES.surfaceSecondary}
      inactiveColor={COLOR_VARIABLES.textShade}
    />
  );

  const renderScene = useCallback(({ route }: { route: Route }) => {
    switch (route.key) {
      case 'bids':
        return BidsTab;
      case 'in-progress':
        return InProgressTab;
      case 'completed':
        return CompletedTab;
      default:
        return null;
    }
  }, [BidsTab, InProgressTab, CompletedTab]);

  return (
    <View style={styles.container}>
      <Header title="Tasks" showBackButton={false} />
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        renderTabBar={renderTabBar}
        lazy
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR_VARIABLES.surfacePrimary,
    paddingVertical:SPACING.md,
  },
  tabBar: {
    backgroundColor: COLOR_VARIABLES.surfacePrimary,
    borderBottomWidth: 1,
    borderBottomColor: COLOR_VARIABLES.borderSec,
  },
  tabIndicator: {
    backgroundColor: COLOR_VARIABLES.surfaceSecondary,
  },
  tabLabel: {
    ...TEXT_STYLES.body,
    textTransform: 'none',
  },
});