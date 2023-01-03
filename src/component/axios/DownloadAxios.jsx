import CommonAxios from 'axios';
import UploadAxios from "./UploadAxios";

const DownloadAxios = CommonAxios.create({
    timeout: 30000,
    responseType: 'arraybuffer',
    headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; charset=UTF-8;',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
        'token': localStorage.getItem('token')
    },
    withCredentials: true
});

if (process.env.NODE_ENV === 'development') {
    DownloadAxios.defaults.baseURL = process.env.REACT_APP_API_HOST
} else {
    DownloadAxios.defaults.baseURL = process.env.REACT_APP_API_HOST
}

export const SESSION_TOKEN_KEY = "__KANAK__auth__";

DownloadAxios.interceptors.request.use(function (config) {
    const token = localStorage.getItem(SESSION_TOKEN_KEY);
    config.headers.Authorization = "Bearer " + token;
    return config;
});

DownloadAxios.interceptors.response.use(function (response) {
    if (401 === response.status) {
        window.location.href = '/login';
        return;
    }

    return response;
}, function (error) {
    if (error.hasOwnProperty('response')) {
        const response = error.response;
        if (401 === response.status) {
            window.location.href = '/login';
            return;
        }
    }

    return Promise.reject(error);
});

export default DownloadAxios;