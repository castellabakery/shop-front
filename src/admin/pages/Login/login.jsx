import {Button, Form, Input, Layout} from 'antd';
import './login.css';
import React from 'react';
import {Message} from "../../../component";
import * as LoginAPI from "../../api/Login";

const {Header, Content, Footer} = Layout;

const login = () => {
    const onFinishFailed = (errorInfo) => {
        Message.error('Failed:', errorInfo);
    };
    const onFinish = (values) => {
        // values._csrf = CommonAPI.getCookie("XSRF-TOKEN");
        values.userType = "admin";
        fetch(process.env.REACT_APP_API_HOST+"/login-process", {
            method: "POST",
            body: new URLSearchParams(values),
            credentials: 'include'
        })
            .then(v => {
                if (v.url.includes('/fail')) {
                    Message.error("아이디 또는 비밀번호를 확인해주세요.");
                } else {
                    LoginAPI.getToken().then((v) => {
                        localStorage.setItem("token", v);
                        window.location = '/admin';
                    });
                }
            })
            .catch(e => Message.error(e))
    }


    return (
        <Layout>
            <Header className="login-layout-header">관리자 로그인</Header>
            <Content className="login-layout-content">
                <Form
                    name="basic"
                    labelCol={{
                        span: 8,
                    }}
                    wrapperCol={{
                        span: 8,
                    }}
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item
                        name="_csrf"
                    >
                        <Input type="hidden"/>
                    </Form.Item>

                    <Form.Item
                        label="아이디"
                        name="username"
                        rules={[
                            {
                                required: true,
                                message: '아이디를 입력해주세요.',
                            },
                        ]}
                    >
                        <Input/>
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
                        <Input.Password/>
                    </Form.Item>

                    <Form.Item
                        wrapperCol={{
                            offset: 8,
                            span: 8,
                        }}
                    >
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </Content>
            <Footer></Footer>
        </Layout>
    );
};

export default login;