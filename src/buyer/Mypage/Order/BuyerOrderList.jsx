import React, {useRef, useState} from 'react';
import 'antd/dist/antd.css';
import {Col, Form, Image, Row, Select} from 'antd';
import {Link, useNavigate} from "react-router-dom";
import {Message, Table} from "../../../component";
import * as OrderAPI from "../../../admin/api/Order";
import './BuyerOrderList.css';
import * as CommonJs from "../../../lib/Common";
import moment from "moment";

const BuyerOrderList = function () {
    const table = useRef();
    const navigate = useNavigate();

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
            render: (_, record) => <Link to={"/buyer/mypage/order/detail/" + record.orderInfo.seq}>{record.orderInfo.orderNo + record.itemSeq}</Link>
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
                                {/*<a href={"/buyer/medicine/detail/"+record.productSeq}>*/}
                                    <Image
                                        preview={false}
                                        width={200}
                                        height={200}
                                        src= {(record.hasOwnProperty('fileList') && record.fileList.length > 0 ? record.fileList[0].fullFilePath : '') || "error"}
                                        fallback="data:image/png;base64,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"
                                    />
                                {/*</a>*/}
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
                    statusText = "배송중";
                    statusOption = [
                        <Select.Option value={initialStatus}>{statusText}</Select.Option>
                    ];
                } else if (initialStatus === 'DELIVERY_COMPLETED') {
                    statusText = "배송완료";
                    statusOption = [
                        <Select.Option value={initialStatus}>{statusText}</Select.Option>,
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
                        <p>{statusText}</p>
                        {/*<Form.Item*/}
                        {/*    name="orderStatus"*/}
                        {/*    required={true}*/}
                        {/*    initialValue={initialStatus}*/}
                        {/*>*/}
                        {/*    <Select*/}
                        {/*        onChange={e => {*/}
                        {/*            changeStatus(e, record.seq);*/}
                        {/*        }}*/}
                        {/*        style={{*/}
                        {/*            width: 120,*/}
                        {/*        }}*/}
                        {/*        defaultValue={initialStatus}>*/}
                        {/*        {statusOption.map(item => {return item;})}*/}
                        {/*    </Select>*/}
                        {/*</Form.Item>*/}
                    </div>
                )
            }
        },
    ];
    const filters = [
        {
            key: "searchConditionDate",
            name: "주문기간",
            type: "date"
        },
        {
            key: "searchConditionSelect",
            name: "검색",
            type: "select",
            options: [
                {
                    "value": "",
                    "name": "주문상태"
                },
                {
                    "value": "PAY_STANDBY",
                    "name": "입금대기"
                },
                {
                    "value": "PAY_DONE",
                    "name": "결제완료"
                },
                {
                    "value": "SHIPPING",
                    "name": "배송중"
                },
                {
                    "value": "DELIVERY_COMPLETED",
                    "name": "배송완료"
                },
                {
                    "value": "ORDER_CONFIRM",
                    "name": "구매확정"
                },
                {
                    "value": "CANCEL_REQUEST, CANCEL_DONE, REFUND_DONE, REFUND_REQUEST",
                    "name": "취소/환불"
                }
            ]
        }
    ];
    const onSearch = (params) => {
        let param = CommonJs.jsonToQueryString(params);
        navigate('/buyer/mypage/order/list' + param);
        table.current['onSubmit']();
    }

    return (
        <div className={"text-left"}>
            <div className='pageTitle'>주문정보</div>
            <div className='pageSubtitle'>고객님의 주문정보를 확인하실 수 있습니다.</div>
            <Table className='mypageOrderList' 
                columns={columns}
                filters={filters}
                onSearch={onSearch}
                isInitLoad={true}
                onList={OrderAPI.buyerList}
                innerRef={table}
                showDateButton={true}
            />
        </div>
    );
};

export default BuyerOrderList;