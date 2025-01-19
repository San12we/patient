
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import TextInput from './TextInput';

const AddressForm = ({ address, setAddress, handleSave }) => {
    const handleAddressChange = (field, value) => {
        setAddress({ ...address, [field]: value });
    };

    return (
        <>
            <View style={styles.formGroup}>
                <Text style={styles.label}>Street</Text>
                <TextInput value={address.street} onChangeText={(value) => handleAddressChange('street', value)} style={styles.input} placeholder="Enter street" />
            </View>
            <View style={styles.formGroup}>
                <Text style={styles.label}>City</Text>
                <TextInput value={address.city} onChangeText={(value) => handleAddressChange('city', value)} style={styles.input} placeholder="Enter city" />
            </View>
            <View style={styles.formGroup}>
                <Text style={styles.label}>State</Text>
                <TextInput value={address.state} onChangeText={(value) => handleAddressChange('state', value)} style={styles.input} placeholder="Enter state" />
            </View>
            <View style={styles.formGroup}>
                <Text style={styles.label}>Postal Code</Text>
                <TextInput value={address.postalCode} onChangeText={(value) => handleAddressChange('postalCode', value)} style={styles.input} placeholder="Enter postal code" />
            </View>
            <View style={styles.formGroup}>
                <Text style={styles.label}>Country</Text>
                <TextInput value={address.country} onChangeText={(value) => handleAddressChange('country', value)} style={styles.input} editable={false} placeholder="KEN" />
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

export default AddressForm;