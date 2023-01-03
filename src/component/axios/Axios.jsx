import CommonAxios from 'axios';

export const SESSION_TOKEN_KEY = "__KANAK__auth__";

const Axios = CommonAxios.create({
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json; charset=UTF-8;',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
        'token': localStorage.getItem('token')
    },
    withCredentials: true
});

if (process.env.NODE_ENV === 'development') {
    Axios.defaults.baseURL = process.env.REACT_APP_API_HOST
} else {
    Axios.defaults.baseURL = process.env.REACT_APP_API_HOST
}

Axios.interceptors.request.use(function (config) {
    const token = localStorage.getItem(SESSION_TOKEN_KEY);
    config.headers.Authorization = "Bearer " + token;
    config.data = JSON.stringify(config.data);
    return config;
});

Axios.interceptors.response.use(function (response) {
    if (401 === response.status) {
        // window.location.href = '/login';
    } else if (403 === response.status) {
        // window.history.back();
        // window.location.href = "/login";
    }

    if (response.data) {
        const data = response.data;
        if (!data.code || data.code !== 1000) {
            // todo 필요한 처리
            // return Promise.reject("호출이 실패하였습니다.");
        }
        // console.log(response);
        // let localToken = localStorage.getItem("token");
        // if(data == "GO_LOGIN_PAGE" && localToken !== "NoToken"){
        //     alert("세션의 만료되었거나 서버에 오류가 있어 로그인 페이지로 이동합니다.");
        //     window.location.href = "/login";
        // }
    }

    return response;
}, function (error) {
    if (error.hasOwnProperty('response')) {
        const response = error.response;
        if (401 === response.status) {
            // window.location.href = '/login';
        } else if (403 === response.status) {
            // window.history.back();
            // window.location.href = "/login";
        }
    }

    return Promise.reject(error);
});

export default Axios;