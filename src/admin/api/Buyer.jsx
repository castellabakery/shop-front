import {Axios} from "../../component";
import {NewPromise} from "../../component/Common";
import {DownloadAxios} from "../../component/axios";

// ADMIN - 회원
export const list              = ((data) => {
    let requestParam = {
        page: data.pageNo - 1,
        pageSize: data.len,
        map: {
            buyerIdentificationId: "",
            staffName:"",
            searchKeyword: ""
        }
    };
    if(data.searchConditionSelect === "buyerIdentificationId"){
        requestParam.map.buyerIdentificationId = data.searchConditionText;
    } else if(data.searchConditionSelect === "staffName"){
        requestParam.map.staffName = data.searchConditionText;
    } else if(data.searchConditionSelect === "buyerType"){
        requestParam.map.buyerType = data.searchConditionText;
    } else if(data.searchConditionSelect === "corpName"){
        requestParam.map.corpName = data.searchConditionText;
    } else if(data.searchConditionSelect === "buyerState"){
        requestParam.map.buyerState = data.searchConditionText;
    } else if(data.searchConditionSelect === "buyerCode"){
        requestParam.map.buyerCode = data.searchConditionText;
    } else if(data.searchConditionSelect === ""){
        requestParam.map.searchKeyword = data.searchConditionText;
    }
    const result = NewPromise(Axios.post('/admin/buyer/list', requestParam));
    console.log(result);
    return result;
});                                                                 // 회원 리스트 조회
export const get               = (data) => NewPromise(Axios.post('/admin/buyer/detail', data));                     // 상세 조회
export const userStopRestart   = (data) => NewPromise(Axios.post('/admin/buyer/modify/buyer-state', data));         // 회원 상태 변경(계정 정지/재사용 처리)
export const subList           = ((data) => {
    let requestParam = {
        page: data.pageNo - 1,
        pageSize: data.len,
        map:{
            buyer:{
                seq:data.id
            }
        }
    };
    console.log(requestParam);
    return NewPromise(Axios.post('/admin/buyer/sub/list', requestParam));
});                                                                 // 회원 서브 리스트 조회
// ADMIN - 임시회원
export const tmpList           = ((data) => {
    let requestParam = {
        page: data.pageNo - 1,
        pageSize: data.len,
        map: {
            buyerIdentificationId: "",
            buyerType:"",
            corpName:"",
            searchKeyword: "",
        }
    };
    if(data.searchConditionSelect === "buyerIdentificationId"){
        requestParam.map.buyerIdentificationId = data.searchConditionText;
    } else if(data.searchConditionSelect === "buyerType"){
        if(data.searchConditionText === ""){
            // Pass
        } else if("".includes(data.searchConditionText)) {
            requestParam.map.buyerType = "M"
        } else if("".includes(data.searchConditionText)) {
            requestParam.map.buyerType = "M"
        } else if("".includes(data.searchConditionText)) {
            requestParam.map.buyerType = "M"
        } else if("".includes(data.searchConditionText)) {
            requestParam.map.buyerType = "P"
        } else if("".includes(data.searchConditionText)) {
            requestParam.map.buyerType = "W"
        } else if("".includes(data.searchConditionText)){
            requestParam.map.buyerType = "M"
        } else if("".includes(data.searchConditionText)) {
            requestParam.map.buyerType = "P"
        } else if("".includes(data.searchConditionText)) {
            requestParam.map.buyerType = "W"
        } else {
            requestParam.map.buyerType = data.searchConditionText;
        }
    } else if(data.searchConditionSelect === "corpName"){
        requestParam.map.corpName = data.searchConditionText;
    } else if(data.searchConditionSelect === "") {
        requestParam.map.searchKeyword = data.searchConditionText;
    }
    return NewPromise(Axios.post('/admin/buyer/tmp/list', requestParam));
});                                                                 // 임시회원 가입, 수정 요청 리스트 조회
export const tmpGet            = (data) => NewPromise(Axios.post('/admin/buyer/tmp/detail', data));                 // 임시회원 가입, 수정 요청 상세 조회
export const tmpAprvDeny       = ((data) => {
    // return NewPromise(Axios.post('/buyer/admin/tmp/'+data.tmpSeq+'?buyerState='+data.buyerState, null))
    return NewPromise(Axios.post('/admin/buyer/tmp/modify/state', data))
});                                                                 // 임시회원 가입, 수정에 대한 승인/반려

// BUYER - 회원
export const buyerGet          = (data) => NewPromise(Axios.post('/buyer/detail', data));                           // 회원 상세 조회
export const buyerCodeIsExist  = (data) => NewPromise(Axios.post('/buyer/exists/buyer-code', data));                // 회원 코드 존재 여부
export const buyerIdIsExist    = (data) => NewPromise(Axios.post('/buyer/exists/buyer-identification-id', data));   // 회원 아이디 존재 여부
export const buyerEmailIsExist = (data) => NewPromise(Axios.post('/buyer/exists/email', data));                     // 회원 이메일 존재 여부
export const buyerSubList      = ((data) => {
    console.log(data);
    let requestParam = {
        page: data.pageNo - 1,
        pageSize: data.len,
    };
    console.log(requestParam);
    return NewPromise(Axios.post('/buyer/sub/list', requestParam));
});                                                                 // 회원 서브 계정 리스트 조회
export const add               = (data) => NewPromise(Axios.post('/buyer/sub/add', data));                          // 회원 서브 계정 등록
export const buyerModify       = (data) => NewPromise(Axios.post('/buyer/sub/modify', data));                       // 회원 서브 계정 수정
export const buyerDelete       = (data) => NewPromise(Axios.post('/buyer/sub/delete', data));                       // 회원 서브 계정 삭제
// BUYER - 임시회원
export const buyerTmpList      = ((data) => {
    let requestParam = {
        page: data.pageNo - 1,
        pageSize: data.len,
        map: {
            buyerIdentificationId: "",
            buyerType:"",
            corpName:""
        }
    };
    if(data.searchConditionSelect === "buyerIdentificationId"){
        requestParam.map.buyerIdentificationId = data.searchConditionText;
    } else if(data.searchConditionSelect === "buyerType"){
        requestParam.map.buyerType = data.searchConditionText;
    } else if(data.searchConditionSelect === "corpName"){
        requestParam.map.corpName = data.searchConditionText;
    }
    return NewPromise(Axios.post('/buyer/tmp/list', requestParam));
}); // 회원 수정 요청 리스트 조회
export const buyerTmpGet       = (data) => NewPromise(Axios.post('/buyer/tmp/detail', data));                       // 회원 수정 요청 상세 조회
export const buyerTmpSignup    = ((data) => {

    let requestParam = {
        map: {
              buyerIdentificationId  : data.buyerIdentificationId
            , password               : data.password
            , corpName               : data.corpName
            , staffName              : data.staffName
            , corpAddress            : data.corpAddress
            , corpTelNo              : data.corpTelNo
            , staffTelNo             : data.corpTelNo
            , corpFaxNo              : data.corpFaxNo
            , healthcareFacilityCode : data.healthcareFacilityCode
            , staffPhoneNo           : data.staffPhoneNo
            , corpPhoneNo            : data.staffPhoneNo
            , staffEmail             : data.staffEmail
            , corpEmail              : data.staffEmail

            , buyerType              : data.buyerType
            , ci                     : data.ci
            , pharmacyNo             : data.pharmacyNo

            , corpShippingAddress    : data.corpShippingAddress
        }
    }

    return NewPromise(Axios.post('/buyer/tmp/add', requestParam));
});                          // 회원 가입 요청
export const buyerTmpModify    = (data) => NewPromise(Axios.post('/buyer/tmp/modify', data));                       // 회원 수정 요청


// CHECKPLUS 본인인증 완료 여부 확인
export const checkplusCheck = (data) => NewPromise(Axios.get('/checkplus/check', data));


// 배송지 관련
export const addressAdd = (data) => NewPromise(Axios.post('/buyer/shipping/address/list/add', data));
export const addressList = (data) => NewPromise(Axios.post('/buyer/shipping/address/list', data));
export const addressMod = (data) => NewPromise(Axios.post('/buyer/shipping/address/list/modify', data));
export const addressDel = (data) => NewPromise(Axios.post('/buyer/shipping/address/list/delete', data));


// ETC or 미사용
export const update = (data) => NewPromise(Axios.post('/admin/buyer/update', data));                // 수정
export const del    = (data) => NewPromise(Axios.post('/admin/buyer/delete', data));                // 삭제
export const excel  = (data) => NewPromise(DownloadAxios.get('/admin/buyer/excelDownload', {
    params: {
        ...data,
    }
})); // 엑셀 다운로드

export const modifyPassword = (data) => NewPromise(Axios.post('/buyer/modify/password', data));
export const getTerms = (data) => NewPromise(Axios.post('/buyer/terms/detail', data));

export const initPassword = (data) => NewPromise(Axios.post('/buyer/init/password', data));
export const adminInitPassword = (data) => NewPromise(Axios.post('/admin/buyer/init/password', data));