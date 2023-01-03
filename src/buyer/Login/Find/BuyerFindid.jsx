import React, {useCallback, useState} from 'react';
import 'antd/dist/antd.css';
import {Button, Col, Form, Input, Layout, Modal, Row, Tabs} from 'antd';
import {Message} from "../../../component";
import * as CommonAPI from "../../../component/Common";
import * as LoginAPI from "../../../admin/api/Login";
import * as BuyerAPI from "../../../admin/api/Buyer";
import {Link, useNavigate} from "react-router-dom";

const {Content} = Layout;
const {TabPane} = Tabs;
const {TextArea} = Input;

const BuyerFindid = function () {
    const navigate = useNavigate();
    const [checkData, setCheckData] = useState({
        isLoading: false,
        isInitialize: false,
    });
    const [initData, setInitData] = useState({
        result: {},
    });
    const onFinishFailedId = (errorInfo) => {
        Message.error('Failed:', errorInfo);
    };
    const onFinishId = (values) => {
        values._csrf = CommonAPI.getCookie("XSRF-TOKEN");
        fetch("/login-process", {
            method: "POST",
            body: new URLSearchParams(values)
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
    const onFinishFailedPw = (errorInfo) => {
        Message.error('Failed:', errorInfo);
    };
    const onFinishPw = (values) => {
        values._csrf = CommonAPI.getCookie("XSRF-TOKEN");
        fetch("/login-process", {
            method: "POST",
            body: new URLSearchParams(values)
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
    const [form] = Form.useForm();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const showModal = () => {
        setIsModalVisible(true);
    };
    const handleOk = () => {
        form.submit();
        setIsModalVisible(false);
    };
    const handleCancel = () => {
        setIsModalVisible(false);
    };
    const onChange = () => {
    }
    const onFailForm = (errorInfo) => {
        Message.error(errorInfo['errorFields'][0].errors[0]);
    };
    const onSubmit = useCallback((values) => {
        if (checkData.isLoading) {
            return;
        }
        setCheckData((p) => {
            return {
                ...p,
                isLoading: true,
            }
        });
        const param = {
            tmpSeq: initData.result['seq'],
            buyerState: 'J'
        };
        const func = BuyerAPI.tmpAprvDeny;
        func(param)
            .then(() => {
                Message.success('회원가입이 ' + '거절' + '되었습니다.');
                // onList();
            }).catch((error) => {
            Message.error(error.message);
            setCheckData((p) => {
                return {
                    ...p,
                    isLoading: false,
                }
            })
        });
    }, [checkData, setCheckData]);

    return (
        <div>
            <Content>
                <Tabs defaultActiveKey="1" onChange={onChange} centered>
                    <TabPane tab="아이디 찾기" key="1">
                        <p><h1>아이디/비밀번호 찾기는 고객센터를 통해 문의바랍니다.</h1></p>
                        <br/>
                        <Button type="primary" onClick={e => navigate("/login")}>뒤로가기</Button>
                        {/*<Row>*/}
                        {/*    <Col span={"12"}>*/}
                        {/*        이메일로 아이디 찾기*/}
                        {/*        <br/>*/}
                        {/*        <Form*/}
                        {/*            name="basic"*/}
                        {/*            labelCol={{*/}
                        {/*                span: 8,*/}
                        {/*            }}*/}
                        {/*            wrapperCol={{*/}
                        {/*                span: 8,*/}
                        {/*            }}*/}
                        {/*            initialValues={{*/}
                        {/*                remember: true,*/}
                        {/*            }}*/}
                        {/*            onFinish={onFinishId}*/}
                        {/*            onFinishFailed={onFinishFailedId}*/}
                        {/*            autoComplete="off"*/}
                        {/*        >*/}
                        {/*            <Form.Item*/}
                        {/*                name="_csrf"*/}
                        {/*            >*/}
                        {/*                <Input type="hidden"/>*/}
                        {/*            </Form.Item>*/}

                        {/*            <Form.Item*/}
                        {/*                label=" "*/}
                        {/*                name="username"*/}
                        {/*                rules={[*/}
                        {/*                    {*/}
                        {/*                        required: true,*/}
                        {/*                        message: 'Please input your username!',*/}
                        {/*                    },*/}
                        {/*                ]}*/}
                        {/*            >*/}
                        {/*                <Input/>*/}
                        {/*            </Form.Item>*/}

                        {/*            <Form.Item*/}
                        {/*                label=" "*/}
                        {/*                name="password"*/}
                        {/*                rules={[*/}
                        {/*                    {*/}
                        {/*                        required: true,*/}
                        {/*                        message: 'Please input your password!',*/}
                        {/*                    },*/}
                        {/*                ]}*/}
                        {/*            >*/}
                        {/*                <Input.Password/>*/}
                        {/*            </Form.Item>*/}

                        {/*            <Form.Item*/}
                        {/*                wrapperCol={{*/}
                        {/*                    offset: 8,*/}
                        {/*                    span: 8,*/}
                        {/*                }}*/}
                        {/*            >*/}
                        {/*                <Button type="primary" htmlType="submit">*/}
                        {/*                    찾기*/}
                        {/*                </Button>*/}
                        {/*            </Form.Item>*/}
                        {/*        </Form>*/}
                        {/*    </Col>*/}
                        {/*    <Col span={"12"}>*/}
                        {/*        휴대번호로 아이디 찾기*/}
                        {/*        <br/>*/}
                        {/*        <Button>본인인증</Button>*/}
                        {/*    </Col>*/}
                        {/*</Row>*/}
                        {/*<Row>*/}
                        {/*    <Col span={"12"}>*/}
                        {/*        고객센터 1234-1234*/}
                        {/*    </Col>*/}
                        {/*    <Col span={"12"}>*/}
                        {/*        10:00 - 17:00*/}
                        {/*        BREAK TIME 12:00 - 13:00*/}
                        {/*        주말 및 공휴일 휴무*/}
                        {/*    </Col>*/}
                        {/*</Row>*/}
                    </TabPane>
                    <TabPane tab="비밀번호 찾기" key="2">
                        <p><h1>아이디/비밀번호 찾기는 고객센터를 통해 문의바랍니다.</h1></p>
                        <br/>
                        <Button type="primary" onClick={e => navigate("/login")}>뒤로가기</Button>
                        {/*<Row>*/}
                        {/*    <Col span={"12"}>*/}
                        {/*        이메일로 비밀번호 찾기*/}
                        {/*        <br/>*/}
                        {/*        <Form*/}
                        {/*            name="basic"*/}
                        {/*            labelCol={{*/}
                        {/*                span: 8,*/}
                        {/*            }}*/}
                        {/*            wrapperCol={{*/}
                        {/*                span: 8,*/}
                        {/*            }}*/}
                        {/*            initialValues={{*/}
                        {/*                remember: true,*/}
                        {/*            }}*/}
                        {/*            onFinish={onFinishPw}*/}
                        {/*            onFinishFailed={onFinishFailedPw}*/}
                        {/*            autoComplete="off"*/}
                        {/*        >*/}
                        {/*            <Form.Item*/}
                        {/*                name="_csrf"*/}
                        {/*            >*/}
                        {/*                <Input type="hidden"/>*/}
                        {/*            </Form.Item>*/}

                        {/*            <Form.Item*/}
                        {/*                label=" "*/}
                        {/*                name="username"*/}
                        {/*                rules={[*/}
                        {/*                    {*/}
                        {/*                        required: true,*/}
                        {/*                        message: 'Please input your username!',*/}
                        {/*                    },*/}
                        {/*                ]}*/}
                        {/*            >*/}
                        {/*                <Input/>*/}
                        {/*            </Form.Item>*/}

                        {/*            <Form.Item*/}
                        {/*                label=" "*/}
                        {/*                name="password"*/}
                        {/*                rules={[*/}
                        {/*                    {*/}
                        {/*                        required: true,*/}
                        {/*                        message: 'Please input your password!',*/}
                        {/*                    },*/}
                        {/*                ]}*/}
                        {/*            >*/}
                        {/*                <Input.Password/>*/}
                        {/*            </Form.Item>*/}

                        {/*            <Form.Item*/}
                        {/*                label=" "*/}
                        {/*                name="password"*/}
                        {/*                rules={[*/}
                        {/*                    {*/}
                        {/*                        required: true,*/}
                        {/*                        message: 'Please input your password!',*/}
                        {/*                    },*/}
                        {/*                ]}*/}
                        {/*            >*/}
                        {/*                <Input.Password/>*/}
                        {/*            </Form.Item>*/}

                        {/*            <Form.Item*/}
                        {/*                wrapperCol={{*/}
                        {/*                    offset: 8,*/}
                        {/*                    span: 8,*/}
                        {/*                }}*/}
                        {/*            >*/}
                        {/*                <Button type="primary" htmlType="submit">*/}
                        {/*                    찾기*/}
                        {/*                </Button>*/}
                        {/*            </Form.Item>*/}
                        {/*        </Form>*/}
                        {/*    </Col>*/}
                        {/*    <Col span={"12"}>*/}
                        {/*        휴대번호로 비밀번호 찾기*/}
                        {/*        <br/>*/}
                        {/*        <Form*/}
                        {/*            name="basic"*/}
                        {/*            labelCol={{*/}
                        {/*                span: 8,*/}
                        {/*            }}*/}
                        {/*            wrapperCol={{*/}
                        {/*                span: 8,*/}
                        {/*            }}*/}
                        {/*            initialValues={{*/}
                        {/*                remember: true,*/}
                        {/*            }}*/}
                        {/*            onFinish={onFinishPw}*/}
                        {/*            onFinishFailed={onFinishFailedPw}*/}
                        {/*            autoComplete="off"*/}
                        {/*        >*/}
                        {/*            <Form.Item*/}
                        {/*                name="_csrf"*/}
                        {/*            >*/}
                        {/*                <Input type="hidden"/>*/}
                        {/*            </Form.Item>*/}

                        {/*            <Form.Item*/}
                        {/*                label=" "*/}
                        {/*                name="username"*/}
                        {/*                rules={[*/}
                        {/*                    {*/}
                        {/*                        required: true,*/}
                        {/*                        message: 'Please input your username!',*/}
                        {/*                    },*/}
                        {/*                ]}*/}
                        {/*            >*/}
                        {/*                <Input/>*/}
                        {/*            </Form.Item>*/}
                        {/*        </Form>*/}
                        {/*        <br/>*/}
                        {/*        /!* 수정 필요 *!/*/}
                        {/*        <Button onClick={showModal}>본인인증</Button>*/}
                        {/*        <Modal title="인증이 완료되었습니다. 새로운 비밀번호를 입력해 주세요." visible={isModalVisible} onOk={handleOk}*/}
                        {/*               onCancel={handleCancel}>*/}
                        {/*            <Form*/}
                        {/*                layout={'vertical'}*/}
                        {/*                form={form}*/}
                        {/*                onFinish={onSubmit}*/}
                        {/*                onFinishFailed={onFailForm}*/}
                        {/*            >*/}
                        {/*                <Form.Item label=" "*/}
                        {/*                           name="name"*/}
                        {/*                           required={true}*/}
                        {/*                           rules={[{*/}
                        {/*                               required: false,*/}
                        {/*                           },*/}
                        {/*                           ]}*/}
                        {/*                >*/}
                        {/*                    <Input placeholder='새 비밀번호' disabled={true}/>*/}
                        {/*                </Form.Item>*/}
                        {/*                <Form.Item label=" "*/}
                        {/*                           name="reason"*/}
                        {/*                           required={true}*/}
                        {/*                           rules={[{*/}
                        {/*                               required: false,*/}
                        {/*                           },*/}
                        {/*                           ]}*/}
                        {/*                >*/}
                        {/*                    <TextArea placeholder='새 비밀빈호 확인' disabled={false}/>*/}
                        {/*                </Form.Item>*/}
                        {/*            </Form>*/}
                        {/*        </Modal>*/}
                        {/*    </Col>*/}
                        {/*</Row>*/}
                        {/*<Row>*/}
                        {/*    <Col span={"12"}>*/}
                        {/*        고객센터 1234-1234*/}
                        {/*    </Col>*/}
                        {/*    <Col span={"12"}>*/}
                        {/*        10:00 - 17:00*/}
                        {/*        BREAK TIME 12:00 - 13:00*/}
                        {/*        주말 및 공휴일 휴무*/}
                        {/*    </Col>*/}
                        {/*</Row>*/}
                    </TabPane>
                </Tabs>
                <br/>
            </Content>
        </div>
    );
};

export default BuyerFindid;