import axios from "axios";

const api = axios.create({
    baseURL: process.env.API_URL
});

api.interceptors.request.use((config) => {
    return config;
    console.log("INTERCEPTOR", config)
}, (error) => {
    console.log("INTERCEPTOR error", error)
    return Promise.reject(error);
})

export { api }