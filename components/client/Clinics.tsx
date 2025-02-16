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
import { useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedClinic } from '../../app/(redux)/clinicSlice'; // Import the setSelectedClinic action

interface Clinic {
  _id: string;
  name: string;
  category: string;
  address: string;
  clinicImages?: string[];
}

const Clinics: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { clinics, loading, error } = useSelector((state) => state.clinics);

  useEffect(() => {
    console.log("Clinics data:", clinics); // Log the clinics data
    clinics.forEach(clinic => {
      console.log(`Clinic: ${clinic.name}, Doctors:`, clinic.doctors); // Log each clinic's doctors
    });
  }, [clinics]);

  const handlePress = useCallback((item: Clinic) => {
    console.log("Navigating to clinic with ID:", item._id);
    const fullClinicData = clinics.find(clinic => clinic._id === item._id);
    console.log("Selected Clinic Data:", fullClinicData); // Log the selected clinic data
    dispatch(setSelectedClinic(fullClinicData)); // Dispatch the selected clinic with full data
    router.push(`/clinic/${item._id}`); // Navigate to the ClinicProfile screen using id
  }, [router, dispatch, clinics]);

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

  const filteredClinics = clinics; // No filtering based on searchQuery

  if (loading) {
    return <ActivityIndicator size="large" color={Colors.GRAY} />;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  return (
    <View style={{ marginTop: 10 }}>
      <SubHeading subHeadingTitle={'Discover Clinics Near You'} onViewAll={() => {}} />
      <FlatList
        data={filteredClinics}
        horizontal={true}
        renderItem={({ item }) => <ClinicItem item={item} />}
        keyExtractor={(item) => item._id?.toString() || `temp-${Math.random()}`}
        showsHorizontalScrollIndicator={false}
      />
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
