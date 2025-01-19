import React, { useRef, useEffect, useMemo } from 'react';
import { View, FlatList, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Animated } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import SubHeading from './SubHeading';
import Colors from '../../components/Shared/Colors';
import useInsurance from '../../hooks/useInsurance';
import { useDoctors } from '../../hooks/useDoctors';
import { useDispatch } from 'react-redux';
import { setSelectedDoctor, getDoctors } from '../../app/(redux)/doctorSlice'; // Import the actions

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
  const { insuranceProviders } = useInsurance();
  const { doctors, loading, error } = useDoctors();
  const dispatch = useDispatch();

  useEffect(() => {
    if (doctors.length === 0) {
      dispatch(getDoctors()); // Fetch doctors only if not already available
    }
  }, [dispatch, doctors.length]);

  useEffect(() => {
    console.log('Doctors component rendered');
  });

  const handleConsult = (doctor: Doctor) => {
    console.log('Consulting doctor:', doctor);
    dispatch(setSelectedDoctor(doctor)); // Dispatch the selected doctor
    router.push(`/doctors/${doctor.id}`); // Navigate to the DoctorProfile screen using id
  };
  
  const filteredDoctors = useMemo(() => {
    return doctors.filter(doctor => {
      const isNotExcluded = doctor.id !== excludeDoctorId;
      return isNotExcluded;
    });
  }, [doctors, excludeDoctorId]);

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
    <View style={styles.container}>
      <SubHeading subHeadingTitle="Discover Doctors Near You" />
      {filteredDoctors.length === 0 && searchQuery ? (
        <Text>No results found</Text>
      ) : (
        <FlatList
          data={filteredDoctors.length > 0 ? filteredDoctors : doctors}
          horizontal
          renderItem={({ item }) => (
            <View style={styles.doctorItem}>
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
            </View>
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
  container: {
    marginTop: 10,
    padding: 10, // Add padding if necessary
    borderRadius: 10, // Add border radius if necessary
  },
  doctorItem: {
    marginRight: 10,
    borderRadius: 10,
    padding: 10,
    width: 200,
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
        fontWeight: 'bold',
        color: Colors.primary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Doctors;
