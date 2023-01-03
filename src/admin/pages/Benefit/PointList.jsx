import React, {useRef, useEffect, useState} from 'react';
import './PointList.css';
import AdminPageHeader from "../../AdminPageHeader";

import {Message, Table} from "../../../component";
import * as CommonJs from "../../../lib/Common";
import {Link, useNavigate} from "react-router-dom";

import {Descriptions} from 'antd';
import * as PointAPI from "../../api/Point";

import moment from 'moment';

const PointList = function () {
    const urlPrefix = '/admin/point';
    const navigate = useNavigate();
    const table = useRef();
    const [allSavePoint, setAllSavePoint] = useState(0);
    const [allSaveExpectPoint, setAllSaveExpectPoint] = useState(0);
    const [allUsePoint, setAllUsePoint] = useState(0);

    // useEffect(() => {
    //     PointAPI.getPointHeader()
    //         .then(res => {
    //             console.log(res);
    //             const list = res.data;
    //             setAllSavePoint(list.reduce((acc, val) => acc + val.savePoint, 0));
    //             setAllSaveExpectPoint(list.reduce((acc, val) => acc + val.saveExpectPoint, 0));
    //             setAllUsePoint(list.reduce((acc, val) => acc + val.usePoint, 0));
    //
    //         })
    //         .catch(err => {
    //             Message.error("일시적인 오류입니다. 다시 시도해주세요. - " + err);
    //         })
    // }, [])

    const columns = [
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
            title: '주문번호',
            dataIndex: 'orderNo',
            key: 'orderNo',
            render: (_, record) => {
                console.log(record);
                return <Link to={'/admin/order/detail/' + record.orderItemDto.orderInfo.seq}>{record.orderNo}</Link>
            }
        },
        {
            title: 'ID',
            dataIndex: '',
            key: '',
            render: (_, record) => record.orderItemDto.orderInfo.staffId
        },
        {
            title: '명',
            dataIndex: '',
            key: '',
            render: (_, record) => record.orderItemDto.orderInfo.corpName
        },
        {
            title: '주문내역',
            dataIndex: 'content',
            key: 'content',
        },
        {
            title: '결제금액',
            dataIndex: '',
            key: '',
            render: (_, record) => record.orderItemDto.orderInfo.amount.toLocaleString()
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
                return pm + record.applyPoint.toLocaleString();
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
                    "value": "pointState",
                    "name": "지급상태"
                },
                {
                    "value": "buyerIdentificationId",
                    "name": "ID"
                },
                {
                    "value": "orderNo",
                    "name": "주문번호"
                },
                {
                    "value": "productDisplayName",
                    "name": "주문내역"
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
        navigate(urlPrefix + "/list" + param);
        table.current['onSubmit']();
    };

    return (
        <div className="point-list-layout">
            <AdminPageHeader title={"혜택관리 |"} subTitle={"포인트관리"}/>
            {/*<div>*/}
            {/*    <Descriptions layout={"vertical"} column={4} bordered>*/}
            {/*        <Descriptions.Item label={"전체 가용포인트"}>*/}
            {/*            {allSavePoint + allSaveExpectPoint + allUsePoint}*/}
            {/*        </Descriptions.Item>*/}
            {/*        <Descriptions.Item label={"적립포인트"}>*/}
            {/*            {allSavePoint}*/}
            {/*        </Descriptions.Item>*/}
            {/*        <Descriptions.Item label={"적립예정포인트"}>*/}
            {/*            {allSaveExpectPoint}*/}
            {/*        </Descriptions.Item>*/}
            {/*        <Descriptions.Item label={"사용포인트"}>*/}
            {/*            {allUsePoint}*/}
            {/*        </Descriptions.Item>*/}
            {/*    </Descriptions>*/}
            {/*</div>*/}
            {/*<br/>*/}
            {/*<br/>*/}
            <Table
                columns={columns}
                filters={filters}
                onSearch={onSearch}
                isInitLoad={true}
                onList={PointAPI.getPointList}
                innerRef={table}
                showDateButton={true}
            />
        </div>
    );
};

export default PointList;
