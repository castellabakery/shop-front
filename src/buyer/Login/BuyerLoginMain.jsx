import React from 'react';
import 'antd/dist/antd.css';
import '../BuyerContainer.css';
import {Link, useNavigate} from "react-router-dom";
import {Button, Col, Form, Input, Layout, Row} from 'antd';
import {Message} from "../../component";
import * as CommonAPI from "../../component/Common";
import * as LoginAPI from "../../admin/api/Login";

const {Content} = Layout;

const BuyerLoginMain = function () {
    const navigate = useNavigate();
    const onFinishFailed = (errorInfo) => {
        // Message.error('Failed:', errorInfo);
    };
    const onFinish = (values) => {
        // values._csrf = CommonAPI.getCookie("XSRF-TOKEN");
        values.userType = "buyer";
        fetch(process.env.REACT_APP_API_HOST+"/login-process", {
            method: "POST",
            body: new URLSearchParams(values),
            credentials: 'include'
        })
            .then(v => {
                console.log(v);
                if(v.url.includes('/fail')){
                    Message.error("아이디 또는 비밀번호를 확인해주세요.");
                } else {
                    LoginAPI.getToken().then((v) => {
                        localStorage.setItem("token", v);
                        window.location = '/buyer';
                    });
                }
            })
            .catch(e => Message.error(e))
    }

    return (
        <div>
            <Content>
                <div className="buyer-content">
                    <Row>
                        <Col span={"12"} className="borderRight">
                            <div className='pageTitle color01'>로그인</div>
                            <Form
                                name="basic"
                                labelCol={{
                                    span: 24,
                                }}
                                wrapperCol={{
                                    span: 24,
                                }}
                                initialValues={{
                                    remember: true,
                                }}
                                onFinish={onFinish}
                                onFinishFailed={onFinishFailed}
                                className="ant-form-vertical loginForm"
                                autoComplete="off"

                            >
                                
                                    <Input type="hidden"/>
                                

                                <Form.Item
                                    label="아이디"
                                    name="username"
                                    className='spacerTop'
                                    rules={[
                                        {
                                            required: true,
                                            message: '아이디를 입력해주세요.',
                                        },
                                    ]}
                                >
                                    <Input placeholder={"아이디를 입력해주세요."} className="loginInput"/>
                                </Form.Item>

                                <Form.Item
                                    label="비밀번호"
                                    name="password"
                                    rules={[
                                        {
                                            required: true,
                                            message: '비밀번호를 입력해주세요.',
                                        },
                                    ]}
                                >
                                    <Input.Password placeholder={"비밀번호를 입력해주세요."}  className="loginInput" />
                                </Form.Item>

                                <Form.Item
                                    wrapperCol={{
                                        offset: 0,
                                        span: 24,
                                    }}
                                >
                                    <Button type="primary" htmlType="submit" className='btnLogin'>
                                        로그인
                                    </Button>
                                </Form.Item>
                            </Form>
                            <br/>
                            <br/>
                            <p style={{color:"grey"}}></p>
                        </Col>
                        <Col span={"12"}>
                            <div className='pageTitle'>회원가입</div>
                            <div>

                                <p><Button type="primary" className="btnLogin btn-color02" style={{width:300}} onClick={e => navigate("/login/signup/hospital/step1")}> 회원가입</Button></p>
                            </div>
                            <div className='color02'>
                            </div>
                        </Col>
                    </Row>
                  
                </div>
            </Content>
        </div>
    );
};

export default BuyerLoginMain;