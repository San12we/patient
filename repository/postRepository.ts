
import axios from 'axios';

const API_URL = 'https://medplus-blog.onrender.com';

export const getAllPosts = async () => {
  const response = await axios.get(`${API_URL}/posts`);
  return response.data;
};

export const getPost = async (slug: string) => {
  const response = await axios.get(`${API_URL}/posts/${slug}`);
  return response.data;
};