import React, {useEffect, useRef, useState} from 'react';
import {Link, useNavigate} from "react-router-dom";

import AdminPageHeader from "../../AdminPageHeader";
import {Message, Table} from "../../../component";
import * as BuyerAPI from "../../api/Buyer";
import * as CommonJs from "../../../lib/Common";

import './BuyerList.css';
import moment from "moment";

const BuyerList = function () {
    const urlPrefix = '/admin/buyer';
    const navigate = useNavigate();
    const table = useRef();
    const [totalBuyer, setTotalBuyer] = useState(0);
    const columns = [
        {
            title: '번호',
            dataIndex: ''/*'buyerIdentificationCode'*/,
            key: ''/*'buyerIdentificationCode'*/,
            render: (text, record, index) => {
                return <Link to={'/admin/buyer/detail/' + record.seq} state={{
                    buyerId: record.buyer.seq
                }}>{record.rownum}</Link>
            },

        },
        {
            title: '유저구분',
            render: (_, record) => (record.buyer['buyerType'] !== "W" ?
                (record.buyer['buyerType'] !== "M" ?
                    (record.buyer['buyerType'] !== "P" ?
                        ""
                        : "")
                    : "")
                : "")
        },
        {
            title: 'ID',
            dataIndex: 'buyerIdentificationId',
            key: 'buyerIdentificationId',
        },
        {
            title: '명',
            render: (_, record) => record.buyer.corpName
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
                    "name":"ID",
                    // render: (_, record) => <Link to={'/admin/buyer/detail/' + record.seq}>{record.buyerIdentificationId}</Link>,
                },
                {
                    "value":"corpName",
                    "name":"명"
                },
                {
                    "value":"staffName",
                    "name":"담당자"
                },
                {
                    "value":"buyerState",
                    "name":"계정상태"
                }
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

    useEffect(() => {
        BuyerAPI.list({
            pageNo: 1,
            len: 2147483647
        })
            .then((response) => {
                const res = response.data;
                const total = res.totalElements || 0;
                console.log(response);
                setTotalBuyer(total);
            })
            .catch((error) => {
                Message.error(error.message);
            })
    }, [])

    return (
        <div className="buyer-list-layout">
            <AdminPageHeader title={"유저관리"} subTitle={"유저 목록입니다."}/>
            <p style={{float:"left"}}>총 회원 수 : {totalBuyer}명</p>
            <Table
                columns={columns}
                filters={filters}
                onSearch={onSearch}
                isInitLoad={true}
                onList={BuyerAPI.list}
                innerRef={table}
            />
        </div>
    );
};

export default BuyerList;
