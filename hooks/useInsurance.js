import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchInsuranceProviders } from "../app/(redux)/insuranceSlice";

const useInsurance = () => {
  const dispatch = useDispatch();
  const insuranceProviders = useSelector((state) => state.insurance.insuranceProviders);
  const status = useSelector((state) => state.insurance.status);
  const error = useSelector((state) => state.insurance.error);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchInsuranceProviders());
    }
  }, [status, dispatch]);

  return { insuranceProviders, status, error };
};

export default useInsurance;