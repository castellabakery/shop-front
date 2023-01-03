import {Axios} from "../../component";
import {NewPromise} from "../../component/Common";

export const login         = (data) => NewPromise(Axios.post('/login-process', null, data));
export const logout        = () => NewPromise(Axios.post('/logout'), null);
export const validateToken = (data) => NewPromise(Axios.post('/auth/token?token='+data.token, null));
export const getToken      = () => NewPromise(Axios.post('/auth/get/token', null));

export const getAdminInfo  = () => NewPromise(Axios.get("/admin/my/info"), null);