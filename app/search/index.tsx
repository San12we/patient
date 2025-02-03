import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, TextInput } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import React from 'react';
import { Ionicons, AntDesign } from '@expo/vector-icons'; // Ensure this package is installed
import useSearch from '@/hooks/useSearch';
import { useRouter } from 'expo-router'; // Update this import
import { useSelector, useDispatch } from 'react-redux';
import { fetchInsuranceProviders } from '../../app/(redux)/insuranceSlice';
import { setSelectedClinic } from '../../app/(redux)/clinicSlice'; // Import the setSelectedClinic action
import useClinics from '../../hooks/useClinics';
const index = () => {
  const router = useRouter(); // Update this line
  const [searchQuery, setSearchQuery] = useState(''); // Initialize search query with an empty string
  const [showFilters, setShowFilters] = useState(false);
  const [currentFilter, setCurrentFilter] = useState('Category');
  const dispatch = useDispatch();
  const { clinics, loading, error } = useClinics();
  const {
    filteredClinics,
    handleSearchChange,
    handleCombinedFilters,
    setSelectedCategory,
    setSelectedPracticeLocation,
    setSelectedInsurance,
    uniqueCategories,
    uniquePracticeLocations,
    uniqueInsurances,
  } = useSearch();

  useEffect(() => {
    try {
      console.log('Filtered Clinics:', filteredClinics);
    } catch (error) {
      console.error('Error logging filtered clinics:', error);
    }
  }, [filteredClinics]);

  const handlePress = useCallback((item: Clinic) => {
    console.log("Navigating to clinic with ID:", item._id);
    const fullClinicData = clinics.find(clinic => clinic._id === item._id);
    console.log("Selected Clinic Data:", fullClinicData); // Log the selected clinic data
    dispatch(setSelectedClinic(fullClinicData)); // Dispatch the selected clinic with full data
    router.push(`/clinic/${item._id}`); // Navigate to the ClinicProfile screen using id
  }, [router, dispatch, clinics]);

  const renderFilterOptions = () => {
    switch (currentFilter) {
      case 'Category':
        return uniqueCategories.map((category) => (
          <TouchableOpacity
            key={category}
            style={styles.filterOption}
            onPress={() => {
              setSelectedCategory(category);
              handleCombinedFilters();
            }}
          >
            <Text style={styles.filterText}>{category}</Text>
          </TouchableOpacity>
        ));
      case 'Location':
        return uniquePracticeLocations.map((location) => (
          <TouchableOpacity
            key={location}
            style={styles.filterOption}
            onPress={() => {
              setSelectedPracticeLocation(location);
              handleCombinedFilters();
            }}
          >
            <Text style={styles.filterText}>{location}</Text>
          </TouchableOpacity>
        ));
      case 'Insurance':
        return uniqueInsurances.map((insurance) => (
          <TouchableOpacity
            key={insurance}
            style={styles.filterOption}
            onPress={() => {
              setSelectedInsurance(insurance);
              handleCombinedFilters();
            }}
          >
            <Text style={styles.filterText}>{insurance}</Text>
          </TouchableOpacity>
        ));
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <AntDesign name="left" size={24} color="black" />
      </TouchableOpacity>

      {/* Search Bar with Filter Toggle */}
      <View style={styles.searchBarContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search clinics..."
          value={searchQuery}
          onChangeText={(text) => {
            setSearchQuery(text);
            handleSearchChange(text);
          }}
        />
        <TouchableOpacity onPress={() => setShowFilters((prev) => !prev)}>
          <Ionicons name="filter" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Filters */}
      {showFilters && (
        <View style={styles.filtersContainer}>
          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Filter By</Text>
            <View style={styles.filterOptions}>
              {['Category', 'Location', 'Insurance'].map((filter) => (
                <TouchableOpacity
                  key={filter}
                  style={[
                    styles.filterOption,
                    currentFilter === filter && styles.selectedFilterOption,
                  ]}
                  onPress={() => setCurrentFilter(filter)}
                >
                  <Text
                    style={[
                      styles.filterText,
                      currentFilter === filter && styles.selectedFilterText,
                    ]}
                  >
                    {filter}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>{currentFilter}</Text>
            <View style={styles.filterOptions}>{renderFilterOptions()}</View>
          </View>
        </View>
      )}

      {/* Clinic List */}
      <FlatList
        data={filteredClinics}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.item} onPress={() => handlePress(item)}>
            <Image source={{ uri: item.profileImage }} style={styles.clinicImage} />
            <View style={styles.info}>
              <Text style={styles.title}>{item.name}</Text>
              <Text>{item.address}</Text>
              <Text>{item.practiceName}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  backButton: {
    marginBottom: 10,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 40,
  },
  searchInput: {
    flex: 1,
    marginRight: 10,
  },
  filtersContainer: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
  },
  filterGroup: {
    marginBottom: 15,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  filterOption: {
    backgroundColor: '#007BFF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    marginRight: 10,
    marginBottom: 10,
  },
  selectedFilterOption: {
    backgroundColor: '#0056b3',
  },
  filterText: {
    color: 'white',
    fontSize: 14,
  },
  selectedFilterText: {
    fontWeight: 'bold',
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flexDirection: 'row',
    alignItems: 'center',
  },
  clinicImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  info: {
    marginLeft: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
