import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TabView, TabBar } from 'react-native-tab-view';
import { COLOR_VARIABLES } from '@/constants/theme/ColorVariables';
import { TEXT_STYLES } from '@/constants/theme/Typography';
import { SPACING } from '@/constants/theme/Spacing';
import Header from '@/components/Header';
import { useLocalSearchParams } from "expo-router";

import ClientTaskList from './ClientTaskList';

interface Route {
  key: 'pending' | 'in-progress' | 'completed';
  title: string;
}

export default function ClientTaskScreen() {
  
  const { focusTab, highlightTaskId } = useLocalSearchParams();
  const [index, setIndex] = useState(() => {
    if (focusTab === "pending") return 0;
    if (focusTab === "in-progress") return 1;
    if (focusTab === "completed") return 2;
    return 0;
  });
  const [routes] = useState<Route[]>([
    { key: 'pending', title: 'Pending' },
    { key: 'in-progress', title: 'In Progress' },
    { key: 'completed', title: 'Completed' },
  ]);

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

  const renderScene = ({ route }: { route: Route }) => (
    <ClientTaskList 
    
      type={route.key}
      highlightTaskId={highlightTaskId}
    />
  );

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
    padding: 10,
  },
  tabIndicator: {
    backgroundColor: COLOR_VARIABLES.surfaceSecondary,
  },
  tabLabel: {
    ...TEXT_STYLES.body,
    textTransform: 'none',
  },
});