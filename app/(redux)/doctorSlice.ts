import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

// Utility function for AsyncStorage
const storeData = async (key: string, value: any) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error storing data:', error);
  }
};

const getData = async (key: string) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error('Error retrieving data:', error);
    return null;
  }
};

export const getDoctors = createAsyncThunk("doctors/getDoctors", async () => {
  try {
    const response = await axios.get('https://medplus-health.onrender.com/api/professionals');
    await storeData('doctors', response.data);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch doctors: ' + error.message);
  }
});

export const fetchDoctorsFromStorage = createAsyncThunk("doctors/fetchDoctorsFromStorage", async () => {
  const doctors = await getData('doctors');
  return doctors || [];
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
        state.error = action.error.message || 'Failed to fetch doctors';
      })
      .addCase(fetchDoctorsFromStorage.fulfilled, (state, action) => {
        state.doctors = action.payload;
      });
  },
});

export const { setSelectedDoctor, setDoctorsFromStorage } = doctorSlice.actions;
export default doctorSlice.reducer;