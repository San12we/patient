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

    // Ensure that clinic.doctors exists and is an array
    const doctors = response.data.filter(professional => professional.practiceLocation === clinic.practiceLocation).map((doctor) => ({
      id: doctor._id,
      firstName: doctor.firstName,
      lastName: doctor.lastName,
      specialty: doctor.professionalDetails?.specialization || 'N/A',
      profileImage: doctor.profileImage,
      clinicAddress: doctor.practiceLocation,
      clinicName: doctor.practiceName || 'Unknown Clinic',
      bio: doctor.bio || 'No bio available',
      title: doctor.title || 'N/A',
      profession: doctor.profession || 'N/A',
      consultationFee: doctor.consultationFee || 'N/A',
      clinic: doctor.clinic || { insuranceCompanies: [] },
      insuranceProviders: insuranceNames,
      yearsOfExperience: doctor.professionalDetails?.yearsOfExperience || 'N/A',
      specializedTreatment: doctor.professionalDetails?.specializedTreatment || 'N/A',
      certifications: doctor.professionalDetails?.certifications || [],
    }));
    console.log('Doctors for clinic:', clinic._id, doctors); // Log the doctors for each clinic

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
      doctors: doctors,
    };
  });

  // Save transformed data to AsyncStorage
  await AsyncStorage.setItem('clinics', JSON.stringify(transformedData));

  return transformedData;
});

export const fetchClinicsFromStorage = createAsyncThunk('clinics/fetchClinicsFromStorage', async () => {
  const clinics = await AsyncStorage.getItem('clinics');
  return clinics ? JSON.parse(clinics) : [];
});

const clinicSlice = createSlice({
  name: 'clinics',
  initialState,
  reducers: {
    setSelectedClinic: (state, action) => {
      const clinic = action.payload;
      const doctors = state.clinics.find(c => c._id === clinic._id)?.doctors || [];
      state.selectedClinic = { ...clinic, doctors };
    },
    setClinicsFromStorage: (state, action) => {
      state.clinics = action.payload;
    },
    setSelectedProfessional: (state, action) => {
      state.selectedProfessional = action.payload;
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
      })
      .addCase(fetchClinicsFromStorage.fulfilled, (state, action) => {
        state.clinics = action.payload;
      });
  },
});

export const { setSelectedClinic, setClinicsFromStorage, setSelectedProfessional } = clinicSlice.actions;
export default clinicSlice.reducer;
