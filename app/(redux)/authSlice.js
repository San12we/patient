import { createSlice } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Function to load user from AsyncStorage
const loadUserFromStorage = async () => {
  try {
    const userInfo = await AsyncStorage.getItem("userInfo");
    return userInfo ? JSON.parse(userInfo) : null;
  } catch (error) {
    console.error("Failed to load user info", error);
    return null;
  }
};

// Function to clear the Expo Push Token from AsyncStorage
const clearPushToken = async () => {
  try {
    await AsyncStorage.removeItem("expoPushToken");
    // Optionally, notify your backend to remove the token for the current user
    // await api.removeUserPushToken();
  } catch (error) {
    console.error("Error clearing push token:", error);
  }
};

const initialState = {
  user: null,
  loading: true,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginAction: (state, action) => {
      state.user = action.payload;
      state.loading = false;
      state.error = null;
      AsyncStorage.setItem("userInfo", JSON.stringify(action.payload));
    },
    logoutAction: (state) => {
      state.user = null;
      state.loading = false;
      state.error = null;
      AsyncStorage.removeItem("userInfo");
      clearPushToken(); // Clear the Expo Push Token on logout
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.loading = false;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    updateProfile: (state, action) => {
      state.profileData = action.payload;
    },
  },
});

export const { loginAction, logoutAction, setUser, setLoading, setError, updateProfile } = authSlice.actions;

export default authSlice.reducer;

// Thunk to load user from AsyncStorage when the app starts
export const loadUser = () => async (dispatch) => {
  try {
    const user = await loadUserFromStorage();
    if (user) {
      dispatch(setUser(user));
    } else {
      dispatch(setLoading(false));
    }
  } catch (error) {
    dispatch(setError(error.message));
  }
};

// Selector to get the user from the state
export const selectUser = (state) => state.auth.user;
export const selectAuthError = (state) => state.auth.error;