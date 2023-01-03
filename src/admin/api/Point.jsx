import {Axios} from "../../component";
import {NewPromise} from "../../component/Common";
import moment from "moment";

export const getPointHeaderForBuyer = () => NewPromise(Axios.post('/buyer/point/header', null));
export const getPointListForBuyer = ((data) => {
    console.log(data);
    const requestParam = {
        page: data.pageNo - 1,
        pageSize: data.len,
        map: {
            startDate: (data.searchConditionDate !== undefined && data.searchConditionDate[0] !== undefined ? moment(data.searchConditionDate[0]._d).format('YYYY-MM-DD') : ''),
            endDate: (data.searchConditionDate !== undefined && data.searchConditionDate[1] !== undefined ? moment(data.searchConditionDate[1]._d).format('YYYY-MM-DD') : ''),
            pointState: data.searchConditionSelect
            // buyerType:"",
            // corpName:"",
            // buyerState:"",
            // buyerCode:""
        }
    }
    // if(data.searchConditionSelect === "buyerIdentificationId"){
    //     requestParam.map.buyerIdentificationId = data.searchConditionText;
    // } else if(data.searchConditionSelect === "staffName"){
    //     requestParam.map.staffName = data.searchConditionText;
    // } else if(data.searchConditionSelect === "buyerType"){
    //     requestParam.map.buyer.buyerType = data.searchConditionText;
    // } else if(data.searchConditionSelect === "corpName"){
    //     requestParam.map.buyer.corpName = data.searchConditionText;
    // } else if(data.searchConditionSelect === "buyerState"){
    //     requestParam.map.buyer.buyerState = data.searchConditionText;
    // } else if(data.searchConditionSelect === "buyerCode"){
    //     requestParam.map.buyer.buyerCode = data.searchConditionText;
    // }

    console.log(requestParam);
    const result = NewPromise(Axios.post('/buyer/point/list', requestParam));
    console.log(result);
    return result;
});

export const getPointHeader = () => NewPromise(Axios.post('/admin/point/header', null));
export const getPointList = ((data) => {
    console.log(data);
    const requestParam = {
        page: data.pageNo - 1,
        pageSize: data.len,
        map: {
            startDate: (data.searchConditionDate !== undefined && data.searchConditionDate[0] !== undefined ? moment(data.searchConditionDate[0]._d).format('YYYY-MM-DD') : ''),
            endDate: (data.searchConditionDate !== undefined && data.searchConditionDate[1] !== undefined ? moment(data.searchConditionDate[1]._d).format('YYYY-MM-DD') : ''),
            pointState: "",
            orderNo: "",
            buyerIdentificationId: "",
            productDisplayName: "",
            searchKeyword: ""
        }
    }

    if(data.searchConditionSelect === "buyerIdentificationId"){
        requestParam.map.buyerIdentificationId = data.searchConditionText;
    } else if(data.searchConditionSelect === "orderNo"){
        requestParam.map.orderNo = data.searchConditionText;
    } else if(data.searchConditionSelect === "pointState"){
        requestParam.map.pointState = data.searchConditionText;
    } else if(data.searchConditionSelect === "productDisplayName"){
        requestParam.map.productDisplayName = data.searchConditionText;
    } else if(data.searchConditionSelect === ""){
        requestParam.map.searchKeyword = data.searchConditionText;
    }

    console.log(requestParam);
    const result = NewPromise(Axios.post('/admin/point/list', requestParam));
    console.log(result);
    return result;
});
