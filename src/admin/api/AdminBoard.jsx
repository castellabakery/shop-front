import {Axios} from "../../component";
import {NewPromise} from "../../component/Common";

// ADMIN - 공지사항
export const addModify    = ((data) => {
    console.log(data);
    let requestParam = {
        map : {
            title                : data.title
            ,content          : data.content
            ,displayYn           : data.displayYn
            ,boardType : data.boardType
            ,seq: data.seq
        }
    };
    return NewPromise(Axios.post('/admin/notice/add-modify', requestParam));
});         // 공지사항 등록-수정
export const get    = (data) => NewPromise(Axios.post('/admin/notice/detail', data));   // 공지사항 상세 조회
export const list   = ((data) => {
    let requestParam = {
        page: data.pageNo - 1,
        pageSize: data.len,
        map: {
            title: "",
            content: ""
        }
    };
    if(data.searchConditionSelect === "title"){
        requestParam.map.title = data.searchConditionText;
    } else if(data.searchConditionSelect === "content"){
        requestParam.map.content = data.searchConditionText;
    }
    return NewPromise(Axios.post('/admin/notice/list', requestParam));
});                                                 // 공지사항 리스트 조회

// BUYER - 공지사항
export const buyerList   = ((data) => {
    console.log(data);
    let requestParam = {
        page: data.pageNo - 1,
        pageSize: data.len,
        map: {
            title: "",
            content: ""
        }
    };
    if(data.searchConditionSelect === "title"){
        requestParam.map.title = data.searchConditionText;
    } else if(data.searchConditionSelect === "content"){
        requestParam.map.content = data.searchConditionText;
    } else if(data.searchConditionSelect === ""){
        requestParam.map.title = data.searchConditionText;
        requestParam.map.content = data.searchConditionText;
    }
    return NewPromise(Axios.post('/buyer/notice/list', requestParam));
});                                                 // 상품 리스트 조회
export const buyerGet    = (data) => NewPromise(Axios.post('/buyer/notice/detail', data));   // 공지사항 상세 조회

export const delAdminBoard    = (data) => NewPromise(Axios.post('/admin/notice/delete', data));   // 공지사항 삭제