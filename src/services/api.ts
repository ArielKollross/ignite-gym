import { AppError } from "@/utils/AppError";
import axios from "axios";

const api = axios.create({
    // baseURL: process.env.API_URL
    baseURL: 'http:/192.168.0.105:3333'
});

api.interceptors.response.use(response => response, (error) => {
    console.error(error, process.env.API_URL)
    const message = error.response && error.response.data
        ? error.response.data.message
        : error;

    return Promise.reject(new AppError(message));
})

export { api }