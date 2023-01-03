import React, {useState} from 'react';
import 'antd/dist/antd.css';
import {Button, Col, Form, Input, Layout, Row, Steps} from 'antd';
import {Link, useNavigate} from "react-router-dom";
import * as BuyerAPI from "../../../../admin/api/Buyer";
import {Message} from "../../../../component";

const {Content} = Layout;
const { Step } = Steps;

const BuyerSignupCompany = function () {
    const navigate = useNavigate();
    const signupType = "company";

    const checkplus = () => {
        // let pop = window.open(process.env.REACT_APP_API_HOST+'/checkplus/main', 'popupChk1', 'width=500, height=550, top=100, left=100, fullscreen=no, menubar=no, status=no, toolbar=no, titlebar=yes, location=no, scrollbar=no');
        // setTimeout(() => pop.close(), 5000);
        window.location.href = process.env.REACT_APP_API_HOST+'/checkplus/main?signupType='+signupType;
    }

    const goNextStep = () => {
        BuyerAPI.checkplusCheck()
            .then(res => {
                if(!(res.hasOwnProperty("sConnInfo") && res.hasOwnProperty("sMobileNo") && res.hasOwnProperty("sName"))){
                    Message.warn("본인인증을 완료하고 다음단계로 넘어가주세요.");
                } else {
                    navigate("/login/signup/company/step2", {
                        state:{
                            sConnInfo: res.sConnInfo,
                            sMobileNo: res.sMobileNo,
                            sName: res.sName
                        }
                    });
                }
            })
            .catch(err => {
                Message.error("Error - "+err);
            })
    }

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
                    본인인증
                </div>
                <Row className='spacerTop'>
                    <Col span={"24"}>
                        <img src="/images/img_certification.png" />
                    </Col>
                </Row>
                <Row>
                    <Col span={"24"}>
                        <br/>
                        <p>소중한 개인정보 보호를 위해 본인인증을 해주세요.</p>
                    </Col>
                </Row>
                <Row className='spacerTop'>
                    <Col span={"24"}>
                        <Button onClick={checkplus} className="btn-color02 btn-huge">본인인증</Button>
                    </Col>
                </Row>
            </Content>
        </div>
    );
};

export default BuyerSignupCompany;