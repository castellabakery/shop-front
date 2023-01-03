import {NewPromise} from "../../component/Common";
import {UploadAxios} from "../../component/axios";

export const upload = (data) => NewPromise(UploadAxios.post('/file/aws/upload', data));
export const uploadWithout = (data) => NewPromise(UploadAxios.post('/file/aws/upload/without', data));
export const update = (data) => NewPromise(UploadAxios.post('/file/aws/update', data));
export const updateForProductDetail = (data) => NewPromise(UploadAxios.post('/file/aws/update', data));