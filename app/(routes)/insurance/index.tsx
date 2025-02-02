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
import { useToast } from 'react-native-paper-toast';
import { theme } from '@/constants/theme';
import axios from 'axios';
import { useSelector } from 'react-redux';

const InsuranceScreen = () => {
  const [isPrivate, setIsPrivate] = useState(false);
  const [insuranceData, setInsuranceData] = useState({
    insuranceProvider: '',
    insuranceNumber: '',
    policyholderName: '',
    effectiveDate: '',
    expirationDate: '',
  });

  const { insuranceProviders } = useInsurance();
  const router = useRouter();
  const toaster = useToast();
  const userId = useSelector((state) => state.auth.user.user._id);

  const saveInsuranceData = async (data) => {
    try {
      await AsyncStorage.setItem('insuranceData', JSON.stringify(data));
      toaster.show({ message: 'Insurance data saved successfully.', type: 'success' });
    } catch (error) {
      console.error('Error saving data:', error);
      toaster.show({ message: 'Failed to save insurance data.', type: 'error' });
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

  const fetchInsuranceData = async () => {
    try {
      const response = await axios.get(`https://project03-rj91.onrender.com/insurance/user/${userId}`);
      if (response.status === 200) {
        const data = response.data;
        await AsyncStorage.setItem('insuranceData', JSON.stringify(data));
        setInsuranceData(data);
        console.log('Fetched insurance data:', data);
      }
    } catch (error) {
      console.error('Error fetching insurance data:', error);
    }
  };

  useEffect(() => {
    loadInsuranceData();
    fetchInsuranceData();
  }, []);

  const handleUpdate = (field, value) => {
    const updatedData = { ...insuranceData, [field]: value };
    setInsuranceData(updatedData);
  };

  const maskValue = (value) => value ? '*'.repeat(value.length) : '';

  const handleSubmit = async () => {
    try {
      const payload = { ...insuranceData, userId };
      const response = await axios.put('https://project03-rj91.onrender.com/insurance', payload);
      if (response.status === 200) {
        toaster.show({ message: 'Insurance data updated successfully.', type: 'success' });
      }
    } catch (error) {
      console.error('Error updating insurance data:', error);
      toaster.show({ message: 'Failed to update insurance data.', type: 'error' });
    }
  };

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
        <View style={styles.cardContent}>
          <Text style={styles.cardLabel}>Effective Date:</Text>
          <Text style={styles.cardValue}>
            {isPrivate ? maskValue(insuranceData.effectiveDate) : insuranceData.effectiveDate}
          </Text>
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.cardLabel}>Expiration Date:</Text>
          <Text style={styles.cardValue}>
            {isPrivate ? maskValue(insuranceData.expirationDate) : insuranceData.expirationDate}
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
        <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
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
    backgroundColor: theme.colors.backgroundColor,
    padding: 16,
    paddingTop: 40,
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
    backgroundColor: Colors.SECONDARY,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 10,
    shadowOffset: { width: 2, height: 4 },
    elevation: 6,
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
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 16,
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
  saveButton: {
    backgroundColor: Colors.SECONDARY,
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: Colors.primary,
    fontSize: 18,
  },
});

export default InsuranceScreen;
