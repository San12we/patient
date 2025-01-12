import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { ScrollView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useToast } from 'react-native-paper-toast';

const InsuranceSettings = () => {
  const [insuranceData, setInsuranceData] = useState({
    provider: '',
    policyNumber: '',
    policyholderName: '',
    startDate: '',
    endDate: '',
    contact: '',
    address: '',
  });

  const toaster = useToast();

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
  }, []);

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

  const renderInputField = ({ icon, label, placeholder, value, onChangeText }) => (
    <View style={styles.inputContainer}>
      <MaterialIcons name={icon} size={24} color="#007AFF" />
      <View style={{ flex: 1, marginLeft: 10 }}>
        <Text style={styles.inputLabel}>{label}</Text>
        <TextInput
          style={styles.textInput}
          placeholder={placeholder}
          placeholderTextColor="#999"
          value={value}
          onChangeText={onChangeText}
        />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => {}}>
          <MaterialIcons name="arrow-back-ios" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Insurance Settings</Text>
      </View>

      {/* Insurance Fields */}
      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>Insurance Details</Text>
        <View style={styles.sectionContainer}>
          {renderInputField({
            icon: 'credit-card',
            label: 'Insurance Provider',
            placeholder: 'Enter provider name',
            value: insuranceData.provider,
            onChangeText: (text) => handleInputChange('provider', text),
          })}
          {renderInputField({
            icon: 'policy',
            label: 'Policy Number',
            placeholder: 'Enter policy number',
            value: insuranceData.policyNumber,
            onChangeText: (text) => handleInputChange('policyNumber', text),
          })}
          {renderInputField({
            icon: 'person-outline',
            label: 'Policyholder Name',
            placeholder: 'Enter policyholder name',
            value: insuranceData.policyholderName,
            onChangeText: (text) => handleInputChange('policyholderName', text),
          })}
          {renderInputField({
            icon: 'calendar-today',
            label: 'Policy Start Date',
            placeholder: 'Enter start date (DD/MM/YYYY)',
            value: insuranceData.startDate,
            onChangeText: (text) => handleInputChange('startDate', text),
          })}
          {renderInputField({
            icon: 'calendar-today',
            label: 'Policy End Date',
            placeholder: 'Enter end date (DD/MM/YYYY)',
            value: insuranceData.endDate,
            onChangeText: (text) => handleInputChange('endDate', text),
          })}
          {renderInputField({
            icon: 'phone',
            label: 'Insurance Contact',
            placeholder: 'Enter support contact number',
            value: insuranceData.contact,
            onChangeText: (text) => handleInputChange('contact', text),
          })}
          {renderInputField({
            icon: 'location-on',
            label: 'Insurance Office Address',
            placeholder: 'Enter office address',
            value: insuranceData.address,
            onChangeText: (text) => handleInputChange('address', text),
          })}
        </View>

        {/* Action Button */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Insurance Details</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default InsuranceSettings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginLeft: 10,
  },
  content: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    textTransform: 'uppercase',
    letterSpacing: 1.1,
    marginBottom: 10,
  },
  sectionContainer: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#555',
  },
  textInput: {
    fontSize: 14,
    color: '#000',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginTop: 4,
    paddingBottom: 4,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
