import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback
} from 'react-native';
import { router } from 'expo-router';
import SearchIcon from '@/assets/icons/Search.svg';
import { COLOR_VARIABLES } from '@/constants/theme/ColorVariables';
import { TEXT_STYLES } from '@/constants/theme/Typography';
import { SPACING } from '@/constants/theme/Spacing';
import { useServiceStore } from '@/shared/stores/useServiceStore';
import { useAuthStore } from '@/shared/stores/useAuthStore';
import Fuse from 'fuse.js';
import { useState, useMemo } from 'react';
import { popularServices } from '@/shared/data/popularServices';

interface StoredServiceItem {
  id: number;
  name: string;
}

interface PopularServiceItem {
  id: number;
  name: string;
  image: any;
}

const ServiceCard = ({ service, onPress }: { service: PopularServiceItem, onPress: (service: PopularServiceItem) => void }) => (
  <TouchableOpacity onPress={() => onPress(service)} style={styles.serviceCard}>
    <Image source={service.image} style={styles.serviceImage} />
    <Text style={styles.serviceLabel}>{service.name}</Text>
  </TouchableOpacity>
);

export default function ClientHomeContent() {
  const { user } = useAuthStore();
  const { services } = useServiceStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<StoredServiceItem[]>([]);

  // Get first name
  const firstName = useMemo(() => {
    if (!user?.name) return '';
    return user.name.split(' ')[0];
  }, [user?.name]);

  // Search function
  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (text.length > 0) {
      const fuse = new Fuse(services, {
        keys: ['name'],
        threshold: 0.3,
      });
      const results = fuse.search(text);
      setSearchResults(results.map(result => result.item));
    } else {
      setSearchResults([]);
    }
  };

  // When service is selected
  const handleServicePress = (service: StoredServiceItem) => {
    setSearchQuery('');
    setSearchResults([]);
    router.push({
      pathname: '/features/post-task/description',
      params: { 
        serviceId: service.id,
        serviceName: service.name
      }
    });
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
        setSearchQuery('');
        setSearchResults([]);
      }}
    >
      <ScrollView 
        style={styles.container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Logo Header */}
        <View style={styles.header}>
          <Image
            source={require("@/assets/images/images/WordLogo.png")}
            style={styles.wordLogo}
          />
        </View>

        {/* Welcome Section */}
        <Text style={styles.welcomeText}>
          Hello, {firstName || 'Client'}
        </Text>

        {/* Search Section */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="What type of help do you need?"
            placeholderTextColor={COLOR_VARIABLES.textShade}
            value={searchQuery}
            onChangeText={handleSearch}
          />
          <SearchIcon color={COLOR_VARIABLES.textShade} />
        </View>

        {/* Search Results */}
        {searchQuery.length > 0 && (
          <View style={styles.searchResults}>
            {searchResults.map((service) => (
              <TouchableOpacity
                key={service.id}
                style={styles.searchResultItem}
                onPress={() => handleServicePress(service)}
              >
                <Text style={styles.searchResultText}>{service.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Popular Services */}
        {searchQuery.length === 0 && (
          <View style={styles.servicesSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Popular Services</Text>
              <TouchableOpacity onPress={() => router.push('/(tabs)/manual-request')}>
                <Text style={styles.manualRequestText}>
                  Can't Find What You Need?
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.servicesGrid}>
              {popularServices.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  onPress={handleServicePress}
                />
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR_VARIABLES.surfacePrimary,
  },
  header: {
    flex:1,
    alignItems: 'center',
    paddingVertical: SPACING.lg,
  },
  wordLogo: {
    width: 230,
    height: 48,
    alignSelf:'center',
  },
  welcomeText: {
    ...TEXT_STYLES.h3,
    color: COLOR_VARIABLES.textSurfaceGen,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
    fontFamily: TEXT_STYLES.title.fontFamily,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: SPACING.lg,
    marginVertical: SPACING.md,
    padding: SPACING.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLOR_VARIABLES.borderSec,
  },
  searchInput: {
    flex: 1,
    ...TEXT_STYLES.body,
    color: COLOR_VARIABLES.textSurfaceGen,
    marginRight: SPACING.sm,
  },
  searchResults: {
    marginHorizontal: SPACING.lg,
    backgroundColor: COLOR_VARIABLES.surfacePrimary,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLOR_VARIABLES.borderSec,
    marginTop: SPACING.sm,
  },
  searchResultItem: {
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLOR_VARIABLES.borderSec,
  },
  searchResultText: {
    ...TEXT_STYLES.body,
    color: COLOR_VARIABLES.textSurfaceGen,
  },
  noResultsText: {
    ...TEXT_STYLES.body,
    color: COLOR_VARIABLES.textShade,
    textAlign: 'center',
    padding: SPACING.md,
  },
  servicesSection: {
    marginTop: SPACING.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    ...TEXT_STYLES.title,
    color: COLOR_VARIABLES.textSurfaceGen,
  },
  manualRequestText: {
    ...TEXT_STYLES.caption,
    color: COLOR_VARIABLES.surfaceGen,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  serviceCard: {
    width: '30%',
    marginBottom: SPACING.lg,
  },
  serviceImage: {
    width: '100%',
    height: 77,
    borderRadius: 4,
    marginBottom: SPACING.xs,
  },
  serviceLabel: {
    ...TEXT_STYLES.caption,
    color: COLOR_VARIABLES.textSurfaceGen,
    textAlign: 'center',
  },
});
