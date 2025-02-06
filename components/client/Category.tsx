import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import SubHeading from './SubHeading';
import Colors from '../Shared/Colors';
import { useRouter } from 'expo-router'; // Reintroduce this import

interface CategoryProps {
  categories: Category[];
  loading: boolean;
  error: string | null;
}

interface Category {
  name: string;
  icon: string;
}

const Category: React.FC<CategoryProps> = ({ categories, loading, error }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null); // State to track active index
  const router = useRouter(); // Reintroduce this line

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (error) {
    return <Text>Error loading categories: {error}</Text>;
  }

  return (
    <View style={{ marginTop: 10 }}>
      <SubHeading subHeadingTitle={"Let's Find You a Specialist"} />
      <FlatList
        data={categories}
        horizontal={true} // Enable horizontal scrolling
        showsHorizontalScrollIndicator={false} // Hide horizontal scroll indicator
        style={styles.flatList}
        contentContainerStyle={styles.contentContainer}
        renderItem={({ item, index }: { item: Category; index: number }) => (
          <TouchableOpacity 
            style={styles.categoryItem} 
            onPress={() => {
              setActiveIndex(index); // Set active index on press
              router.push('/search'); // Navigate to the search screen without parameters
            }}
          >
            <View style={activeIndex == index ? styles.categoryIconContainerActive : styles.categoryIconContainer}>
              <Image
                source={{ uri: item.icon }}
                style={styles.categoryIcon}
              />
            </View>
            <Text style={activeIndex == index ? styles.categoryBtnActive : styles.categoryBtnTxt}>{item.name}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.name}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flatList: {
    marginTop: 5,
  },
  contentContainer: {
    paddingHorizontal: 10,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 15,
  },
  categoryIconContainer: {
    backgroundColor: '#edf7fa',
    padding: 15,
    borderRadius: 99,
  },
  categoryIconContainerActive: {
    backgroundColor: '#dcd6f7', // Change background color for active state
    padding: 15,
    borderRadius: 99,
  },
  categoryIcon: {
    width: 30,
    height: 30,
  },
  categoryBtnTxt: {
    marginTop: 5,
    textAlign: 'center',
    color: Colors.primary,
  },
  categoryBtnActive: {
    marginTop: 5,
    textAlign: 'center',
    color: Colors.PRIMARY, // Change text color for active state
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Category;