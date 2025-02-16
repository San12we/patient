import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

export const getDoctors = createAsyncThunk("doctors/getDoctors", async () => {
  try {
    const response = await axios.get('https://medplus-health.onrender.com/api/professionals');
    await AsyncStorage.setItem('doctors', JSON.stringify(response.data));
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch doctors');
  }
});

export const fetchDoctorsFromStorage = createAsyncThunk("doctors/fetchDoctorsFromStorage", async () => {
  const doctors = await AsyncStorage.getItem('doctors');
  return doctors ? JSON.parse(doctors) : [];
});

const doctorSlice = createSlice({
  name: "doctors",
  initialState: {
    doctors: [],
    loading: false,
    error: null,
    selectedDoctor: null,
  },
  reducers: {
    setSelectedDoctor: (state, action) => {
      state.selectedDoctor = action.payload;
    },
    setDoctorsFromStorage: (state, action) => {
      state.doctors = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDoctors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDoctors.fulfilled, (state, action) => {
        state.loading = false;
        state.doctors = action.payload;
      })
      .addCase(getDoctors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchDoctorsFromStorage.fulfilled, (state, action) => {
        state.doctors = action.payload;
      });
  },
});

export const { setSelectedDoctor, setDoctorsFromStorage } = doctorSlice.actions;
export default doctorSlice.reducer;