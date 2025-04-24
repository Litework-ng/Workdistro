import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import Fuse from 'fuse.js';
import { useQuery } from '@tanstack/react-query';
import { COLOR_VARIABLES } from '@/constants/theme/ColorVariables';
import { TEXT_STYLES } from '@/constants/theme/Typography';
import { SPACING } from '@/constants/theme/Spacing';
import Input from '@/components/InputField';
import Button from '@/components/Button';
import { Alert } from '@/components/Alert';
import { serviceService } from '@/services/service';
import SearchIcon from '@/assets/icons/Search.svg';
import ArrowBack from '@/assets/icons/ArrowBack.svg';
import { Service } from '@/shared/types/service';

const popularServices = [
  { id: 1, name: 'Grocery Shopping' },
  { id: 2, name: 'Item Delivery' },
  { id: 3, name: 'Chef/Cook' },
  // ...add more popular services
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

  const { data: services = [], isLoading } = useQuery({
    queryKey: ['services'],
    queryFn: serviceService.getServices,
  });

  const fuse = useMemo(() => new Fuse(services, fuseOptions), [services]);

  const filteredServices = useMemo(() => {
    if (!searchTerm) return [];
    return fuse.search(searchTerm).map(result => result.item);
  }, [searchTerm, fuse]);

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    setShowConfirmAlert(true);
  };

  const handleConfirm = async () => {
    if (!selectedService) return;
    
    try {
      await serviceService.selectService(selectedService.id);
      router.push('/(worker)/home');
    } catch (error) {
      // Show error toast
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.header}>
        <Button
          variant="icon"
          icon={<ArrowBack />}
          onPress={() => router.back()}
        />
        <Text style={styles.title}>Select Your Service</Text>
      </View>

      <View style={styles.searchContainer}>
        <Input
          placeholder="Search services..."
          value={searchTerm}
          onChangeText={setSearchTerm}
          leftIcon={<SearchIcon />}
        />
      </View>

      <ScrollView style={styles.content}>
        {searchTerm ? (
          <View style={styles.searchResults}>
            {filteredServices.map((service) => (
              <Button
                key={service.id}
                text={service.name}
                variant="outline"
                onPress={() => handleServiceSelect(service)}
                style={styles.serviceButton}
              />
            ))}
          </View>
        ) : (
          <>
            <Text style={styles.sectionTitle}>Popular Services</Text>
            <View style={styles.popularServices}>
              {popularServices.map((service) => (
                <Button
                  key={service.id}
                  text={service.name}
                  variant="chip"
                  onPress={() => handleServiceSelect(service)}
                />
              ))}
            </View>
          </>
        )}
      </ScrollView>

      <Alert
        visible={showConfirmAlert}
        onClose={() => setShowConfirmAlert(false)}
        variant="action2"
        title="Confirm Service"
        description={`Are you sure you want to select ${selectedService?.name}?`}
        primaryAction={{
          label: "Confirm",
          onPress: handleConfirm
        }}
        secondaryAction={{
          label: "Cancel",
          onPress: () => setShowConfirmAlert(false)
        }}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR_VARIABLES.surfacePrimary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  title: {
    ...TEXT_STYLES.h2,
    color: COLOR_VARIABLES.textSurfaceGen,
    marginLeft: SPACING.md,
  },
  searchContainer: {
    padding: SPACING.lg,
  },
  content: {
    flex: 1,
    padding: SPACING.lg,
  },
  sectionTitle: {
    ...TEXT_STYLES.subtitle,
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
  },
  serviceButton: {
    marginBottom: SPACING.xs,
  },
});
