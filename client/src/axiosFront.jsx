import axios from "axios";
import Cookies from "js-cookie";

// global base url for client side
const axiosFrontend = axios.create({
    baseURL: "http://localhost:9001/api"
});

// handle request from the client side
axiosFrontend.interceptors.request.use((config) => {
    const jwtToken = Cookies.get('WEB_ACCESS_TOKEN');
    config.headers.Authorization = `Bearer ${jwtToken}`;
    return config;
});

// handle response, getting from the server side
axiosFrontend.interceptors.response.use((response) => {
    return response;
}, (error) => {
    const errData = error;
    if(errData.response === 401)  {
        Cookies.remove('WEB_ACCESS_TOKEN');
    }
    throw error;
});

export default axiosFrontend;