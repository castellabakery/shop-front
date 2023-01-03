import React, {useCallback, useRef} from 'react';
import './AdminBoardList.css';
import AdminPageHeader from "../../AdminPageHeader";

import * as AdminBoardAPI from "../../api/AdminBoard";
import {Message, Table} from "../../../component";
import * as CommonJs from "../../../lib/Common";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {PlusCircleOutlined} from "@ant-design/icons";
import moment from "moment/moment";

const AdminBoardList = function (props) {
    const urlPrefix = '/admin/board';
    const location = useLocation();
    const navigate = useNavigate();
    const table = useRef();

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
            render: (_, record) => <Link to={'/admin/board/detail/' + record.seq}>{record.title}</Link>,
        },
        {
            title: '노출여부',
            dataIndex: 'displayYn',
            key: 'displayYn',
            render: (_, record) => (record.displayYn == "Y" ? "노출" : "미노출")
        },
        {
            title: '생성일자',
            dataIndex: 'createdDatetime',
            key: 'createdDatetime',
            render: (_, record) => moment(record.createdDatetime).format('YYYY-MM-DD HH:mm:ss')
        },
        {
            title: '수정일자',
            dataIndex: 'modifiedDatetime',
            key: 'modifiedDatetime',
            render: (_, record) => moment(record.modifiedDatetime).format('YYYY-MM-DD HH:mm:ss')
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
        navigate(urlPrefix + '/list' + param);
        table.current['onSubmit']();
    }
    const onClickAddButton = useCallback(() => {
        navigate(urlPrefix + "/add" + location.search);
    }, [props]);
    const buttons = [
        {
            type: 'primary',
            disabled: false,
            name: '등록',
            icon: <PlusCircleOutlined/>,
            onClick: onClickAddButton,
        },
    ];

    return (
        <div className="buyer-list-layout">
            <AdminPageHeader title={"공지사항 관리"} subTitle={"공지사항-목록"}/>
            <Table
                buttons={buttons}
                columns={columns}
                filters={filters}
                onSearch={onSearch}
                isInitLoad={true}
                onList={AdminBoardAPI.list}
                innerRef={table}
            />
        </div>
    );
};

export default AdminBoardList;
