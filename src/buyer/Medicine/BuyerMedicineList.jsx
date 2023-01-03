import React, {useCallback, useEffect, useState} from 'react';
import 'antd/dist/antd.css';
import {
    Breadcrumb,
    Button,
    Col,
    Divider,
    Form,
    Image,
    InputNumber,
    PageHeader,
    Pagination,
    Popconfirm,
    Row
} from 'antd';
import { Card } from 'antd';
import {Message} from "../../component";
import * as MedicineAPI from "../../admin/api/Medicine";
import * as CommonJs from "../../lib/Common";
import moment from "moment";
import './BuyerMedicineList.css';
import {Link, useLocation, useNavigate} from "react-router-dom";
import * as OrderAPI from "../../admin/api/Order";
import {ShoppingCartOutlined} from "@ant-design/icons";

const { Meta } = Card;

const BuyerMedicineList = function (props) {
    const nowPage = props.nowPage;
    const navigate = useNavigate();
    const location = useLocation();
    const [isResult, setIsResult] = useState(false);
    const [form] = Form.useForm();
    const [_total, setTotal] = useState(0);
    const [dataList, setDataList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [_pageNo, setPageNo] = useState(1);
    const [_len, setLen] = useState(12);
    const [quantityList, setQuantityList] = useState([]);

    const gnbMain_ = (location.state !== undefined && location.state !== null ? (location.state.hasOwnProperty('searchConditionSelect') ? location.state.searchConditionSelect : "") : []);
    const gnbSub1_ = (location.state !== undefined && location.state !== null ? (location.state.hasOwnProperty('searchConditionText') ? location.state.searchConditionText : "") : []);

    const [gnbMain, setGnbMain] = useState();

    const _onSearch = useCallback((pageNo = _pageNo, len = _len) => {
        form.validateFields()
            .then(values => {
                values.searchConditionSelect = (location.state !== undefined && location.state !== null ? (location.state.hasOwnProperty('searchConditionSelect') ? location.state.searchConditionSelect : []) : []);
                values.searchConditionText = (location.state !== undefined && location.state !== null ? (location.state.hasOwnProperty('searchConditionText') ? location.state.searchConditionText : []) : []);

                values.pageNo = pageNo;
                values.len = len;

                setPageNo(pageNo);
                setLen(len);

                values.sortName = (location.state !== undefined && location.state !== null ? (location.state.hasOwnProperty('sortName') ? location.state.sortName : []) : []);
                values.sortType = (location.state !== undefined && location.state !== null ? (location.state.hasOwnProperty('sortType') ? location.state.sortType : []) : []);

                const tmp = (location.state !== undefined && location.state !== null ? (location.state.hasOwnProperty('pageInititate') ? location.state.pageInititate : false) : false);
                console.log(tmp)
                if(tmp){
                    values.pageNo = 1;
                    setPageNo(1);
                    location.state.pageInititate = false;
                }

                const keys = Object.keys(values);
                let _values = {};
                for (let i = 0, len = keys.length; i < len; ++i) {
                    const key = keys[i];
                    const val = values[key];
                    if (!val) {
                        _values[key] = val;
                    } else {
                        if (val instanceof moment) {
                            const ins = form.getFieldInstance(key);
                            _values[key] = moment(val).format(ins && ins.props && ins.props.format ? ins.props.format : (val._f || 'YYYY-MM-DD'));
                        } else {
                            _values[key] = val;
                        }
                    }
                }
                _onList(values);
            })
    }, [form, _pageNo, _len, _onList, setPageNo, setLen, location, setDataList, setTotal, setIsResult]);
    const handlePageSize = useCallback((len) => {
        setLen(len);
        _onSearch(_pageNo, len);
    }, [_onSearch, setLen, _pageNo]);
    const handlePageNo = useCallback((pageNo, len) => {
        setPageNo(pageNo);
        _onSearch(pageNo, len);
    }, [_onSearch, setPageNo]);
    const _onList = (values) => {
        console.log(values);
        MedicineAPI.buyerList(values)
            .then((response) => {
                console.log(response);
                let res = response.data;
                const total = res.totalElements || 0;
                const list = res.content || [];
                if(total !== 0){
                    setTotal(total);
                    setDataList(list);
                    const tmp = list.map(item => {
                        return {
                            seq: item.seq,
                            quantity: 1
                        }
                    });
                    console.log(tmp);
                    setQuantityList(tmp)
                    setIsResult(true);
                } else {
                    setIsResult(false);
                }
            })
            .catch((error) => {
                Message.error(error.message);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }

    const settingGnbMain = () => {
        if(gnbMain_ === "factory") {
            return "";
        } else if(gnbMain_ === "specialtyDivision0") {
            return "";
        } else if(gnbMain_ === "specialtyDivision1") {
            return "";
        } else if(gnbMain_ === "formulaDivision") {
            return "";
        } else {
            return gnbMain_;
        }
    }

    const [nowPage_, setNowPage_] = useState("");
    useEffect(() => {
        if(nowPage === "main"){
            setNowPage_("/buyer");
        } else {
            setNowPage_("/buyer/medicine/list");
        }
        setGnbMain(settingGnbMain(gnbMain_));
       _onSearch();
    }, [setDataList, location, setDataList, setTotal, setIsResult, setGnbMain]);

    const setCart = (product, quantityList) => {
        console.log(product);
        console.log(quantityList);
        let quantity = 1;
        const idx = quantityList.findIndex(item => item.seq === product.seq);
        if(idx != -1) quantity = quantityList[idx].quantity;
        console.log(quantity);
        OrderAPI.setCart({
            map: {
                quantity: quantity,
                productSeq: product.seq
            }

        }).then(res => {
            console.log(res);
        }).catch(err => {
            Message.error(err);
        })
    };

    const changeProductCount = (e, seq, quantityList) => {
        console.log(quantityList);
        console.log(seq);
        console.log(e);
        const idx = quantityList.findIndex(item => item.seq === seq);
        if(idx != -1) quantityList[idx].quantity = e;
        setQuantityList(quantityList);
        console.log(quantityList);
    }

    const onConfirm = useCallback(() => {
        navigate("/buyer/cart");
    }, []);

    return (
        <div className='medicine-list-container'>
            {
                isResult && (
                    <div>
                        <Row>
                            <Col span={"8"}></Col>
                            <Col span={"8"}>
                                {
                                    (gnbMain.length > 0 && gnbMain !== undefined && gnbMain !== null) &&
                                    (
                                        <div>
                                            <div className="pageTitle">
                                                <div>{gnbMain}</div>
                                            </div>
                                            <div title={gnbSub1_} className="breadcrumbContainer">
                                                <Breadcrumb separator=">">
                                                    <Breadcrumb.Item>홈</Breadcrumb.Item>
                                                    <Breadcrumb.Item>{gnbMain}</Breadcrumb.Item>
                                                    <Breadcrumb.Item>{gnbSub1_}</Breadcrumb.Item>
                                                </Breadcrumb>
                                            </div>
                                        </div>
                                    )
                                }
                                {
                                    gnbMain.length === 0 &&
                                    (
                                        <div>
                                            <br/>
                                            <div className="pageTitle">
                                                <div>전체</div>
                                            </div>
                                            <div title={gnbSub1_} className="breadcrumbContainer">
                                                <Breadcrumb separator=">">
                                                    <Breadcrumb.Item>홈</Breadcrumb.Item>
                                                    <Breadcrumb.Item>전체</Breadcrumb.Item>
                                                </Breadcrumb>
                                            </div>
                                        </div>
                                    )
                                }
                            </Col>
                            <Col span={"8"}></Col>
                        </Row>
                        <Row className='productListSort'>
                            <Link to={nowPage_} state={{
                                pageNo: _pageNo,
                                len: _len,
                                searchConditionText: "",
                                searchConditionSelect: "",
                                sortName: "amount",
                                sortType: "desc",
                                pageInititate: true
                            }}>
                                높은 가격순
                            </Link>
                            <Link to={nowPage_} state={{
                                pageNo: _pageNo,
                                len: _len,
                                searchConditionText: "",
                                searchConditionSelect: "",
                                sortName: "amount",
                                sortType: "asc",
                                pageInititate: true
                            }}>
                                낮은 가격순
                            </Link>
                            <Link to={nowPage_} state={{
                                pageNo: _pageNo,
                                len: _len,
                                searchConditionText: "",
                                searchConditionSelect: "",
                                pageInititate: true
                            }}>
                                최신순
                            </Link>
                        </Row>
                        <br/>
                        <Row className='productListContainer'>
                            {
                                dataList.map((product) => (
                                    <Col span={"6"}>
                                        <Card className='medicine-list-card medicine-list-img'
                                            cover={
                                                <a href={"/buyer/medicine/detail/"+product['seq']}>
                                                    <Image
                                                        preview={false}
                                                        src= {(product.hasOwnProperty('fileList') && product.fileList.length > 0 ? product.fileList[0].fullFilePath : 'data:image/png;base64,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') || "error"}
                                                        fallback="data:image/png;base64,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"
                                                    />
                                                </a>
                                            }
                                            actions={[
                                                <InputNumber onChange={e => changeProductCount(e, product.seq, quantityList)} min={1} defaultValue={1} className={"count-input medicine-list-card-input-number"}/>,
                                                <Popconfirm placement="topLeft" title={'장바구니에 상품을 담았습니다. 장바구니로 이동하시겠습니까?'}
                                                            onConfirm={onConfirm} okText="확인" cancelText="취소">
                                                    <Button onClick={e => setCart(product, quantityList)}>담기</Button>
                                                </Popconfirm>
                                            ]}
                                        >
                                            <Meta
                                                title={product['name']}
                                                description={(
                                                    <div className='medicine-list-card-description'>
                                                        <p className='factory'>{product['factory']}</p>
                                                        <p className='name'>{product['productDisplayName']}</p>                                                                                                                
                                                    </div>
                                                )}
                                            />
                                            <div className='price'>{product.buyerTypeProductAmountList[0].amount.toLocaleString()}원</div>   
                                        </Card>
                                        
                                    </Col>
                                ))
                            }
                        </Row>
                        <br/>
                        <Row>
                            <Pagination
                                pageSizeOptions={[
                                    12, 24, 48, 84, 96
                                ]}
                                size={12}
                                total={_total}
                                showTotal={(total, range) => `총 ${CommonJs.makeComma(total)} 개 중 ${CommonJs.makeComma(range[0])}-${CommonJs.makeComma(range[1])}`}
                                defaultPageSize={_len}
                                pageSize={_len}
                                defaultCurrent={_pageNo}
                                current={_pageNo}
                                className={'pagination medicine-list-pagination'}
                                onShowSizeChange={(current, size) => handlePageSize(size)}
                                onChange={(page, pageSize) => handlePageNo(page, pageSize)}
                                disabled={isLoading}
                                showSizeChanger={true}
                            />
                        </Row>
                    </div>
                )
            }
            {
                !isResult && (
                    <div>
                        <Row>
                            <Col span={"8"}></Col>
                            <Col span={"8"}>
                                <div className="pageTitle">
                                    <div>{gnbMain}</div>
                                </div>
                                <div title={gnbSub1_} className="breadcrumbContainer">
                                    <Breadcrumb separator=">">
                                        <Breadcrumb.Item>홈</Breadcrumb.Item>
                                        <Breadcrumb.Item>{gnbMain}</Breadcrumb.Item>
                                        <Breadcrumb.Item>{gnbSub1_}</Breadcrumb.Item>
                                    </Breadcrumb>
                                </div>
                            </Col>
                            <Col span={"8"}></Col>
                        </Row>
                        <div className='medicine-list-none-container'>
                            <div className='description'>
                                <p className='title'>검색하신 요건에 대한 검색결과가 없습니다.</p>
                                <p></p>
                            </div>
                        </div>
                        <div className='medicine-list-button'>
                            <Button onClick={e => navigate("/buyer/medicine/list")}>돌아가기</Button><Button type="primary" onClick={e => navigate("/buyer")}>메인으로</Button>
                        </div>
                    </div>
                )
            }
        </div>
    );
};

export default BuyerMedicineList;
