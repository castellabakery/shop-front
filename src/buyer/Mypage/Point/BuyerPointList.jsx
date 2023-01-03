import React, {useEffect, useRef, useState} from 'react';
import 'antd/dist/antd.css';
import {Card, Form, Layout, Steps} from 'antd';
import {useNavigate} from "react-router-dom";
import {Message, Table} from "../../../component";
import * as MedicineAPI from "../../../admin/api/Medicine";
import './BuyerPointList.css';
import * as CommonJs from "../../../lib/Common";

const {Content} = Layout;
const {Step} = Steps;
const {Meta} = Card;

const BuyerPointList = function () {
    const table = useRef();
    const [isResult, setIsResult] = useState(false);
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const total = 0;
    const len = 10;
    const pageNo = 1;
    const [_total, setTotal] = useState(total);
    const [dataList, setDataList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [_pageNo, setPageNo] = useState(pageNo);
    const [_len, setLen] = useState(len);

    const onChange = (record) => {
        console.log(record);
    }
    const _onList = () => {
        const values = "";
        MedicineAPI.buyerList(values)
            .then((response) => {
                let res = response.data;
                const total = res.totalElements || 0;
                const list = res.content || [];
                if (total !== 0) {
                    setTotal(total);
                    setDataList(list);
                    setIsResult(true);
                }
            })
            .catch((error) => {
                Message.error(error.message);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }
    useEffect(() => {
        _onList();
    }, [setDataList]);

    const columns = [
        {
            title: '번호',
            dataIndex: 'checkbox',
            key: 'checkbox',
            render: (_, record) => record.key,
        },
        {
            title: '지급상태',
            dataIndex: 'medicineCode',
            key: 'medicineCode',
            render: (_, record) => record.status
        },
        {
            title: '날짜',
            dataIndex: 'medicineCode',
            key: 'medicineCode',
            render: (_, record) => "YYYY-MM-DD",
        },
        {
            title: '상품주문번호',
            dataIndex: 'medicineCode',
            key: 'medicineCode',
            render: (_, record) => "YYMMDDhhssdd0000"
        },
        {
            title: '상품명',
            dataIndex: 'medicineCode',
            key: 'medicineCode',
            render: (_, record) => record.제조사
        },
        {
            title: '결제금액',
            dataIndex: 'medicineCode',
            key: 'medicineCode',
            render: (_, record) => record.가격
        },
        {
            title: '포인트',
            dataIndex: 'medicineCode',
            key: 'medicineCode',
            render: (_, record) => record.포인트
        }
    ];
    const filters = [
        {
            key: "searchConditionDate",
            name: "조회기간",
            type: "date"
        },
        {
            key: "searchConditionSelect",
            name: "검색",
            type: "select",
            options: [
                {
                    "value": "all",
                    "name": "지급상태"
                },
                {
                    "value": "orderState",
                    "name": "적립예정"
                },
                {
                    "value": "buyerIdentificationId",
                    "name": "예정취소"
                },
                {
                    "value": "corpName",
                    "name": "적립"
                },
                {
                    "value": "staffName",
                    "name": "사용"
                },
                {
                    "value": "staffName",
                    "name": "사용취소"
                }
            ]
        }
    ];

    const onSearch = (params) => {
        let param = CommonJs.jsonToQueryString(params);
        navigate('/buyer/mypage/point/list');
        table.current['onSubmit']();
    }
    const buttons = [];

    return (
        <div className={"text-left"}>
            <h1>나의 포인트</h1>
            <p>고객님의 포인트정보를 확인하실 수 있습니다.</p>
            {
                isResult && (
                    <Table
                        buttons={buttons}
                        columns={columns}
                        filters={filters}
                        onSearch={onSearch}
                        isInitLoad={true}
                        onList={MedicineAPI.buyerList}
                        innerRef={table}
                        propTotal={_total}
                        propDataList={dataList}
                        showDateButton={true}
                    />
                )
            }

        </div>
    );
};

export default BuyerPointList;