import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchClinics, setClinicsFromStorage } from '../app/(redux)/clinicSlice';
import useInsurance from './useInsurance'; // Import the insurance hook
import AsyncStorage from '@react-native-async-storage/async-storage';

const useClinics = () => {
  const dispatch = useDispatch();
  const clinics = useSelector((state) => state.clinics.clinics);
  const loading = useSelector((state) => state.clinics.loading);
  const error = useSelector((state) => state.clinics.error);
  const { insuranceProviders } = useInsurance(); // Use the insurance hook
  const initialLoad = useRef(true);

  useEffect(() => {
    const loadClinicsFromStorage = async () => {
      const storedClinics = await AsyncStorage.getItem('clinics');
      if (storedClinics) {
        dispatch(setClinicsFromStorage(JSON.parse(storedClinics)));
      }
    };

    if (initialLoad.current) {
      loadClinicsFromStorage();
      initialLoad.current = false;
    }
  }, [dispatch]);

  useEffect(() => {
    if (insuranceProviders.length > 0) {
      dispatch(fetchClinics({ insuranceProviders }));
    }
  }, [dispatch, insuranceProviders]);

  return { clinics, loading, error };
};

export default useClinics;
