import React, {useRef} from 'react';
import './PointList.css';

import {Table} from "../../../component";
import * as CommonJs from "../../../lib/Common";
import {useNavigate} from "react-router-dom";

import * as PointAPI from "../../../admin/api/Point";

import moment from 'moment';

const PointList = function () {
    const urlPrefix = '/buyer/mypage/point';
    const navigate = useNavigate();
    const table = useRef();

    const columns = [
        {
          title:'번호',
          dataIndex: 'rownum',
          key: 'rownum'
        },
        {
            title: '지급상태',
            dataIndex: 'pointState',
            key: 'pointState',
            render: (_, record) => {
                if(record.pointState === "SAVE_EXPECT"){
                    return "적립예정";
                } else if(record.pointState === "CANCEL_EXPECT") {
                    return "적립예정취소";
                } else if(record.pointState === "SAVE_POINT") {
                   return "적립";
                } else if(record.pointState === "USE_POINT") {
                   return "사용";
                } else if(record.pointState === "USE_CANCEL") {
                    return "사용취소";
                } else {
                    return record.pointState;
                }
            }
        },
        {
            title: '날짜',
            dataIndex: 'createdDatetime',
            key: 'createdDatetime',
            render: (_, record) => moment(record.createdDatetime).format('YYYY-MM-DD HH:mm:ss')
        },
        {
            title: '주문번호',
            dataIndex: 'orderNo',
            key: 'orderNo',
        },
        {
            title: '주문내역',
            dataIndex: 'content',
            key: 'content',
        },
        {
            title: '결제금액',
            dataIndex: 'payAmount',
            key: 'payAmount',
        },
        {
            title: '포인트',
            dataIndex: '',
            key: '',
            render: (_, record) => {
                let pm = "";
                if(Number(record.applyPoint) >= 0) {
                    pm = "+";
                }
                return pm + record.applyPoint;
            }
        }
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
            options: [
                {
                    "value": "",
                    "name": "전체"
                },
                {
                    "value": "SAVE_EXPECT",
                    "name": "적립예정"
                },
                {
                    "value": "CANCEL_EXPECT",
                    "name": "적립예정취소"
                },
                {
                    "value": "SAVE_POINT",
                    "name": "적립"
                },
                {
                    "value": "USE_POINT",
                    "name": "사용"
                },
                {
                    "value": "USE_CANCEL",
                    "name": "사용취소"
                }
            ]
        },
    ];
    const onSearch = (params) => {
        let param = CommonJs.jsonToQueryString(params);
        navigate(urlPrefix + "/list" + param);
        table.current['onSubmit']();
    };

    return (
        <div className="point-list-layout">
            <p style={{textAlign:"initial"}}><h2>포인트</h2></p>
            <Table
                columns={columns}
                filters={filters}
                onSearch={onSearch}
                isInitLoad={true}
                onList={PointAPI.getPointListForBuyer}
                innerRef={table}
                showDateButton={true}
            />
        </div>
    );
};

export default PointList;
