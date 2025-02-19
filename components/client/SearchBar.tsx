import React from 'react';
import { TouchableOpacity, View, TextInput, StyleSheet, Text } from 'react-native';
import Colors from '../Shared/Colors';

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
      backgroundColor: '#e3f6f5',
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
      backgroundColor: '#dcd6f7',
      color: '#333',
    },
    iconContainer: {
      marginLeft: 10,
      backgroundColor: '#90f6d7',
      padding: 8,
      borderRadius: 25,
    },
    searchButtonText: {
      color: Colors.primary,
      fontSize: 16,
    },
  });
  
  export default SearchBar;
