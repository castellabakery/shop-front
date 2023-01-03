import React, {useEffect, useRef, useState} from 'react';
import 'antd/dist/antd.css';
import {Button, Col, Descriptions, Form, Image, Modal, PageHeader, Row, Select} from 'antd';
import {useNavigate, useParams} from "react-router-dom";
import {Message, Table} from "../../../component";
import * as OrderAPI from "../../../admin/api/Order";
import './BuyerOrderDetail.css';
import moment from "moment";

const BuyerOrderDetail = function () {
    const params = useParams();
    const id = Number(params.id);
    const table = useRef();
    const [isResult, setIsResult] = useState(false);
    const navigate = useNavigate();
    const total = 0;
    const [_total, setTotal] = useState(total);
    const [dataList, setDataList] = useState([]);
    const [detailData, setDetailData] = useState([]);
    const [statusList, setStatusList] = useState([]);
    const [orgStatusList, setOrgStatusList] = useState([]);
    const [orderNo, setOrderNo] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("");

    const _onList = () => {
        const values = {
            map: {
                orderInfoSeq: id
            }
        };
        OrderAPI.buyerGet(values)
            .then((response) => {
                console.log(response);
                let res = response.data.orderItemList;
                const total = res.length || 0;
                const list = res || [];
                if (total !== 0) {
                    setTotal(total);
                    setDataList(list);
                    setDetailData(response.data);
                    setOrderNo(response.data.orderNo);
                    if(response.data.paymentMethod === "CC"){
                        setPaymentMethod("카드결제")
                    } else if(response.data.paymentMethod === "PT") {
                        setPaymentMethod("전액포인트")
                    } else {
                        setPaymentMethod(response.data.paymentMethod)
                    }
                    setOrgStatusList(res.map(item => {
                        return (
                            {
                                seq: item.seq,
                                orderItemState: item.orderItemState
                            }
                        )
                    }))
                    setStatusList(res.map(item => {
                        return (
                            {
                                seq: item.seq,
                                orderItemState: item.orderItemState
                            }
                        )
                    }))
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

    const changeStatus = (status, seq, statusLst) => {
        const idx = statusLst.findIndex(item => item.seq === seq);
        statusLst[idx].orderItemState = status;
        setStatusList(statusLst);
    }
    const onsubm = () => {
        let requestParam = {
            map: {
                orderItemList: []
            }
        }
        let tmp = [];
        statusList.map(item => {
            orgStatusList.filter(item_ => {
                if(item.seq === item_.seq){
                    if(item.orderItemState !== item_.orderItemState){
                        console.log(item);
                        console.log(item_);
                        tmp.push({
                            seq: item_.seq,
                            orderItemState: item.orderItemState
                        })
                        console.log(tmp);
                        return true;
                    }
                }
            })
        })
        requestParam.map.orderItemList = tmp;
        console.log(requestParam);
        OrderAPI.buyerChangeStatus(requestParam)
            .then((res) => {
                console.log(res);
                if(res.code !== 1000){
                    Message.error("일시적인 서버 오류입니다. 다시 시도해주세요.");
                    return;
                }
                Message.success('주문상태 변경에 성공하였습니다.');
                window.location.reload();
            }).catch((error) => {
            Message.error(error.message);
        });
    }

    const columns = [
        {
            title: '주문일자',
            dataIndex: 'createdDatetime',
            key: 'createdDatetime',
            render: (_, record) => moment(record.createdDatetime).format('YYYY-MM-DD HH:mm:ss')
        },
        {
            title: '상품주문번호',
            dataIndex: 'orderNo',
            key: 'orderNo',
            render: (_, record) =>  orderNo + record.itemSeq
        },
        {
            title: '상품정보',
            dataIndex: 'medicineCode',
            key: 'medicineCode',
            render: (_, record) => {
                return (
                    <div>
                        <Row>
                            <Col>
                                <a href={"/buyer/medicine/detail/"+record.productSeq}>
                                    <Image
                                        preview={false}
                                        width={200}
                                        height={200}
                                        src= {(record.hasOwnProperty('fileList') && record.fileList.length > 0 ? record.fileList[0].fullFilePath : '') || "error"}
                                        fallback="data:image/png;base64,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"
                                    />
                                </a>
                            </Col>
                            <Col>
                                <p>{record.productDisplayName}</p>
                            </Col>
                        </Row>
                    </div>
                )
            },
        },
        {
            title: '수량',
            dataIndex: 'orderQuantity',
            key: 'orderQuantity',
        },
        {
            title: '결제금액',
            dataIndex: 'orderItemAmount',
            key: 'orderItemAmount',
            render: (_, record) => record.orderItemAmount.toLocaleString()
        },
        {
            title: '주문상태',
            dataIndex: '',
            key: '',
            render: (_, record) => {
                let statusOption
                let statusText
                let statusButton
                const initialStatus = record.orderItemState;
                if (initialStatus === 'ORDER_STANDBY') {
                    statusText = "주문 전";
                    statusOption = [
                        <Select.Option value={initialStatus}>{statusText}</Select.Option>
                    ];
                } else if (initialStatus === 'PAY_STANDBY') {
                    statusText = "입금대기";
                    statusOption = [
                        <Select.Option value={initialStatus}>{statusText}</Select.Option>,
                        <Select.Option value={"CANCEL_DONE"}>주문취소</Select.Option>
                    ];
                } else if (initialStatus === 'PAY_DONE') {
                    statusText = "결제완료";
                    statusOption = [
                        <Select.Option value={initialStatus}>{statusText}</Select.Option>,
                        <Select.Option value={"CANCEL_REQUEST"}>취소신청</Select.Option>
                    ];
                } else if (initialStatus === 'SHIPPING') {
                    statusButton = (
                        <Button onClick={e => showModalForShipping(record)}>배송중</Button>
                    );
                    statusText = "배송중";
                    statusOption = [
                        <Select.Option value={initialStatus}>{statusText}</Select.Option>
                    ];
                } else if (initialStatus === 'DELIVERY_COMPLETED') {
                    statusText = "배송완료";
                    statusOption = [
                        <Select.Option value={initialStatus}>{statusText}</Select.Option>,
                        <Select.Option value={"REFUND_REQUEST"}>환불신청</Select.Option>,
                        <Select.Option value={"ORDER_CONFIRM"}>구매확정</Select.Option>
                    ];
                } else if (initialStatus === 'CANCEL_REQUEST') {
                    statusText = "취소신청";
                    statusOption = [
                        <Select.Option value={initialStatus}>{statusText}</Select.Option>
                    ];
                } else if (initialStatus === 'CANCEL_DONE') {
                    statusText = "주문취소완료";
                    statusOption = [
                        <Select.Option value={initialStatus}>{statusText}</Select.Option>
                    ];
                } else if (initialStatus === 'REFUND_REQUEST') {
                    statusText = "환불신청";
                    statusOption = [
                        <Select.Option value={initialStatus}>{statusText}</Select.Option>
                    ];
                } else if (initialStatus === 'REFUND_DONE') {
                    statusText = "환불완료";
                    statusOption = [
                        <Select.Option value={initialStatus}>{statusText}</Select.Option>
                    ];
                } else if (initialStatus === 'ORDER_CONFIRM') {
                    statusText = "구매확정";
                    statusOption = [
                        <Select.Option value={initialStatus}>{statusText}</Select.Option>
                    ];
                } else if (initialStatus === 'PAYMENT_ERROR') {
                    statusText = "결제오류";
                    statusOption = [
                        <Select.Option value={initialStatus}>{statusText}</Select.Option>
                    ];
                } else {
                    statusText = "시스템오류";
                    statusOption = [
                        <Select.Option value={initialStatus}>{statusText}</Select.Option>
                    ];
                }

                return (
                    <div>
                        {
                            initialStatus === "SHIPPING" &&
                            <p>{statusButton}</p>
                        }
                        {
                            initialStatus !== "SHIPPING" &&
                            <p>{statusText}</p>
                        }
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
        }
    ];
    const goOrderList = () => {
        navigate("/buyer/mypage/order/list");
    }

    const showModalForShipping = (record) => {
        console.log(record);
        setDeliveryCompany(record.deliveryCompany);
        setDeliveryNo(record.deliveryNo);
        setIsModalVisible(true);
    }

    const [deliveryCompany, setDeliveryCompany] = useState("");
    const [deliveryNo, setDeliveryNo] = useState("");
    const [isModalVisible, setIsModalVisible] = useState(false);
    const handleCancel = () => {
        setIsModalVisible(false);
    };
    return (
        <div className={"text-left"}>
            <div className='pageTitle'>주문정보</div>
            <div className='ant-descriptions ant-descriptions-small ant-descriptions-bordered spacerBottom'>
                <div className='ant-descriptions-view'>
                    <table>
                        <tr className='ant-descriptions-row'>
                            <th className='ant-descriptions-item-label'>주문일자</th>
                            <td className='ant-descriptions-item-content'>{(detailData.hasOwnProperty('createdDatetime') ? moment(detailData.createdDatetime).format('YYYY-MM-DD HH:mm:ss') : '')} </td>
                            <th className='ant-descriptions-item-label'>주문번호</th>
                            <td className='ant-descriptions-item-content'>{(detailData.hasOwnProperty('orderNo') ? detailData.orderNo : '')}</td>
                        </tr>
                    </table>
                </div>
            </div>

            {
                isResult && (
                    <div className='mypageOrderDetail'>
                        <Table
                            columns={columns}
                            onList={OrderAPI.buyerGet} //의미없는 코드지만, Table Component가 onList를 받아야지만 _onList를 실행시키는 것 같음;
                            isInitLoad={true}
                            innerRef={table}
                            propTotal={_total}
                            propDataList={dataList}
                            showPagination={false}
                        />
                    </div>
                )
            }
            <br/>
            <h3>주문자정보</h3>
            <Descriptions column={0} bordered>
                <Descriptions.Item label={"주문자"}>
                    {(detailData.hasOwnProperty('staffName') ? detailData.staffName : '')}
                </Descriptions.Item>
                <Descriptions.Item label={"이메일"}>
                    {(detailData.hasOwnProperty('staffEmail') ? detailData.staffEmail : '')}
                </Descriptions.Item>
                <Descriptions.Item label={"연락처"}>
                    {(detailData.hasOwnProperty('staffPhoneNo') ? detailData.staffPhoneNo : '')}
                </Descriptions.Item>
            </Descriptions>
            <br/>
            <h3>배송지정보</h3>
            <Descriptions column={0} bordered>
                <Descriptions.Item label={"명"}>
                    {(detailData.hasOwnProperty('corpName') ? detailData.corpName : '')}
                </Descriptions.Item>
                <Descriptions.Item label={"대표번호"}>
                    {(detailData.hasOwnProperty('corpTelNo') ? detailData.corpTelNo : '')}
                </Descriptions.Item>
                <Descriptions.Item label={"주소"}>
                    {(detailData.hasOwnProperty('shippingAddressPostNo') ? detailData.shippingAddressPostNo : '')}&nbsp;
                    {(detailData.hasOwnProperty('shippingAddress') ? detailData.shippingAddress : '')}&nbsp;
                    {(detailData.hasOwnProperty('shippingAddressDetail') ? detailData.shippingAddressDetail : '')}
                </Descriptions.Item>
                <Descriptions.Item label={"배송요청사항"}>
                    {(detailData.hasOwnProperty('orderMemo') ? detailData.orderMemo : '')}
                </Descriptions.Item>
            </Descriptions>
            <br/>
            <h3>결제정보</h3>
            <Descriptions column={2} bordered>
                <Descriptions.Item label={"상품금액"}>
                    {dataList.reduce((acc, val) => acc + val.orderItemAmount, 0).toLocaleString()} 원
                </Descriptions.Item>
                <Descriptions.Item label={"결제방법"}>
                    {paymentMethod}
                </Descriptions.Item>
                <Descriptions.Item label={"할인금액"}>
                    {(detailData.hasOwnProperty('usePoint') ? detailData.usePoint.toLocaleString() : 0)} 포인트
                </Descriptions.Item>
                <Descriptions.Item label={"결제금액"}>
                    <h3 style={{color: "#1F6FBF", margin:"0px"}}>
                        {(Number(dataList.reduce((acc, val) => acc + val.orderItemAmount, 0)) - Number((detailData.hasOwnProperty('usePoint') ? detailData.usePoint : 0))).toLocaleString()} 원
                    </h3>
                </Descriptions.Item>
                <Descriptions.Item label={"적립포인트"}>
                    {dataList.reduce((acc, val) => acc + val.pointSave, 0).toLocaleString()} 포인트
                </Descriptions.Item>
            </Descriptions>

            <br/>

            <p className={"table-center textCenter"}>
                <Button onClick={goOrderList} className="btn-color02-2 btn-huge" style={{width:"300px"}}>목록으로</Button>
                <Button type="primary" onClick={onsubm} className="btn-color02 btn-huge"  style={{width:"300px"}}>저장</Button>
            </p>

            <Modal title="배송정보" visible={isModalVisible} onOk={handleCancel} onCancel={handleCancel}>
                <Descriptions title="배송정보" size={'small'} column={4} bordered>
                    <Descriptions.Item label={"택배사"} span={2}>
                        {deliveryCompany}
                    </Descriptions.Item>
                    <Descriptions.Item label={"택배번호"} span={2}>
                        {deliveryNo}
                    </Descriptions.Item>
                </Descriptions>
            </Modal>

        </div>
    );
};

export default BuyerOrderDetail;