import React from 'react';
import 'antd/dist/antd.css';
import {Button, Col, Layout, Row, Steps} from 'antd';
import {useNavigate} from "react-router-dom";

const {Content} = Layout;
const { Step } = Steps;

const BuyerSignupPharmacy = function () {
    const navigate = useNavigate();
    const signupType = "pharmacy";

    const goBack = () => {
        navigate("/login/signup/"+signupType+"/step1");
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
                    본인인증 실패
                </div>
                <Row className='spacerTop'>
                    <Col span={"24"}>
                        <br/>
                        <p>본인인증에 실패하셨습니다. 다시 시도해주세요.</p>
                    </Col>
                </Row>
                <Row className='spacerTop'>
                    <Col span={"24"}>
                        <Button onClick={goBack} className="btn-color02 btn-huge">뒤로가기</Button>
                    </Col>
                </Row>
            </Content>
        </div>
    );
};

export default BuyerSignupPharmacy;