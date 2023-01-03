import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Col, Divider, Image, Input, InputNumber, Modal, Radio, Row, Steps } from 'antd';

import './BuyerOrder.css';
import 'antd/dist/antd.css';

import * as OrderAPI from "../../admin/api/Order";
import { Message, Table } from "../../component";
import * as PointAPI from "../../admin/api/Point";
import * as BuyerAPI from "../../admin/api/Buyer";
import PopupPostCode from "../Login/Signup/Common/PostCode/PopupPostCode";

const { Step } = Steps;

const BuyerOrder = function (props) {
    const location = useLocation();
    const table = useRef();
    const navigate = useNavigate();
    const [isResult, setIsResult] = useState(false);
    const [_total, setTotal] = useState(0);
    const [dataList, setDataList] = useState([]);
    const [orderTmpData, setOrderTmpData] = useState({});
    const [deliveryRequest, setDeliveryRequest] = useState("");
    const [deliveryAddressName, setDeliveryAddressName] = useState("");
    const [deliveryAddress, setDeliveryAddress] = useState("");
    const [deliveryAddressTel, setDeliveryAddressTel] = useState("");
    const [deliveryPostNo, setDeliveryPostNo] = useState("");
    const [deliveryAddressDetail, setDeliveryAddressDetail] = useState("");
    const [orgDeliveryAddress, setOrgDeliveryAddress] = useState("");
    const [orgDeliveryPostNo, setOrgDeliveryPostNo] = useState("");
    const [orgDeliveryAddressDetail, setOrgDeliveryAddressDetail] = useState("");
    const [orgDeliveryAddressTel, setOrgDeliveryAddressTel] = useState("");
    const [isAddressChecked, setIsAddressChecked] = useState(true);
    const [address, setAddress] = useState("");
    const [addressName, setAddressName] = useState("");
    const [addressTel, setAddressTel] = useState("");
    const [addressList, setAddressList] = useState([]);
    const [myPoint, setMyPoint] = useState(0);
    const [usePoint, setUsePoint] = useState(0);
    const [deliveryList, setDeliveryList] = useState([]);
    const [deliveryAddressDetail1, setDeliveryAddressDetail1] = useState("");
    const [deliveryAddressDetail2, setDeliveryAddressDetail2] = useState("");
    const [getPostcode, setPostcode] = useState();
    const [buyerIdentificationCode, setBuyerIdentificationCode] = useState("");
    const [orderNo, setOrderNo] = useState("");
    const cartSeqList = (location.state !== undefined && location.state !== null ? (location.state.hasOwnProperty('cartSeqList') ? location.state.cartSeqList : []) : []);
    const quantityFromMedicineDetail = (location.state !== undefined && location.state !== null ? (location.state.hasOwnProperty('quantity') ? location.state.quantity : 0) : 0);
    const productSeqFromMedicineDetail = (location.state !== undefined && location.state !== null ? (location.state.hasOwnProperty('productSeq') ? location.state.productSeq : 0) : 0);
    const totalAmount = dataList.map(values => Number(values.orderItemAmount)).reduce((a, b) => a + b, 0);
    const totalPayPoint = dataList.map(values => Number(values.pointSave)).reduce((a, b) => a + b, 0);

    const [payType, setPayType] = useState("card");

    const [isOpenVaccountOrder, setIsOpenVaccountOrder] = useState(false);

    useEffect(() => {
        if (cartSeqList.length > 0 || (quantityFromMedicineDetail > 0 && productSeqFromMedicineDetail > 0)) {
            _onList();
            getPoint();
            getDeliveryListForWholesaleUser();
        } else {
            alert("올바른 접근이 아닙니다.");
            navigate("/buyer");
        }
    }, []);
    const _onList = () => {
        const param = new FormData();
        if (cartSeqList.length > 0) {
            param.append('cartSeqList', cartSeqList);
            OrderAPI.getOrderTmp(param)
                .then((response) => {
                    console.log(response);
                    const res = response.data;
                    const total = res.orderItemList.length || 0;
                    const list = res.orderItemList || [];
                    if (total > 0) {
                        setOrderTmpData(res);
                        setDeliveryAddressTel(res.buyerIdentification.buyer.corpTelNo);
                        setDeliveryAddress(res.shippingAddress);
                        setDeliveryPostNo(res.shippingAddressPostNo);
                        setDeliveryAddressDetail(res.shippingAddressDetail);
                        setOrgDeliveryAddressTel(res.staffPhoneNo);
                        setOrgDeliveryAddress(res.shippingAddress);
                        setOrgDeliveryPostNo(res.shippingAddressPostNo);
                        setOrgDeliveryAddressDetail(res.shippingAddressDetail);

                        setOrderNo(res.orderNo);
                        setTotal(total);
                        setDataList(list);
                        setDeliveryAddressName(res.buyerIdentification.buyer.corpName);
                        setBuyerIdentificationCode(res.orderIdentificationCode);
                        setIsResult(true);
                    }
                })
                .catch((error) => {
                    Message.error(error.message);
                })
        } else if (quantityFromMedicineDetail > 0 && productSeqFromMedicineDetail > 0) {
            OrderAPI.goOrder({
                map: {
                    quantity: quantityFromMedicineDetail,
                    productSeq: productSeqFromMedicineDetail
                }
            }).then(response => {
                console.log(response);
                const res = response.data;
                const total = res.orderItemList.length || 0;
                const list = res.orderItemList || [];
                if (total > 0) {
                    setOrderTmpData(res);
                    setDeliveryAddressTel(res.buyerIdentification.buyer.corpTelNo);
                    setDeliveryAddress(res.shippingAddress);
                    setDeliveryPostNo(res.shippingAddressPostNo);
                    setDeliveryAddressDetail(res.shippingAddressDetail);
                    setOrgDeliveryAddressTel(res.staffPhoneNo);
                    setOrgDeliveryAddress(res.shippingAddress);
                    setOrgDeliveryPostNo(res.shippingAddressPostNo);
                    setOrgDeliveryAddressDetail(res.shippingAddressDetail);

                    setOrderNo(res.orderNo);
                    setTotal(total);
                    setDataList(list);
                    setDeliveryAddressName(res.buyerIdentification.buyer.corpName);
                    setBuyerIdentificationCode(res.orderIdentificationCode);
                    setIsResult(true);
                }
            }).catch(err => {
                Message.error(err);
            })
        }

    }
    const getPoint = () => {
        PointAPI.getPointHeaderForBuyer()
            .then(res => {
                if (res.code !== 1000) {
                    Message.error("포인트 조회 오류입니다. 다시 시도해주세요.");
                    return;
                }
                setMyPoint(res.data.savePoint);
            })
            .catch(err => {
                console.log(err);
                Message.error("포인트 조회 오류입니다. 다시 시도해주세요.");
            })
    }
    const changeUsePoint = (point) => {
        if (point >= 0 && myPoint >= point) {
            setUsePoint(Number(point));
        } else if (point > totalAmount) {
            Message.warn("포인트가 올바르게 입력되지 않았습니다. 다시 입력해주세요.");
            return;
        } else {
            Message.warn("포인트가 올바르게 입력되지 않았습니다. 다시 입력해주세요.");
            return;
        }
    }
    const useAllPoint = () => {
        // 1. 보유포인트와 전체상품금액을 비교한다.
        // 2-1. 보유포인트 >= 전체상품금액 ::> 사용포인트 = 전체상품금액
        // 2-2. 보유포인트 < 전체상품금액 ::> 사용포인트 = 보유포인트
        if (myPoint > 0) {
            if (myPoint >= totalAmount) {
                setUsePoint(totalAmount);
            } else if (myPoint < totalAmount) {
                setUsePoint(myPoint);
            } else {
                Message.error("포인트 사용 오류입니다. 다시 시도해주세요.");
                return;
            }
        } else {
            Message.warn("보유한 포인트가 없습니다.");
            return;
        }
    }
    const goCart = () => {
        navigate("/buyer/cart");
    }

    const columns = [
        {
            title: '상품정보',
            dataIndex: 'productName',
            key: 'productName',
            render: (_, record) => {
                return (
                    <div>
                        <Row>
                            <Col span={"12"}>
                                <Image
                                    width={200}
                                    height={200}
                                    src={(record.hasOwnProperty('fileList') && record.fileList.length > 0 ? record.fileList[0].fullFilePath : '') || "error"}
                                    fallback="data:image/png;base64,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"
                                />
                            </Col>
                            <Col span={"12"}>
                                <p>{record.productName}</p>
                                <p>{/*ingredientName*/}</p>
                            </Col>
                        </Row>
                    </div>
                );
            },
        },
        {
            title: 'xx',
            dataIndex: 'factory',
            key: 'factory',
            render: (_, record) => record.factory,
        },
        {
            title: 'xx',
            dataIndex: 'productAmount',
            key: 'productAmount',
            render: (_, record) => {
                return (
                    <div>
                        <p>
                            {record.productAmount.toLocaleString()} 원
                        </p>
                    </div>
                );
            },
        },
        {
            title: 'xx',
            dataIndex: 'orderQuantity',
            key: 'orderQuantity',
            render: (_, record) => {
                return (
                    <div>
                        <p>
                            {record.orderQuantity}개
                        </p>
                    </div>
                );
            },
        },
        {
            title: 'xx',
            dataIndex: 'orderItemAmount',
            key: 'orderItemAmount',
            render: (_, record) => {
                return (
                    <div>
                        <p>
                            {record.orderItemAmount.toLocaleString()} 원
                        </p>
                    </div>
                );
            },
        }
    ];

    const setDeliveryReq = (object) => {
        setDeliveryRequest(object.target.value);
    }
    const getDeliveryListForWholesaleUser = () => {
        const requestParam = {
            map: {
            }
        }
        BuyerAPI.addressList(requestParam)
            .then(res => {
                console.log(res);
                setDeliveryAddressName(res.data[0].addressName)
                setDeliveryAddress(res.data[0].address)
                setDeliveryAddressTel(res.data[0].addressTel)
                setAddressList(res.data.map(item => {
                    return {
                        seq: item.seq,
                        name: item.addressName,
                        address: item.address,
                        phone: item.addressTel
                    }
                }))
            })
            .catch(err => {
                console.log(err);
            })
    }
    const goDeliveryList = (addressList) => {
        const list = addressList;
        console.log(list);
        setDeliveryList(
            <div>
                {
                    list.map(item => {
                        return (
                            <Row>
                                <Col span={"12"}>
                                    {item.name} <Divider type={"vertical"} /> {item.phone}
                                    <br />
                                    {item.address}
                                </Col>
                                <Col span={"12"}>
                                    <Button onClick={event => { selectDeliveryAddress(event, item); }}>선택</Button>
                                    <br />
                                    <Button onClick={event => { deleteDeliveryAddress(event, item); }}>삭제</Button>
                                </Col>
                            </Row>
                        );
                    })
                }
            </div>
        );
        setIsModalVisible1(true);
    }
    const selectDeliveryAddress = (event, item) => {
        console.log(event);
        console.log(item);
        setDeliveryAddress(item.address);
        setDeliveryAddressName(item.name);
        setDeliveryAddressTel(item.phone);
        setIsAddressChecked(false);
        closeModal1();
    }
    const deleteDeliveryAddress = (event, item) => {
        console.log(event);
        console.log(item);

        const requestParam = {
            map: {
                shippingAddressSeq: item.seq
            }
        }
        BuyerAPI.addressDel(requestParam)
            .then(res => {
                console.log(res);
                if (res.code !== 1000) {
                    alert(res.message);
                }
                window.location.reload();
            })
            .catch(err => {
                console.log(err);
            })
    }

    const [isModalVisible1, setIsModalVisible1] = useState(false);
    const showModal1 = (addressList) => {
        goDeliveryList(addressList);
    };
    const closeModal1 = () => {
        setIsModalVisible1(false);
    }
    const handleOk1 = () => {
        showModal2();
    };
    const handleCancel1 = () => {
        setIsModalVisible1(false);
    };

    const [isModalVisible2, setIsModalVisible2] = useState(false);
    const showModal2 = () => {
        setIsModalVisible2(true);
    };
    const closeModal2 = () => {
        setIsModalVisible2(false);
    };
    const handleOk2 = (address, deliveryAddressDetail1, deliveryAddressDetail2, addressName, addressTel, deliveryList) => {
        console.log(deliveryList);
        const address_ = address + " " + deliveryAddressDetail1 + " " + deliveryAddressDetail2;
        console.log(address_);

        if (deliveryList.length >= 3) {
            Message.warn("배송지는 3개까지 등록 가능합니다.");
            return;
        }

        const requestParam = {
            map: {
                address: address_,
                addressName: addressName,
                addressTel: addressTel
            }
        }

        if (deliveryAddressDetail2.replace(/\s/g, "") === "" || deliveryAddressDetail2 === undefined || deliveryAddressDetail2 === null) {
            Message.error("상세 주소를 입력해주세요.");
            return;
        }
        if (address_.replace(/\s/g, "") === "" || address_ === undefined || address_ === null) {
            Message.error("주소를 입력해주세요.");
            return;
        }
        if (address_.replace(/\s/g, "") === "" || address_ === undefined || address_ === null) {
            Message.error("주소를 입력해주세요.");
            return;
        }
        if (addressName === "" || addressName === undefined || addressName === null) {
            Message.error("배송지명을 입력해주세요.");
            return;
        }
        if (addressTel === "" || addressTel === undefined || addressTel === null) {
            Message.error("연락처를 입력해주세요.");
            return;
        }


        BuyerAPI.addressAdd(requestParam)
            .then(res => {
                console.log(res);
                if (res.code !== 1000) {
                    alert(res.message);
                    closeModal2();
                    window.location.reload();
                    return;
                }
                getDeliveryListForWholesaleUser();
                closeModal2();
                closeModal1();
                window.location.reload();
            })
            .catch(err => {
                console.log(err);
                window.location.reload();
            })
    };
    const handleCancel2 = () => {
        setAddress("");
        setAddressName("");
        setAddressTel("");
        setDeliveryAddressDetail2("");
        setDeliveryAddressDetail1("");
        setIsModalVisible2(false);
    };

    const [isModalVisible3, setIsModalVisible3] = useState(false);
    const showModal3 = () => {
        setIsModalVisible3(true);
    };
    const handleCancel3 = () => {
        setIsModalVisible3(false);
    };

    // ============== PG ==============
    function inputcreate() {
        var formInput1 = document.createElement("input"); // 입력창 생성
        return formInput1;
    }
    const btnPaymentClick = () => {
    }
    // ============== PG ==============

    // ============== Postcode ========
    // const postcode = () => {
    //     const handleComplete = (data) => {
    //         let fullAddress = data.address;
    //         let extraAddress = '';
    //
    //         if (data.addressType === 'R') {
    //             if (data.bname !== '') {
    //                 extraAddress += data.bname;
    //             }
    //             if (data.buildingName !== '') {
    //                 extraAddress += extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName;
    //             }
    //             fullAddress += extraAddress !== '' ? ` (${extraAddress})` : '';
    //         }
    //
    //         console.log(data.zonecode + " " + fullAddress); // e.g. '서울 성동구 왕십리로2길 20 (성수동1가)'
    //         setAddress(data.zonecode);
    //         setDeliveryAddressDetail1(fullAddress);
    //         handleCancel3();
    //     };
    //     console.log("test");
    //     setPostcode(<DaumPostcodeEmbed onComplete={handleComplete} {...props} />);
    //     showModal3();
    // }

    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const openPostCode = () => {
        setIsPopupOpen(true);
    }
    const closePostCode = () => {
        setIsPopupOpen(false);
    }
    const onClickPostCode = (postCode, address) => {
        setAddress(postCode);
        setDeliveryAddressDetail1(address);
        handleCancel3();
        closePostCode();
    }

    // ============== Postcode ========

    const checkDefaultAddress = (e, isAddressChecked, orgDeliveryAddressTel, orgDeliveryAddress, orgDeliveryPostNo, orgDeliveryAddressDetail) => {
        console.log(e);
        console.log(isAddressChecked);
        console.log(orgDeliveryAddressTel);
        console.log(orgDeliveryAddress);
        console.log(orgDeliveryPostNo);
        console.log(orgDeliveryAddressDetail);
        if (!isAddressChecked) {
            console.log(orgDeliveryAddressTel);
            console.log(orgDeliveryAddress);
            console.log(orgDeliveryPostNo);
            console.log(orgDeliveryAddressDetail);
            setIsAddressChecked(true);
            setDeliveryAddressTel(orgDeliveryAddressTel);
            setDeliveryAddress(orgDeliveryAddress);
            setDeliveryPostNo(orgDeliveryPostNo);
            setDeliveryAddressDetail(orgDeliveryAddressDetail);
            return true;
        }
        return false;
    }

    const PAY_TYPE_CARD = 'card';
    const PAY_TYPE_VACCOUNT = 'vaccount';

    const onClickPay = useCallback(() => {
        if (payType === PAY_TYPE_CARD) {
            btnPaymentClick(deliveryAddress, deliveryAddressTel, orderNo, deliveryRequest, (Number(totalAmount) - Number(usePoint)))
        } else if (payType === PAY_TYPE_VACCOUNT) {
            setIsOpenVaccountOrder(true);
        } else {
            Message.warn('결제수단을 선택해주세요.');
        }

    }, [payType, deliveryAddress, deliveryAddressTel, orderNo, deliveryRequest, totalAmount, usePoint]);

    return (
        <div>
            <div className='logoCart'>
                 {<Image src={"/images/logo_top.svg"} preview={false}></Image>}
            </div>
            <Steps current={1} className="container3step">
                <Step title="장바구니" description="" />
                <Step title="주문/결제" description="" />
                <Step title="주문완료" description="" />
            </Steps>
            {
                isResult && (
                    <div  className="orderProductList">    
                        <h3>주문내역</h3>
                        <br/>
                        <Table
                            columns={columns}
                            isInitLoad={true}
                            onList={OrderAPI.getOrderTmp}
                            innerRef={table}
                            showPagination={false}
                            propTotal={_total}
                            propDataList={dataList}
                        />

                        <div className='containerTotalPrice'>                            
                            총 {_total}개의 상품금액
                            <b>{totalAmount.toLocaleString()}원 </b>                                                       
                        </div>

                        <div className={"rowCol-padding-10"}>
                            <Row className={"text-left"}>
                                <Col span={"12"} className="containerOrderBuyer">
                                    <h4>주문자정보</h4>
                                    <div className='tableB noBorder'>
                                        <dl>
                                            <dt>이름</dt>
                                            <dd>{orderTmpData.buyerIdentification.staffName}</dd>
                                        </dl>
                                        <dl>
                                            <dt>이메일</dt>
                                            <dd>{orderTmpData.buyerIdentification.staffEmail}</dd>
                                        </dl>
                                        <dl>
                                            <dt>전화번호</dt>
                                            <dd>{orderTmpData.buyerIdentification.staffPhoneNo}</dd>
                                        </dl>
                                        <div className='supportText'>※ 주문자 정보로 주문관련 정보가 제공됩니다.</div>
                                    </div>
                               
                                    <h3 className='spacerTop'>배송지정보</h3>
                                    <div className='tableB noBorder'>
                                        <dl>
                                            <dt>배송지명</dt>
                                            <dd>{deliveryAddressName}</dd>
                                        </dl>
                                        <dl>
                                            <dt>대표번호</dt>
                                            <dd>{deliveryAddressTel}</dd>
                                        </dl>
                                        <dl>
                                            <dt>주소</dt>
                                            <dd>
                                                {
                                                    orderTmpData.buyerIdentification.buyer.buyerType === "W" &&
                                                    <div>
                                                        <Radio onChange={e => {
                                                            checkDefaultAddress(e, isAddressChecked, orgDeliveryAddressTel, orgDeliveryAddress, orgDeliveryPostNo, orgDeliveryAddressDetail)
                                                        }} checked={isAddressChecked} defaultChecked /> 기본배송지 &nbsp;&nbsp; <Button onClick={e => { showModal1(addressList) }}>배송지목록</Button>

                                                        <Divider />
                                                        {deliveryAddress}
                                                    </div>
                                                }
                                                {
                                                    orderTmpData.buyerIdentification.buyer.buyerType !== "W" &&
                                                    (orderTmpData.shippingAddressPostNo + " " + orderTmpData.shippingAddress + " " + orderTmpData.shippingAddressDetail)
                                                }
                                            </dd>
                                        </dl>
                                        <dl>
                                            <dt>배송요청사항</dt>
                                            <dd><Input onChange={setDeliveryReq} width={200} /></dd>
                                        </dl>
                                    </div>

                                </Col>
                                
                                <Col span={"12"}  className="containerOrderMoney">
                                    <h4>포인트</h4>
                                    <div className='tableB'>
                                        <dl>
                                            <dt>보유</dt>
                                            <dd>{myPoint.toLocaleString()} 포인트</dd>
                                        </dl>
                                        <dl>
                                            <dt>사용</dt>
                                            <dd>
                                                <InputNumber value={usePoint} onChange={event => { changeUsePoint(event) }} style={{ width: 100 }}  /> 포인트 &nbsp;
                                                <Button className='btn-color01-2'>적용</Button> <Button onClick={useAllPoint} type={"primary"} >전액사용</Button>
                                            </dd>
                                        </dl>
                                        <dl>
                                            <div className='supportText'>
                                            보유 <b style={{ color: "red", display: "inline" }}>포인트가 1,000포인트 이상일 때 사용할 수</b> 있습니다.<br/>
                                            상품 환불 시 사용하신 포인트는 포인트로 환불됩니다.
                                            </div>
                                        </dl>
                                        <dl>
                                            <dt>적립예정</dt>
                                            <dd>{totalPayPoint.toLocaleString()} 포인트</dd>
                                        </dl>
                                        
                                    </div>
                                    
                                    <h4 className='spacerTop'>결제정보</h4>
                                    <div className='tableB'>
                                        <dl>
                                            <dt>상품금액</dt>
                                            <dd>{totalAmount.toLocaleString()}원</dd>
                                        </dl>
                                        <dl>
                                            <dt>포인트사용금액</dt>
                                            <dd>{usePoint.toLocaleString()} 원</dd>
                                        </dl>
                                        <dl>
                                            <dt>최종 결제금액</dt>
                                            <dd>{(Number(totalAmount) - Number(usePoint)).toLocaleString()}원</dd>
                                        </dl>
                                        <dl>
                                            <dt>결제수단</dt>
                                            <dd>
                                                <Radio.Group defaultValue={PAY_TYPE_CARD} onChange={e => {
                                                    setPayType(e.target.value)
                                                }
                                                }>
                                                    <Radio value={PAY_TYPE_CARD}>카드</Radio>
                                                </Radio.Group>
                                        </dd>
                                        </dl>

                                    </div>


                                    {/*<Checkbox/> 개인정보 수집 및 이용 동의(필수)*/}

                                    <div>
                                        
                                    </div>
                                  
                                </Col>
                            </Row>
                            <div className='spacerTop'>
                                 <Button style={{ width: 300 }} onClick={goCart} className=" btn-color02-2 btn-huge">장바구니 돌아가기</Button>
                                <Button style={{ width: 300 }} type={"primary"}onClick={onClickPay} className=" btn-color02 btn-huge" >결제하기</Button>
                            </div>
                        </div>



                    </div>
                )
            }


            <Modal title="배송지 목록" visible={isModalVisible1} onCancel={handleCancel1}
                footer={[
                    <Button key="confirmed" type="primary" onClick={handleOk1}>
                        배송지 추가
                    </Button>,
                    <Button key="confirmed" onClick={handleCancel1}>
                        닫기
                    </Button>
                ]}
            >
                {deliveryList}
            </Modal>
            <Modal title="배송지 추가" visible={isModalVisible2} onOk={handleOk2} onCancel={handleCancel2}
                footer={[
                    <Button key="confirmed" type="primary" onClick={e => {
                        handleOk2(address, deliveryAddressDetail1, deliveryAddressDetail2, addressName, addressTel, deliveryList)
                    }}>
                        저장
                    </Button>,
                    <Button key="confirmed" onClick={handleCancel2}>
                        취소
                    </Button>
                ]}
            >
                <h4 style={{ color: "red" }}>배송지명 *</h4> <Input value={addressName} onChange={e => setAddressName(e.target.value)}></Input>
                <br />
                <h4>연락처 *</h4> <Input value={addressTel} onChange={e => setAddressTel(e.target.value.replace(/[^0-9]/g, ""))}></Input>
                <br />
                <h4>주소 *</h4>
                {/*<Input disabled value={address} onChange={e => setAddress(e.target.value)}></Input>*/}
                {/*<Button onClick={postcode}>주소검색</Button>*/}
                {/*<Input disabled onChange={event => {setDeliveryAddressDetail1(event.target.value)}} value={deliveryAddressDetail1}/>*/}
                {/*<br/>*/}
                {/*<Input onChange={event => {setDeliveryAddressDetail2(event.target.value)}} value={deliveryAddressDetail2} placeholder={"상세주소를 입력해주세요"}/>*/}
                <Input maxLength={100} className="input-middle" value={address} onChange={e => setAddress(e.target.value)} disabled />
                <Button onClick={openPostCode} style={{ float: 'left' }}>주소검색</Button>
                <Modal
                    visible={isPopupOpen}
                    onOk={closePostCode}
                    onCancel={closePostCode}
                    footer={null}
                >
                    <PopupPostCode onClick={(postCode, address) => onClickPostCode(postCode, address)} />
                </Modal>
                <Input className='input-large' onChange={event => { setDeliveryAddressDetail1(event.target.value) }} value={deliveryAddressDetail1} disabled />
                <Input onChange={event => { setDeliveryAddressDetail2(event.target.value) }} value={deliveryAddressDetail2} name='corpAddressEtc' className='input-large' placeholder={"상세주소를 입력해주세요"} />
            </Modal>
            <Modal title="배송지 추가" visible={isModalVisible3} onOk={handleCancel3} onCancel={handleCancel3}>
                {getPostcode}
            </Modal>
        </div>
    );
};

export default BuyerOrder;