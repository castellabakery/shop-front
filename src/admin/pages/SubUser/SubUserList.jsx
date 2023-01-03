import React, {useRef} from 'react';
import {useLocation, useNavigate} from "react-router-dom";

import './SubUserList.css';

import AdminPageHeader from "../../AdminPageHeader";
import {Table} from "../../../component";

import * as BuyerAPI from "../../api/Buyer";
import moment from "moment";

const SubUserList = function (props) {
    const urlPrefix = '/admin/buyer';
    const urlNow = (props.urlNow !== undefined && props.urlNow !== null ? props.urlNow : '/subuser/list');
    const location = useLocation();
    const navigate = useNavigate();
    const id = Number(props.detailId !== undefined && props.detailId !== null ? props.detailId : '');
    console.log(id);
    const buyerId = Number(props.buyerId !== undefined && props.buyerId !== null ? props.buyerId : '');
    console.log(buyerId);
    const table = useRef();
    const columns = [
        {
            title: '번호',
            dataIndex: 'seq',
            key: 'seq',
        },
        {
            title: 'ID',
            dataIndex: 'buyerIdentificationId',
            key: 'buyerIdentificationId',
        },
        {
            title: '담당자',
            dataIndex: 'staffName',
            key: 'staffName',
        },
        {
            title: '이메일',
            dataIndex: 'staffEmail',
            key: 'staffEmail',
        },
        {
            title: '생성일자',
            dataIndex: 'createdDatetime',
            key: 'createdDatetime',
            render: (_, record) => moment(record.createdDatetime).format('YYYY-MM-DD HH:mm:ss')
        },
        {
            title: '계정상태',
            dataIndex: 'buyerIdentificationState',
            key: 'buyerIdentificationState',
            render: (_, record) => (record['buyerIdentificationState'] !== "R" ?
                (record['buyerIdentificationState'] !== "W" ?
                    (record['buyerIdentificationState'] !== "D" ?
                        (record['buyerIdentificationState'] !== "J" ?
                            (record['buyerIdentificationState'] !== "S" ?
                                ""
                                : "정지")
                            : "반려")
                        : "승인완료")
                    : "수정승인대기")
                : "가입승인대기")
        },
    ];

    const filters = [
        {
            key: "id",
            name: "",
            type: "hidden",
            defaultValue: buyerId
        }
    ];

    return (
        <div className="buyer-list-layout">
            <AdminPageHeader title={"부계정관리"} subTitle={""}/>
            <Table
                columns={columns}
                filters={filters}
                isInitLoad={true}
                onList={BuyerAPI.subList}
                innerRef={table}
            />
        </div>
    );
};

export default SubUserList;
