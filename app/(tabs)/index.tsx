import { StyleSheet, Text, View, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
// Remove the LinearGradient import
// import { LinearGradient } from 'expo-linear-gradient';
import Doctors from '../../components/client/Doctors';
import Category from '@/components/client/Category';
import SearchBar from '@/components/client/SearchBar';
import { theme } from '@/constants/theme';
import Clinics from '@/components/client/Clinics';
import SubHeading from '@/components/client/SubHeading';

const Index: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const router = useRouter();

  const handleSearchSubmit = () => {
    router.push(`/search?query=${searchQuery}`);
  };

  return (
    // Replace LinearGradient with a View
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.innerContainer}>
          <SearchBar
            setSearchQuery={setSearchQuery}
            onSubmit={handleSearchSubmit}
          />
          <Category searchQuery={searchQuery} />
          <Doctors />
          <Clinics />
        </View>
      </ScrollView>
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundColor, // Set the background color
  },
  scrollContainer: {
    flexGrow: 1,
    // Remove backgroundColor to allow the gradient to be visible
  },
  innerContainer: {
    flex: 1,
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});
