import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { fetchInsuranceProviders } from "../app/(redux)/insuranceSlice";
import { selectUser } from "../app/(redux)/authSlice";

const useInsurance = () => {
  const dispatch = useDispatch();
  const insuranceProviders = useSelector((state) => state.insurance.insuranceProviders);
  const status = useSelector((state) => state.insurance.status);
  const error = useSelector((state) => state.insurance.error);
  const user = useSelector(selectUser);
  const userId = user.user?._id;

  const [userInsurance, setUserInsurance] = useState(null);
  const [isInsuranceAccepted, setIsInsuranceAccepted] = useState(false);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchInsuranceProviders());
    }
  }, [status, dispatch]);

  useEffect(() => {
    const fetchUserInsurance = async () => {
      try {
        const response = await axios.get(`https://project03-rj91.onrender.com/insurance/user/${userId}`);
        if (response.status === 200) {
          const data = response.data;
          setUserInsurance(data.insuranceProvider);
          setIsInsuranceAccepted(insuranceProviders.some((insurance) => insurance.name === data.insuranceProvider));
        }
      } catch (error) {
        console.error('Error fetching user insurance:', error);
      }
    };

    if (userId) {
      fetchUserInsurance();
    }
  }, [userId, insuranceProviders]);

  return { insuranceProviders, userInsurance, isInsuranceAccepted, status, error };
};

export default useInsurance;