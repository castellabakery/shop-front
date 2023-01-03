import React, {useEffect, useState} from 'react';
import BuyerRouter from "./BuyerRouter";
import 'antd/dist/antd.css';
import './BuyerContainer.css';

import {Link, useNavigate} from "react-router-dom";
import {Image, Input, Layout, Menu, Modal, Select} from 'antd';
import {
    ContainerOutlined,
    LoginOutlined,
    MedicineBoxOutlined,
    ShoppingCartOutlined,
    UserAddOutlined
} from '@ant-design/icons';
import * as BuyerAPI from "../admin/api/Buyer";
import {Message} from "../component";
import TextArea from "antd/es/input/TextArea";

const {Header, Content, Footer} = Layout;

const BuyerContainer = function () {
    const navigate = useNavigate();
    const [searchSelected, setSearchSelected] = useState("all");

    const userMenuItem = [
        {
            key: 1,
            label: (
                <Link to={"/buyer/logout"}>
                    로그아웃
                </Link>
            ),
        },
        {
            key: 2,
            label: (
                <Link to={"/buyer/mypage"}>
                    마이페이지
                </Link>
            ),
        },
        {
            key: 3,
            label: (
                <Link to={"/buyer/mypage/order/list"}>
                    내 주문
                </Link>
            ),
        },
        {
            key: 4,
            label: (
                <Link to={"/buyer/cart"}>
                    장바구니
                </Link>
            ),
        },
        {
            key: 5,
            label: (
                <Link to={"/buyer/board/list"}>
                    공지사항
                </Link>
            ),
        },
    ];

    const largeMenu = [
        {
            key: 1,
            label: (
                <Link to={"/buyer/medicine/list"} state={{
                    pageNo: 1,
                    len: 10,
                    searchConditionText: "",
                    searchConditionSelect: "factory"
                }}>
                    제조사별
                </Link>
            ),
            children: [
                {
                    type: 'group',
                    label: (
                        <Link to={"/buyer/medicine/list"} state={{
                            pageNo: 1,
                            len: 10,
                            searchConditionText: "xx1",
                            searchConditionSelect: "factory"
                        }}>
                            xx1
                        </Link>
                    ),
                    key: '1',
                },
                {
                    type: 'group',
                    label: (
                        <Link to={"/buyer/medicine/list"} state={{
                            pageNo: 1,
                            len: 10,
                            searchConditionText: "xx2",
                            searchConditionSelect: "factory"
                        }}>
                            xx2
                        </Link>
                    ),
                    key: '2',
                },
                {
                    type: 'group',
                    label: (
                        <Link to={"/buyer/medicine/list"} state={{
                            pageNo: 1,
                            len: 10,
                            searchConditionText: "xx3",
                            searchConditionSelect: "factory"
                        }}>
                            xx3
                        </Link>
                    ),
                    key: '3',
                },
                {
                    type: 'group',
                    label: (
                        <Link to={"/buyer/medicine/list"} state={{
                            pageNo: 1,
                            len: 10,
                            searchConditionText: "xx4",
                            searchConditionSelect: "factory"
                        }}>
                            xx4
                        </Link>
                    ),
                    key: '4',
                }
            ]
        },
        {
            key: 2,
            label: (
                <Link to={"/buyer/medicine/list"} state={{
                    pageNo: 1,
                    len: 10,
                    searchConditionText: "",
                    searchConditionSelect: "formulaDivision"
                }}>
                    종류별
                </Link>
            ),
            children: [
                {
                    type: 'group',
                    label: (
                        <Link to={"/buyer/medicine/list"} state={{
                            pageNo: 1,
                            len: 10,
                            searchConditionText: "xx",
                            searchConditionSelect: "formulaDivision"
                        }}>
                            xx
                        </Link>
                    ),
                    key: '1',
                },
                {
                    type: 'group',
                    label: (
                        <Link to={"/buyer/medicine/list"} state={{
                            pageNo: 1,
                            len: 10,
                            searchConditionText: "xx",
                            searchConditionSelect: "formulaDivision"
                        }}>
                            xx
                        </Link>
                    ),
                    key: '2',
                },
                {
                    type: 'group',
                    label: (
                        <Link to={"/buyer/medicine/list"} state={{
                            pageNo: 1,
                            len: 10,
                            searchConditionText: "xx",
                            searchConditionSelect: "formulaDivision"
                        }}>
                            xx
                        </Link>
                    ),
                    key: '3',
                },
                {
                    type: 'group',
                    label: (
                        <Link to={"/buyer/medicine/list"} state={{
                            pageNo: 1,
                            len: 10,
                            searchConditionText: "xx",
                            searchConditionSelect: "formulaDivision"
                        }}>
                            xx
                        </Link>
                    ),
                    key: '4',
                },
                {
                    type: 'group',
                    label: (
                        <Link to={"/buyer/medicine/list"} state={{
                            pageNo: 1,
                            len: 10,
                            searchConditionText: "xx",
                            searchConditionSelect: "formulaDivision"
                        }}>
                            xx
                        </Link>
                    ),
                    key: '5',
                },
                {
                    type: 'group',
                    label: (
                        <Link to={"/buyer/medicine/list"} state={{
                            pageNo: 1,
                            len: 10,
                            searchConditionText: "xx",
                            searchConditionSelect: "formulaDivision"
                        }}>
                            xx
                        </Link>
                    ),
                    key: '6',
                },
            ]
        },
        {
            key: 3,
            label: (
                <Link to={"/buyer/medicine/list"} state={{
                    pageNo: 1,
                    len: 10,
                    searchConditionText: "",
                    searchConditionSelect: "specialtyDivision0"
                }}>
                    xx
                </Link>
            ),
        },
        {
            key: 4,
            label: (
                <Link to={"/buyer/medicine/list"} state={{
                    pageNo: 1,
                    len: 10,
                    searchConditionText: "",
                    searchConditionSelect: "specialtyDivision1"
                }}>
                    xx
                </Link>
            ),
        }
    ];

    const onSearch = (e) => {
        navigate("/buyer/medicine/list", {
            state: {
                pageNo: 1,
                len: 10,
                searchConditionText: e,
                searchConditionSelect: searchSelected
            }
        });
    }

    const onChangeSearchSelect = (e) => {
        setSearchSelected(e);
    }

    const [isModalVisible1, setIsModalVisible1] = useState(false);
    const showModal1 = () => {
        setIsModalVisible1(true);
    };
    const closeModal1 = () => {
        setIsModalVisible1(false);
    };
    const [isModalVisible2, setIsModalVisible2] = useState(false);
    const showModal2 = () => {
        setIsModalVisible2(true);
    };
    const closeModal2 = () => {
        setIsModalVisible2(false);
    };
    const [terms1, setTerms1] = useState("");
    const [terms2, setTerms2] = useState("");

    const changeHTML = (str) => {
        let parser = new DOMParser();
        let doc = parser.parseFromString(str, 'text/html');
        return doc.body;
    }

    const showTerms = (seq) => {
        BuyerAPI.getTerms({
            map:{
                seq: seq
            }
        })
            .then(res => {
                console.log(res);
                if(seq === "1"){
                    setTerms1(changeHTML(res.data.content).innerHTML);
                } else if(seq === "2"){
                    setTerms2(changeHTML(res.data.content).innerHTML);
                }
                // setIsResult(true)
            })
            .catch(err => {
                Message.error(err);
            })
    }

    useEffect(() => {
        showTerms("1");
        showTerms("2");
    }, [])

    return (
        <div>
            {/*<BrowserRouter>*/}
            <Layout className="buyer-container-layout">
                <Header className={"buyer-header"}>
                    <div className={"search-header"}>
                        <div className="header-item logo">
                            <Link to={"/buyer"}>
                                {<Image src={"/images/logo_top.svg"} preview={false}></Image>}

                            </Link>
                        </div>
                        <div className="header-item search header-searchbox">
                            <Input.Search
                                addonBefore={
                                    <Select
                                        style={{
                                            width:120
                                        }}
                                        onChange={onChangeSearchSelect}
                                        defaultValue={searchSelected}
                                    >
                                        <Select.Option value={"all"}>
                                            전체
                                        </Select.Option>
                                        <Select.Option value={"factory"}>
                                            xx
                                        </Select.Option>
                                        <Select.Option value={"formulaDivision"}>
                                            xx
                                        </Select.Option>
                                        <Select.Option value={"specialtyDivision0"}>
                                            xx
                                        </Select.Option>
                                        <Select.Option value={"specialtyDivision1"}>
                                            xx
                                        </Select.Option>
                                    </Select>
                                }
                                enterButton
                                placeholder="통합검색"
                                onSearch={onSearch}
                            ></Input.Search>
                        </div>
                        <div className="header-item icons header-right-menu">
                            <Menu mode="horizontal"
                                  items={userMenuItem}
                            >
                            </Menu>
                        </div>
                    </div>
                </Header>
                <Header className={"buyer-sub-header"}>
                    <div className={"menu-header"}>
                        <Menu
                            mode="horizontal"
                            items={largeMenu}
                        />
                    </div>
                </Header>
                <div className={"buyer-content-layout"}>
                    <Content>
                        <div className="buyer-content">
                            <BuyerRouter/>
                        </div>
                    </Content>
                </div>
                <Footer className={"buyer-footer"}>
                    <div className={"buyer-footer-content"}>
                        <Link to={"/buyer"}>
                                {<Image src={"/images/logo_bottom.svg"} preview={false}></Image>}
                        </Link>
                        {/*<div>이용약관 이메일 무단수집거부 개인정보처리방침</div>*/}

                        <div className="footerMenu"><Link to={"#"} onClick={showModal1}>이용약관 &gt;</Link> <Link to={"#"} onClick={showModal2}>개인정보처리방침 &gt;</Link></div>
                        <div className="footerContent">
                            주식회사 xx <span>|</span> xx<br/>
                            대표자: xx <span>|</span> 통신판매업 xx <span>|</span> 사업등록번호 xx  <Link to={"#"} target="_blank">사업자정보확인 &gt;</Link><br/>
                            이메일 xx@xx.com <span>|</span> 고객센터 xx <br/>

                        </div>
                        <div className="footerCopyright">Copyright © xx All rights reserved.</div>
                    </div>
                </Footer>
            </Layout>
            {/*</BrowserRouter>*/}
            <Modal title="이용약관" visible={isModalVisible1} onOk={closeModal1} onCancel={closeModal1}>
                <TextArea autoSize={true} value={terms1}></TextArea>
            </Modal>
            <Modal title="개인정보 수집 및 이용 동의" visible={isModalVisible2} onOk={closeModal2} onCancel={closeModal2}>
                <TextArea autoSize={true} value={terms2}></TextArea>
            </Modal>
        </div>
    );
};

export default BuyerContainer;