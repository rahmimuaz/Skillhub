import axios from 'axios';

const API_URL = 'http://localhost:9006/api/posts';

export const postService = {
    getAllPosts: async () => {
        try {
            const response = await axios.get(API_URL);
            return response.data;
        } catch (error) {
            console.error('Error fetching posts:', error);
            throw error;
        }
    },

    createPost: async (post) => {
        try {
            const response = await axios.post(API_URL, post);
            return response.data;
        } catch (error) {
            console.error('Error creating post:', error);
            throw error;
        }
    }
}; 