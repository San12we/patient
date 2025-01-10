import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchClinics } from '../app/(redux)/clinicSlice';
import { getDoctors } from '../app/(redux)/doctorSlice';
import useInsurance from './useInsurance';

interface Doctor {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  specialty: string;
  profileImage: string;
  clinicAddress: string;
  clinicName: string;
  bio: string;
  title: string;
  profession: string;
  consultationFee: string;
  clinic: { insuranceCompanies: string[] };
  insuranceProviders: string[];
  yearsOfExperience: string;
  specializedTreatment: string;
  certifications: string[];
}

interface Clinic {
  _id: string;
  name: string;
  category: string;
  address: string;
  clinicImages: string[];
  profileImage: string;
  insuranceProviders: string[];
  practiceLocation: string;
  practiceName: string;
  workingHours: string;
  workingDays: string;
  doctors: Doctor[];
}

const useSearch = () => {
  const dispatch = useDispatch();
  const clinics = useSelector((state) => state.clinics.clinics);
  const doctors = useSelector((state) => state.doctors.doctors);
  const loading = useSelector((state) => state.clinics.loading || state.doctors.loading);
  const error = useSelector((state) => state.clinics.error || state.doctors.error);
  const { insuranceProviders } = useInsurance();

  const [filteredClinics, setFilteredClinics] = useState<Clinic[]>([]);
  const [filteredProfessionals, setFilteredProfessionals] = useState<Doctor[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('');
  const [selectedInsurance, setSelectedInsurance] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedPracticeLocation, setSelectedPracticeLocation] = useState<string>('');

  useEffect(() => {
    dispatch(fetchClinics({ insuranceProviders }));
    dispatch(getDoctors());
  }, [dispatch, insuranceProviders]);

  useEffect(() => {
    setFilteredClinics(clinics);
    setFilteredProfessionals(doctors);
  }, [clinics, doctors]);

  useEffect(() => {
    console.log('Clinics Data:', clinics);
    console.log('Doctors Data:', doctors);
  }, [clinics, doctors]);

  const resetFilters = () => {
    setSelectedLocation('');
    setSelectedSpecialty('');
    setSelectedInsurance('');
    setFilteredClinics(clinics);
    setFilteredProfessionals(doctors);
  };

  const handleSearchChange = (text: string) => {
    const searchQuery = text.toLowerCase();
    const searchedClinics = clinics.filter((clinic) =>
      (clinic.practiceName && clinic.practiceName.toLowerCase().includes(searchQuery)) || // Clinic practice name
      (clinic.address && clinic.address.toLowerCase().includes(searchQuery)) || // Clinic address
      clinic.doctors.some((prof) =>
        (prof.firstName && prof.firstName.toLowerCase().includes(searchQuery)) || // Doctor first name
        (prof.lastName && prof.lastName.toLowerCase().includes(searchQuery)) || // Doctor last name
        (prof.specialty && prof.specialty.toLowerCase().includes(searchQuery)) // Doctor specialty
      )
    );
    setFilteredClinics(searchedClinics);
  };

  const handleCombinedFilters = () => {
    const filtered = clinics.filter(
      (clinic) =>
        (selectedLocation ? clinic.address?.toLowerCase().includes(selectedLocation.toLowerCase()) : true) &&
        (selectedInsurance ? clinic.insuranceProviders.some((ins) =>
          ins.toLowerCase().includes(selectedInsurance.toLowerCase())
        ) : true) &&
        (selectedSpecialty ? clinic.doctors.some((prof) =>
          prof.specialty.toLowerCase().includes(selectedSpecialty.toLowerCase())
        ) : true) &&
        (selectedCategory ? clinic.category?.toLowerCase().includes(selectedCategory.toLowerCase()) : true) &&
        (selectedPracticeLocation ? clinic.practiceLocation?.toLowerCase().includes(selectedPracticeLocation.toLowerCase()) : true)
    );
    setFilteredClinics(filtered);
  };

  const uniqueLocations = [...new Set(clinics.map((clinic) => clinic.address?.split(',')[0] || ''))];
  const uniqueSpecialties = [
    ...new Set(
      clinics.flatMap((clinic) => clinic.doctors?.map((professional) => professional.specialty) || [])
    ),
  ];
  const uniqueInsurances = [
    ...new Set(clinics.flatMap((clinic) => clinic.insuranceProviders || [])),
  ];
  const uniqueCategories = [...new Set(clinics.map((clinic) => clinic.category || ''))];
  const uniquePracticeLocations = [...new Set(clinics.map((clinic) => clinic.practiceLocation || ''))];

  return {
    clinics,
    filteredClinics,
    filteredProfessionals,
    loading,
    error,
    uniqueLocations,
    uniqueSpecialties,
    uniqueInsurances,
    uniqueCategories,
    uniquePracticeLocations,
    handleSearchChange,
    handleCombinedFilters,
    resetFilters,
    setSelectedLocation,
    setSelectedSpecialty,
    setSelectedInsurance,
    setSelectedCategory,
    setSelectedPracticeLocation,
  };
};

export default useSearch;
