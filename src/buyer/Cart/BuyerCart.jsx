import React, {useCallback, useEffect, useRef, useState} from 'react';
import 'antd/dist/antd.css';
import {Button, Checkbox, Col, Image, InputNumber, Modal, Row, Steps} from 'antd';
import {useNavigate} from "react-router-dom";
import {Message, Table} from "../../component";
import * as CartAPI from "../../admin/api/Cart";
import './BuyerCart.css'

const {Step} = Steps;

const BuyerCart = function () {
    const table = useRef();
    const navigate = useNavigate();
    const [isResult, setIsResult] = useState(false);
    const [buyerIdentificationCode, setBuyerIdentificationCode] = useState("");
    const [totalElements, setTotalElements] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);
    const [totalPayPoint, setTotalPayPoint] = useState(0);
    const [checkboxList, setCheckboxList] = useState([]);
    const [checkedList, setCheckedList] = useState([]);

    useEffect(() => {
        CartAPI.list({map: {}})
            .then((response) => {
                console.log(response);
                let res = response.data;
                const total = res.totalElements || 0;
                const list = res.content || [];
                if (total !== 0) {
                    let totalAmountTmp = 0;
                    let totalPayPointTmp = 0;
                    let _total = 0;
                    list.filter(item => item.product.useYn === "Y").forEach(item => {
                        _total = _total + 1;
                    })
                    setTotalElements(_total);
                    setBuyerIdentificationCode(list[0].buyerCode);
                    list.filter(item => item.product.useYn === "Y").forEach(item => {
                        totalAmountTmp += (Number(item.buyerTypeProductAmount.amount) * Number(item.quantity));
                        totalPayPointTmp += (Number(item.buyerTypeProductAmount.savePoint) * Number(item.quantity));
                    })
                    setTotalAmount(totalAmountTmp);
                    setTotalPayPoint(totalPayPointTmp);
                    setCheckedList(prev => [...prev, ...list.filter(item => item.product.useYn === "Y").map(item => {
                        return {
                            seq: item.seq,
                            checked: true,
                            quantity: item.quantity,
                            amount: Number(item.buyerTypeProductAmount.amount) * Number(item.quantity)
                        };
                    })]);
                    setCheckboxList(prev => [...prev, ...list.filter(item => item.product.useYn === "Y").map(item => item.seq)])
                    setIsResult(true);
                }
            })
            .catch((error) => {
                Message.error(error.message);
            })
    }, []);

    const arrangeCheckbox = (type, seqForSingle) => {
        let result = [];

        if (type === 'all') {
            checkedList.map(item => {
                result.push(item.seq);
            })
        } else if (type === 'checked') {
            checkedList.map(item => {
                if (item.checked === true) result.push(item.seq);
            })
        } else if (type === 'single') {
            result.push(seqForSingle);
        } else {
            Message.error('일시적인 오류입니다. 다시 시도해주세요.');
            return false;
        }

        if (result.length === 0) {
            Message.warn('상품을 선택해주세요.');
            return false;
        }

        return result;
    }
    const goOrder = (event, type, seqForSingle) => {
        const result = arrangeCheckbox(type, seqForSingle);
        if(!result) return;
        navigate('/buyer/order', {
            state: {
                cartSeqList: result
            }
        })
    }
    const onChange = useCallback((checkedList, checkboxList, event, type, seq) => {
        if(type === 'all') {
            checkboxList = [];
            for(let i=0;i<checkedList.length;i++){
                checkedList[i].checked = event.target.checked;
                if(event.target.checked) {
                    checkboxList.push(checkedList[i].seq);
                } /*else {
                    checkboxList = [];
                }*/
            }
        } else {
            const idx = checkedList.findIndex(item => item.seq === seq);
            if(idx > -1) checkedList[idx].checked = event.target.checked;

            if(event.target.checked){
                checkboxList.push(seq);
            } else {
                const index = checkboxList.indexOf(seq);
                if(index > -1) checkboxList.splice(index, 1);
            }
        }
        setCheckedList(prev => [...checkedList]);
        setCheckboxList(prev => [...checkboxList])
    }, [setCheckboxList, setCheckedList]);
    const changeQuantity = (quantity, seq) => {
        const idx = checkedList.findIndex(item => item.seq === seq);
        checkedList[idx].quantity = quantity;
        setCheckedList([...checkedList]);
    }
    const setQuantity = (a, seq, productSeq) => {
        const idx = checkedList.findIndex(item => item.seq === seq);
        const changedQuantity = checkedList[idx].quantity

        CartAPI.add({
            map: {
                quantity: changedQuantity,
                productSeq: productSeq
            }
        }).then(res => {
            if(res.code !== 1000){
                Message.error("수량변경에 실패하였습니다. 다시 시도해주세요.");
                return;
            }
            window.location.reload();
        }).catch(err => {
            Message.error(err);
        })
    }
    const goMedicineList = () => {
        navigate("/buyer/medicine/list");
    }
    const goMain = () => {
        navigate("/buyer");
    }
    const delCart = (result) => {
        for (let i = 0; i < result.length; i++) {
            CartAPI.del({
                map: {
                    seq: String(result[i]),
                    buyerIdentificationCode: buyerIdentificationCode
                }
            }).then(response => {
                if (response.code !== 1000) {
                    Message.error("오류가 발생했습니다. 다시 시도해주세요. - " + response.data.message);
                    return;
                }
                window.location.reload();
            }).catch(err => {
                Message.error("오류가 발생했습니다. 다시 시도해주세요.");
            })
        }
    }

    const [isModalVisible1, setIsModalVisible1] = useState(false);
    const showModal1 = () => {
        setIsModalVisible1(true);
    };
    const handleOk1 = () => {
        delCart(arrangeCheckbox("checked"));
    };
    const handleCancel1 = () => {
        setIsModalVisible1(false);
    };
    const [isModalVisible2, setIsModalVisible2] = useState(false);
    const showModal2 = () => {
        setIsModalVisible2(true);
    };
    const handleOk2 = () => {
        delCart(arrangeCheckbox("all"));
    };
    const handleCancel2 = () => {
        setIsModalVisible2(false);
    };

    const [isModalVisible3, setIsModalVisible3] = useState(false);
    const handleCancel3 = () => {
        setIsModalVisible3(false);
    };
    const [isModalVisible4, setIsModalVisible4] = useState(false);
    const handleCancel4 = () => {
        setIsModalVisible4(false);
    };
    const onClickAddButton1 = useCallback(() => {
        showModal1();
    }, []);
    const onClickAddButton2 = useCallback(() => {
        showModal2();
    }, []);

    const buttons = [
        {
            type: 'primary03',
            disabled: false,
            name: '선택 삭제',
            onClick: onClickAddButton1,
        },
        {
            type: 'primary03',
            disabled: false,
            name: '장바구니 비우기',
            onClick: onClickAddButton2,
        },
    ];
    const columns = [
        {
            title: () => {
                return (
                    <div>
                        <Checkbox onChange={e => {
                            onChange(checkedList, checkboxList, e, 'all');
                        }}
                        checked={checkboxList.length === checkedList.length}
                        /> 전체 선택
                    </div>
                );
            },
            dataIndex: 'checkbox',
            key: 'checkbox',
            render: (_, record) => {
                if(record.product.useYn !== "N") {
                    return <Checkbox checked={checkboxList.includes(record.seq) ? true : false} onChange={e => {onChange(checkedList, checkboxList, e, 'single', record.seq);}}/>;
                } else {
                    return <div>
                        <div style={{position:"relative"}}>
                            <Checkbox checked={false} />
                        </div>
                        <div onClick={e => {alert("구매불가 상품으로 장바구니에서 삭제됩니다.");delCart(arrangeCheckbox("single", record.seq))}} className={"cart_dim2"}>&nbsp;</div>
                    </div>
                }
            },
        },
        {
            title: '상품정보',
            dataIndex: 'medicineCode',
            key: 'medicineCode',
            render: (_, record) => {
                if(record.product.useYn !== "N") {
                    return (
                        <div>
                            <Row>
                                <Col span={"12"}>
                                    <a href={"/buyer/medicine/detail/"+record.product.seq}>
                                        <Image
                                            preview={false}
                                            width={200}
                                            height={200}
                                            src= {(record.hasOwnProperty('fileManagerDto') && record.fileManagerDto.length > 0 ? record.fileManagerDto[0].fullFilePath : '') || "error"}
                                            fallback="data:image/png;base64,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"
                                        />
                                    </a>
                                </Col>
                                <Col span={"12"}>
                                    <p>{record.product['productDisplayName']}</p>
                                    <p>{record.product['ingredientName']}</p>
                                    <p>{record.product['standard']}</p>
                                    <p>{record.product['factory']}</p>
                                </Col>
                            </Row>
                        </div>
                    )
                } else {
                    return <div>
                        <div style={{position:"relative"}}>
                            <Row>
                                <Col span={"12"}>
                                    <a href={"/buyer/medicine/detail/"+record.product.seq}>
                                        <Image
                                            preview={false}
                                            width={200}
                                            height={200}
                                            src= {(record.hasOwnProperty('fileManagerDto') && record.fileManagerDto.length > 0 ? record.fileManagerDto[0].fullFilePath : '') || "error"}
                                            fallback="data:image/png;base64,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"
                                        />
                                    </a>
                                </Col>
                                <Col span={"12"}>
                                    <p>{record.product['productName']}</p>
                                    <p>{record.product['ingredientName']}</p>
                                    <p>{record.product['standard']}</p>
                                    <p>{record.product['factory']}</p>
                                </Col>
                            </Row>
                        </div>
                        <div onClick={e => {alert("구매불가 상품으로 장바구니에서 삭제됩니다.");delCart(arrangeCheckbox("single", record.seq))}} className={"cart_dim2"}>&nbsp;</div>
                        <h2 className={"cart_dim"}>구매 가능한 상품이 아닙니다.</h2>
                    </div>
                }
            },
        },
        {
            title: '단가',
            dataIndex: 'medicineCode',
            key: 'medicineCode',
            render: (_, record) => {
                if(record.product.useYn !== "N") {
                    return record.buyerTypeProductAmount['amount'].toLocaleString() + "원"
                } else {
                    return <div>
                        <div style={{position:"relative"}}>
                            {record.buyerTypeProductAmount['amount'].toLocaleString() + "원"}
                        </div>
                        <div onClick={e => {alert("구매불가 상품으로 장바구니에서 삭제됩니다.");delCart(arrangeCheckbox("single", record.seq))}} className={"cart_dim2"}>&nbsp;</div>
                    </div>
                }
            },
        },
        {
            title: '수량',
            dataIndex: 'medicineCode',
            key: 'medicineCode',
            render: (_, record) => {
                if(record.product.useYn !== "N") {
                    return (
                        <div>
                            <p>
                                <InputNumber onChange={e => {
                                    changeQuantity(e, record.seq)
                                }} defaultValue={record.quantity}/>
                            </p>
                            <p>
                                <Button className="btn-color03" onClick={e => {
                                    setQuantity(e, record.seq, record.product.seq);
                                }}>수량변경</Button>
                            </p>
                        </div>
                    );
                } else {
                    return <div>
                        <div style={{position:"relative"}}>
                            <p>
                                <InputNumber onChange={e => {
                                    changeQuantity(e, record.seq)
                                }} defaultValue={record.quantity}/>
                            </p>
                            <p>
                                <Button className="btn-color03" onClick={e => {
                                    setQuantity(e, record.seq, record.product.seq);
                                }}>수량변경</Button>
                            </p>
                        </div>
                        <div onClick={e => {alert("구매불가 상품으로 장바구니에서 삭제됩니다.");delCart(arrangeCheckbox("single", record.seq))}} className={"cart_dim2"}>&nbsp;</div>
                    </div>
                }

            },
        },
        {
            title: '상품금액',
            dataIndex: 'medicineCode',
            key: 'medicineCode',
            render: (_, record) => {
                if(record.product.useYn !== "N") {
                    return <div>
                        <p>
                            {(record.buyerTypeProductAmount['amount'] * record.quantity).toLocaleString()}원
                        </p>
                        <p>
                            <Button className="btn-color03" onClick={e => {
                                goOrder(e, "single", record.seq)
                            }}>주문하기</Button>
                        </p>
                    </div>
                } else {
                    return <div>
                        <div style={{position:"relative"}}>
                            <p>
                                {(record.buyerTypeProductAmount['amount'] * record.quantity).toLocaleString()}원
                            </p>
                            <p>
                                <Button className="btn-color03" onClick={e => {
                                    goOrder(e, "single", record.seq)
                                }}>주문하기</Button>
                            </p>
                        </div>
                        <div onClick={e => {alert("구매불가 상품으로 장바구니에서 삭제됩니다.");delCart(arrangeCheckbox("single", record.seq))}} className={"cart_dim2"}>&nbsp;</div>
                    </div>
                }
            },
        }
    ];

    return (
        <div>
            <div className='logoCart'>
                 {<Image src={"/images/logo_top.svg"} preview={false}></Image>}
            </div>
            <Steps current={0}>
                <Step title="장바구니" description=""/>
                <Step title="주문/결제" description=""/>
                <Step title="주문완료" description=""/>
            </Steps>
            {
                isResult && (
                    <div className='cartProductList'>
                        <h3>장바구니</h3>
                        <Table
                            buttons={buttons}
                            columns={columns}
                            isInitLoad={true}
                            onList={CartAPI.list}
                            innerRef={table}
                            showPagination={false}
                        />

                        <div className={"text-right"}>
                            <div className="totalPrice">
                                <h4  style={{display: "inline"}}>총 {checkedList.filter(item => item.checked).length}개의 상품금액</h4> &nbsp;&nbsp; <h3 style={{display: "inline"}}>{Number(checkedList.filter(item => item.checked).reduce((a, b) => a + b.amount, 0)).toLocaleString()}원</h3>
                            </div>
                            <div className="finalPoint">
                                <h4  style={{display: "inline"}}>적립예정 포인트</h4> &nbsp;&nbsp; <h3 style={{display: "inline"}}>+ {totalPayPoint.toLocaleString()}원</h3>
                            </div>
                        </div>
                        <div>
                            <Button className="btn-color02 btn-huge" onClick={goMedicineList}>쇼핑 계속하기</Button>
                            <Button className="btn-color02 btn-huge" onClick={e => {
                                goOrder(e, "checked");
                            }}>선택 상품 주문</Button>
                            <Button className="btn-color02 btn-huge" onClick={e => {
                                goOrder(e, "all");
                            }}>전체 상품 주문</Button>
                        </div>
                    </div>
                )
            }
            {
                !isResult && (
                    <div>
                        <Row>
                            <Col span={"24"}>
                                <table className={"table-center"}>
                                    <tr>
                                        <td>
                                            장바구니에 담긴 상품이 없습니다.
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            원하는 상품을 장바구니에 담아보세요!
                                        </td>
                                    </tr>
                                </table>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={"24"}>
                                <Button onClick={goMain}>메인으로</Button>
                            </Col>
                        </Row>
                    </div>
                )
            }
            <Modal title="선택한 상품을 삭제하시겠습니까?" visible={isModalVisible1} onOk={handleOk1} onCancel={handleCancel1}
                   footer={[
                       <Button key="confirmed" type="primary" onClick={handleOk1}>
                           확인
                       </Button>,
                       <Button key="confirmed" onClick={handleCancel1}>
                           취소
                       </Button>
                   ]}
            >
            </Modal>
            <Modal title="장바구니를 모두 비우시겠습니까?" visible={isModalVisible2} onOk={handleOk2} onCancel={handleCancel2}
                   footer={[
                       <Button key="confirmed" type="primary" onClick={handleOk2}>
                           확인
                       </Button>,
                       <Button key="confirmed" onClick={handleCancel2}>
                           취소
                       </Button>
                   ]}
            >
            </Modal>
            <Modal title="주문불가 상품이 포함되어 있습니다." visible={isModalVisible3} onOk={handleCancel3} onCancel={handleCancel3}
                   footer={[
                       <Button key="confirmed" type="primary" onClick={handleCancel3}>
                           확인
                       </Button>
                   ]}
            >
            </Modal>
            <Modal title="현재 판매하지 않는 상품입니다." visible={isModalVisible4} onOk={handleCancel4} onCancel={handleCancel4}
                   footer={[
                       <Button key="confirmed" type="primary" onClick={handleCancel4}>
                           확인
                       </Button>
                   ]}
            >
            </Modal>
        </div>
    );
};

export default BuyerCart;