import React from 'react';
import { TouchableOpacity, View, TextInput, StyleSheet, Text } from 'react-native';

interface SearchBarProps {
  setSearchQuery: (query: string) => void;
  onSubmit: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ setSearchQuery, onSubmit }) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        onChangeText={setSearchQuery}
        placeholder="Search..."
        onSubmitEditing={onSubmit}
      />
      <TouchableOpacity onPress={onSubmit} style={styles.iconContainer}>
        <Text style={styles.searchButtonText}>Search</Text>
      </TouchableOpacity>
    </View>
  );
};


const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#f0f0f0',
      borderRadius: 25,
      paddingHorizontal: 12,
      paddingVertical: 8,
      marginHorizontal: 10,
      marginVertical: 5,
    },
    input: {
      flex: 1,
      height: 40,
      fontSize: 16,
      paddingHorizontal: 10,
      borderRadius: 25,
      backgroundColor: '#fff',
      color: '#333',
    },
    iconContainer: {
      marginLeft: 10,
      backgroundColor: '#4CAF50',
      padding: 8,
      borderRadius: 25,
    },
    searchButtonText: {
      color: '#fff',
      fontSize: 16,
    },
  });
  
  export default SearchBar;
