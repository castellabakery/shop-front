import {Axios} from "../../component";
import {NewPromise} from "../../component/Common";
import {DownloadAxios} from "../../component/axios";

// ADMIN - 상품
export const add    = ((data) => {
    let requestParam = {
        map : {
            quantity                : data.quantity
            ,productDetail          : data.productDetail
            ,standardCode           : ""
            ,insuranceCode          : data.insuranceCode
            ,specialDivision        : data.specialDivision
            ,specialtyDivision      : data.specialtyDivision
            ,medicalDivision        : data.medicalDivision
            ,insuranceDivision      : data.insuranceDivision
            ,productName            : data.productName
            ,productDisplayName     : data.productName + " " + data.ingredientName
            ,standard               : data.standard
            ,unit                   : data.unit
            ,factory                : data.factory
            ,formulaDivision        : data.formulaDivision
            ,ingredientDivisionName : ""
            ,ingredientName         : data.ingredientName
            ,useYn                  : data.useYn
            ,point                  : (data.pointPayType === "I" ? data.pointAmount : (data.pointPayType === "L" ? data.pointPercent : ""))
            ,pointPayType           : data.pointPayType
            ,buyerTypeProductAmountList : [
                {
                    buyerType      : "W"
                    , amount       : data.buyerTypeProductAmountList_W_amount
                },
                {
                    buyerType      : "M"
                    , amount       : data.buyerTypeProductAmountList_M_amount
                },
                {
                    buyerType      : "P"
                    , amount       : data.buyerTypeProductAmountList_P_amount
                }
            ]
        }
    };
    return NewPromise(Axios.post('/admin/product/add', requestParam));
});         // 상품 등록
export const update = ((data) => {
    let requestParam = {
        map : {
             seq                    : data.seq
            ,quantity               : data.quantity
            ,productDetail          : data.productDetail
            ,standardCode           : ""
            ,insuranceCode          : data.insuranceCode
            ,specialDivision        : data.specialDivision
            ,specialtyDivision      : data.specialtyDivision
            ,medicalDivision        : data.medicalDivision
            ,insuranceDivision      : data.insuranceDivision
            ,productName            : data.productName
            ,productDisplayName     : data.productName + " " + data.ingredientName
            ,standard               : data.standard
            ,unit                   : data.unit
            ,factory                : data.factory
            ,formulaDivision        : data.formulaDivision
            ,ingredientDivisionName : ""
            ,ingredientName         : data.ingredientName
            ,useYn                  : data.useYn
            ,point                  : (data.pointPayType === "I" ? data.pointAmount : (data.pointPayType === "L" ? data.pointPercent : ""))
            ,pointPayType           : data.pointPayType
            ,buyerTypeProductAmountList : [
                {
                    buyerType      : "W"
                    , amount       : data.buyerTypeProductAmountList_W_amount
                },
                {
                    buyerType      : "M"
                    , amount       : data.buyerTypeProductAmountList_M_amount
                },
                {
                    buyerType      : "P"
                    , amount       : data.buyerTypeProductAmountList_P_amount
                }
            ]
        }
    };
    return NewPromise(Axios.post('/admin/product/modify', requestParam));
});   // 상품 수정
export const get    = (data) => NewPromise(Axios.post('/admin/product/detail', data));   // 상품 상세 조회
export const list   = ((data) => {
    let requestParam = {
        page: data.pageNo - 1,
        pageSize: data.len,
        map: {
            standardCode: "",
            productName: "",
            factory:"",
            searchKeyword: "",
            useYn: ""
        }
    };
    if(data.searchConditionSelect === "standardCode"){
        requestParam.map.standardCode = data.searchConditionText;
    } else if(data.searchConditionSelect === "productName"){
        requestParam.map.productName = data.searchConditionText;
    } else if(data.searchConditionSelect === "factory"){
        requestParam.map.factory = data.searchConditionText;
    } else if(data.searchConditionSelect === "useYn"){
        if(data.searchConditionText === ""){
            // Pass
        } else if("사용".includes(data.searchConditionText)) {
            requestParam.map.useYn = "Y"
        } else if("미사용".includes(data.searchConditionText)) {
            requestParam.map.useYn = "N"
        } else {
            requestParam.map.useYn = data.searchConditionText;
        }
        requestParam.map.useYn = data.searchConditionText;
    } else if(data.searchConditionSelect === ""){
        requestParam.map.searchKeyword = data.searchConditionText;
    }
    return NewPromise(Axios.post('/admin/product/list', requestParam));
});                                                 // 상품 리스트 조회

// BUYER - 상품
export const buyerList   = ((data) => {
    console.log(data.sortName.length);
    let requestParam = {
        page: data.pageNo - 1,
        pageSize: data.len,
        map: {
            standardCode: "",
            productName: "",
            factory:"",
            searchKeyword: "",
            sortName:(data.sortName.length <= 0 ? "" : data.sortName),
            sortType:(data.sortType.length <= 0 ? "" : data.sortType),
            specialtyDivision: ""
        }
    };
    if(data.searchConditionSelect === "standardCode"){
        requestParam.map.standardCode = data.searchConditionText;
    } else if(data.searchConditionSelect === "productName"){
        requestParam.map.productName = data.searchConditionText;
    } else if(data.searchConditionSelect === "factory"){
        requestParam.map.factory = data.searchConditionText;
    } else if(data.searchConditionSelect === "all"){
        requestParam.map.searchKeyword = data.searchConditionText;
    } else if(data.searchConditionSelect === "formulaDivision"){
        requestParam.map.formulaDivision = data.searchConditionText;
    } else if(data.searchConditionSelect === "specialtyDivision0"){
        requestParam.map.specialtyDivision = "2";
        requestParam.map.searchKeyword = data.searchConditionText;
    } else if(data.searchConditionSelect === "specialtyDivision1"){
        requestParam.map.specialtyDivision = "1";
        requestParam.map.searchKeyword = data.searchConditionText;
    }
    return NewPromise(Axios.post('/buyer/product/list', requestParam));
});                                                 // 상품 리스트 조회
export const buyerGet    = (data) => NewPromise(Axios.post('/buyer/product/detail', data));   // 상품 상세 조회


// ETC or 미사용
export const excel  = (data) => NewPromise(DownloadAxios.get('/product/admin/excelDownload', {
    params: {
        ...data,
    }
})); // 엑셀 다운로드