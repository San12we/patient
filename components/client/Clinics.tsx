import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import SubHeading from '../../components/client/SubHeading';
import Colors from '../Shared/Colors';
import * as SplashScreen from 'expo-splash-screen';
import { useRouter } from 'expo-router';
import useClinics from '../../hooks/useClinics'; // Import the useClinics hook
import { useSelector, useDispatch } from 'react-redux';
import { fetchInsuranceProviders } from '../../app/(redux)/insuranceSlice';

SplashScreen.preventAutoHideAsync();

interface Clinic {
  _id: string;
  name: string;
  category: string;
  address: string;
  clinicImages?: string[];
}

interface ClinicsProps {
  searchQuery: string;

}

const Clinics: React.FC<ClinicsProps> = ({ searchQuery }) => {
  const router = useRouter();
  const { clinics, loading, error } = useClinics(); // Use the useClinics hook
  const insuranceProviders = useSelector((state) => state.insurance.insuranceProviders);
  const dispatch = useDispatch();
  const initialLoad = useRef(true);

  useEffect(() => {
    if (initialLoad.current) {
      SplashScreen.hideAsync();
      initialLoad.current = false;
    }
    console.log("Clinics data:", clinics); // Log the clinics data
  }, [clinics]);

  useEffect(() => {
    if (insuranceProviders.length === 0) {
      dispatch(fetchInsuranceProviders());
    }
  }, [insuranceProviders, dispatch]);

  const handlePress = useCallback((item: Clinic) => {
    console.log("Navigating to clinic with ID:", item._id);
    router.push(`/hospital/book-appointment/${item._id}`);
  }, [router]);

  const ClinicItem: React.FC<{ item: Clinic }> = React.memo(({ item }) => {
    const [currentImage, setCurrentImage] = useState<string | null>(null);
    const clinicImages = item.clinicImages || [];

    useEffect(() => {
      if (clinicImages.length > 0) {
        setCurrentImage(clinicImages[0]);

        if (clinicImages.length > 1) {
          let imageIndex = 0;
          const interval = setInterval(() => {
            imageIndex = (imageIndex + 1) % clinicImages.length;
            setCurrentImage(clinicImages[imageIndex]);
          }, 10000);

          return () => clearInterval(interval);
        }
      }
    }, [clinicImages]);

    return (
      <TouchableOpacity style={styles.clinicItem} onPress={() => handlePress(item)}>
        {currentImage ? (
          <Image
            source={{ uri: currentImage }}
            style={styles.clinicImage}
          />
        ) : (
          <Image
            source={item.profileImage ? { uri: item.profileImage } : 'https://res.cloudinary.com/dws2bgxg4/image/upload/v1734385887/loginp_ovgecg.png'}
            style={styles.clinicImage}
          />
        )}
        <View style={styles.textContainer}>
          <Text style={styles.clinicName} numberOfLines={1}>
            {item.practiceName}
          </Text>
        </View>
      </TouchableOpacity>
    );
  });

  const filteredClinics = clinics.filter(clinic => true);

  if (loading) {
    return <ActivityIndicator size="large" color={Colors.GRAY} />;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  return (
    <View style={{ marginTop: 10 }}>
      <SubHeading subHeadingTitle={'Discover Clinics Near You'} onViewAll={() => {}} />
      {filteredClinics.length === 0 && searchQuery ? (
        <Text>No results found</Text>
      ) : (
        <FlatList
          data={filteredClinics.length > 0 ? filteredClinics : clinics}
          horizontal={true}
          renderItem={({ item }) => <ClinicItem item={item} />}
          keyExtractor={(item) => item._id?.toString() || `temp-${Math.random()}`}
          showsHorizontalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  clinicItem: {
    marginRight: 10,
    borderRadius: 10,
    padding: 10,
    width: 200,
  },
  clinicImage: {
    width: '100%',
    height: 100,
    borderRadius: 10,
  },
  textContainer: {
    marginTop: 5,
  },
  clinicName: {
    fontWeight: 'bold',
    color: Colors.primary,
  },
  clinicAddress: {
    color: Colors.primary,
  },
  clinicCategory: {
    color: Colors.primary,
    marginTop: 5,
  },
});

export default Clinics;
