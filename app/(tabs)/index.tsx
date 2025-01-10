import { StyleSheet, Text, View, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Doctors from '../../components/client/Doctors';
import Category from '@/components/client/Category';
import SearchBar from '@/components/client/SearchBar';
import { theme } from '@/core/theme';
import Clinics from '@/components/client/Clinics';
import SubHeading from '@/components/client/SubHeading';


const Index: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const router = useRouter();

  const handleSearchSubmit = () => {
    router.push(`/search?query=${searchQuery}`);
  };

  return (
    <LinearGradient
      colors={['rgba(55, 98, 122, 0.46)', 'rgba(211, 9, 177, 0.4)']}
      style={[styles.gradient, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onSubmit={handleSearchSubmit}
          />
         
          <Category searchQuery={searchQuery} />

          <Doctors searchQuery={searchQuery} />
          <Clinics searchQuery={searchQuery} />
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default Index;

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    backgroundColor: theme.colors.backgroundColor,
    paddingVertical: 30,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    // Removed backgroundColor to ensure LinearGradient is visible
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});
