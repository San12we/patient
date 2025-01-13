import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialState = {
  clinics: [],
  loading: false,
  error: null,
};

export const fetchClinics = createAsyncThunk('clinics/fetchClinics', async ({ insuranceProviders }, { getState }) => {
  const response = await axios.get('https://medplus-health.onrender.com/api/professionals');
  console.log('Data before transformation:', response.data); // Log the data before transformation
  const transformedData = response.data.map((clinic) => {
    const insuranceNames = clinic.insuranceProviders.map(id => {
      const provider = insuranceProviders.find(provider => provider._id === id);
      return provider ? provider.name : 'Unknown';
    });
    return {
      _id: clinic._id,
      name: `${clinic.firstName} ${clinic.lastName}`,
      category: clinic.professionalDetails?.specialization || 'N/A',
      address: clinic.practiceLocation,
      clinicImages: clinic.clinic_images,
      profileImage: clinic.profileImage,
      insuranceProviders: insuranceNames,
      practiceLocation: clinic.practiceLocation,
      practiceName: clinic.practiceName,
      workingHours: clinic.workingHours,
      workingDays: clinic.workingDays,
      doctors: [{
        id: clinic._id,
        firstName: clinic.firstName,
        lastName: clinic.lastName,
        specialty: clinic.professionalDetails?.specialization || 'N/A',
        profileImage: clinic.profileImage,
        clinicAddress: clinic.practiceLocation,
        clinicName: clinic.practiceName || 'Unknown Clinic',
        bio: clinic.bio || 'No bio available',
        title: clinic.title || 'N/A',
        profession: clinic.profession || 'N/A',
        consultationFee: clinic.consultationFee || 'N/A',
        clinic: clinic.clinic || { insuranceCompanies: [] },
        insuranceProviders: insuranceNames,
        yearsOfExperience: clinic.professionalDetails?.yearsOfExperience || 'N/A',
        specializedTreatment: clinic.professionalDetails?.specializedTreatment || 'N/A',
        certifications: clinic.professionalDetails?.certifications || [],
      }],
    };
  });

  // Save transformed data to AsyncStorage
  await AsyncStorage.setItem('clinics', JSON.stringify(transformedData));

  return transformedData;
});

const clinicSlice = createSlice({
  name: 'clinics',
  initialState,
  reducers: {
    setSelectedClinic: (state, action) => {
      state.selectedClinic = action.payload;
    },
    setClinicsFromStorage: (state, action) => {
      state.clinics = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchClinics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClinics.fulfilled, (state, action) => {
        state.clinics = action.payload;
        state.loading = false;
      })
      .addCase(fetchClinics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setSelectedClinic, setClinicsFromStorage } = clinicSlice.actions;
export default clinicSlice.reducer;
