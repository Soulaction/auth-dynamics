import axios from "axios";

export const $serverHost = axios.create({
    baseURL: 'http://localhost:8080/auth-api',
    withCredentials: true
});
