import React, { useRef, useState } from "react";
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView,
  Dimensions,
  Image
} from "react-native";
import Swiper from "react-native-swiper";
import { router } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLOR_VARIABLES } from "@/constants/theme/ColorVariables";
import { TEXT_STYLES } from "@/constants/theme/Typography";
import { SPACING } from "@/constants/theme/Spacing";
import OnboardingOne from "@/assets/icons/OnboardingOne.svg";
import OnboardingTwo from "@/assets/icons/OnboardingTwo.svg";
import Copy from "@/assets/icons/Copy.svg";
import Frame from "@/assets/icons/Frame.svg";
import Lice from "@/assets/icons/SlideImg1.svg"
import Live from "@/assets/icons/Live.svg";
import Kopo from "@/assets/icons/Kopo.svg";
import See from "@/assets/icons/See.svg";
import Flat from "@/assets/icons/Flat.svg";
import Button from "@/components/Button";
import RoleSelector from  "./roleSelector";
import { useRoleStore } from '@/shared/stores/useRoleStore';


const OnboardingScreen = () => {
  const swiperRef = useRef<Swiper>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { selectedRole } = useRoleStore(); 

  const handleComplete = async () => {
    try {
      await AsyncStorage.setItem('hasOnboarded', 'true');
      // Navigate to registration instead of home
      router.replace('/(auth)/register');
    } catch (error) {
      console.error('Failed to save onboarding status:', error);
    }
  };

  const handleSkip = () => {
    swiperRef.current?.scrollTo(2); // Skip to the last slide
  };

  const renderPagination = (index: number) => {
    const total = 3;
    const indicators = [];

    for (let i = 0; i < total; i++) {
      indicators.push(
        <TouchableOpacity
          key={i}
          style={[
            styles.paginationDot,
            i === index ? styles.paginationActive : styles.paginationInactive
          ]}
          onPress={() => {
            swiperRef.current?.scrollBy(i - index);
          }}
        />
      );
    }

    return (
      <View style={styles.paginationContainer}>
        <View style={styles.indicators}>{indicators}</View>
        <View style={styles.buttonContainer}>
        {index === total - 1 ? (
          <Button
            text="Get Started"
            variant="secondary"
            onPress={handleComplete}
            disabled={!selectedRole}
          />
        ) : (
          <Button
            text="Next"
            variant="secondary"
            onPress={() => {
              swiperRef.current?.scrollBy(1);
            }}
          />
        )}
      </View>
      </View>
    );
  };

  const slides = [
    {
      icon: <Lice width={300} height={300} />,
      title: "Delegate Tasks The Easy Way",
      description: "Find handy workers to help with your tasks, whatever they are, wherever you are.",
    },
    {
      icon: <Kopo width={300} height={300} />,
      title: "Turn Your Skills To Earnings",
      description: "Connect with people who need your skills close to you.",
    },
    {
      icon: <OnboardingTwo width={300} height={300} />,
      title: "How Will You Be Using Workdistro Today?",
      description: "Don't worry, you can switch later in settings.",
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}> 
        <See style={styles.logo} width={230} height={48}/>
        {currentIndex !== slides.length - 1 && (
          <TouchableOpacity 
            style={styles.skipButton} 
            onPress={handleSkip}
          >
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        )}
      </View>

      <Swiper
        ref={swiperRef}
        loop={false}
        showsPagination={false}
        onIndexChanged={setCurrentIndex}
      >
            {slides.map((slide, index) => (
        <View key={index} style={styles.slide}>
          {index !== 2 ? (
            <>
              <View style={styles.textContainer}>
                <Text style={styles.title}>{slide.title}</Text>
                <Text style={styles.description}>{slide.description}</Text>
              </View>
              <View>
                {slide.icon}
              </View>
            </>
          ) : (
            <View style={styles.fullCustom}>
              <RoleSelector />
            </View>
          )}
        </View>
      ))}
      </Swiper>

      {renderPagination(currentIndex)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR_VARIABLES.surfacePrimary,
  },
  header:{
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
    
  },
  logo:{
    marginTop:15,
  },
  skipButton: {
    position: 'absolute',
    top: SPACING.xl,
    right: SPACING.lg,
    zIndex: 1,
  },
  skipText: {
    ...TEXT_STYLES.description,
    color: COLOR_VARIABLES.textShade,
  },
  slide: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.xl,
    
  },
  title: {
    ...TEXT_STYLES.title,
    color: COLOR_VARIABLES.textSurfaceGen,
    textAlign: 'center',
    marginTop: SPACING.xl,
    marginBottom: SPACING.sm,
    width:311,
  },
  description: {
    ...TEXT_STYLES.description,
    textAlign: 'center',
    width:298,
  },
  textContainer: {
    
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.xl,
    
  },
  paginationContainer: {
    position: 'absolute',
    bottom: SPACING.md,
    left: 0,
    right: 0,
    alignItems: 'center',
    
  },
  indicators: {
    flexDirection: 'row',
    marginBottom: SPACING.lg,
  },
  paginationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  paginationActive: {
    backgroundColor: COLOR_VARIABLES.surfaceGen,
  },
  paginationInactive: {
    backgroundColor: COLOR_VARIABLES.surfaceOptical,
  },
  fullCustom: {
    flex: 1,
    
    paddingHorizontal: SPACING.sm,
  },

  buttonContainer: {
    width: '90%',
    paddingHorizontal: SPACING.xs,
  },



});

export default OnboardingScreen;