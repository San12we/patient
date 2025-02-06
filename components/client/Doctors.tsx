import React, { useMemo, useEffect } from 'react';
import { View, FlatList, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import SubHeading from './SubHeading';
import Colors from '../../components/Shared/Colors';
import { useDispatch } from 'react-redux';
import { setSelectedDoctor } from '../../app/(redux)/doctorSlice'; // Import the setSelectedDoctor action

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
  doctors: Doctor[];
  error: string | null;
}

const Doctors: React.FC<DoctorsProps> = ({ doctors, error }) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const handleConsult = (doctor: Doctor) => {
    console.log('Consulting doctor:', doctor);
    dispatch(setSelectedDoctor(doctor)); // Dispatch the selected doctor
    router.push(`/doctors/${doctor.id}`); // Navigate to the DoctorProfile screen using id
  };

  const filteredDoctors = useMemo(() => {
    return doctors; // No filtering based on searchQuery or excludeDoctorId
  }, [doctors]);

  useEffect(() => {
    console.log('Filtered doctors:', filteredDoctors); // Log the filtered data
  }, [filteredDoctors]);

  if (error) {
    return <Text>Error loading doctors: {error}</Text>;
  }

  return (
    <View style={styles.container}>
      <SubHeading subHeadingTitle="Discover Doctors Near You" />
      <FlatList
        data={filteredDoctors}
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
