import { Tabs } from 'expo-router';
import { StyleSheet, Dimensions } from "react-native";
import { COLOR_VARIABLES } from '../../constants/theme/ColorVariables';
import { 
  HomeIcon, 
  TaskIcon, 
  WalletIcon, 
  NotificationIcon, 
  ProfileIcon 
} from '../../components/navigation/TabBarIcons';

const { height } = Dimensions.get("window");

export default function TabLayout() {
  return (
    <Tabs
    screenOptions={{
        tabBarActiveTintColor: COLOR_VARIABLES.surfaceSecondary,
        tabBarInactiveTintColor: COLOR_VARIABLES.textSurfaceSecondary,
        tabBarStyle: styles.tabBar,
        headerShown: false,
        tabBarItemStyle: { flex: 1 },
        tabBarShowLabel: false, // Hide default labels
      }}
    >
      <Tabs.Screen
     
        name="home"
        options={{
          title: 'Home',                        
          tabBarIcon: ({ focused, color, size }) => (
            <HomeIcon focused={focused} color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="tasks"
        options={{
          title: 'Tasks',
          tabBarIcon: ({ focused, color, size }) => (
            <TaskIcon focused={focused} color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="wallet"
        options={{
          title: 'Wallet',
          tabBarIcon: ({ focused, color, size }) => (
            <WalletIcon focused={focused} color={color} size={size} />
          ),
        }}
      />
    <Tabs.Screen
        name="notifications"
        options={{
          title: 'Notifications',
          tabBarIcon: ({ focused, color, size }) => (
            <NotificationIcon focused={focused} color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused, color, size }) => (
            <ProfileIcon focused={focused} color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    backgroundColor: COLOR_VARIABLES.surfacePrimary,
    paddingTop: 24,
    height: height * 0.11,
  },
});