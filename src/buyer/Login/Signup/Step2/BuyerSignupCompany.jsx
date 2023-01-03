import React, {useEffect, useState} from 'react';
import 'antd/dist/antd.css';
import {Button, Checkbox, Col, Form, Input, Layout, PageHeader, Row, Steps, Modal} from 'antd';
import {Link, useLocation, useNavigate, useParams} from "react-router-dom";
import TextArea from "antd/es/input/TextArea";
import {Message} from "../../../../component";
import * as BuyerAPI from "../../../../admin/api/Buyer";

const {Content} = Layout;
const { Step } = Steps;

const BuyerSignupCompany = function () {
    const navigate = useNavigate();
    const params = useParams();
    const location = useLocation();
    const ci = (location.state !== undefined && location.state !== null ? (location.state.hasOwnProperty('sConnInfo') ? location.state.sConnInfo : "") : []);
    const sMobileNo = (location.state !== undefined && location.state !== null ? (location.state.hasOwnProperty('sMobileNo') ? location.state.sMobileNo : "") : []);
    const sName = (location.state !== undefined && location.state !== null ? (location.state.hasOwnProperty('sName') ? location.state.sName : "") : []);

    const checkboxList = ["checkbox-normal", "checkbox-privacy"];
    const [checkItems, setCheckItems] = useState([]);
    const [terms1, setTerms1] = useState("");
    const [terms2, setTerms2] = useState("");
    const [isResult, setIsResult] = useState(false);


    // 체크박스 전체 선택
    const handleAllCheck = (checked) => {
        if(checked) {
            const idArray = [];
            checkboxList.forEach((el) => idArray.push(el));
            setCheckItems(idArray);
        }
        else {
            setCheckItems([]);
        }
    }

    // 체크박스 단일 선택
    const handleSingleCheck = (e) => {
        if (e.target.checked) {
            setCheckItems(prev => [...prev, e.target.name]);
        } else {
            setCheckItems(checkItems.filter((el) => el !== e.target.name));
        }
    };

    const goNext = (ci, sMobileNo, sName) => {
        navigate("/login/signup/company/step3", {
            state:{
                sConnInfo: ci,
                sMobileNo: sMobileNo,
                sName: sName
            }
        })
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
                setIsResult(true)
            })
            .catch(err => {
                Message.error(err);
            })
    }

    const changeHTML = (str) => {
        var parser = new DOMParser();
        var doc = parser.parseFromString(str, 'text/html');
        return doc.body;
    }

    useEffect(() => {
        showTerms("1");
        showTerms("2");
    }, [])


    return (
        <div>
            <Content>
                <Row>
                    <Col span={"24"}>
                        <Steps current={0}  className="container3step">
                            <Step title="본인인증 및 약관동의" description="" />
                            <Step title="회원정보입력"  description="" />
                            <Step title="가입완료" description="" />
                        </Steps>
                    </Col>
                </Row>
                <div className='loginTitle'>
                    약관동의
                </div>
                <Row>
                    <Col span={"24"}  className='loginTextbox'>
                        
                    </Col>
                    <div className='loginCheckbox'>
                        <Checkbox name='checkbox-all' onChange={(e) => handleAllCheck(e.target.checked)} checked={checkItems.length === checkboxList.length ? true : false}> 아래 모든 내용을 읽고 확인 후, 전체 동의합니다. </Checkbox>
                    </div>
                    
                </Row>
                <Row>
                    <Col span={"24"}>
                        <PageHeader
                            title="이용약관(필수)"
                            extra={[
                                <Button onClick={showModal1} key="1">전체보기</Button>
                            ]}
                        >
                            <TextArea autoSize={{maxRows:6}} value={terms1}>약관내용</TextArea>
                            <br/>
                            <div className='loginCheckbox'>
                                <Checkbox name="checkbox-normal" onChange={(e) => handleSingleCheck(e)} checked={checkItems.includes("checkbox-normal") ? true : false}> 위의 내용을 읽고 이에 동의합니다. </Checkbox>
                                </div>
                            
                        </PageHeader>
                        <br/>
                        <PageHeader
                            title="개인정보 수집 및 이용 동의(필수)"
                            extra={[
                                <Button onClick={showModal2} key="1">전체보기</Button>
                            ]}
                        >
                            <TextArea autoSize={{maxRows:6}} value={terms2}>약관내용</TextArea>
                            <br/>
                            <div className='loginCheckbox'>
                                <Checkbox name="checkbox-privacy" onChange={(e) => handleSingleCheck(e)} checked={checkItems.includes("checkbox-privacy") ? true : false}> 위의 내용을 읽고 이에 동의합니다.  </Checkbox>
                            </div>
                            
                        </PageHeader>
                    </Col>
                </Row>
                <Row>
                    <Col span={"24"}>
                        <Button href="/login/signup/company/step1" className='btn-color02-2 btn-huge btn-fix1'  style={{width: "300px"}}>취소</Button> <Button type="primary" onClick={e => {goNext(ci, sMobileNo, sName)}}  className='btn-color02 btn-huge' style={{width: "300px"}} disabled={checkItems.length === checkboxList.length ? false : true}>다음단계</Button>
                    </Col>
                </Row>
            </Content>
            <Modal title="이용약관" visible={isModalVisible1} onOk={closeModal1} onCancel={closeModal1}>
                {terms1}
            </Modal>
            <Modal title="개인정보 수집 및 이용 동의" visible={isModalVisible2} onOk={closeModal2} onCancel={closeModal2}>
                {terms2}
            </Modal>
            <br/><br/><br/>
        </div>
    );
};

export default BuyerSignupCompany;