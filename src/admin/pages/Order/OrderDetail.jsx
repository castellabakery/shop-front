import React, {useCallback, useEffect, useState, useRef} from 'react';
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {Button, Descriptions, Input, Popconfirm, Select, Form, Modal, Row, Col, Image, InputNumber} from "antd";

import './OrderDetail.css';

import AdminPageHeader from "../../AdminPageHeader";

import * as OrderAPI from "../../api/Order";
import {Message, Table} from "../../../component";
import moment from "moment";

const OrderDetail = function () {
    const urlPrefix = '/admin/order';
    const navigate = useNavigate();
    const location = useLocation();
    const params = useParams();
    const id = Number(params.id);
    const table = useRef();
    const [form] = Form.useForm();

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [initData, setInitData] = useState({});
    const [_total, setTotal] = useState(0);
    const [dataList, setDataList] = useState([]);
    const [isResult, setIsResult] = useState(false);
    const [statusList, setStatusList] = useState([]);
    const [orgStatusList, setOrgStatusList] = useState([]);
    const [orderNo, setOrderNo] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("");
    const [deliveryCompanyList, setDeliveryCompanyList] = useState([]);
    const [deliveryNoList, setDeliveryNoList] = useState([]);
    const [taxbillYn, setTaxbillYn] = useState("N");

    const _onList = () => {
        const values = {
            map: {
                orderInfoSeq: id
            }
        };
        OrderAPI.get(values)
            .then((response) => {
                console.log(response);
                let res = response.data.orderItemList;
                const total = res.length || 0;
                const list = res || [];
                if (total !== 0) {
                    setTotal(total);
                    setDataList(list);
                    setInitData(response.data);
                    setOrderNo(response.data.orderNo);
                    if(response.data.paymentMethod === "CC"){
                        setPaymentMethod("????????????")
                    } else if(response.data.paymentMethod === "PT") {
                        setPaymentMethod("???????????????")
                    } else {
                        setPaymentMethod(response.data.paymentMethod)
                    }
                    setOrgStatusList(res.map(item => {
                        return (
                            {
                                seq: item.seq,
                                orderItemState: item.orderItemState,
                                deliveryNo: item.deliveryNo,
                                deliveryCompany: item.deliveryCompany
                            }
                        )
                    }))
                    setStatusList(res.map(item => {
                        return (
                            {
                                seq: item.seq,
                                orderItemState: item.orderItemState,
                                deliveryNo: item.deliveryNo,
                                deliveryCompany: item.deliveryCompany
                            }
                        )
                    }))
                    setTaxbillYn((response.data.hasOwnProperty('taxbillYn') ? response.data.taxbillYn : 'N'));
                    setIsResult(true);
                }
            })
            .catch((error) => {
                Message.error(error.message);
            })
    }
    useEffect(() => {
        _onList();
    }, []);

    const columns = [
        {
            title: '??????????????????',
            dataIndex: 'orderNo',
            key: 'orderNo',
            render: (_, record) => orderNo + record.itemSeq
        },
        {
            title: '????????????',
            dataIndex: '',
            key: '',
            render: (_, record) => {
                return (
                    <div>
                        <Row>
                            <Col>
                                <a href={"#"}>
                                    <Image
                                        width={200}
                                        height={200}
                                        src= {(record.hasOwnProperty('fileList') && record.fileList.length > 0 ? record.fileList[0].fullFilePath : '') || "error"}
                                        fallback="data:image/png;base64,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"
                                    />
                                </a>
                            </Col>
                            <Col>
                                <p>{record.productDisplayName} (?????????)</p>
                                <p>{record.standard} ()</p>
                                <p>{record.factory} ()</p>
                            </Col>
                        </Row>
                    </div>
                )
            },
        },
        {
            title: '????????????(??????)',
            dataIndex: '',
            key: '',
            render: (_, record) => {
                return (
                    <div>
                        {record.orderItemAmount.toLocaleString()} ???
                        <br/>
                        {record.orderQuantity} (???)
                    </div>
                );
            }
        },
        {
            title: '????????????',
            dataIndex: '',
            key: '',
            render: (_, record) => {
                let statusOption
                let statusText
                const initialStatus = record.orderItemState;
                if (initialStatus === 'ORDER_STANDBY') {
                    statusText = "?????? ???";
                    statusOption = [
                        <Select.Option value={initialStatus}>{statusText}</Select.Option>
                    ];
                } else if (initialStatus === 'PAY_STANDBY') {
                    statusText = "????????????";
                    statusOption = [
                        <Select.Option value={initialStatus}>{statusText}</Select.Option>,
                        <Select.Option value={"CANCEL_DONE"}>????????????</Select.Option>
                    ];
                } else if (initialStatus === 'PAY_DONE') {
                    statusText = "????????????";
                    statusOption = [
                        <Select.Option value={initialStatus}>{statusText}</Select.Option>,
                        <Select.Option value={"CANCEL_DONE"}>????????????</Select.Option>,
                        <Select.Option value={"SHIPPING"}>?????????</Select.Option>
                    ];
                } else if (initialStatus === 'SHIPPING') {
                    statusText = "?????????";
                    statusOption = [
                        <Select.Option value={initialStatus}>{statusText}</Select.Option>,
                        <Select.Option value={"DELIVERY_COMPLETED"}>????????????</Select.Option>
                    ];
                } else if (initialStatus === 'DELIVERY_COMPLETED') {
                    statusText = "????????????";
                    statusOption = [
                        <Select.Option value={initialStatus}>{statusText}</Select.Option>,
                        <Select.Option value={"ORDER_CONFIRM"}>????????????</Select.Option>,
                        <Select.Option value={"REFUND_DONE"}>????????????</Select.Option>
                    ];
                } else if (initialStatus === 'CANCEL_REQUEST') {
                    statusText = "????????????";
                    statusOption = [
                        <Select.Option value={initialStatus}>{statusText}</Select.Option>,
                        <Select.Option value={"SHIPPING"}>?????????</Select.Option>,
                        <Select.Option value={"CANCEL_DONE"}>????????????</Select.Option>
                    ];
                } else if (initialStatus === 'CANCEL_DONE') {
                    statusText = "??????????????????";
                    statusOption = [
                        <Select.Option value={initialStatus}>{statusText}</Select.Option>
                    ];
                } else if (initialStatus === 'REFUND_REQUEST') {
                    statusText = "????????????";
                    statusOption = [
                        <Select.Option value={initialStatus}>{statusText}</Select.Option>,
                        <Select.Option value={"DELIVERY_COMPLETED"}>????????????</Select.Option>,
                        <Select.Option value={"REFUND_DONE"}>????????????</Select.Option>
                    ];
                } else if (initialStatus === 'REFUND_DONE') {
                    statusText = "????????????";
                    statusOption = [
                        <Select.Option value={initialStatus}>{statusText}</Select.Option>
                    ];
                } else if (initialStatus === 'ORDER_CONFIRM') {
                    statusText = "????????????";
                    statusOption = [
                        <Select.Option value={initialStatus}>{statusText}</Select.Option>
                    ];
                } else if (initialStatus === 'ORDER_ERROR') {
                    statusText = "????????????";
                    statusOption = [
                        <Select.Option value={initialStatus}>{statusText}</Select.Option>
                    ];
                } else if(initialStatus === 'PAYMENT_ERROR') {
                    statusText = "????????????";
                    statusOption = [
                        <Select.Option value={initialStatus}>{statusText}</Select.Option>,
                        <Select.Option value={"CANCEL_DONE"}>????????????</Select.Option>
                    ];
                } else {
                    statusText = "???????????????";
                    statusOption = [
                        <Select.Option value={initialStatus}>{statusText}</Select.Option>
                    ];
                }

                return (
                    <div>
                        <p>{statusText}</p>
                        <Form.Item
                            name={"orderStatus"+record.seq}
                            required={true}
                            initialValue={initialStatus}
                        >
                            <Select
                                onChange={e => {
                                    changeStatus(e, record.seq, statusList);
                                }}
                                style={{
                                width: 120,
                            }}
                                    defaultValue={initialStatus}>
                                {statusOption.map(item => {return item;})}
                            </Select>
                        </Form.Item>
                    </div>
                )
            }
        },
        {
            title: '?????????',
            dataIndex: '',
            key: '',
            render: (_, record) => {
                const initialShippingCompany = record.deliveryCompany;
                const initialShippingNo = record.deliveryNo;
                return (
                    <div>
                        <Form.Item
                            name={"deliveryCompany_"+record.seq}
                            required={true}
                            initialValue={initialShippingCompany}
                        >
                            <Select
                                onChange={e => changeDeliveryCompany(e, record.seq, statusList)}
                                defaultValue
                                style={{
                                width: 120,
                            }}>
                                <Select.Option value={"CJ????????????"}>CJ????????????</Select.Option>
                                <Select.Option value={"????????????"}>????????????</Select.Option>
                                <Select.Option value={"????????????"}>????????????</Select.Option>
                                <Select.Option value={"????????????"}>????????????</Select.Option>
                                <Select.Option value={"???????????????"}>???????????????</Select.Option>
                                <Select.Option value={"????????????"}>????????????</Select.Option>
                                <Select.Option value={"????????????"}>????????????</Select.Option>
                            </Select>
                        </Form.Item>
                        <br/>
                        <Form.Item
                            name={"deliveryNo_"+record.seq}
                            required={true}
                            initialValue={initialShippingNo}
                        >
                            <InputNumber style={{width:125}} onChange={e => changeDeliveryNo(e, record.seq, statusList)} type={"text"} defaultValue={initialShippingNo} placeholder={"????????????"}/>
                        </Form.Item>
                    </div>
                )
            }
        }
    ];
    const showModal = () => {
        setIsModalVisible(true);
    };
    const handleCancel = () => {
        setIsModalVisible(false);
    };
    const onList = useCallback(() => {
        navigate(urlPrefix + '/list' + location.search);
    }, []);
    const goSelf = useCallback(() => {
        navigate(urlPrefix + '/detail/' + id);
    }, []);
    const onSubmit = useCallback((values) => {
    }, []);
    const onsubm = (statusList, orgStatusList, paymentMethod, taxbillYn) => {
        console.log(statusList);
        console.log(taxbillYn);
        console.log(paymentMethod);
        if(paymentMethod === "????????????"){
            paymentMethod = "CC"
        } else if(paymentMethod === "???????????????") {
            paymentMethod = "PT"
        }

        let requestParam = {
            map: {
                seq: id,
                taxbillYn: taxbillYn,
                orderItemList: []
            }
        }
        let tmp = [];
        statusList.map(item => {
            orgStatusList.filter(item_ => {
                if(item.seq === item_.seq){
                    console.log(item);
                    console.log(item_);
                    tmp.push({
                        seq: item_.seq,
                        orderItemState: item.orderItemState,
                        deliveryNo: item.deliveryNo,
                        deliveryCompany: item.deliveryCompany,
                        orderInfo: {
                            paymentMethod: paymentMethod
                        }
                    })
                    console.log(tmp);
                    return true;
                }
            })
        })
        requestParam.map.orderItemList = tmp;
        console.log(requestParam);
        OrderAPI.changeStatus(requestParam)
                .then((res) => {
                    console.log(res);
                    if(res.code !== 1000){
                        Message.error(res.message);
                        return;
                    }
                    Message.success('???????????? ????????? ?????????????????????.');
                    window.location.reload();
                }).catch((error) => {
                Message.error(error.message);
            });

    }
    const changeStatus = (status, seq, statusLst, deliveryNo, deliveryCompany) => {
        const idx = statusLst.findIndex(item => item.seq === seq);
        statusLst[idx].orderItemState = status;
        console.log(status);
        // if(status === "SHIPPING") {
        //     statusLst[idx].deliveryNo = deliveryNo;
        //     statusLst[idx].deliveryCompany = deliveryCompany;
        // }
        setStatusList(statusLst);
    }

    const changeDeliveryCompany = (e, seq, statusLst) => {
        console.log(e);
        const idx = statusLst.findIndex(item => item.seq === seq);
        statusLst[idx].deliveryCompany = e;
        setStatusList(statusLst);
    }

    const changeDeliveryNo = (e, seq, statusLst) => {
        console.log(e);
        const idx = statusLst.findIndex(item => item.seq === seq);
        statusLst[idx].deliveryNo = e;
        setStatusList(statusLst);
    }

    const changeTaxbill = useCallback((e) => {
        setTaxbillYn(e);
    }, [taxbillYn, setTaxbillYn]);

    return (
        <div className="buyer-detail-layout">
            <AdminPageHeader title={"????????????"} subTitle={"????????????-??????"}/>
            <div className={'detail_wrap'}>
                <p>???????????? : {(initData.hasOwnProperty('createdDatetime') ? moment(initData.createdDatetime).format('YYYY-MM-DD HH:mm:ss') : '')}  /  ???????????? : {(initData.hasOwnProperty('orderNo') ? initData.orderNo : '')}</p>
                <br/>
                <p><h3>????????????</h3></p>
                {
                    isResult && (
                        <div>
                            <Form
                                layout={'vertical'}
                                form={form}
                                onFinish={onSubmit}
                            >
                                <Table
                                    columns={columns}
                                    onList={OrderAPI.get} //???????????? ????????????, Table Component??? onList??? ??????????????? _onList??? ??????????????? ??? ??????;
                                    isInitLoad={true}
                                    innerRef={table}
                                    propTotal={_total}
                                    propDataList={dataList}
                                    showPagination={false}
                                />
                            </Form>
                        </div>
                    )
                }

                <br/>
                <br/>
                {
                    isResult && (
                        <Descriptions title="????????????" size={'small'} column={2} bordered>
                            <Descriptions.Item label="ID" span={2}>
                                {initData.hasOwnProperty('staffId') ? initData['staffId'] : ''}
                            </Descriptions.Item>

                            <Descriptions.Item label="?????????" span={2}>
                                {initData.hasOwnProperty('staffName') ? initData['staffName'] : ''}
                            </Descriptions.Item>

                            <Descriptions.Item label="?????????" span={2}>
                                {initData.hasOwnProperty('staffEmail') ? initData['staffEmail'] : ''}
                            </Descriptions.Item>

                            <Descriptions.Item label="?????????" span={2}>
                                {initData.hasOwnProperty('staffPhoneNo') ? initData['staffPhoneNo'] : ''}
                            </Descriptions.Item>

                            <Descriptions.Item label="???" span={2}>
                                {initData.hasOwnProperty('corpName') ? initData['corpName'] : ''}
                            </Descriptions.Item>

                            <Descriptions.Item label="?????????" span={2}>
                                {initData.hasOwnProperty('shippingAddressPostNo') ? initData['shippingAddressPostNo'] : ''}&nbsp;
                                {initData.hasOwnProperty('shippingAddress') ? initData['shippingAddress'] : ''}&nbsp;
                                {initData.hasOwnProperty('shippingAddressDetail') ? initData['shippingAddressDetail'] : ''}
                            </Descriptions.Item>

                            <Descriptions.Item label="??????????????????" span={2}>
                                {initData.hasOwnProperty('orderMemo') ? initData['orderMemo'] : ''}
                            </Descriptions.Item>
                        </Descriptions>
                    )
                }
                        <br/>
                        <br/>
                {
                    isResult && (
                        <Descriptions title="????????????" size={'small'} column={4} bordered>
                            <Descriptions.Item label="???????????????" span={4}>
                                {dataList.reduce((acc, val) => acc + val.orderItemAmount, 0).toLocaleString()} ???
                            </Descriptions.Item>

                            <Descriptions.Item label="???????????????" span={2}>
                                {/*{dataList.reduce((acc, val) => acc + val.orderInfo.usePoint, 0).toLocaleString()} ?????????*/}
                                {initData.usePoint.toLocaleString()} ?????????
                            </Descriptions.Item>

                            <Descriptions.Item label="???????????????" span={2}>
                                {dataList.reduce((acc, val) => acc + val.pointSave, 0).toLocaleString()} ?????????
                                <Button onClick={showModal}>????????????</Button>
                                <Modal title="??????????????? ????????????" visible={isModalVisible} onOk={handleCancel} onCancel={handleCancel}
                                footer={[
                                    <Button key="confirmed" type="primary" onClick={handleCancel}>
                                        ??????
                                    </Button>
                                ]}
                                >
                                    <Descriptions title="????????????" size={'small'} column={2} bordered>
                                        {
                                             dataList.map(item => {
                                                 return (
                                                    <Descriptions.Item label={item.productDisplayName} span={2}>
                                                        {item.pointSave} ?????????
                                                    </Descriptions.Item>
                                                );
                                            })
                                        }
                                    </Descriptions>
                                </Modal>
                            </Descriptions.Item>

                            <Descriptions.Item label="????????????" span={2}>
                                {(Number(dataList.reduce((acc, val) => acc + val.orderItemAmount, 0)) - Number(dataList.reduce((acc, val) => acc + val.orderInfo.usePoint, 0))).toLocaleString()} ???
                            </Descriptions.Item>

                            <Descriptions.Item label="????????????" span={4}>
                                {paymentMethod}
                            </Descriptions.Item>

                            <Descriptions.Item label="?????????????????????" span={4}>
                                <Select onChange={changeTaxbill} defaultValue={taxbillYn}>
                                    <Select.Option value={"Y"}>??????</Select.Option>
                                    <Select.Option value={"N"}>?????????</Select.Option>
                                </Select>
                            </Descriptions.Item>
                        </Descriptions>
                    )
                }

                <br/>
                <br/>

                <div className={'button_div'}>
                    <Popconfirm placement="topLeft" title={'?????????????????????????'}
                                onConfirm={e => onsubm(statusList, orgStatusList, paymentMethod, taxbillYn)} okText="??????" cancelText="??????">
                        <Button type={'primary'} danger>??????</Button>
                    </Popconfirm>
                    <Button onClick={onList}>??????</Button>
                </div>
            </div>

        </div>
    );
};

export default OrderDetail;
