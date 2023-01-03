import React, {useEffect, useRef, useState} from 'react';
import 'antd/dist/antd.css';
import {Button, Col, Image, PageHeader, Row, Select} from 'antd';
import {Link, useNavigate} from "react-router-dom";
import {Message, Table} from "../../component";
import './BuyerMypage.css';
import {AccountBookOutlined, DollarCircleFilled, ShoppingCartOutlined} from "@ant-design/icons";
import * as OrderAPI from "../../admin/api/Order"
import moment from "moment";
import * as CartAPI from "../../admin/api/Cart";
import * as BuyerAPI from "../../admin/api/Buyer";
import * as PointAPI from "../../admin/api/Point";


const BuyerMypage = function () {

    const table = useRef();
    const [isResult, setIsResult] = useState(false);
    const navigate = useNavigate();
    const pageNo = 1;
    const [orderStates, setOrderStates] = useState([{
        ORDER_STANDBY: 0,
        PAY_STANDBY: 0,
        PAY_DONE: 0,
        SHIPPING: 0,
        DELIVERY_COMPLETED: 0,
        CANCEL_REFUND: 0,
        ORDER_CONFIRM: 0
    }]);
    const [cartTotal, setCartTotal] = useState(0);
    const [orderTotal, setOrderTotal] = useState(0);
    const [staffName, setStaffName] = useState("");
    const [buyerType, setBuyerType] = useState("");
    const [myPoint, setMyPoint] = useState(0);
    const [buyerIdentificationType, setBuyerIdentificationType] = useState("");

    const _onList2 = () => {
        const values = {
            page: 0,
            pageSize: 2147483647,
            map: {
                startDate : ""
                ,endDate : ""
                ,orderStateList : ""
            }
        };
        OrderAPI.buyerList2(values)
            .then((response) => {
                console.log(response);
                let res = response.data;
                const total = res.totalElements || 0;
                if (total !== 0) {
                    setOrderTotal(total);
                }
            })
            .catch((error) => {
                Message.error(error.message);
            })
    }


    const _onList = () => {
        const values = {
            page: pageNo - 1,
            pageSize: 2147483647,
            map: {
                startDate : moment().subtract(1, "months").format("YYYY-MM-DD")
                ,endDate : moment().format("YYYY-MM-DD")
                ,orderStateList : ""
            }
        };
        OrderAPI.buyerList2(values)
            .then((response) => {
                console.log(response);
                let res = response.data;
                const total = res.totalElements || 0;
                const list = res.content || [];
                if (total !== 0) {
                    setOrderTotal(total);
                    list.forEach(item => {
                        let copyArray = [...orderStates];
                        if (item.orderItemState === 'ORDER_STANDBY') {
                            copyArray[0].ORDER_STANDBY = copyArray[0].ORDER_STANDBY + 1;
                        } else if (item.orderItemState === 'PAY_STANDBY') {
                            copyArray[0].PAY_STANDBY = copyArray[0].PAY_STANDBY + 1;
                        } else if (item.orderItemState === 'PAY_DONE') {
                            copyArray[0].PAY_DONE = copyArray[0].PAY_DONE + 1;
                        } else if (item.orderItemState === 'SHIPPING') {
                            copyArray[0].SHIPPING = copyArray[0].SHIPPING + 1;
                        } else if (item.orderItemState === 'DELIVERY_COMPLETED') {
                            copyArray[0].DELIVERY_COMPLETED = copyArray[0].DELIVERY_COMPLETED + 1;
                        } else if (item.orderItemState === 'CANCEL_REQUEST' || item.orderItemState === 'CANCEL_DONE' || item.orderItemState === 'REFUND_REQUEST' || item.orderItemState === 'REFUND_DONE') {
                            copyArray[0].CANCEL_REFUND = copyArray[0].CANCEL_REFUND + 1;
                        } else if (item.orderItemState === 'ORDER_CONFIRM') {
                            copyArray[0].ORDER_CONFIRM = copyArray[0].ORDER_CONFIRM + 1;
                        }
                        setOrderStates(copyArray);
                    })
                    setIsResult(true);
                }
            })
            .catch((error) => {
                Message.error(error.message);
            })
    }

    const _cartCount = () => {
        CartAPI.list({map: {}})
            .then((response) => {
                console.log(response);
                let res = response.data;
                const total = res.totalElements || 0;
                if (total !== 0) {
                    setCartTotal(total);
                }
            })
            .catch((error) => {
                Message.error(error.message);
            })
    }

    const getUserDetail = () => {
        const values = {
            map:{
            }
        };
        BuyerAPI.buyerGet(values)
            .then((response) => {
                console.log(response);
                setStaffName(response.data.staffName);
                setBuyerType(response.data.buyer.buyerType);
                setBuyerIdentificationType(response.data.identificationType);
                PointAPI.getPointHeaderForBuyer()
                    .then(res => {
                        console.log(res);
                        setMyPoint(res.data.savePoint);
                    })
                    .catch(err => {
                        Message.error("일시적인 오류입니다. 다시 시도해주세요. - " + err);
                    })
            })
            .catch((error) => {
                Message.error(error.message);
            });
    }

    useEffect(() => {
        getUserDetail();
        _cartCount();
        _onList2();
        _onList();
    }, []);

    const columns = [
        {
            title: '주문일자',
            dataIndex: 'createdDatetime',
            key: 'createdDatetime',
            render: (_, record) => moment(record.createdDatetime).format('YYYY-MM-DD HH:mm:ss')
        },
        {
            title: '상품주문번호',
            dataIndex: 'orderNo',
            key: 'orderNo',
            render: (_, record) => <Link to={"/buyer/mypage/order/detail/" + record.orderInfo.seq}>{record.orderInfo.orderNo + record.itemSeq}</Link>
        },
        {
            title: '상품정보',
            dataIndex: 'medicineCode',
            key: 'medicineCode',
            render: (_, record) => {
                return (
                    <div>
                        <Row>
                            <Col>
                                {/*<a href={"/buyer/medicine/detail/"+record.productSeq}>*/}
                                    <Image
                                        preview={false}
                                        width={200}
                                        height={200}
                                        src= {(record.hasOwnProperty('fileList') && record.fileList.length > 0 ? record.fileList[0].fullFilePath : '') || "error"}
                                        fallback="data:image/png;base64,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"
                                    />
                                {/*</a>*/}
                            </Col>
                            <Col>
                                <p>{record.productDisplayName}</p>
                            </Col>
                        </Row>
                    </div>
                )
            },
        },
        {
            title: '수량',
            dataIndex: 'orderQuantity',
            key: 'orderQuantity',
        },
        {
            title: '결제금액',
            dataIndex: 'orderItemAmount',
            key: 'orderItemAmount',
            render: (_, record) => record.orderItemAmount.toLocaleString()
        },
        {
            title: '주문상태',
            dataIndex: '',
            key: '',
            render: (_, record) => {
                let statusOption
                let statusText
                const initialStatus = record.orderItemState;
                if (initialStatus === 'ORDER_STANDBY') {
                    statusText = "주문 전";
                    statusOption = [
                        <Select.Option value={initialStatus}>{statusText}</Select.Option>
                    ];
                } else if (initialStatus === 'PAY_STANDBY') {
                    statusText = "입금대기";
                    statusOption = [
                        <Select.Option value={initialStatus}>{statusText}</Select.Option>,
                        <Select.Option value={"CANCEL_DONE"}>주문취소</Select.Option>
                    ];
                } else if (initialStatus === 'PAY_DONE') {
                    statusText = "결제완료";
                    statusOption = [
                        <Select.Option value={initialStatus}>{statusText}</Select.Option>,
                        <Select.Option value={"CANCEL_REQUEST"}>취소신청</Select.Option>
                    ];
                } else if (initialStatus === 'SHIPPING') {
                    statusText = "배송중";
                    statusOption = [
                        <Select.Option value={initialStatus}>{statusText}</Select.Option>
                    ];
                } else if (initialStatus === 'DELIVERY_COMPLETED') {
                    statusText = "배송완료";
                    statusOption = [
                        <Select.Option value={initialStatus}>{statusText}</Select.Option>,
                        <Select.Option value={"ORDER_CONFIRM"}>구매확정</Select.Option>
                    ];
                } else if (initialStatus === 'CANCEL_REQUEST') {
                    statusText = "취소신청";
                    statusOption = [
                        <Select.Option value={initialStatus}>{statusText}</Select.Option>
                    ];
                } else if (initialStatus === 'CANCEL_DONE') {
                    statusText = "주문취소완료";
                    statusOption = [
                        <Select.Option value={initialStatus}>{statusText}</Select.Option>
                    ];
                } else if (initialStatus === 'REFUND_REQUEST') {
                    statusText = "환불신청";
                    statusOption = [
                        <Select.Option value={initialStatus}>{statusText}</Select.Option>
                    ];
                } else if (initialStatus === 'REFUND_DONE') {
                    statusText = "환불완료";
                    statusOption = [
                        <Select.Option value={initialStatus}>{statusText}</Select.Option>
                    ];
                } else if (initialStatus === 'ORDER_CONFIRM') {
                    statusText = "구매확정";
                    statusOption = [
                        <Select.Option value={initialStatus}>{statusText}</Select.Option>
                    ];
                } else if (initialStatus === 'PAYMENT_ERROR') {
                    statusText = "결제오류";
                    statusOption = [
                        <Select.Option value={initialStatus}>{statusText}</Select.Option>
                    ];
                } else {
                    statusText = "시스템오류";
                    statusOption = [
                        <Select.Option value={initialStatus}>{statusText}</Select.Option>
                    ];
                }

                return (
                    <div>
                        <p>{statusText}</p>
                        {/*<Form.Item*/}
                        {/*    name="orderStatus"*/}
                        {/*    required={true}*/}
                        {/*    initialValue={initialStatus}*/}
                        {/*>*/}
                        {/*    <Select*/}
                        {/*        style={{*/}
                        {/*            width: 120,*/}
                        {/*        }}*/}
                        {/*        defaultValue={initialStatus}*/}
                        {/*    disabled>*/}
                        {/*        {statusOption.map(item => {return item;})}*/}
                        {/*    </Select>*/}
                        {/*</Form.Item>*/}
                    </div>
                )
            }
        },
    ];
    const onSearch = () => {
        navigate('/buyer/mypage');
        table.current['onSubmit']();
    }
    const goUserDetail = (buyerType) => {
        navigate("/buyer/mypage/user/detail/" + (buyerType !== "W" ?
            (buyerType !== "M" ?
                (buyerType !== "P" ?
                    ""
                    : "pharmacy")
                : "hospital")
            : "company")
        );
    }
    const goSubUser = () => {
        navigate("/buyer/mypage/user/sub")
    }

    return (
        <div className={"text-left"}>
            <div className='pageTitle'>
                My Page
            </div>
            <div className='pageSubtitle'>
            고객님의 모든 정보를 확인하실 수 있습니다.
            </div>
            
            <PageHeader
                className="site-page-header"
            >
                <Row className='mypagrUser'>
                    <Col  style={{width:"50%"}}>
                        <div className='mypageUserName'><b>{staffName}</b> 님</div>
                        {
                            buyerIdentificationType == "M" &&
                                <font>
                                    <Button type={"primary"} onClick={e => goUserDetail(buyerType)} className="btn-medium btn-square">회원정보 수정</Button>
                                    <Button onClick={() => navigate('/buyer/mypage/vaccount')}  className="btn-medium btn-square btn-color01-2 ">관리</Button>
                                </font>
                        }
                    </Col>
                    <Col style={{width:"16.6666%"}}>
                        <Link to={"/buyer/cart"}><ShoppingCartOutlined/></Link>
                        <p>장바구니</p>
                        <p>{cartTotal.toLocaleString()}</p>
                    </Col>
                    <Col style={{width:"16.6666%"}}>
                        <Link to={"/buyer/mypage/order/list"}><AccountBookOutlined/></Link>
                        <p>주문</p>
                        <p>{orderTotal.toLocaleString()}</p>
                    </Col>
                    <Col style={{width:"16.6666%"}}>
                        <Link to={"/buyer/mypage/point/list"}><DollarCircleFilled/></Link>
                        <p>Point</p>
                        <p>{myPoint.toLocaleString()}원</p>
                    </Col>
                    {/*<Col>*/}
                    {/*    <Link to={"/buyer/mypage/qna"}><QuestionCircleFilled/></Link>*/}
                    {/*    <p>1:1문의</p>*/}
                    {/*    <p>10건</p>*/}
                    {/*</Col>*/}
                </Row>
            </PageHeader>
            <br/>
            <h4 className='spacerTop textCenter'>최근 주문정보</h4>
            <div className="textCenter pad10"> 최근 30일 내에 진행중인 주문정보입니다. <Link className='btn-color02 btn-small' to={"/buyer/mypage/order/list"}>더 보기 ></Link></div>
            <PageHeader
                className="site-page-header"
            >
                {
                    isResult && (
                        <Row className={"mypageStatus"}>
                            <Col>
                                입금대기
                                <p>{orderStates[0].PAY_STANDBY.toLocaleString()}</p>
                            </Col>
                            <Col>
                                결제완료
                                <p>{orderStates[0].PAY_DONE.toLocaleString()}</p>
                            </Col>
                            <Col>
                                배송중
                                <p>{orderStates[0].SHIPPING.toLocaleString()}</p>
                            </Col>
                            <Col>
                                배송완료
                                <p>{orderStates[0].DELIVERY_COMPLETED.toLocaleString()}</p>
                            </Col>
                            <Col>
                                구매확정
                                <p>{orderStates[0].ORDER_CONFIRM.toLocaleString()}</p>
                            </Col>
                            <Col>
                                취소/환불/교환
                                <p>{orderStates[0].CANCEL_REFUND.toLocaleString()}</p>
                            </Col>
                        </Row>
                    )
                }
            </PageHeader>
            <div class="listMypage">
            {
                isResult && (
                    <Table 
                        columns={columns}
                        onSearch={onSearch}
                        isInitLoad={true}
                        onList={OrderAPI.buyerList3}
                        innerRef={table}
                    />
                )
            }
            </div>

        </div>
    );
};

export default BuyerMypage;
