import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, ActivityIndicator, FlatList } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getPost } from '@/repository/postRepository';
import AntDesign from '@expo/vector-icons/AntDesign';
import { LinearGradient } from 'expo-linear-gradient';
import { Dimensions } from 'react-native';
import { Post } from '@/types/post';

const { width } = Dimensions.get('window');

const PostDetailsPage = () => {
  const { slug } = useLocalSearchParams();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await getPost(slug);
        setPost(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  if (!post) {
    return <Text>Post not found</Text>;
  }

  return (
    <LinearGradient colors={['#ffebbb', '#e0ffcd', '#fcffc1', '#1dad9b']} style={styles.background}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <AntDesign name="left" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{post.title}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Image source={{ uri: post.thumbnail }} style={styles.thumbnail} />
        
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={post.additionalImages}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <Image source={{ uri: item }} style={styles.additionalImage} />
          )}
        />

        <View style={styles.textContainer}>
          <Text style={styles.title}>{post.title}</Text>
          <Text style={styles.description}>{post.description}</Text>
          <Text style={styles.content}>{post.content}</Text>
        </View>

       
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  backButton: {
    padding: 10,
    borderRadius: 5,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
  },
  contentContainer: {
    padding: 20,
  },
  thumbnail: {
    width: '100%',
    height: 250,
    borderRadius: 20,
    marginBottom: 20,
  },
  additionalImage: {
    width: width * 0.5, // Reduced width for smaller images
    height: 120, // Reduced height for smaller images
    marginRight: 10,
    borderRadius: 10, // Slightly smaller border radius
  },
  textContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    fontStyle: 'italic',
    marginBottom: 20,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1dad9b',
    padding: 10,
    borderRadius: 10,
    flex: 1,
    marginRight: 10,
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6200ee',
    padding: 10,
    borderRadius: 10,
    flex: 1,
    marginLeft: 10,
  },
  shareText: {
    color: '#fff',
    marginLeft: 5,
  },
  likeText: {
    color: '#fff',
    marginLeft: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PostDetailsPage;
