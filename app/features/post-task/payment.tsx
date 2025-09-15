import { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  ActivityIndicator,
  Animated,
  Keyboard,
  TouchableWithoutFeedback
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Location as LocationIcon, SearchNormal } from 'iconsax-react-native';
import * as Location from 'expo-location';
import Input from '@/components/InputField';
import Button from '@/components/Button';
import Header from '@/components/Header';
import { usePostTaskStore } from '@/shared/stores/usePostTaskStore';
import { COLOR_VARIABLES } from '@/constants/theme/ColorVariables';
import { TEXT_STYLES } from '@/constants/theme/Typography';
import { SPACING } from '@/constants/theme/Spacing';
import Toast from 'react-native-toast-message';

const validationSchema = Yup.object().shape({
  budget: Yup.number()
    .typeError('Budget must be a number')
    .required('Budget is required')
    .min(1000, 'Budget must be at least ₦1000'),
  location: Yup.string()
    .required('Location is required')
    .min(3, 'Location must be at least 3 characters'),
});

interface FormValues {
  budget: string;
  location: string;
}

interface PlaceSuggestion {
  place_id: string;
  description: string;
  structured_formatting?: {
    main_text: string;
    secondary_text: string;
  };
}

const GOOGLE_PLACES_API_KEY = 'AIzaSyB2CbZk-225Mj978qzNqhry8L8FMO5jpJc'; // move to .env

export default function PaymentScreen() {
  const { budget, location, setField, reset } = usePostTaskStore();
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [isFocusingLocation, setIsFocusingLocation] = useState(false);

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const locationInputRef = useRef<TextInput>(null);
  const { edit, taskId } = useLocalSearchParams();



  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: isFocusingLocation ? 0 : 1,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [isFocusingLocation]);

  const handleGetCurrentLocation = async (
    setFieldValue: (field: string, value: string) => void
  ) => {
    try {
      setIsGettingLocation(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Toast.show({
          type: 'error',
          text1: 'Permission Denied',
          text2: 'Location permission is required',
        });
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const address = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (address[0]) {
        const { city, region, street, name } = address[0];
        const locationString = street && name
          ? `${name}, ${street}, ${city}, ${region}`
          : `${city}, ${region}`;
        setFieldValue('location', locationString);
        setShowSuggestions(false);
        setIsFocusingLocation(false);
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Location Error',
        text2: 'Unable to get current location',
      });
    } finally {
      setIsGettingLocation(false);
    }
  };

  const searchPlaces = async (query: string) => {
    if (query.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsLoadingSuggestions(true);
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(query)}&components=country:ng&language=en&key=${GOOGLE_PLACES_API_KEY}`
      );
      const data = await response.json();
      if (data.status === 'OK' && data.predictions) {
        setSuggestions(data.predictions);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } catch (error) {
      console.error('Places API Error:', error);
      setSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  const handleLocationInputChange = (
    text: string,
    setFieldValue: (field: string, value: string) => void
  ) => {
    setFieldValue('location', text);
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => {
      searchPlaces(text);
    }, 300);
  };

const handleSuggestionSelect = (
  suggestion: PlaceSuggestion,
  setFieldValue: (field: string, value: string) => void
) => {
  setFieldValue('location', suggestion.description);
  setShowSuggestions(false);
  setSuggestions([]);
  setIsFocusingLocation(false);
  Keyboard.dismiss();
  locationInputRef.current?.blur();
};


  const handleSubmit = (values: FormValues) => {
    setField('budget', values.budget);
    setField('location', values.location);
    router.push({
      pathname: '/features/post-task/review',
      params: { edit, taskId }
    });
  };

  const renderSuggestionWithSetField = (setFieldValue: (field: string, value: string) => void) =>
    ({ item }: { item: PlaceSuggestion }) => (
      <TouchableOpacity
        style={styles.suggestionItem}
        onPress={() => handleSuggestionSelect(item, setFieldValue)}
      >
        <SearchNormal size={16} color={COLOR_VARIABLES.textShade} />
        <View style={styles.suggestionTextContainer}>
          <Text style={styles.suggestionMainText}>
            {item.structured_formatting?.main_text || item.description}
          </Text>
          {item.structured_formatting?.secondary_text && (
            <Text style={styles.suggestionSecondaryText}>
              {item.structured_formatting.secondary_text}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <Formik
        initialValues={{
        budget: budget ? String(budget) : '',
        location: location || '',
      }}
        validationSchema={validationSchema}
        validateOnChange={true}
        onSubmit={handleSubmit}
      >
        {({ handleChange, handleBlur, handleSubmit, setFieldValue, values, errors, touched }) => (
          <View >
            
            <Animated.View style={{ opacity: fadeAnim }}>
              <Header title="Budget & Location" />
              <View style={styles.progressHeader}>
                <View style={styles.progressBar}>
                  <View style={styles.progressFill} />
                </View>
              </View>
              <Input
                label="Budget"
                placeholder="Enter your budget"
                value={values.budget}
                onChangeText={handleChange('budget')}
                onBlur={handleBlur('budget')}
                error={touched.budget ? errors.budget : undefined}
                keyboardType="numeric"
                leftIcon={<Text style={styles.currency}>₦</Text>}
              />
            </Animated.View>

            {/* Location Input */}
            <Animated.View
          style={[
            styles.locationAnimatedContainer,
            {
              transform: [{ translateY: isFocusingLocation ? -180 : 0 }],
            },
          ]}
        >
  <Text style={styles.label}>Location</Text>
  <View style={styles.locationInputContainer}>
    <TextInput
      style={[
        styles.locationInput,
        touched.location && errors.location && styles.inputError,
      ]}
      ref={locationInputRef}
      placeholder="Enter task location"
      placeholderTextColor={COLOR_VARIABLES.textShade}
      value={values.location}
      onChangeText={(text) => handleLocationInputChange(text, setFieldValue)}
      onFocus={() => {
        setIsFocusingLocation(true);
        if (values.location.length >= 2) setShowSuggestions(true);
      }}
      onBlur={() => {
        handleBlur('location');
        setTimeout(() => {
          setShowSuggestions(false);
          setIsFocusingLocation(false);
        }, 300);
      }}
      autoCapitalize="words"
      autoCorrect={false}
    />
    {isLoadingSuggestions && (
      <View style={styles.loadingIndicator}>
        <ActivityIndicator size="small" color={COLOR_VARIABLES.surfaceSecondary} />
      </View>
    )}
  </View>

  {touched.location && errors.location && (
    <Text style={styles.errorText}>{errors.location}</Text>
  )}

  <TouchableOpacity
    style={styles.locationButton}
    onPress={() => handleGetCurrentLocation(setFieldValue)}
    disabled={isGettingLocation}
  >
    <LocationIcon size={20} color={COLOR_VARIABLES.surfaceSecondary} />
    <Text style={styles.locationButtonText}>
      {isGettingLocation ? 'Getting Location...' : 'Use Current Location'}
    </Text>
  </TouchableOpacity>

  {showSuggestions && suggestions.length > 0 && (
    <View style={styles.suggestionsListContainer}>
      <FlatList
        data={suggestions}
        renderItem={renderSuggestionWithSetField(setFieldValue)}
        keyExtractor={(item) => item.place_id}
        keyboardShouldPersistTaps="handled"
      />
    </View>
  )}
</Animated.View>


            {!isFocusingLocation && (
              <Animated.View style={[styles.buttonContainer, { opacity: fadeAnim }]}>
                <Button
                  onPress={handleSubmit}
                  text="Continue to Review"
                  variant="secondary"
                />
              </Animated.View>
            )}
          </View>
        )}
      </Formik>
    </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR_VARIABLES.surfacePrimary,
    padding: SPACING.lg,
  },
  progressHeader: {
    marginVertical: SPACING.xl,
  },
  progressBar: {
    height: 2,
    backgroundColor: COLOR_VARIABLES.borderSec,
    borderRadius: 2,
  },
  progressFill: {
    width: '66%',
    height: '100%',
    backgroundColor: COLOR_VARIABLES.surfaceGen,
    borderRadius: 2,
  },
  currency: {
    ...TEXT_STYLES.body,
    color: COLOR_VARIABLES.textShade,
    marginRight: SPACING.xs,
  },
  locationContainer: {
    marginBottom: SPACING.lg,
    position: 'relative',
  },
  locationInputContainer: {
    position: 'relative',
  },
  locationInput: {
    ...TEXT_STYLES.body,
    height: 45,
    borderWidth:  1,
    borderColor: COLOR_VARIABLES.borderSec,
    borderRadius: 8,
    paddingHorizontal: SPACING.md,
    color: COLOR_VARIABLES.textSurfaceGen,
    backgroundColor: COLOR_VARIABLES.surfacePrimary,
  },
  inputError: {
    borderColor: COLOR_VARIABLES.borderDanger,
  },
  loadingIndicator: {
    position: 'absolute',
    right: SPACING.md,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  suggestionsContainer: {
   
    top: 47,
    left: 0,
    right: 0,
    zIndex: 1000,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  locationAnimatedContainer: {
  marginBottom: SPACING.lg,
  },
  suggestionsListContainer: {
    marginTop: SPACING.sm,
    borderWidth: 1,
    borderColor: COLOR_VARIABLES.borderSec,
    borderRadius: 8,
    backgroundColor: COLOR_VARIABLES.surfacePrimary,
    maxHeight: 200,
  },

  suggestionsList: {
    maxHeight: 200,
    backgroundColor: COLOR_VARIABLES.surfacePrimary,
    borderWidth: 1,
    borderColor: COLOR_VARIABLES.borderSec,
    borderRadius: 8,
    borderTopWidth: 0,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLOR_VARIABLES.borderSec,
  },
  suggestionTextContainer: {
    flex: 1,
    marginLeft: SPACING.sm,
  },
  suggestionMainText: {
    ...TEXT_STYLES.body,
    color: COLOR_VARIABLES.textSurfaceGen,
    fontWeight: '600',
  },
  suggestionSecondaryText: {
    ...TEXT_STYLES.caption,
    color: COLOR_VARIABLES.textShade,
    marginTop: 2,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginTop: SPACING.xs,
    padding: SPACING.sm,
  },
  locationButtonText: {
    ...TEXT_STYLES.body,
    color: COLOR_VARIABLES.surfaceSecondary,
  },
  buttonContainer: {
    marginTop: SPACING.xxl,
    marginBottom: SPACING.lg,
  },
  label: {
    ...TEXT_STYLES.body,
    color: COLOR_VARIABLES.textSurfaceGen,
    marginBottom: SPACING.xs,
    fontWeight: '600',
  },
  errorText: {
    ...TEXT_STYLES.caption,
    color: COLOR_VARIABLES.dangerText,
    marginTop: SPACING.xs,
  },
});
