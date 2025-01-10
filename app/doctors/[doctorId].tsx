import React, { useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  Image,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSelector } from 'react-redux';
import Colors from '../../components/Shared/Colors';
import BookingSection from '../../components/BookingSection';
import HorizontalLine from '../../components/common/HorizontalLine';
import ClinicSubHeading from '@/components/clinics/ClinicSubHeading';
import { theme } from '@/constants/theme';
import Doctors from '../../components/client/Doctors';
import { LinearGradient } from 'expo-linear-gradient';

const DoctorProfile: React.FC = () => {
  const router = useRouter();
  const doctor = useSelector((state) => state.doctors.selectedDoctor);

  useEffect(() => {
    if (!doctor) {
      router.back();
    }
  }, [doctor, router]);

  if (!doctor) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.PRIMARY} />
      </View>
    );
  }

  const profileImageUri =
    doctor.profileImage ||
    'https://res.cloudinary.com/dws2bgxg4/image/upload/v1726073012/nurse_portrait_hospital_2d1bc0a5fc.jpg';

  const specialties = doctor.professionalDetails?.customSpecializedTreatment || 'N/A';
  const clinicName = doctor.practiceName || 'Unknown Clinic';
  const yearsOfExperience = doctor.experience?.length || 'N/A';
  const userId = doctor.user?._id;

  return (
    <LinearGradient
      colors={['rgba(55, 98, 122, 0.46)', 'rgba(211, 9, 177, 0.4)']}
      style={styles.gradient}
    >
      <ScrollView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.heroContainer}>
          <Image source={{ uri: profileImageUri }} style={styles.heroImage} />
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.heroOverlay}>
            <Text style={styles.heroText}>{`${doctor.firstName} ${doctor.lastName}`}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <ClinicSubHeading subHeadingTitle={`${doctor.firstName} ${doctor.lastName}`} />
          <Text style={styles.descriptionText}>
            {doctor.bio || 'No description available'}
          </Text>
        </View>

        <View style={[styles.section, styles.horizontalSection]}>
          <View style={styles.infoCard}>
            <Ionicons name="medkit" size={20} color={Colors.primary} />
            <Text style={styles.infoText}>{specialties}</Text>
          </View>
          <View style={styles.infoCard}>
            <Ionicons name="business" size={20} color={Colors.primary} />
            <Text style={styles.infoText}>{clinicName}</Text>
          </View>
          <View style={styles.infoCard}>
            <Ionicons name="calendar" size={20} color={Colors.primary} />
            <Text style={styles.infoText}>{yearsOfExperience} years of experience</Text>
          </View>
        </View>

        <BookingSection
          doctorId={doctor._id}
          userId={userId} // Ensure userId is passed correctly
          consultationFee={doctor.consultationFee || 'N/A'}
          insurances={doctor.insuranceProviders} // Pass insurance provider IDs here
        />
        <HorizontalLine />

        <View style={styles.section}>
          <Doctors searchQuery="" excludeDoctorId={doctor.id} />
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default DoctorProfile;

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    backgroundColor: theme.colors.backgroundColor,
  },
  container: { flex: 1 },
  heroContainer: { position: 'relative', height: 250 },
  heroImage: { width: '100%', height: '100%' },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 10,
    zIndex: 10,
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroText: { fontSize: 24, color: '#fff', fontWeight: 'bold' },
  section: { marginVertical: 15, paddingHorizontal: 15 },
  horizontalSection: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  descriptionText: { fontSize: 16, color: '#333' },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    width: '45%',
  },
  infoText: { marginLeft: 8, fontSize: 14, color: Colors.text },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
});
