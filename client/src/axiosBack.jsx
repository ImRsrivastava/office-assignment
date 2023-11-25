import axios from "axios";
import Cookies from "js-cookie";

const axiosBackend = axios.create({
    baseURL: "http://localhost:9001/api/admin"
})

axiosBackend.interceptors.request.use((config) => {
    const jwtToken = Cookies.get('ADMIN_ACCESS_TOKEN');
    config.headers.Authorization = `Bearer ${jwtToken}`;
    return config;
});

axiosBackend.interceptors.response.use((response) => {
    return response;
}, (error) => {
    const {response} = error;
    if (response.status === 401) {
        Cookies.remove('ACCESS_TOKEN_ADMIN');
    }
    throw error;
});

export default axiosBackend;