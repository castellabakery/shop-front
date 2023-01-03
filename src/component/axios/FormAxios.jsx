import CommonAxios from 'axios';

const UploadAxios = CommonAxios.create({
    timeout: 30000,
    headers: {
        'Content-Type': 'multipart/form-data;',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
        'token': localStorage.getItem('token')
    },
    withCredentials: true
});

if (process.env.NODE_ENV === 'development') {
    UploadAxios.defaults.baseURL = process.env.REACT_APP_API_HOST
} else {
    UploadAxios.defaults.baseURL = process.env.REACT_APP_API_HOST
}

export const SESSION_TOKEN_KEY = "__KANAK__auth__";

UploadAxios.interceptors.request.use(function (config) {
    const token = localStorage.getItem(SESSION_TOKEN_KEY);
    config.headers.Authorization = "Bearer " + token;
    return config;
});

UploadAxios.interceptors.response.use(function (response) {
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

export default UploadAxios;