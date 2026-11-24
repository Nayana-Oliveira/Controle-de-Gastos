import axios from 'axios';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

const host = Constants.expoConfig?.hostUri?.split(':')[0] ?? 'localhost';

const api = axios.create({
    baseURL: __DEV__ ? `http://${host}:8080` : process.env.EXPO_PUBLIC_IP,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

api.interceptors.request.use(async (config) => {
    const token = await AsyncStorage.getItem('token');

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export default api;