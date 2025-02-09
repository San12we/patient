import { StyleSheet, Text, View, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
// Remove the LinearGradient import
// import { LinearGradient } from 'expo-linear-gradient';
import Doctors from '../../components/client/Doctors';
import Category from '@/components/client/Category';
import SearchBar from '@/components/client/SearchBar';
import { theme } from '@/constants/theme';
import Clinics from '@/components/client/Clinics';
import CustomLoadingScreen from '../../components/CustomLoadingScreen';
import { useDispatch, useSelector } from 'react-redux';
import { getDoctors } from '../../app/(redux)/doctorSlice';
import { fetchInsuranceProviders } from '../../app/(redux)/insuranceSlice';
import { fetchClinics } from '../../app/(redux)/clinicSlice'; // Import fetchClinics action
import GlobalApi from '../../Services/GlobalApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Posts from '@/components/client/Posts';
import SubHeading from '@/components/client/SubHeading';
import ClinicSubHeading from '@/components/clinics/ClinicSubHeading';

const Index: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState<boolean>(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);
  const router = useRouter();
  const dispatch = useDispatch();
  const { doctors, loading: doctorsLoading, error: doctorsError } = useSelector((state) => state.doctors);
  const { clinics, loading: clinicsLoading, error: clinicsError } = useSelector((state) => state.clinics);
  const { insuranceProviders } = useSelector((state) => state.insurance);

  const handleSearchSubmit = () => {
    router.push(`/search?query=${searchQuery}`);
  };

  useEffect(() => {
    dispatch(getDoctors()); // Fetch doctors data
    dispatch(fetchInsuranceProviders()); // Fetch insurance providers data
    getCategories(); // Fetch categories data
  }, [dispatch]);

  useEffect(() => {
    if (insuranceProviders.length > 0) {
      dispatch(fetchClinics({ insuranceProviders })); // Fetch clinics data
    }
  }, [dispatch, insuranceProviders]);

  useEffect(() => {
    console.log("Clinics data in Index component:", clinics); // Log the clinics data
  }, [clinics]);

  const getCategories = async () => {
    try {
      // Check AsyncStorage for cached categories
      const cachedCategories = await AsyncStorage.getItem('categories');
      if (cachedCategories) {
        setCategories(JSON.parse(cachedCategories));
        setCategoriesLoading(false);
        return;
      }

      // Fetch categories from API if not in AsyncStorage
      const resp = await GlobalApi.getCategories();
      const categories: Category[] = resp.data || [];
      setCategories(categories);

      // Store categories in AsyncStorage
      await AsyncStorage.setItem('categories', JSON.stringify(categories));
    } catch (error) {
      setCategories([]);
      setCategoriesError('Error loading categories');
    } finally {
      setCategoriesLoading(false);
    }
  };

  if (doctorsLoading || clinicsLoading || categoriesLoading) {
    return <CustomLoadingScreen message="Loading content..." />;
  }

  if (doctorsError) {
    return <Text>Error loading doctors: {doctorsError}</Text>;
  }

  if (clinicsError) {
    return <Text>Error loading clinics: {clinicsError}</Text>;
  }

  if (categoriesError) {
    return <Text>{categoriesError}</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.innerContainer}>
        <SearchBar
          setSearchQuery={setSearchQuery}
          onSubmit={handleSearchSubmit}
        />
        <Category categories={categories} loading={categoriesLoading} error={categoriesError} />
        <Doctors doctors={doctors} loading={doctorsLoading} error={doctorsError} />
        <Clinics clinics={clinics} loading={clinicsLoading} error={clinicsError} />
        <ClinicSubHeading subHeadingTitle='Explore Insights' />
        <Posts />
      </View>
    </ScrollView>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#e3f6f5', // Set the background color
    padding: 20,
    paddingBottom: 40, // Add padding to the bottom
  },
  innerContainer: {
    flex: 1,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  clinics: {
    marginBottom: 20, // Add margin to the bottom of Clinics component
  },
});
