import { StyleSheet, FlatList, TouchableOpacity, View, Text, Dimensions, Button } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';
import Colors from '@/components/Shared/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as DocumentPicker from 'expo-document-picker';
import usePatientProfile from '../../hooks/usePatientProfile';

const Health = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [appointments, setAppointments] = useState([]);
  const [medication, setMedication] = useState('');
  const [allergies, setAllergies] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const { uploadImage } = usePatientProfile();

  useEffect(() => {
    const loadAppointments = async () => {
      const storedAppointments = await AsyncStorage.getItem('appointments');
      if (storedAppointments) {
        setAppointments(JSON.parse(storedAppointments));
      }
    };
    loadAppointments();
  }, []);

  useEffect(() => {
    const loadData = async () => {
      const storedMedication = await AsyncStorage.getItem('medication');
      const storedAllergies = await AsyncStorage.getItem('allergies');
      const storedDiagnosis = await AsyncStorage.getItem('diagnosis');
      if (storedMedication) setMedication(storedMedication);
      if (storedAllergies) setAllergies(storedAllergies);
      if (storedDiagnosis) setDiagnosis(storedDiagnosis);
    };
    loadData();
  }, []);

  const saveData = async () => {
    await AsyncStorage.setItem('medication', medication);
    await AsyncStorage.setItem('allergies', allergies);
    await AsyncStorage.setItem('diagnosis', diagnosis);
  };

  const uploadPrescription = async () => {
    let result = await DocumentPicker.getDocumentAsync({ copyToCacheDirectory: true });
    if (result.type === 'success') {
      const uploadResult = await uploadImage(result.uri);
      if (uploadResult) {
        await AsyncStorage.setItem('prescriptionUrl', uploadResult);
        console.log('Prescription uploaded and URL stored:', uploadResult);
      }
    }
  };

  const medicalHistoryCategories = [
    { name: 'Appointments', icon: 'calendar' },
    { name: 'Prescriptions', icon: 'medkit' },
    { name: 'Reports', icon: 'document' },
    { name: 'Profile', icon: 'person' },
  ];

  const screenWidth = Dimensions.get('window').width;
  const itemWidth = screenWidth / medicalHistoryCategories.length;

  const renderAppointmentCard = ({ item }) => (
    <TouchableOpacity 
      style={styles.appointmentCard} 
      onPress={() => console.log('Pressed appointment:', item)}
    >
      <Text style={styles.appointmentText}>Date: {item.date}</Text>
      <Text style={styles.appointmentText}>Doctor: {item.doctor}</Text>
    </TouchableOpacity>
  );

  return (
    <LinearGradient
      colors={['rgba(55, 98, 122, 0.46)', 'rgba(211, 9, 177, 0.4)']}
      style={styles.gradient}
    >
      <View style={styles.card}>
        <FlatList
          data={medicalHistoryCategories}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryContainer}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.categoryItem,
                { width: itemWidth },
                activeCategory === item.name && styles.activeCategory,
              ]}
              onPress={() => setActiveCategory(item.name)}
            >
              <View style={styles.categoryIconContainer}>
                <Ionicons name={item.icon} size={24} color={Colors.primary} />
              </View>
              <Text style={styles.categoryBtnTxt}>{item.name}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.name}
        />
      </View>

      {activeCategory === 'Appointments' && (
        <FlatList
          data={appointments}
          renderItem={renderAppointmentCard}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.appointmentList}
        />
      )}

      {activeCategory === 'Prescriptions' && (
        <View style={styles.section}>
          <Text style={styles.title}><Ionicons name="cloud-upload" size={24} color="purple" /> Upload Prescription</Text>
          <Button title="Upload" onPress={uploadPrescription} />
        </View>
      )}
    </LinearGradient>
  );
};

export default Health;

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    backgroundColor: theme.colors.backgroundColor,
    paddingVertical: 30,
  },
  card: {
    margin: 16,
    padding: 16,
    backgroundColor: 'rgba(211, 9, 177, 0.4)',
    borderRadius: 12,
    elevation: 5,
  },
  categoryContainer: {
    paddingHorizontal: 10,
    marginTop: 10,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 10,
  },
  activeCategory: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 8,
    padding: 5,
  },
  categoryIconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    padding: 10,
    borderRadius: 99,
  },
  categoryBtnTxt: {
    marginTop: 5,
    textAlign: 'center',
    color: Colors.primary,
  },
  appointmentList: {
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  appointmentCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  appointmentText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  section: {
    margin: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
});
