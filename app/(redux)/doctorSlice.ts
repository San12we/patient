import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

export const getDoctors = createAsyncThunk("doctors/getDoctors", async (_, { getState }) => {
  const state = getState();
  if (state.doctors.doctors.length > 0) {
    // If doctors are already in the state, return them
    return state.doctors.doctors;
  }

  const storedDoctors = await AsyncStorage.getItem('doctors');
  if (storedDoctors) {
    // If doctors are in AsyncStorage, return them
    return JSON.parse(storedDoctors);
  }

  // Otherwise, fetch from the API
  const response = await axios.get('https://medplus-health.onrender.com/api/professionals');
  
  // Save fetched data to AsyncStorage
  await AsyncStorage.setItem('doctors', JSON.stringify(response.data));
  
  return response.data;
});

const doctorSlice = createSlice({
  name: "doctors",
  initialState: {
    doctors: [],
    loading: false,
    error: null,
    selectedDoctor: null, // Add selectedDoctor to the initial state
  },
  reducers: {
    setSelectedDoctor: (state, action) => {
      state.selectedDoctor = action.payload; // Set the selected doctor
    },
    setDoctorsFromStorage: (state, action) => {
      state.doctors = action.payload; // Set doctors from AsyncStorage
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDoctors.pending, (state) => {
        state.loading = true;
      })
      .addCase(getDoctors.fulfilled, (state, action) => {
        state.loading = false;
        state.doctors = action.payload;
      })
      .addCase(getDoctors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setSelectedDoctor, setDoctorsFromStorage } = doctorSlice.actions; // Export the actions
export default doctorSlice.reducer;
