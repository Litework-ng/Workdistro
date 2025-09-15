import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Animated,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { router } from 'expo-router';
import Fuse from 'fuse.js';
import { COLOR_VARIABLES } from '@/constants/theme/ColorVariables';
import { TEXT_STYLES } from '@/constants/theme/Typography';
import { SPACING } from '@/constants/theme/Spacing';
import Input from '@/components/InputField';
import { Alert } from '@/components/Alert';
import { Service } from '@/shared/types/service';
import { serviceService } from '@/services/services';
import { useServiceStore } from '@/shared/stores/useServiceStore';
import Header from '@/components/Header';
import SearchIcon from '@/assets/icons/Search.svg';
import Chip from '@/components/Chip'; 
import Exclamation from '@/assets/icons/Exclamation.svg'; 
import Toast from 'react-native-toast-message';

const popularServices = [
  { id: 1, name: 'Grocery Shopping' },
  { id: 2, name: 'Item Delivery' },
  { id: 3, name: 'Chef/Cook' },
  // ...more services
];

const fuseOptions = {
  keys: ['name'],
  threshold: 0.3,
  includeScore: true,
};

export default function SelectServiceScreen() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [showConfirmAlert, setShowConfirmAlert] = useState(false);
  const [isCreatingService, setIsCreatingService] = useState(false);

  const { services } = useServiceStore();

  const fuse = useMemo(() => new Fuse(services, fuseOptions), [services]);

  const filteredServices = useMemo(() => {
    if (!searchTerm) return [];
    return fuse.search(searchTerm).map(result => result.item);
  }, [searchTerm, fuse]);

  const [isInputFocused, setIsInputFocused] = useState(false);

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    setShowConfirmAlert(true);
  };

  const handleConfirm = async () => {
    if (!selectedService) {
        Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'Please select a service first',
            position: 'top',
            visibilityTime: 3000
        });
        return;
    }

    try {
        setIsCreatingService(true); // Start loading
        const response = await serviceService.createService({ 
            id: selectedService.id
        });

        if (response) {
            Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'Service created successfully',
                position: 'top',
                visibilityTime: 4000
            });
            setShowConfirmAlert(false);
            router.push('/(tabs)/home');
        }
    } catch (error: any) {
        console.error('Error details:', error.response?.data); // Debug log
        const errorMessage = error.response?.data?.message || 
                          (error.response?.status === 401 ? 'Unauthorized. Please login again.' : 
                           'Failed to create service. Please try again later.');
        
        Toast.show({
            type: 'error',
            text1: 'Error',
            text2: errorMessage,
            position: 'top',
            visibilityTime: 3000
        });
        
        if (error.response?.status === 401) {
            router.replace('/(auth)/login');
        }
       } finally {
          setIsCreatingService(false); // Stop loading
          setShowConfirmAlert(false);
    }
};

  const searchAnim = useRef(new Animated.Value(0)).current;

useEffect(() => {
  if (searchTerm && filteredServices.length > 0) {
    Animated.timing(searchAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  } else {
    searchAnim.setValue(0); // Reset when no search or no results
  }
}, [searchTerm, filteredServices]);


  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
        setIsInputFocused(false); // close suggestions
      }}
>
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <Header title="Select Service" onBackPress={() => router.push('/onboarding?initialIndex=2')} />
      {!searchTerm && !isInputFocused && (
        <Text style={styles.description}>
          Select the main service you want to offer. You’ll be able to unlock more services as you build your reputation on the app.
        </Text>
      )}


      <View style={styles.searchContainer}>
        <Input
          placeholder="Search services..."
          value={searchTerm}
          onChangeText={setSearchTerm}
          onFocus={() => setIsInputFocused(true)}
          onBlur={() => setIsInputFocused(false)}
          rightIcon={<SearchIcon />}
        />
      </View>

      <ScrollView style={styles.content}>
        {searchTerm && isInputFocused ? (
          <Animated.View
            style={[
              styles.searchResults,
              {
                opacity: searchAnim,
                transform: [
                  {
                    scale: searchAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.95, 1],
                    }),
                  },
                ],
              },
            ]}
          >           
           {filteredServices.map((service) => (
              <Pressable
                key={service.id}
                style={({ pressed }) => [
                  styles.searchResultItem,
                  pressed && styles.searchResultItemPressed
                ]}
                onPress={() => handleServiceSelect(service)}
              >
                <Text style={styles.searchResultText}>{service.name}</Text>
              </Pressable>
            ))}
          </Animated.View>
        ) : (
          <>
            <Text style={styles.sectionTitle}>Popular Services</Text>
            <View style={styles.popularServices}>
              {popularServices.map((service) => (
                <Chip
                  key={service.id}
                  label={service.name}
                  onPress={() => handleServiceSelect(service)}
                />
              ))}
            </View>
          </>
        )}
      </ScrollView>

      <Alert
        visible={showConfirmAlert}
        onClose={() => !isCreatingService && setShowConfirmAlert(false)}
        variant="action2"
        title="Confirm Service"
        description={
          <Text>
            Are you sure you want to select{' '}
            <Text style={styles.selectedServiceText}>
              {selectedService?.name}
            </Text>
            ?
          </Text>
        }
        icon={<Exclamation />}
        showBackIcon={true}
        primaryAction={{
          label: "Confirm",
          onPress: handleConfirm,
          loading: isCreatingService,
          disabled: isCreatingService
        }}
        secondaryAction={{
          label: "Cancel",
          onPress: () => setShowConfirmAlert(false),
          disabled: isCreatingService
        }}
      />
    </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR_VARIABLES.surfacePrimary,
  },
  description:{
    ...TEXT_STYLES.description,
  
    padding: SPACING.lg,
  },
  searchContainer: {
    padding: SPACING.lg,
    marginTop: SPACING.xs
    ,
  },
  content: {
    flex: 1,
    padding: SPACING.lg,

  },
  sectionTitle: {
    ...TEXT_STYLES.title,
    color: COLOR_VARIABLES.textSurfaceGen,
    marginBottom: SPACING.md,
  },
  popularServices: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  searchResults: {
    gap: SPACING.xs,
    backgroundColor: COLOR_VARIABLES.surfacePrimary,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLOR_VARIABLES.borderSec,
    padding: SPACING.sm,
  },
  searchResultItem: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    backgroundColor: COLOR_VARIABLES.surfacePrimary,
    borderRadius: 8,
    borderBottomWidth: 1,
    borderColor: COLOR_VARIABLES.borderSec,
    marginBottom: SPACING.xs,
  },
  searchResultItemPressed: {
    backgroundColor: COLOR_VARIABLES.surfaceGen,
  },
  searchResultText: {
    ...TEXT_STYLES.body,
    color: COLOR_VARIABLES.textSurfaceSecondary,
  },
  selectedServiceText: {
    ...TEXT_STYLES.title,
    color: COLOR_VARIABLES.textSurfaceGen,
  },
});
