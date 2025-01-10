import React, { useRef, useEffect } from 'react';
import { View, FlatList, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Animated } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import SubHeading from './SubHeading';
import Colors from '../../components/Shared/Colors';
import useInsurance from '../../hooks/useInsurance';
import { useDoctors } from '../../hooks/useDoctors';
import { useDispatch } from 'react-redux';
import { setSelectedDoctor } from '../../app/(redux)/doctorSlice'; // Import the action

interface Doctor {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  specialty: string;
  profileImage?: string;
  clinicAddress?: string;
  clinicName?: string;
  bio?: string;
  title?: string;
  profession?: string;
  consultationFee?: string;
  clinic?: { insuranceCompanies: string[] };
  insuranceProviders: string[];
  yearsOfExperience?: string;
  specializedTreatment?: string;
  certifications?: string[];
  user: {
    profileImage?: string; // Add profileImage in the nested user object
  };
}

interface DoctorsProps {
  searchQuery: string;
  excludeDoctorId?: string;
}

const Doctors: React.FC<DoctorsProps> = ({ searchQuery, excludeDoctorId }) => {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const { insuranceProviders } = useInsurance();
  const { doctors, loading, error } = useDoctors();
  const dispatch = useDispatch();

  const handleConsult = (doctor: Doctor) => {
    console.log('Consulting doctor:', doctor);
    dispatch(setSelectedDoctor(doctor)); // Dispatch the selected doctor
    router.push(`/doctors/${doctor.id}`); // Navigate to the DoctorProfile screen using id
  };
  
  
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const filteredDoctors = doctors.filter(doctor => {
    const matchesQuery = (doctor.firstName && doctor.firstName.toLowerCase().includes(searchQuery.toLowerCase())) ||
                         (doctor.specialty && doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase()));
    const isNotExcluded = doctor.id !== excludeDoctorId;
    return matchesQuery && isNotExcluded;
  });

  useEffect(() => {
    console.log('Filtered doctors:', filteredDoctors); // Log the filtered data
  }, [filteredDoctors]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.PRIMARY} />
      </View>
    );
  }

  if (error) {
    return <Text>Error loading doctors: {error}</Text>;
  }

  return (
    <View style={{ marginTop: 10 }}>
      <SubHeading subHeadingTitle="Discover Doctors Near You" />
      {filteredDoctors.length === 0 && searchQuery ? (
        <Text>No results found</Text>
      ) : (
        <FlatList
          data={filteredDoctors.length > 0 ? filteredDoctors : doctors}
          horizontal
          renderItem={({ item }) => (
            <Animated.View style={[styles.doctorItem, { opacity: fadeAnim }]}>
              <TouchableOpacity onPress={() => handleConsult(item)}>
                <Image
                  source={{
                    uri: item.user.profileImage || item.profileImage || 'https://res.cloudinary.com/dws2bgxg4/image/upload/v1726073012/nurse_portrait_hospital_2d1bc0a5fc.jpg',
                  }}
                  style={styles.doctorImage}
                />
              </TouchableOpacity>
              <View style={styles.nameCategoryContainer}>
                <Text style={styles.doctorName}>{item.firstName} {item.lastName}</Text>
                <Text style={styles.doctorName}>{item.specialty}</Text>
              </View>
            </Animated.View>
          )}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          showsHorizontalScrollIndicator={false}
          nestedScrollEnabled={true}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  doctorItem: {
    marginRight: 10,
    borderRadius: 10,
    padding: 10,
    width: 240,
  },
  doctorImage: {
    width: '100%',
    height: 100,
    borderRadius: 10,
  },
  nameCategoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  doctorName: {
    fontFamily: 'SourceSans3-Bold',
    fontSize: 16,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Doctors;
