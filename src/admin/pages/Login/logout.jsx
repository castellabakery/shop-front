import React from 'react';
import * as loginAPI from '../../api/Login';

const logout = () => {
    loginAPI.logout().then(() => {
        localStorage.setItem("token", "NoToken");
        window.location.href = "/admin";
    })
}
export default logout;