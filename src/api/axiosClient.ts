import axios from 'axios';

export const greenApiAxios = axios.create({
    baseURL: 'https://3100.api.green-api.com',
    headers: {
        'Content-Type': 'application/json',
    },
});