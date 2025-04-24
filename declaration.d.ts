// declaration.d.ts
declare module "*.svg" {
    import React from "react";
    import { SvgProps } from "react-native-svg";
    const content: React.FC<SvgProps>;
    export default content;
  }

  declare module 'react-native-onboarding-swiper' {
    import { ComponentType } from 'react';
    import { ViewStyle, ImageSourcePropType } from 'react-native';
  
    interface Page {
      backgroundColor: string;
      image: JSX.Element;
      title: string;
      subtitle: string;
    }
  
    interface Props {
      pages: Page[];
      onSkip?: () => void;
      onDone?: () => void;
      NextButtonComponent?: ComponentType<{ onPress: () => void }>;
      DoneButtonComponent?: ComponentType<{ onPress: () => void }>;
      containerStyles?: ViewStyle;
    }
  
    export default function Onboarding(props: Props): JSX.Element;
  }