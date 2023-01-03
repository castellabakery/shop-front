import React, {useEffect, useRef, useState} from 'react';
import './OrderList.css';
import AdminPageHeader from "../../AdminPageHeader";

import * as OrderAPI from "../../api/Order";
import {Message, Table} from "../../../component";
import * as CommonJs from "../../../lib/Common";
import {Link, useNavigate} from "react-router-dom";
import moment from "moment";
import {Select} from "antd";
import * as BuyerAPI from "../../api/Buyer";

const OrderList = function (props) {
    const buyerId = props.detailId;
    const urlPrefix = (props.type === "buyer" ? "/admin/buyer/detail/"+buyerId : '/admin/order/list');
    const showTotalOrder = (props.showTotalOrder !== undefined && props.showTotalOrder !== null ? props.showTotalOrder : false);
    const navigate = useNavigate();
    const table = useRef();
    const [totalPoint, setTotalPoint] = useState(0);
    const [total, setTotal] = useState(0);
    const columns = [
        {
            title: '번호',
            dataIndex: 'seq',
            key: 'seq',
            render: (text, record, index) => {
                return record.rownum
            },

        },
        {
            title: '상품주문번호',
            dataIndex: 'orderNo',
            key: 'orderNo',
            render: (_, record) => <Link to={'/admin/order/detail/' + record.orderInfo.seq}>{record.orderInfo.orderNo + record.itemSeq}</Link>,
        },
        {
            title: '주문상태',
            dataIndex: 'orderItemState',
            key: 'orderItemState',
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
                } else if (initialStatus === 'ORDER_ERROR') {
                    statusText = "주문오류";
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
                    </div>
                )
            }
        },
        {
            title: '일자',
            dataIndex: 'createdDatetime',
            key: 'createdDatetime',
            render: (_, record) => moment(record.createdDatetime).format('YYYY-MM-DD HH:mm:ss')
        },
        {
            title: 'ID',
            dataIndex: 'orderInfo.staffId',
            key: 'orderInfo.staffId',
            render: (_, record) => record.orderInfo.staffId
        },
        {
            title: '명',
            dataIndex: 'corpName',
            key: 'corpName',
            render: (_, record) => record.orderInfo.corpName
        },
        {
            title: '주문자',
            dataIndex: 'staffName',
            key: 'staffName',
            render: (_, record) => record.orderInfo.staffName
        },
        {
            title: '주문내역',
            dataIndex: 'productDisplayName',
            key: 'productDisplayName',
        },
        {
            title: '결제금액',
            // dataIndex: 'orderItemAmount',
            // key: 'orderItemAmount',
            dataIndex: 'orderinfo.amount',
            key: 'orderinfo.amount',
            render: (_, record) => record.orderInfo.amount.toLocaleString()
        },
        {
            title: '포인트',
            dataIndex: 'pointSave',
            key: 'pointSave',
            render: (_, record) => record.pointSave.toLocaleString()
        },
        {
            title: '결제수단',
            dataIndex: 'paymentMethod',
            key: 'paymentMethod',
            render: (_, record) => {
                if(record.orderInfo.paymentMethod === "CC"){
                    return "카드결제";
                } else if(record.orderInfo.paymentMethod === "PT") {
                    return "전액포인트";
                } else {
                    return record.orderInfo.paymentMethod;
                }
            }
        },
    ];
    const filters = [
        {
            key: "searchConditionDate",
            name: "주문기간",
            type: "date",
            defaultValue: [moment(new Date(), "YYYY-MM-DD").subtract(1, "weeks"), moment(new Date(), "YYYY-MM-DD")]
        },
        {
            key: "searchConditionSelect2",
            name: "검색",
            type: "select",
            defaultValue: "",
            options: [
                {
                    "value": "",
                    "name": "전체"
                },
                {
                    "value": "buyerIdentificationId",
                    "name": "ID"
                },
                {
                    "value": "staffName",
                    "name": "주문자"
                },
                {
                    "value": "orderState",
                    "name": "주문상태"
                }
            ]
        },
        {
            key: "searchConditionText",
            name: "",
            type: "text",
        },
        {
            key: "buyerIdentificationSeq",
            name: "buyerIdentificationSeq",
            type: "hidden",
            defaultValue: buyerId
        }
    ];
    const onSearch = (params) => {
        let param = CommonJs.jsonToQueryString(params);
        navigate(urlPrefix + param);
        table.current['onSubmit']();
    }

    useEffect(() => {
        if(showTotalOrder){
            OrderAPI.list({
                pageNo: 1,
                len: 2147483647,
                buyerIdentificationSeq: buyerId
            })
                .then((response) => {
                    const res = response.data;
                    const total = res.totalElements || 0;
                    const list = res.content || [];
                    console.log(response);
                    const point = list.reduce((acc, val) => acc + val.pointSave, 0)
                    setTotal(total);
                    setTotalPoint(point);
                })
                .catch((error) => {
                    Message.error(error.message);
                })
        }
    }, [])

    return (
        <div className="buyer-list-layout">
            <AdminPageHeader title={"주문내역"} subTitle={""}/>
            {
                showTotalOrder &&
                    <p style={{float:"left"}}>총 {total}건&nbsp;&nbsp;{totalPoint}p</p>
            }
            <Table
                columns={columns}
                filters={filters}
                onSearch={onSearch}
                isInitLoad={true}
                onList={OrderAPI.list}
                innerRef={table}
                showDateButton={true}
                // showTotalOrder={showTotalOrder}
            />

        </div>
    );
};

export default OrderList;
