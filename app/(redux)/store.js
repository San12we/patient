import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authReducer from "./authSlice";
import doctorReducer from "./doctorSlice";
import clinicReducer from "./clinicSlice";
import appointmentsReducer from "./appointmentSlice";
import insuranceReducer from "./insuranceSlice";

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth', 'clinics', 'doctors']
};

const rootReducer = {
  auth: authReducer,
  doctors: doctorReducer,
  clinics: clinicReducer,
  appointments: appointmentsReducer,
  insurance: insuranceReducer,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);
export default store;
