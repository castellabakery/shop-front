import React, {useEffect, useRef, useState} from 'react';
import './OrderList.css';
import AdminPageHeader from "../../AdminPageHeader";

import * as OrderAPI from "../../api/Order";
import {Message, Table} from "../../../component";
import * as CommonJs from "../../../lib/Common";
import {Link, useNavigate} from "react-router-dom";
import moment from "moment";
import {Button, Select} from "antd";
import {excel} from "../../api/Order";

const OrderStatistics = function (props) {
    const urlPrefix = '/admin/order/statistics';
    const navigate = useNavigate();
    const table = useRef();
    const columns = [
        {
            title: '번호',
            dataIndex: 'seq',
            key: 'seq',
            render: (text, record, index) => {
                return record.rownum
            }
        },
        {
            title: '결제수단',
            dataIndex: 'paymentMethod',
            key: 'paymentMethod',
            render: (_, record) => {
                if(record.paymentMethod === "CC"){
                    return "카드결제";
                } else if(record.paymentMethod === "PT") {
                    return "전액포인트";
                } else {
                    return record.paymentMethod;
                }
            }
        },
        {
            title: '주문번호',
            dataIndex: 'orderNo',
            key: 'orderNo',
            render: (_, record) => <Link to={'/admin/order/detail/' + record.seq}>{record.orderNo}</Link>,
        },
        {
            title: '구매내역',
            dataIndex: 'orderName',
            key: 'orderName',
        },
        {
            title: '전체결제금액',
            dataIndex: 'amount',
            key: 'amount',
            render: (_, record) => record.amount.toLocaleString() + " 원"
        },
        {
            title: '전체취소금액',
            dataIndex: 'totalAmount',
            key: 'totalAmount',
            render: (_, record) => (Number(record.cancelAmount) + Number(record.cancelPoint)).toLocaleString() + " 원"
        },
        {
            title: '결제금액',
            dataIndex: 'approveAmount',
            key: 'approveAmount',
            render: (_, record) => record.approveAmount.toLocaleString() + " 원"
        },
        {
            title: '취소금액',
            dataIndex: 'cancelAmount',
            key: 'cancelAmount',
            render: (_, record) => record.cancelAmount.toLocaleString() + " 원"
        },
        {
            title: '사용포인트',
            dataIndex: 'usePoint',
            key: 'usePoint',
            render: (_, record) => record.usePoint.toLocaleString() + " 원"
        },
        {
            title: '취소포인트',
            dataIndex: 'cancelPoint',
            key: 'cancelPoint',
            render: (_, record) => record.cancelPoint.toLocaleString() + " 원"
        },
        {
            title: '결제일시',
            dataIndex: 'createdDatetime',
            key: 'createdDatetime',
            render: (_, record) => moment(record.createdDatetime).format('YYYY-MM-DD HH:mm:ss')
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
            key: "searchConditionSelect",
            name: "검색",
            type: "select",
            defaultValue: "CC",
            options: [
                {
                    "value": "",
                    "name": "전체"
                },
                {
                    "value": "CC",
                    "name": "카드결제"
                },
                {
                    "value": "PT",
                    "name": "전액포인트"
                },
            ]
        },
    ];
    const onSearch = (params) => {
        let param = CommonJs.jsonToQueryString(params);
        navigate(urlPrefix + param);
        table.current['onSubmit']();
    }

    return (
        <div className="buyer-list-layout">
            <AdminPageHeader title={"매출조회"} subTitle={""}/>
            <Table
                columns={columns}
                filters={filters}
                onSearch={onSearch}
                isInitLoad={true}
                onList={OrderAPI.statisticsList}
                innerRef={table}
                showDateButton={true}
                showStatistics={true}
                statistics={OrderAPI.statisticsSummary}
            />

        </div>
    );
};

export default OrderStatistics;
