import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, TextInput, Alert, Picker, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { ScrollView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useToast } from 'react-native-paper-toast';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInsuranceProviders } from '../../(redux)/insuranceSlice';

const InsuranceSettings = () => {
  const [insuranceData, setInsuranceData] = useState({
    provider: '',
    policyNumber: '',
    policyholderName: '',
    startDate: new Date(),
    endDate: new Date(),
    contact: '',
    address: '',
  });

  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const toaster = useToast();
  const dispatch = useDispatch();
  const insuranceProviders = useSelector((state) => state.insurance.insuranceProviders);

  useEffect(() => {
    const loadInsuranceData = async () => {
      try {
        const storedData = await AsyncStorage.getItem('insuranceData');
        if (storedData) {
          setInsuranceData(JSON.parse(storedData));
        }
      } catch (error) {
        console.error('Failed to load insurance data:', error);
      }
    };

    loadInsuranceData();
    dispatch(fetchInsuranceProviders());
  }, [dispatch]);

  const handleInputChange = (field, value) => {
    setInsuranceData((prevData) => ({ ...prevData, [field]: value }));
  };

  const handleSave = async () => {
    try {
      await AsyncStorage.setItem('insuranceData', JSON.stringify(insuranceData));
      toaster.show({ message: 'Insurance details saved successfully!', type: 'success' });
    } catch (error) {
      console.error('Failed to save insurance data:', error);
      Alert.alert('Error', 'Failed to save insurance data. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
     

      <ScrollView style={styles.content}>
        
        <View style={styles.sectionContainer}>
          <View style={styles.inputContainer}>
            <MaterialIcons name="credit-card" size={24} color="#007AFF" />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.inputLabel}>Insurance Provider</Text>
              <Picker
                selectedValue={insuranceData.provider}
                style={styles.picker}
                onValueChange={(itemValue) => handleInputChange('provider', itemValue)}
              >
                {insuranceProviders.map((provider) => (
                  <Picker.Item key={provider._id} label={provider.name} value={provider.name} />
                ))}
              </Picker>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <MaterialIcons name="person" size={24} color="#007AFF" />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.inputLabel}>Policyholder Name</Text>
              <TextInput
                style={styles.textInput}
                value={insuranceData.policyholderName}
                onChangeText={(text) => handleInputChange('policyholderName', text)}
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <MaterialIcons name="confirmation-number" size={24} color="#007AFF" />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.inputLabel}>Policy Number</Text>
              <TextInput
                style={styles.textInput}
                value={insuranceData.policyNumber}
                onChangeText={(text) => handleInputChange('policyNumber', text)}
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <MaterialIcons name="phone" size={24} color="#007AFF" />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.inputLabel}>Contact Number</Text>
              <TextInput
                style={styles.textInput}
                value={insuranceData.contact}
                onChangeText={(text) => handleInputChange('contact', text)}
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <MaterialIcons name="location-on" size={24} color="#007AFF" />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.inputLabel}>Address</Text>
              <TextInput
                style={styles.textInput}
                value={insuranceData.address}
                onChangeText={(text) => handleInputChange('address', text)}
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <MaterialIcons name="calendar-today" size={24} color="#007AFF" />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.inputLabel}>Policy Start Date</Text>
              <TouchableOpacity
                onPress={() => setShowStartDatePicker(true)}
                style={styles.datePickerButton}
              >
                <Text style={styles.dateText}>
                  {insuranceData.startDate ? insuranceData.startDate.toDateString() : 'Select Start Date'}
                </Text>
              </TouchableOpacity>
              {showStartDatePicker && (
                <DateTimePicker
                  value={insuranceData.startDate}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={(event, selectedDate) => {
                    setShowStartDatePicker(false);
                    if (selectedDate) {
                      handleInputChange('startDate', selectedDate);
                    }
                  }}
                />
              )}
            </View>
          </View>

          <View style={styles.inputContainer}>
            <MaterialIcons name="calendar-today" size={24} color="#007AFF" />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.inputLabel}>Policy End Date</Text>
              <TouchableOpacity
                onPress={() => setShowEndDatePicker(true)}
                style={styles.datePickerButton}
              >
                <Text style={styles.dateText}>
                  {insuranceData.endDate ? insuranceData.endDate.toDateString() : 'Select End Date'}
                </Text>
              </TouchableOpacity>
              {showEndDatePicker && (
                <DateTimePicker
                  value={insuranceData.endDate}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={(event, selectedDate) => {
                    setShowEndDatePicker(false);
                    if (selectedDate) {
                      handleInputChange('endDate', selectedDate);
                    }
                  }}
                />
              )}
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Insurance Details</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#ddd' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#000', marginLeft: 10 },
  content: { padding: 16 },
  sectionTitle: { fontSize: 14, fontWeight: '600', textTransform: 'uppercase', marginBottom: 10 },
  sectionContainer: { backgroundColor: '#f9f9f9', borderRadius: 8, padding: 16, marginBottom: 16 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  inputLabel: { fontSize: 12, fontWeight: '600', color: '#555' },
  datePickerButton: { borderBottomWidth: 1, borderBottomColor: '#ddd', paddingVertical: 4 },
  dateText: { fontSize: 14, color: '#000' },
  picker: { height: 50, width: '100%' },
  textInput: { borderBottomWidth: 1, borderBottomColor: '#ddd', paddingVertical: 4, fontSize: 14, color: '#000' },
  saveButton: { backgroundColor: '#007AFF', padding: 16, borderRadius: 8, alignItems: 'center' },
  saveButtonText: { fontSize: 16, fontWeight: '600', color: '#fff' },
});

export default InsuranceSettings;
