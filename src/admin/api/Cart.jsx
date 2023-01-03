import {Axios} from "../../component";
import {NewPromise} from "../../component/Common";

// BUYER - 장바구니
export const list = (data) => NewPromise(Axios.post('/buyer/cart/list', data));         // 장바구니 조회
export const add  = (data) => NewPromise(Axios.post('/buyer/cart/add-modify', data));   // 장바구니 등록(수정)
export const del  = (data) => NewPromise(Axios.post('/buyer/cart/delete', data));       // 장바구니 삭제