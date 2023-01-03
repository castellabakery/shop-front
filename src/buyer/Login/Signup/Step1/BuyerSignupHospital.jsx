import React, {useState} from 'react';
import 'antd/dist/antd.css';
import {Button, Col, Form, Input, Layout, Row, Steps} from 'antd';
import {Link, useNavigate} from "react-router-dom";
import * as BuyerAPI from "../../../../admin/api/Buyer";
import {Message} from "../../../../component";

const {Content} = Layout;
const { Step } = Steps;

const BuyerSignupHospital = function () {
    const navigate = useNavigate();
    const signupType = "hospital";

    const checkplus = () => {
        // let pop = window.open(process.env.REACT_APP_API_HOST+'/checkplus/main', 'popupChk1', 'width=500, height=550, top=100, left=100, fullscreen=no, menubar=no, status=no, toolbar=no, titlebar=yes, location=no, scrollbar=no');
        window.location.href = process.env.REACT_APP_API_HOST+'/checkplus/main?signupType='+signupType;
        // setTimeout(() => pop.close(), 5000);
    }

    const goNextStep = (sMobile, sName) => {
        BuyerAPI.checkplusCheck()
            .then(res => {
                if(!(res.hasOwnProperty("sConnInfo") && res.hasOwnProperty("sMobileNo") && res.hasOwnProperty("sName"))){
                    Message.warn("본인인증을 완료하고 다음단계로 넘어가주세요.");
                } else {
                    navigate("/login/signup/hospital/step2", {
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
                        <Steps current={0} className="container3step">
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
                    <Col span={"24"} >
                        <br/>
                        <p>소중한 개인정보 보호를 위해 본인인증을 해주세요.</p>
                    </Col>
                </Row>
                <Row className='spacerTop'>
                    <Col span={"24"}>
                        {/* 여기서 함수 onClick으로 바꾸고 서버 호출해서 본인인증한 데이터 있는지 확인 후 담으로 넘어가게 하면 될 것 같음. */}
                        {/*<Link to={"/login/signup/hospital/step2"}>다음단계</Link>*/}
                        <Button onClick={checkplus} className="btn-color02 btn-huge">본인인증</Button> {/*<Button type="primary" onClick={e => {goNextStep(sMobile, sName)}}>다음단계</Button>*/}
                    </Col>
                </Row>
            </Content>
        </div>
    );
};

export default BuyerSignupHospital;