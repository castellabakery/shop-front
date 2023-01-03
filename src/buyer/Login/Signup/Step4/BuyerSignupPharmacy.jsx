import React from 'react';
import 'antd/dist/antd.css';
import {Button, Col, Form, Input, Layout, Row, Steps} from 'antd';
import {Link} from "react-router-dom";

const {Content} = Layout;
const { Step } = Steps;

const BuyerSignupPharmacy = function () {

    return (
        <div>
            <Content>
                <Row>
                    <Col span={"24"}>
                        <Steps current={2}  className="container3step">
                            <Step title="본인인증 및 약관동의" description="" />
                            <Step title="회원정보입력"  description="" />
                            <Step title="가입완료" description="" />
                        </Steps>
                    </Col>
                </Row>
                <Row>
                    <Col span={"24"}>
                    <div className='spacerTop'>
                            <img src="/images/pic_done.png"></img>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col span={"24"}>
                        <Button href="/login" className='btn-color02-2 btn-huge btn-fix1' style={{width: "300px"}}>로그인페이지로 이동</Button>
                    </Col>
                </Row>
            </Content>
        </div>
    );
};

export default BuyerSignupPharmacy;