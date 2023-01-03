import {Axios} from "../../component";
import {NewPromise} from "../../component/Common";

export const sidemenu = (data) => NewPromise(Axios.get('/admin/menu/side', {
    params: {
        ...data,
    }
}));
export const mymenu   = (data) => NewPromise(Axios.get('/admin/menu/my', {
    params: {
        ...data,
    }
}));