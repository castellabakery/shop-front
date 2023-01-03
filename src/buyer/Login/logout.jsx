import React from 'react';
import * as loginAPI from './../../admin/api/Login';

const logout = () => {
    loginAPI.logout().then(() => {
        localStorage.setItem("token", "NoToken");
        window.location.href = "/login";
    })
}
export default logout;