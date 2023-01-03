import React, {useRef, useState} from 'react';
import 'antd/dist/antd.css';
import {Col, Form, Image, Row, Select} from 'antd';
import {Link, useNavigate} from "react-router-dom";
import * as AdminBoardAPI from "../../admin/api/AdminBoard";
import './BuyerAdminBoardList.css';
import moment from "moment";
import {Table} from "../../component";
import * as CommonJs from "../../lib/Common";

const BuyerAdminBoardList = function () {
    const table = useRef();
    const navigate = useNavigate();

    const columns = [
        {
            title: '번호',
            dataIndex: 'seq',
            key: 'seq',
            render: (text, record, index) => {
                console.log(record);
                return record.rownum
            },

        },
        {
            title: '제목',
            dataIndex: 'title',
            key: 'title',
            render: (_, record) => <Link to={'/buyer/board/detail/' + record.seq}>{record.title}</Link>,
        },
        {
            title: '생성일자',
            dataIndex: 'createdDatetime',
            key: 'createdDatetime',
            render: (_, record) => moment(record.createdDatetime).format('YYYY-MM-DD HH:mm:ss')
        }
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
                    "value":"title",
                    "name":"제목"
                },
                {
                    "value":"content",
                    "name":"내용"
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
        navigate('/buyer/board/list' + param);
        table.current['onSubmit']();
    }

    return (
        <div className={"text-left"}>
            <div className='pageTitle'>공지사항</div>
            <div className='pageSubtitle'>관리자 공지사항을 확인하실 수 있습니다.</div>
            <div className='noticeList'>
                <Table
                    columns={columns}
                    filters={filters}
                    onSearch={onSearch}
                    isInitLoad={true}
                    onList={AdminBoardAPI.buyerList}
                    innerRef={table}
                />
            </div>
        </div>
    );
};

export default BuyerAdminBoardList;