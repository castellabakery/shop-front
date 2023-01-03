import {Axios} from "../../component";
import {NewPromise} from "../../component/Common";
import {DownloadAxios, UploadAxios} from "../../component/axios";
import FormAxios from "../../component/axios/FormAxios";
import moment from "moment";

export const buyerGet = (data) => NewPromise(Axios.post('/buyer/order/detail', data));
export const get = (data) => NewPromise(Axios.post('/admin/buyer/order/detail', data));
export const add = (data) => NewPromise(Axios.post('/admin/buyer/add', data));
export const update = (data) => NewPromise(Axios.post('/admin/buyer/update', data));
export const del = (data) => NewPromise(Axios.post('/admin/buyer/delete', data));

export const list = ((data) => {
    console.log(data);
    let requestParam;
    if(data.buyerIdentificationSeq !== undefined && data.buyerIdentificationSeq !== null && data.buyerIdentificationSeq !== ""){
        requestParam = {
            page: data.pageNo - 1,
            pageSize: data.len,
            map: {
                startDate: (data.searchConditionDate !== null && data.searchConditionDate !== undefined && data.searchConditionDate[0] !== undefined ? moment(data.searchConditionDate[0]._d).format('YYYY-MM-DD') : ''),
                endDate: (data.searchConditionDate !== null && data.searchConditionDate !== undefined && data.searchConditionDate[1] !== undefined ? moment(data.searchConditionDate[1]._d).format('YYYY-MM-DD') : ''),
                orderStateList: "",
                searchKeyword: "",
                staffId: "",
                staffName: "",
                buyerIdentificationSeq: data.buyerIdentificationSeq
            }
        };
    } else {
        requestParam = {
            page: data.pageNo - 1,
            pageSize: data.len,
            map: {
                startDate: (data.searchConditionDate !== null && data.searchConditionDate !== undefined && data.searchConditionDate[0] !== undefined ? moment(data.searchConditionDate[0]._d).format('YYYY-MM-DD') : ''),
                endDate: (data.searchConditionDate !== null && data.searchConditionDate !== undefined && data.searchConditionDate[1] !== undefined ? moment(data.searchConditionDate[1]._d).format('YYYY-MM-DD') : ''),
                orderStateList: "",
                searchKeyword: "",
                staffId: "",
                staffName: ""
            }
        };
    }

    if(data.searchConditionSelect2 === "buyerIdentificationId"){
        requestParam.map.staffId = data.searchConditionText;
    } else if(data.searchConditionSelect2 === "staffName"){
        requestParam.map.staffName = data.searchConditionText;
    } else if(data.searchConditionSelect2 === "orderState") {
        if(data.searchConditionText === ""){
            // Pass
        }else if("입금대기".includes(data.searchConditionText)){
            requestParam.map.orderStateList = "PAY_STANDBY"
        } else if("취소".includes(data.searchConditionText)) {
            requestParam.map.orderStateList = "CANCEL_REQUEST, CANCEL_DONE"
        } else if("배송".includes(data.searchConditionText)) {
            requestParam.map.orderStateList = "SHIPPING, DELIVERY_COMPLETED"
        } else if("환불".includes(data.searchConditionText)) {
            requestParam.map.orderStateList = "REFUND_REQUEST, REFUND_DONE"
        } else if("신청".includes(data.searchConditionText)) {
            requestParam.map.orderStateList = "REFUND_REQUEST, CANCEL_REQUEST"
        } else if("완료".includes(data.searchConditionText)) {
            requestParam.map.orderStateList = "REFUND_DONE, CANCEL_DONE, PAY_DONE, DELIVERY_COMPLETED"
        } else if("대기".includes(data.searchConditionText)) {
            requestParam.map.orderStateList = "PAY_STANDBY"
        } else if("입금".includes(data.searchConditionText)) {
            requestParam.map.orderStateList = "PAY_STANDBY"
        } else if("취소".includes(data.searchConditionText)) {
            requestParam.map.orderStateList = "CANCEL_REQUEST, CANCEL_DONE"
        } else if("결제완료".includes(data.searchConditionText)) {
            requestParam.map.orderStateList = "PAY_DONE"
        } else if("배송중".includes(data.searchConditionText)) {
            requestParam.map.orderStateList = "SHIPPING"
        } else if("배송완료".includes(data.searchConditionText)) {
            requestParam.map.orderStateList = "DELIVERY_COMPLETED"
        } else if("구매확정".includes(data.searchConditionText)) {
            requestParam.map.orderStateList = "ORDER_CONFIRM"
        } else if("취소신청".includes(data.searchConditionText)) {
            requestParam.map.orderStateList = "CANCEL_REQUEST"
        } else if("취소완료".includes(data.searchConditionText)) {
            requestParam.map.orderStateList = "CANCEL_DONE"
        } else if("환불신청".includes(data.searchConditionText)) {
            requestParam.map.orderStateList = "REFUND_REQUEST"
        } else if("환불완료".includes(data.searchConditionText)) {
            requestParam.map.orderStateList = "REFUND_DONE"
        } else {
            requestParam.map.orderStateList = data.searchConditionText;
        }
    } else if(data.searchConditionSelect2 === ""){
        requestParam.map.searchKeyword = data.searchConditionText;
    }

    console.log(requestParam);
    const result = NewPromise(Axios.post('/admin/buyer/order/list', requestParam));
    console.log(result);
    return result;
});

export const buyerList2 = ((data) => {
    const result = NewPromise(Axios.post('/buyer/order/list', data));
    console.log(result);
    return result;
});

export const buyerList3 = ((data) => {
    console.log(data);
    let requestParam = {
        page: data.pageNo - 1,
        pageSize: data.len,
        map: {
            startDate : moment().subtract(1, "months").format("YYYY-MM-DD")
            ,endDate : moment().format("YYYY-MM-DD")
            ,orderStateList : data.searchConditionSelect
        }
    };
    console.log(requestParam);
    const result = NewPromise(Axios.post('/buyer/order/list', requestParam));
    console.log(result);
    return result;
});

export const buyerList = ((data) => {
    console.log(data);
    let requestParam = {
        page: data.pageNo - 1,
        pageSize: data.len,
        map: {
            startDate: (data.searchConditionDate !== undefined && data.searchConditionDate[0] !== undefined ? moment(data.searchConditionDate[0]._d).format('YYYY-MM-DD') : ''),
            endDate: (data.searchConditionDate !== undefined && data.searchConditionDate[1] !== undefined ? moment(data.searchConditionDate[1]._d).format('YYYY-MM-DD') : ''),
            orderStateList: data.searchConditionSelect
        }
    };
    console.log(requestParam);
    const result = NewPromise(Axios.post('/buyer/order/list', requestParam));
    console.log(result);
    return result;
});

export const listTmp = (data) => {
    return NewPromise(Axios.post('/admin/order/tmp', data));
}

export const excel = (data) => NewPromise(DownloadAxios.get('/admin/excelDownload/sales/list', {
    params: {
        ...data,
    }
}));




export const goOrder = (data) => NewPromise(Axios.post('/buyer/order/direct', data));
export const setCart = (data) => NewPromise(Axios.post('/buyer/cart/add-modify', data));
export const checkHash = (data) => NewPromise(Axios.get('/buyer/order/checkHash?buyReqamt='+data.buyReqamt+"&buyItemnm="+data.buyItemnm+"&kindstype="+data.kindstype+"&orderno="+data.orderno));

export const getOrderTmp = (data) => NewPromise(FormAxios.post('/buyer/order/cart', data));

export const changeStatus = (data) => NewPromise(Axios.post('/admin/buyer/order/modify/info', data));
export const buyerChangeStatus = (data) => NewPromise(Axios.post('/buyer/order/modify/state', data));

export const beforePayment = (data) => NewPromise(Axios.post('/buyer/order/modify/before-order', data));

export const paymentForPT = (data) => NewPromise(Axios.post('/buyer/order/return', data));




export const statisticsSummary = ((data) => {
    console.log(data);
    let requestParam = {
        page: data.pageNo - 1,
        pageSize: data.len,
        map: {
            startDate: (data.searchConditionDate !== null && data.searchConditionDate !== undefined && data.searchConditionDate[0] !== undefined ? moment(data.searchConditionDate[0]._d).format('YYYY-MM-DD') : ''),
            endDate: (data.searchConditionDate !== null && data.searchConditionDate !== undefined && data.searchConditionDate[1] !== undefined ? moment(data.searchConditionDate[1]._d).format('YYYY-MM-DD') : ''),
            paymentMethod: data.searchConditionSelect
        }
    };

    console.log(requestParam);
    const result = NewPromise(Axios.post('/admin/sales/header', requestParam));
    console.log(result);
    return result;
});

export const statisticsList = ((data) => {
    console.log(data);
    let requestParam = {
        page: data.pageNo - 1,
        pageSize: data.len,
        map: {
            startDate: (data.searchConditionDate !== null && data.searchConditionDate !== undefined && data.searchConditionDate[0] !== undefined ? moment(data.searchConditionDate[0]._d).format('YYYY-MM-DD') : ''),
            endDate: (data.searchConditionDate !== null && data.searchConditionDate !== undefined && data.searchConditionDate[1] !== undefined ? moment(data.searchConditionDate[1]._d).format('YYYY-MM-DD') : ''),
            paymentMethod: data.searchConditionSelect,
            // recommender: data.searchConditionText
        }
    };

    console.log(requestParam);
    const result = NewPromise(Axios.post('/admin/sales/list', requestParam));
    console.log(result);
    return result;
});
