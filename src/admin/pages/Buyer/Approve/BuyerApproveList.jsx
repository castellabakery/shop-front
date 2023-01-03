import React, {useRef} from 'react';
import {Link, useNavigate} from "react-router-dom";

import './BuyerApproveList.css';

import AdminPageHeader from "../../../AdminPageHeader";
import {Table} from "../../../../component";
import * as CommonJs from "../../../../lib/Common";

import * as BuyerAPI from "../../../api/Buyer";
import moment from "moment";

const BuyerApproveList = function () {
    const urlPrefix = '/admin/approve';
    const navigate = useNavigate();
    const table = useRef();
    const columns = [
        {
            title: '번호',
            dataIndex: 'rownum',
            key: 'rownum',
            render: (_, record) => <Link to={urlPrefix+'/detail/' + record.seq}>{record.rownum}</Link>,
        },
        {
            title: '유저구분',
            render: (_, record) => record.hasOwnProperty('buyerType') ?
                (record.buyerType !== "W" ?
                    (record.buyerType !== "M" ?
                        (record.buyerType !== "P" ?
                            ""
                            : "")
                        : "")
                    : "")
                : ''
        },
        {
            title: 'ID',
            dataIndex: 'buyerIdentificationId',
            key: 'buyerIdentificationId',
        },
        {
            title: '명',
            render: (_, record) => record.corpName
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
            title: '가입일자',
            dataIndex: 'createdDatetime',
            key: 'createdDatetime',
            render: (_, record) => moment(record.createdDatetime).format('YYYY-MM-DD HH:mm:ss')
        },
        {
            title: '계정상태',
            dataIndex: 'state',
            key: 'state',
            render: (_, record) => (record['state'] !== "R" ?
                (record['state'] !== "W" ?
                    (record['state'] !== "D" ?
                        (record['state'] !== "J" ?
                            (record['state'] !== "S" ?
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
            key: "searchConditionSelect",
            name: "",
            type: "select",
            options:[
                {
                    "value":"",
                    "name":"전체"
                },
                {
                    "value":"buyerType",
                    "name":"유저구분"
                },
                {
                    "value":"buyerIdentificationId",
                    "name":"ID"
                },
                {
                    "value":"corpName",
                    "name":"명"
                },
            ]
        },
        {
            key: "searchConditionText",
            name: "",
            type: "text",
        }
    ];
    const onSearch = (params) => {
        let param = CommonJs.jsonToQueryString(params);
        navigate(urlPrefix + '/list' + param);
        table.current['onSubmit']();
    }
    return (
        <div className="buyer-list-layout">
            <AdminPageHeader title={"승인관리"} subTitle={"승인관리-목록"}/>
            <Table
                columns={columns}
                filters={filters}
                onSearch={onSearch}
                isInitLoad={true}
                onList={BuyerAPI.tmpList}
                innerRef={table}
            />
        </div>
    );
};

export default BuyerApproveList;
