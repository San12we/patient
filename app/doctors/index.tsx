import { StyleSheet, Text, View, ActivityIndicator, TouchableOpacity, ScrollView, Avatar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import React, { useState, useEffect } from 'react';
import { useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDoctors } from '../../app/(redux)/doctorSlice';
import { RootState } from '../../app/(redux)/store';
import Colors from '../../components/Shared/Colors';
import BookingSection from '../../components/BookingSection';
import HorizontalLine from '../../components/common/HorizontalLine';
import { SafeAreaView } from 'react-native-safe-area-context';

const DoctorProfile: React.FC = () => {
  const route = useRoute();
  const doctorId = route.params?.doctorId; 
  
  const dispatch = useDispatch();
  const doctors = useSelector((state: RootState) => state.doctors.doctorList);
  const loading = useSelector((state: RootState) => state.doctors.loading);
  const error = useSelector((state: RootState) => state.doctors.error);
  
  const doctor = doctors.find((doc) => doc._id === doctorId);

  const [selectedInsurance, setSelectedInsurance] = useState('');

  useEffect(() => {
    dispatch(fetchDoctors()); 
  }, [dispatch]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!doctor) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: Doctor information not found.</Text>
      </View>
    );
  }

  const profileImageUri = doctor.image?.url || 'https://res.cloudinary.com/dws2bgxg4/image/upload/v1726073012/nurse_portrait_hospital_2d1bc0a5fc.jpg';

  return (
    <SafeAreaView style={styles.safeArea}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.profileContainer}>
          <Avatar
            source={{ uri: profileImageUri }}
            containerStyle={styles.avatar}
            imageProps={{ style: { borderRadius: 50 } }}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.doctorName}>{`${doctor.firstName} ${doctor.lastName}`}</Text>
            <Text style={styles.categoryName}>{doctor.profession}</Text>
          </View>
        </View>
        <View style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <Ionicons name="person" size={20} color={Colors.primary} />
            <Text style={styles.infoText}>{doctor.yearsOfExperience} Years of Experience</Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="people" size={20} color={Colors.primary} />
            <Text style={styles.infoText}>{doctor.numberOfPatients} Patients</Text>
          </View>
        </View>
        <BookingSection 
          doctorId={doctor._id} 
          consultationFee={doctor.consultationFee} 
          insurances={doctor.clinicInsurances} 
          selectedInsurance={selectedInsurance} 
        />
        <HorizontalLine />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.light_gray,
  },
  scrollViewContent: {
    padding: 20,
    paddingTop: 60,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 2,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: Colors.light_gray,
    borderRadius: 8,
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
  },
  profileInfo: {
    flex: 1,
    marginLeft: 15,
  },
  doctorName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  categoryName: {
    fontSize: 16,
    color: Colors.gray,
    marginVertical: 4,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 18,
  },
});

export default DoctorProfile;
