import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchClinics } from '../app/(redux)/clinicSlice';
import useInsurance from './useInsurance'; // Import the insurance hook

const useClinics = () => {
  const dispatch = useDispatch();
  const clinics = useSelector((state) => state.clinics.clinics);
  const loading = useSelector((state) => state.clinics.loading);
  const error = useSelector((state) => state.clinics.error);
  const { insuranceProviders } = useInsurance(); // Use the insurance hook

  useEffect(() => {
    if (insuranceProviders.length > 0) {
      dispatch(fetchClinics({ insuranceProviders }));
    }
  }, [dispatch, insuranceProviders]);

  return { clinics, loading, error };
};

export default useClinics;
