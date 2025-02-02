import { StyleSheet, Text, View, Image, TouchableOpacity, ActivityIndicator, ScrollView, FlatList } from 'react-native';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts } from '../(redux)/postSlice';
import { RootState } from '../(redux)/store';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const health = () => {
  const dispatch = useDispatch();
  const { posts, loading } = useSelector((state: RootState) => state.posts);
  const router = useRouter();

  useEffect(() => {
    if (posts.length === 0) {
      dispatch(fetchPosts());
    }
  }, [dispatch, posts.length]);

  const segments = [
    { title: 'Consultations', route: '/consultation' },
    { title: 'Labs Reports', route: '/labs' },
    { title: 'Diagnosis', route: '/diagnosis' },
    { title: 'Health Monitor', route: '/monitor' },
  ];

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  return (
    <LinearGradient colors={['#bae8e8', '#faf9f9', '#ffffff', '#1dad9b']} style={styles.background}>
      <View style={styles.container}>
        <ScrollView horizontal contentContainerStyle={styles.segmentsContainer} showsHorizontalScrollIndicator={false}>
          {segments.map((segment, index) => (
            <TouchableOpacity
              key={index}
              style={styles.segment}
              onPress={() => router.push(segment.route)}
            >
              <Text style={styles.segmentText}>{segment.title}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        
        <FlatList
          data={posts}
          horizontal
          renderItem={({ item }) => (
            <View style={styles.postContainer}>
              <TouchableOpacity onPress={() => router.push(`/${item.slug}`)}>
                <Image
                  source={{ uri: item.thumbnail }}
                  style={styles.thumbnail}
                  onError={(error) => console.log('Error loading image:', error)}
                />
              </TouchableOpacity>
              <View style={styles.nameCategoryContainer}>
                <Text style={styles.title}>{item.title}</Text>
              </View>
            </View>
          )}
          keyExtractor={(item, index) => `${item.slug}-${index}`}
          showsHorizontalScrollIndicator={false}
          nestedScrollEnabled={true}
        />
      </View>
    </LinearGradient>
  );
};

export default health;

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  segmentsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 8,
  },
  segment: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  segmentText: {
    fontSize: 14,
    fontWeight: '500',
  },
  subtitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  postContainer: {
    marginRight: 10,
    borderRadius: 15,
    padding: 10,
    width: 220,
  },
  thumbnail: {
    width: '100%',
    height: 120,
    borderRadius: 15,
  },
  nameCategoryContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  title: {
    fontWeight: 'bold',
    color: '#6200ee',
  },
  description: {
    color: '#333',
  },
});