import { useState, useCallback, useMemo, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  ScrollView,
  TextInput,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  FlatList,
  Keyboard
} from 'react-native';
import { TabView, TabBar } from 'react-native-tab-view';
import { router } from 'expo-router';
import { COLOR_VARIABLES } from '@/constants/theme/ColorVariables';
import { TEXT_STYLES } from '@/constants/theme/Typography';
import { SPACING } from '@/constants/theme/Spacing';
import { useAuthStore } from '@/shared/stores/useAuthStore';
import { userService } from '@/services/user';
import Toast from 'react-native-toast-message';
import * as Location from 'expo-location';
import JobList from './JobList';
// import ProfilePhotoModal from './ProfilePhotoModal';

interface Route {
  key: string;
  title: string;
}

export default function WorkerHomeContent() {
     // Get first name
     const { user, setUser } = useAuthStore();
     const firstName = useMemo(() => {
         if (!user?.name) return '';
         return user.name.split(' ')[0];
     }, [user?.name]);
  const [index, setIndex] = useState(0);
  const [routes] = useState<Route[]>([
    { key: 'bestMatches', title: 'Best Matches' },
    { key: 'mostRecent', title: 'Most Recent' },
  ]);
  const [address, setAddress] = useState(user?.location || '');
  interface PlaceSuggestion {
    description: string;
    place_id: string;
    structured_formatting?: {
      main_text?: string;
      secondary_text?: string;
    };
  }
  
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [locationVersion, setLocationVersion] = useState(0);
  const locationInputRef = useRef<TextInput>(null);
  const GOOGLE_PLACES_API_KEY = 'AIzaSyB2CbZk-225Mj978qzNqhry8L8FMO5jpJc'; // move to .env
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    // Add your refresh logic here
    setRefreshing(false);
  }, []);

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
    } catch {
      setSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

const handleLocationInputChange = (text: string) => {
  setAddress(text);
  searchPlaces(text);
};

const handleSuggestionSelect = async (suggestion: PlaceSuggestion) => {
  setAddress(suggestion.description);
  setShowSuggestions(false);
  setSuggestions([]);
  Keyboard.dismiss();
  locationInputRef.current?.blur();
  await handleUpdateLocation(suggestion.description);
};
 

  const handleUpdateLocation = async (location: string) => {
    if (!user) return;
    setIsUpdating(true);
    try {
      const updated = await userService.updateUser({
        name: user.name,
        location,
      });
      setUser({ ...user, location: updated.location });
      Toast.show({
        type: 'success',
        text1: 'Location Updated',
        text2: 'Your location has been updated successfully.',
      });
      setLocationVersion((v) => v + 1); 
    } catch {
      Toast.show({
        type: 'error',
        text1: 'Update Failed',
        text2: 'Could not update your location. Try again.',
      });
    } finally {
      setIsUpdating(false);
    }
  };

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

  const renderScene = ({ route }: { route: Route }) => {
    switch (route.key) {
      case 'bestMatches':
        return <JobList type="bestMatches" onRefresh={handleRefresh} refreshing={refreshing}  location={address}  locationVersion={locationVersion}/>;
      case 'mostRecent':
        return <JobList type="mostRecent" onRefresh={handleRefresh} refreshing={refreshing}  location={address}  locationVersion={locationVersion}/>;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {/* <ProfilePhotoModal 
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
      /> */}

      {/* Header Section */}
      <View style={styles.header}>
        <Image 
          source={require('@/assets/images/images/logo.png')} 
          style={styles.logo} 
        />
         <Text style={styles.welcomeText}>
                  Hello, {firstName || 'Worker'}
         </Text>
        
        {/* Location Input */}
        <View style={styles.locationContainer}>
          <TextInput
            ref={locationInputRef}
            style={styles.locationInput}
            value={address}
            onChangeText={handleLocationInputChange}
            placeholder="Set your location..."
            placeholderTextColor={COLOR_VARIABLES.textShade}
            editable={!isUpdating}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            onFocus={() => address.length >= 2 && setShowSuggestions(true)}
          />
            {/* Show close icon when input is focused and not loading, show loader when loading, show location icon when not focused and address is set */}
            {locationInputRef.current?.isFocused() && !isLoadingSuggestions ? (
            address.length > 0 && (
              <TouchableOpacity
              onPress={() => {
                setAddress('');
                setSuggestions([]);
                setShowSuggestions(false);
                locationInputRef.current?.focus();
              }}
              style={{ padding: 8 }}
              accessibilityLabel="Clear location input"
              >
              <Text style={{ fontSize: 18, color: COLOR_VARIABLES.textShade }}>✕</Text>
              </TouchableOpacity>
            )
            ) : isLoadingSuggestions ? (
            <ActivityIndicator size="small" color={COLOR_VARIABLES.surfaceSecondary} style={{ marginLeft: 8 }} />
            ) : !locationInputRef.current?.isFocused() && address.length > 0 ? (
            <View style={{ padding: 8 }}>
              <Text style={{ fontSize: 18, color: COLOR_VARIABLES.surfaceSecondary }}>📍</Text>
            </View>
            ) : null}
          {showSuggestions && suggestions.length > 0 && (
            <View style={styles.suggestionsListContainer}>
              <FlatList
                data={suggestions}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.suggestionItem}
                    onPress={() => handleSuggestionSelect(item)}
                  >
                    <Text style={styles.suggestionMainText}>{item.structured_formatting?.main_text || item.description}</Text>
                    {item.structured_formatting?.secondary_text && (
                      <Text style={styles.suggestionSecondaryText}>{item.structured_formatting.secondary_text}</Text>
                    )}
                  </TouchableOpacity>
                )}
                keyExtractor={(item) => item.place_id}
                keyboardShouldPersistTaps="handled"
              />
            </View>
          )}
        </View>
      </View>

      {/* Tab View */}
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
  },
  header: {
    padding: SPACING.lg,
    paddingTop: SPACING.xl,
  },
  logo: {
    width: 230,
    height: 48,
    alignSelf: 'center',
    marginBottom: SPACING.xl,
  },
  welcomeText: {
       ...TEXT_STYLES.h3,
       color: COLOR_VARIABLES.textSurfaceGen,
       paddingHorizontal: SPACING.lg,
       marginBottom: SPACING.sm,
       fontFamily: TEXT_STYLES.title.fontFamily,
     },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  locationInput: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: COLOR_VARIABLES.borderSec,
    borderRadius: 4,
    paddingHorizontal: SPACING.md,
    ...TEXT_STYLES.body,
    color: COLOR_VARIABLES.textSurfaceGen,
  },
  locationButton: {
    padding: SPACING.sm,
    borderRadius: 4,
    backgroundColor: COLOR_VARIABLES.surfaceSecondary,
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
  suggestionsListContainer: {
    position: 'absolute',
    top: 55,
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: COLOR_VARIABLES.surfacePrimary,
    borderWidth: 1,
    borderColor: COLOR_VARIABLES.borderSec,
    borderRadius: 8,
    maxHeight: 200,
  },
  suggestionItem: {
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLOR_VARIABLES.borderSec,
  },
  suggestionMainText: {
    ...TEXT_STYLES.body,
    color: COLOR_VARIABLES.textSurfaceGen,
    fontWeight: '600',
  },
  suggestionSecondaryText: {
    ...TEXT_STYLES.caption,
    color: COLOR_VARIABLES.textShade,
  },
});