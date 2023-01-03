import React, {useEffect, useState} from 'react';
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

    useEffect(() => {
        goNextStep();
    }, [])

    const goBack = () => {
        navigate("/login/signup/"+signupType+"/step1");
    }

    const goNextStep = () => {
        BuyerAPI.checkplusCheck()
            .then(res => {
                if(!(res.hasOwnProperty("sConnInfo") && res.hasOwnProperty("sMobileNo") && res.hasOwnProperty("sName"))){
                    Message.warn("본인인증이 정상적으로 처리되지 않았습니다. 다시 시도해주세요.");
                } else {
                    navigate("/login/signup/"+signupType+"/step2", {
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
                        <br/>
                        <p>본인인증 중입니다... 진행에 문제가 있으실 경우 뒤로가기를 눌러 다시 시도해주세요.</p>
                    </Col>
                </Row>
                <Row className='spacerTop'>
                    <Col span={"24"}>
                        <Button onClick={goBack}  className='btn-color02-2'>뒤로가기</Button>
                    </Col>
                </Row>
            </Content>
        </div>
    );
};

export default BuyerSignupCompany;