
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import TextInput from './TextInput';

const EmergencyContactForm = ({ emergencyContact, setEmergencyContact, handleSave }) => {
    const handleEmergencyContactChange = (field, value) => {
        setEmergencyContact({ ...emergencyContact, [field]: value });
    };

    return (
        <>
            <View style={styles.formGroup}>
                <Text style={styles.label}>Emergency Contact Name</Text>
                <TextInput value={emergencyContact.name} onChangeText={(value) => handleEmergencyContactChange('name', value)} style={styles.input} placeholder="Enter emergency contact name" />
            </View>
            <View style={styles.formGroup}>
                <Text style={styles.label}>Emergency Contact Relationship</Text>
                <TextInput value={emergencyContact.relationship} onChangeText={(value) => handleEmergencyContactChange('relationship', value)} style={styles.input} placeholder="Enter relationship" />
            </View>
            <View style={styles.formGroup}>
                <Text style={styles.label}>Emergency Contact Phone</Text>
                <TextInput value={emergencyContact.phone} onChangeText={(value) => handleEmergencyContactChange('phone', value)} style={styles.input} placeholder="Enter phone number" />
            </View>
            <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
        </>
    );
};

const styles = StyleSheet.create({
    formGroup: {
        marginBottom: 16,
    },
    label: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    input: {
        height: 50,
        borderColor: '#6200ea',
        borderWidth: 1,
        borderRadius: 5,
        paddingLeft: 8,
    },
    saveButton: {
        backgroundColor: '#6200ea',
        height: 50,
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10,
    },
    saveButtonText: {
        color: 'white',
        textAlign: 'center',
    },
});

export default EmergencyContactForm;