import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
} from 'react-native';
import { TextInput } from 'react-native-paper';
import FeatherIcon from 'react-native-vector-icons/Feather';
import useInsurance from '../../../hooks/useInsurance';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import Colors from '@/components/Shared/Colors';

const InsuranceScreen = () => {
  const [isPrivate, setIsPrivate] = useState(false);
  const [insuranceData, setInsuranceData] = useState({
    insuranceProvider: 'HealthPlus',
    insuranceNumber: '123-456-789',
    policyholderName: 'John Doe',
    effectiveDate: '2024-01s-01',
    expirationDate: '2025-01-01',
  });

  const { insuranceProviders } = useInsurance();
  const router = useRouter();

  const saveInsuranceData = async (data) => {
    try {
      await AsyncStorage.setItem('insuranceData', JSON.stringify(data));
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const loadInsuranceData = async () => {
    try {
      const storedData = await AsyncStorage.getItem('insuranceData');
      if (storedData) {
        setInsuranceData(JSON.parse(storedData));
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  useEffect(() => {
    loadInsuranceData();
  }, []);

  useEffect(() => {
    saveInsuranceData(insuranceData);
  }, [insuranceData]);

  const handleUpdate = (field, value) => {
    const updatedData = { ...insuranceData, [field]: value };
    setInsuranceData(updatedData);
  };

  const maskValue = (value) => value ? '*'.repeat(value.length) : '';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <FeatherIcon name="arrow-left" size={24} color="#007bff" style={{ marginRight: 16 }} />
        </TouchableOpacity>
        <FeatherIcon name="shield" size={24} color="#007bff" style={{ marginRight: 16 }} />
        <Text style={styles.headerTitle}>Insurance Information</Text>
      </View>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Insurance Details</Text>
          <Switch
            value={isPrivate}
            onValueChange={() => setIsPrivate(!isPrivate)}
          />
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.cardLabel}>Provider:</Text>
          <Text style={styles.cardValue}>
            {isPrivate ? maskValue(insuranceData.insuranceProvider) : insuranceData.insuranceProvider}
          </Text>
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.cardLabel}>Policy Number:</Text>
          <Text style={styles.cardValue}>
            {isPrivate ? maskValue(insuranceData.insuranceNumber) : insuranceData.insuranceNumber}
          </Text>
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.cardLabel}>Policyholder:</Text>
          <Text style={styles.cardValue}>
            {isPrivate ? maskValue(insuranceData.policyholderName) : insuranceData.policyholderName}
          </Text>
        </View>
      </View>
      <ScrollView style={styles.editSection}>
        <View style={styles.editableField}>
          <Text style={styles.fieldLabel}>Insurance Provider:</Text>
          <Picker
            selectedValue={insuranceData.insuranceProvider}
            onValueChange={(value) => handleUpdate('insuranceProvider', value)}
            style={styles.picker}
          >
            {insuranceProviders.map((provider) => (
              <Picker.Item
                key={provider._id}
                label={provider.name}
                value={provider.name}
              />
            ))}
          </Picker>
        </View>
        <EditableField
          label="Insurance Number"
          value={insuranceData.insuranceNumber}
          onChangeText={(value) => handleUpdate('insuranceNumber', value)}
        />
        <EditableField
          label="Policyholder Name"
          value={insuranceData.policyholderName}
          onChangeText={(value) => handleUpdate('policyholderName', value)}
        />
        <EditableField
          label="Effective Date"
          value={insuranceData.effectiveDate}
          onChangeText={(value) => handleUpdate('effectiveDate', value)}
        />
        <EditableField
          label="Expiration Date"
          value={insuranceData.expirationDate}
          onChangeText={(value) => handleUpdate('expirationDate', value)}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const EditableField = ({ label, value, onChangeText }) => (
  <View style={styles.editableField}>
    <Text style={styles.fieldLabel}>{label}:</Text>
    <TextInput
      value={value}
      onChangeText={onChangeText}
      style={styles.fieldInput}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e0f7fa',
    padding: 16,
    paddingTop: 40, // Added paddingTop to prevent overlap with the status bar
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#e0f7fa', // Light cyan background color
    borderRadius: 16, // Increased border radius
    padding: 20, // Increased padding
    shadowColor: '#000',
    shadowOpacity: 0.4, // Increased shadow opacity
    shadowRadius: 10, // Increased shadow radius
    shadowOffset: { width: 2, height: 4 },
    elevation: 8, // Increased elevation
    marginBottom: 20, // Added margin bottom for spacing
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  cardLabel: {
    fontWeight: '600',
    fontSize: 16,
  },
  cardValue: {
    fontSize: 16,
    color: '#333',
  },
  editSection: {
    marginTop: 16,
    padding: 16, // Added padding
    backgroundColor: '#ffffff', // White background
    borderRadius: 16, // Border radius to match card
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 1, height: 3 },
    elevation: 4,
  },
  editableField: {
    marginBottom: 12,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  fieldInput: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
  },
  picker: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
});

export default InsuranceScreen;
