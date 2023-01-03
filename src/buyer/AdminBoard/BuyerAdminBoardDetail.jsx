import React, {useEffect, useRef, useState} from 'react';
import 'antd/dist/antd.css';
import {Button, Col, Descriptions, Form, Image, Modal, PageHeader, Row, Select} from 'antd';
import {useNavigate, useParams} from "react-router-dom";
import './BuyerAdminBoardDetail.css';
import moment from "moment";
import * as AdminBoardAPI from "../../admin/api/AdminBoard";
import {Message} from "../../component";

const BuyerAdminBoardDetail = function () {
    const params = useParams();
    const id = Number(params.id);
    const table = useRef();
    const [isResult, setIsResult] = useState(false);
    const navigate = useNavigate();
    const total = 0;
    const [_total, setTotal] = useState(total);
    const [dataList, setDataList] = useState([]);
    const [detailData, setDetailData] = useState([]);
    const [paymentMethod, setPaymentMethod] = useState("");

    const _onList = () => {
        const values = {
            map: {
                seq: id
            }
        };
        AdminBoardAPI.buyerGet(values)
            .then((response) => {
                console.log(response);
                if(response.code !== 1000){
                    Message.error("공지사항 상세 조회에 실패하였습니다.");
                    return;
                }
                setDetailData(response.data);
                setIsResult(true);
            })
            .catch((error) => {
                Message.error(error.message);
            })
    }
    useEffect(() => {
        _onList();
    }, []);

    const onList = () => {
        navigate("/buyer/board/list");
    }

    return (
        <div className={"text-left"}>
            <div class="pageTitle">공지사항</div>
            <div class="pageSubtitle">관리자 공지사항을 확인하실 수 있습니다.</div>

            {/*<PageHeader*/}
            {/*    className="site-page-header"*/}
            {/*>*/}
            {/*    게시일자 : {(detailData.hasOwnProperty('createdDatetime') ? moment(detailData.createdDatetime).format('YYYY-MM-DD HH:mm:ss') : '')}*/}
            {/*</PageHeader>*/}

            {
                isResult && (
                    <Descriptions column={0} bordered>
                        <Descriptions.Item label={"제목"} labelStyle={{width:"100px"}}>
                            {(detailData.hasOwnProperty('title') ? detailData.title : '')}
                        </Descriptions.Item>
                        <Descriptions.Item label={"내용"} labelStyle={{width:"100px", height:"500px"}}>
                            {(detailData.hasOwnProperty('content') ? detailData.content : '')}
                        </Descriptions.Item>
                    </Descriptions>
                )
            }
            <br/>
            <p className="textCenter">
                <Button onClick={onList} className="btn-color02 btn-huge" style={{width: '300px'}}>목록으로</Button>
            </p>

        </div>
    );
};

export default BuyerAdminBoardDetail;