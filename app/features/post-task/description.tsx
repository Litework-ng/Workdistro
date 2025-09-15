import { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  KeyboardAvoidingView,
  Platform,
  Text,
  Image
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Camera, ArrowRight2 } from 'iconsax-react-native';
import * as ImagePicker from 'expo-image-picker';
import { useServiceStore } from '@/shared/stores/useServiceStore';
import { usePostTaskStore } from '@/shared/stores/usePostTaskStore';
import  Input  from '@/components/InputField';
import { Select } from '@/components/Select';
import  Button  from '@/components/Button';
import  Header from '@/components/Header';
import { COLOR_VARIABLES } from '@/constants/theme/ColorVariables';
import { TEXT_STYLES } from '@/constants/theme/Typography';
import { SPACING } from '@/constants/theme/Spacing';
import UploadInput from '@/components/UploadInput';
import { taskService } from '@/services/task';


const validationSchema = Yup.object().shape({
  serviceId: Yup.number().required('Service is required'),
  description: Yup.string()
    .required('Description is required')
    .min(20, 'Description must be at least 20 characters')
    .max(500, 'Description cannot exceed 500 characters'),
});

export interface FormValues {
  serviceId: number;
  subject: string;
  description: string;
  images?: File[];  // Optional if images are not required
} 

export default function TaskDescriptionScreen() {
  const { serviceId, edit, taskId } = useLocalSearchParams<{ serviceId: string, edit?: string, taskId?: string }>();
  const { services } = useServiceStore();
  const [photos, setPhotos] = useState<string[]>([]);
  const { setField, subject, description, budget, location, service_id } = usePostTaskStore();

  // Convert services to dropdown options
  const serviceOptions = services.map(service => ({
    label: service.name,
    value: service.id.toString()
  }));

  useEffect(() => {
    if (edit && taskId) {
      taskService.getTask(taskId).then(response => {
        const task = response.data;
        console.log(task);
        setField('subject', task.subject);
        setField('description', task.description);
        setField('budget', task.budget);
        setField('location', task.location);
        setField('service_id', task.service_cat);
        if (task.images && Array.isArray(task.images) && task.images.length > 0) {
          setPhotos(task.images);
          setField('images', task.images);
        }
      });
    }
  }, [edit, taskId]);

  useEffect(() => {
    if (!edit && !taskId) {
      // Reset the post task store when not editing or viewing a task
      usePostTaskStore.getState().reset();
      setPhotos([]);
    }
  }, [edit, taskId]);

 const handleSubmit = (values: FormValues) => {
  try {
    // Set service_id as string
    setField('service_id', values.serviceId.toString());
    // Set subject from selected service name
    const selectedService = serviceOptions.find(option => option.value === values.serviceId.toString());
    if (selectedService) {
      setField('subject', selectedService.label);
    }
    setField('description', values.description);
    
    // Only set images if they exist
    if (photos.length > 0) {
      setField('images', photos);
    }
    
    router.push('/features/post-task/payment');
  } catch (error) {
    console.error('Error in handleSubmit:', error);
  }
};

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <Formik
        enableReinitialize
        initialValues={{
          serviceId: edit && service_id ? Number(service_id) : Number(serviceId) || 0,
          subject: edit && subject ? subject : '',
          description: edit && description ? description : '',
          images: []
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ handleChange, handleBlur, handleSubmit, setFieldValue, values, errors, touched }) => (
          <ScrollView showsVerticalScrollIndicator={false}>
        {/* Progress Header */}
        <Header title={edit ? "Edit Description" : "Description"} />
        <View style={styles.progressHeader}>
          <View style={styles.progressBar}>
            <View style={styles.progressFill} />
          </View>
        </View>

        {/* Service Selection */}
        <Select
          label="Service Type"
          options={serviceOptions}
          value={values.serviceId.toString()}
          onValueChange={(value) => {
            setFieldValue('serviceId', Number(value));
            // Find the selected service name and set it as subject
            const selectedService = serviceOptions.find(option => option.value === value);
            if (selectedService) {
          setFieldValue('subject', selectedService.label);
            }
          }}
          error={touched.serviceId ? errors.serviceId : undefined}
          placeholder="Select a service"
        />

        {/* Description Field */}
        <Input
          label="Task Description"
          multiline
          numberOfLines={4}
          onChangeText={handleChange('description')}
          onBlur={handleBlur('description')}
          value={values.description}
          placeholder="Describe your task in detail..."
          error={touched.description ? errors.description : undefined}
          maxLength={500}
          showCharacterCount
          style={{ minHeight: 120 }}
        />

        {/* Photo Upload */}
        <UploadInput
          label="Add Photos (Optional)"
          onImageSelect={(uris) => {
            setPhotos(uris);
            setField('images', uris);
          }}
          selectedImages={photos}
          maxImages={3}
          style={styles.photoSection}
        />

        {/* Next Button */}
        <View style={styles.nextButton}>
          <Button
            onPress={handleSubmit}
            text={edit ? 'Update' : 'Continue'}
            variant="secondary"
          />
        </View>
          </ScrollView>
        )}
      </Formik>
    </KeyboardAvoidingView>
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
  stepText: {
    ...TEXT_STYLES.caption,
    color: COLOR_VARIABLES.textShade,
    marginBottom: SPACING.xs,
  },
  progressBar: {
    height: 2,
    backgroundColor: COLOR_VARIABLES.borderSec,
    borderRadius: 2,
  },
  progressFill: {
    width: '33%',
    height: '100%',
    backgroundColor: COLOR_VARIABLES.surfaceGen,
    borderRadius: 2,
  },
  title: {
    ...TEXT_STYLES.h2,
    color: COLOR_VARIABLES.textSurfaceGen,
    marginBottom: SPACING.xl,
  },
  inputContainer: {
    marginBottom: SPACING.lg,
  },
  label: {
    ...TEXT_STYLES.body,
    color: COLOR_VARIABLES.textSurfaceGen,
    marginBottom: SPACING.xs,
  },
  input: {
    ...TEXT_STYLES.body,
    borderWidth: 1,
    borderColor: COLOR_VARIABLES.borderSec,
    borderRadius: 8,
    padding: SPACING.md,
    color: COLOR_VARIABLES.textSurfaceGen,
  },
  textArea: {
    ...TEXT_STYLES.body,
    borderWidth: 1,
    borderColor: COLOR_VARIABLES.borderSec,
    borderRadius: 8,
    padding: SPACING.md,
    minHeight: 120,
    color: COLOR_VARIABLES.textSurfaceGen,
  },
  inputError: {
    borderColor: COLOR_VARIABLES.borderDanger,
  },
  errorText: {
    ...TEXT_STYLES.caption,
    color: COLOR_VARIABLES.dangerText,
    marginTop: SPACING.xs,
  },
  photoSection: {
    marginBottom: SPACING.xl,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    padding: SPACING.md,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: COLOR_VARIABLES.borderSec,
    borderRadius: 8,
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  uploadText: {
    ...TEXT_STYLES.body,
    color: COLOR_VARIABLES.textSurfaceGen,
  },
  photoPreview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginTop: SPACING.md,
  },
  nextButton: {
    marginBottom: SPACING.lg,
  },
 
});