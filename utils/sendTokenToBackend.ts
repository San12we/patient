import axios from 'axios';

export const sendTokenToBackend = async (userId: string, token: string) => {
    try {
        if (token) {
            await axios.post('https://project03-rj91.onrender.com/store-token', {
                userId,
                token
            });
            console.log('Token sent to backend successfully');
        } else {
            console.log('No Expo push token found');
        }
    } catch (error) {
        console.log('Error sending token to backend:', error);
    }
};
