import { create } from 'zustand';

interface PostTaskStore {
  subject: string;
  description: string;
  budget: string;
  location: string;
  service_id: string; // Changed to string to match API
  images: string[];
  setField: (field: keyof Omit<PostTaskStore, 'setField' | 'reset' | 'getFormData'>, value: any) => void;
  reset: () => void;
  getFormData: () => FormData;
}

export const usePostTaskStore = create<PostTaskStore>((set, get) => ({
  subject: '',
  description: '',
  budget: '',
  location: '',
  service_id: '',
  images: [],
  setField: (field, value) => set(state => ({ ...state, [field]: value })),
  reset: () => set({
    subject: '',
    description: '',
    budget: '',
    location: '',
    service_id: '',
    images: []
  }),
  getFormData: () => {
    const state = get();
    const formData = new FormData();

    // Append all required fields
    formData.append('subject', state.subject);
    formData.append('description', state.description);
    formData.append('budget', state.budget);
    formData.append('location', 'Lagos, Nigeria'); // Temporary default
    formData.append('service_id', state.service_id);

    // Append images if they exist
     if (state.images.length > 0) {
      state.images.forEach((uri, index) => {
        // Detect file extension
        const fileExt = uri.split('.').pop() || 'jpg';
        formData.append('images', {
          uri,
          name: `image_${index}.${fileExt}`,
          type: `image/${fileExt}`,
        } as any);
      });
    }

    return formData;
  }
}));