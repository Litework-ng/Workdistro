import { COLOR_VARIABLES } from "../../constants/theme/ColorVariables";
import { StyleSheet, Text, View } from "react-native";
import { SvgProps } from "react-native-svg";
import {SPACING} from "@/constants/theme/Spacing"
import HomeActiveIcon from "../../assets/icons/HomeActive.svg";
import HomeInactiveIcon from "../../assets/icons/HomeInactive.svg";
import TaskActiveIcon from "../../assets/icons/TaskActive.svg";
import TaskInactiveIcon from "../../assets/icons/TaskInactive.svg";
import WalletActiveIcon from "../../assets/icons/WalletActive.svg";
import WalletInactiveIcon from "../../assets/icons/WalletInactive.svg";
import NotificationActiveIcon from "../../assets/icons/NotificationActive.svg";
import NotificationInactiveIcon from "../../assets/icons/NotificationInactive.svg";
import ProfileActiveIcon from "../../assets/icons/ProfileActive.svg";
import ProfileInactiveIcon from "../../assets/icons/ProfileInactive.svg";

interface TabBarIconProps {
  focused: boolean;
  color: string;
  size: number;
}

// ✅ Reusable component for each tab icon
const TabBarIcon = ({
  focused,
  ActiveIcon,
  InactiveIcon,
  label,
}: {
  focused: boolean;
  ActiveIcon: React.FC<SvgProps>;
  InactiveIcon: React.FC<SvgProps>;
  label: string;
}) => {
  const Icon = focused ? ActiveIcon : InactiveIcon;

  return (
    <View style={styles.mainContainer}>
      <Icon width={24} height={24} />
      <Text style={focused ? styles.activeText : styles.inActiveText}>
        {label}
      </Text>
    </View>
  );
};

// ✅ Individual icon components
export const HomeIcon = (props: TabBarIconProps) => (
  <TabBarIcon
    {...props}
    ActiveIcon={HomeActiveIcon}
    InactiveIcon={HomeInactiveIcon}
    label="Home"
  />
);

export const TaskIcon = (props: TabBarIconProps)  => (
  <TabBarIcon
  {...props}
    ActiveIcon={TaskActiveIcon}
    InactiveIcon={TaskInactiveIcon}
    label="Tasks"
  />
);

export const WalletIcon = (props: TabBarIconProps) => (
  <TabBarIcon
  {...props}
    ActiveIcon={WalletActiveIcon}
    InactiveIcon={WalletInactiveIcon}
    label="Wallet"
  />
);

export const NotificationIcon = (props: TabBarIconProps) => (
  <TabBarIcon
  {...props}
    ActiveIcon={NotificationActiveIcon}
    InactiveIcon={NotificationInactiveIcon}
    label="Notifications"
  />
);

export const ProfileIcon = (props: TabBarIconProps) => (
  <TabBarIcon
  {...props}
    ActiveIcon={ProfileActiveIcon}
    InactiveIcon={ProfileInactiveIcon}
    label="Profile"
  />
);

// ✅ Styles
const styles = StyleSheet.create({
  mainContainer: {
    flex:1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    
    
  },
  activeText: {
    width: "100%",
    color: COLOR_VARIABLES.surfaceSecondary,
    fontSize: 12,
    fontFamily: "ManropeSemiBold",
    marginTop: SPACING.xs,
    marginHorizontal:'auto',
  },
  inActiveText: {
    width: "100%",
    color: COLOR_VARIABLES.tabLabelText,
    fontSize: 12,
    fontFamily: "ManropeRegular",
    marginTop: SPACING.xs,
  },
});
