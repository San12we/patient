import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts, setPostsFromStorage } from '../app/(redux)/postSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

const usePosts = () => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts.posts);
  const loading = useSelector((state) => state.posts.loading);
  const error = useSelector((state) => state.posts.error);
  const initialLoad = useRef(true);

  useEffect(() => {
    const loadPostsFromStorage = async () => {
      const storedPosts = await AsyncStorage.getItem('posts');
      if (storedPosts) {
        dispatch(setPostsFromStorage(JSON.parse(storedPosts)));
      }
    };

    if (initialLoad.current) {
      loadPostsFromStorage();
      initialLoad.current = false;
    }
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  return { posts, loading, error };
};

export default usePosts;
