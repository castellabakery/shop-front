import React, {useCallback, useEffect, useState} from 'react';
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {Button, Popconfirm} from "antd";

import './BuyerDetail.css';

import AdminPageHeader from "../../AdminPageHeader";
import {Message} from "../../../component";

import * as BuyerAPI from "../../api/Buyer";

import OrderList from "../Order/OrderList";
import SubUserList from "../SubUser/SubUserList";
import BuyerDetail_ComDesc_Company from "./BuyerDetail_ComDesc_Company";
import BuyerDetail_ComDesc_Hospital from "./BuyerDetail_ComDesc_Hospital";
import BuyerDetail_ComDesc_Medicine from "./BuyerDetail_ComDesc_Medicine";
import {adminInitPassword, del} from "../../api/Buyer";

const BuyerDetail = function () {
    const urlNow = '/detail';
    const urlPrefix = '/admin/buyer';
    const navigate = useNavigate();
    const location = useLocation();
    const params = useParams();
    const id = Number(params.id);
    const buyerId = (location.state !== undefined && location.state !== null ? (location.state.hasOwnProperty('buyerId') ? location.state.buyerId : 0) : 0);
    console.log(buyerId);
    const [checkData, setCheckData] = useState({
        isLoading: false,
        isInitialize: false,
    });
    const [initData, setInitData] = useState({
        result: {},
    });
    const requestParam = {
        map: {
            buyerIdentificationSeq: id
        }
    };
    const [buyerStateCheck, setBuyerStateCheck] = useState("");
    const [buyerIdentificationCode, setBuyerIdentificationCode] = useState("");
    useEffect(() => {
        if (!checkData.isInitialize) {
            setCheckData((p) => {
                return {
                    ...p,
                    isInitialize: true,
                    isLoading: true,
                }
            })
            BuyerAPI.get(requestParam)
                .then((response) => {
                    console.log(response);
                    setBuyerStateCheck(response.data.buyer.buyerState);
                    setBuyerIdentificationCode(response.data.buyerIdentificationCode);
                    setInitData((p) => {
                        return {
                            ...p,
                            result: response.data || {},
                        }
                    });
                    setCheckData((p) => {
                        return {
                            ...p,
                            isLoading: false,
                        }
                    })
                })
                .catch((error) => {
                    Message.error(error.message);
                })
        }
    }, [checkData, setCheckData, setInitData, id]);
    const onList = useCallback(() => {
        navigate(urlPrefix + '/list' + location.search);
    }, []);
    const onUpdate = () => {
        navigate(urlPrefix + '/update/' + id);
    }
    const onConfirmStop = () => {
        BuyerAPI.userStopRestart(
            {
                map: {
                    buyerSeq: buyerId,
                    changeState: "S"
                }
            }
        )
            .then((res) => {
                console.log(res);
                window.location.reload();
            })
            .catch(err => {
                console.log(err);
            })
    }

    const deleteUser = (buyerIdentificationCode) => {
        BuyerAPI.del(
            {
                map: {
                    buyerIdentificationCode: buyerIdentificationCode
                }
            }
        )
            .then((res) => {
                console.log(res);
                if(res.code !== 1000){
                    let msg;
                    if(res.message == "EXISTS_V_ACCOUNT_BALANCE"){
                        msg = " ??????????????????.";
                    } else if(res.message == "EXISTS_POINT"){
                        msg = "?????????????????? ??????????????????.";
                    } else if(res.message == "EXISTS_ORDER"){
                        msg = "???????????? ????????? ??????????????????.";
                    } else {
                        msg = "???????????? ??????????????????.";
                    }
                    Message.error("?????? ????????? ?????????????????????. ??????: "+msg);
                    return;
                }
                Message.success("?????? ????????? ?????????????????????.");
                onList();
            })
            .catch(err => {
                console.log(err);
            })
    }

    const onConfirmRestore = () => {
        BuyerAPI.userStopRestart(
            {
                map: {
                    buyerSeq: buyerId,
                    changeState: "D"
                }
            }
        )
            .then((res) => {
                console.log(res);
                window.location.reload();
            })
            .catch(err => {
                console.log(err);
            })
    }

    const initPassword = (id) => {
        BuyerAPI.adminInitPassword({map:{buyerIdentificationId:id}})
            .then(res => {
                console.log(res);
                if(res.code !== 1000){
                    Message.error("???????????? ???????????? ?????????????????????.");
                    return;
                }
                Message.success("???????????? ???????????? ?????????????????????.");
                // onList();
            })
            .catch(err => {
                console.log(err);
                Message.error("???????????? ???????????? ?????????????????????.");
            })
    }

    return (
        <div className="buyer-detail-layout">
            <AdminPageHeader title={"????????????"} subTitle={"????????????-??????"}/>
            <div className={'detail_wrap'}>
                {
                    (initData.result.hasOwnProperty('buyer') && initData.result.buyer.hasOwnProperty('buyerType') && initData.result.buyer['buyerType'] === 'M') &&
                    <BuyerDetail_ComDesc_Hospital initData={initData}/>
                }
                {
                    (initData.result.hasOwnProperty('buyer') && initData.result.buyer.hasOwnProperty('buyerType') && initData.result.buyer['buyerType'] === 'W') &&
                    <BuyerDetail_ComDesc_Company initData={initData}/>
                }
                {
                    (initData.result.hasOwnProperty('buyer') && initData.result.buyer.hasOwnProperty('buyerType') && initData.result.buyer['buyerType'] === 'P') &&
                    <BuyerDetail_ComDesc_Medicine initData={initData}/>
                }
                <br/>
                <OrderList detailId={id} urlNow={urlNow} type={"buyer"} urlPrefix={urlPrefix} showTotalOrder={true}/>
                <br/>
                {/*<VirtualAccountList detailId={id} urlNow={urlNow}/>*/}
                {/*<br/>*/}
                <SubUserList detailId={id} buyerId={buyerId} urlNow={urlNow}/>
                <br/>
                <div className={'button_div'}>
                    {/*<Popconfirm placement="topLeft" title={'?????????????????????????'}*/}
                    {/*            onConfirm={onDelete} okText="??????" cancelText="??????">*/}
                    {/*</Popconfirm>*/}
                    {/*<Button type={'primary'} onClick={onUpdate}>??????</Button>*/}
                    <Button onClick={onList}>??????</Button>
                    {
                        buyerStateCheck == "D" &&
                            <Popconfirm placement="topLeft" onConfirm={onConfirmStop} title={'?????? ????????? ?????????????????????????'} okText="??????"
                                        cancelText="??????">
                                <Button>????????????</Button>
                            </Popconfirm>
                    }
                    {
                        buyerStateCheck !== "D" &&
                            <Popconfirm placement="topLeft" onConfirm={onConfirmRestore} title={'?????? ????????? ???????????????????????????????'}
                                        okText="??????" cancelText="??????">
                                <Button>??????????????????</Button>
                            </Popconfirm>
                    }
                    <Button onClick={e => initPassword(initData.result.buyerIdentificationId)}>???????????? ?????????</Button>
                    <Popconfirm placement="topLeft" onConfirm={e => deleteUser(buyerIdentificationCode)} title={'?????? ????????? ?????????????????????????'}
                                okText="??????" cancelText="??????">
                        <Button type={"primary"} danger>????????????</Button>
                    </Popconfirm>
                </div>
            </div>
        </div>
    );
};

export default BuyerDetail;
