import { StyleSheet, Text, View, Image, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts } from '../../app/(redux)/postSlice';
import { RootState } from '../../app/(redux)/store';
import { useRouter } from 'expo-router';

const Posts = () => {
  const dispatch = useDispatch();
  const { posts, loading } = useSelector((state: RootState) => state.posts);
  const router = useRouter();

  useEffect(() => {
    if (posts.length === 0) {
      dispatch(fetchPosts());
    }
  }, [dispatch, posts.length]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  return (
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
  );
};

export default Posts;

const styles = StyleSheet.create({
  loadingContainer: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
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
});
