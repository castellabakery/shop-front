import React, {useCallback, useEffect, useState} from 'react';
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {Button, Popconfirm, Modal, Input, Form, Radio} from "antd";

import '../BuyerDetail.css';

import AdminPageHeader from "../../../AdminPageHeader";
import {Message} from "../../../../component";

import * as BuyerAPI from "../../../api/Buyer";

import BuyerApproveDetailDescription_Hospital from "./BuyerApproveDetailDescription_Hospital";
import BuyerApproveDetailDescription_Company from "./BuyerApproveDetailDescription_Company";
import BuyerApproveDetailDescription_Medicine from "./BuyerApproveDetailDescription_Medicine";
import * as LoginAPI from "../../../api/Login";

const { TextArea } = Input;
const BuyerApproveDetail = function (props) {
    const urlNow = '/detail';
    const urlPrefix = '/admin/approve';
    const navigate = useNavigate();
    const location = useLocation();
    const params = useParams();
    const id = Number(params.id);
    const [form] = Form.useForm();
    const [checkData, setCheckData] = useState({
        isLoading: false,
        isInitialize: false,
    });
    const [initData, setInitData] = useState({
        result: {},
    });
    const [wInitData, setWInitData] = useState({
        result: {},
    });
    const requestParam = {
        map: {
            seq: id
        }
    };
    const [adminInfo, setAdminInfo] = useState("");
    const [isResult, setIsResult] = useState(false);
    const getAdminInfo = () => {
        LoginAPI.getAdminInfo()
            .then(res => {
                console.log(res);
                setAdminInfo(res.data.name + "(" + res.data.adminId + ")");
            })
            .catch(err => {
                Message.error(err);
            })
    }
    useEffect(() => {
        getAdminInfo();
        if (!checkData.isInitialize) {
            setCheckData((p) => {
                return {
                    ...p,
                    isInitialize: true,
                    isLoading: true,
                }
            })
            BuyerAPI.tmpGet(requestParam)
                .then((response) => {
                    console.log(response);
                    setInitData((p) => {
                        return {
                            ...p,
                            result: response.data || {},
                        }
                    });
                    setCheckData((p) => {
                        return {
                            ...p,
                            isLoading: false,
                        }
                    })
                    if(response.data.state !== "R") {
                        BuyerAPI.get({
                            map: {
                                buyerIdentificationCode: response.data['buyerIdentificationCode']
                            }
                        }).then((wResponse) => {
                            console.log(wResponse);
                            setWInitData((wp) => {
                                return {
                                    ...wp,
                                    result: wResponse.data || {},
                                }
                            });
                            setIsResult(true);
                        })
                            .catch((error) => {
                                Message.error(error.message);
                            });
                    }
                })
                .catch((error) => {
                    Message.error(error.message);
                })
        }
    }, [checkData, setCheckData, setInitData, id]);
    const onAprov = useCallback(() => {
        if (checkData.isLoading) {
            return;
        }
        setCheckData((p) => {
            return {
                ...p,
                isLoading: true,
            }
        });
        BuyerAPI.tmpAprvDeny({
            map:{
                tmpSeq: id,
                changeState: 'D'
            }
        })
            .then(() => {
                Message.success('????????? ?????? ???????????????.');
                onList();
            }).catch((error) => {
                Message.error(error.message);
                setCheckData((p) => {
                    return {
                        ...p,
                        isLoading: false,
                    }
                })
            });
    }, [id, setCheckData, checkData]);
    const onList = useCallback(() => {
        navigate(urlPrefix + '/list' + location.search);
    }, []);
    const onUpdate = () => {
        navigate(urlPrefix + '/update/' + id);
    }
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
            map:{
                tmpSeq: id,
                changeState: 'J',
                rejectedMsg: values.rejectedMsg
            }
        };
        console.log(param);
        const func = BuyerAPI.tmpAprvDeny;
        func(param)
            .then((res) => {
                console.log(res);
                if(res.code !== 1000){
                    Message.error("?????? ????????? ??????????????????. ?????? ??????????????????. (???????????? : " + res.code + ")");
                    return;
                }
                Message.success('??????????????? ' + '??????' + '???????????????.');
                onList();
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
        <div className="buyer-detail-layout">
            <AdminPageHeader title={"????????????"} subTitle={"????????????-??????"}/>
            <div className={'detail_wrap'}>
                <Form
                    layout={'vertical'}
                    form={form}
                    onFinish={onSubmit}
                    onFinishFailed={onFailForm}
                >
                    {
                        (initData.result.hasOwnProperty('buyerType') && initData.result['buyerType'] === 'M') &&
                        <BuyerApproveDetailDescription_Hospital isResult={isResult} detailData={initData} wDetailData={wInitData} detailId={id} urlNow={urlNow}/>
                    }
                    {
                        (initData.result.hasOwnProperty('buyerType') && initData.result['buyerType'] === 'W') &&
                        <BuyerApproveDetailDescription_Company isResult={isResult} detailData={initData} wDetailData={wInitData} detailId={id} urlNow={urlNow}/>
                    }
                    {
                        (initData.result.hasOwnProperty('buyerType') && initData.result['buyerType'] === 'P') &&
                        <BuyerApproveDetailDescription_Medicine isResult={isResult} detailData={initData} wDetailData={wInitData} detailId={id} urlNow={urlNow}/>
                    }
                <br/>
                </Form>
                {
                    initData.result['state'] == "R" &&
                <div className={'button_div'}>
                    <Popconfirm placement="topLeft" title={'?????? ????????? ???????????? ???????????????????'} onConfirm={onAprov} okText="??????" cancelText="??????">
                        <Button type={'primary'} danger>????????????</Button>
                    </Popconfirm>
                    <Button type={'primary'} onClick={showModal}>????????????</Button>
                    <Button onClick={onList}>??????</Button>
                    <Modal title="???????????? ??????" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                        <Form
                            layout={'vertical'}
                            form={form}
                            onFinish={onSubmit}
                            onFinishFailed={onFailForm}
                        >
                            <Form.Item label="?????????"
                                       name="name"
                                       initialValue={adminInfo}
                                       required={true}
                                       rules={[{
                                           required: false,
                                       },
                                       ]}
                            >
                                <Input placeholder='?????????' disabled={true}/>
                            </Form.Item>
                            <Form.Item label="??????????????????"
                                       name="rejectedMsg"
                                       required={true}
                                       rules={[{
                                           required: true,
                                           message: "????????????????????? ??????????????????."
                                       },
                                       ]}
                            >
                                <TextArea placeholder='??????????????????' disabled={false}/>
                            </Form.Item>
                        </Form>
                    </Modal>
                </div>
                }
                {
                    initData.result['state'] == "W" &&
                    <div className={'button_div'}>
                        <Popconfirm placement="topLeft" title={'?????? ????????? ???????????? ???????????????????'} onConfirm={onAprov} okText="??????" cancelText="??????">
                            <Button type={'primary'} danger>????????????</Button>
                        </Popconfirm>
                        <Button type={'primary'} onClick={showModal}>????????????</Button>
                        <Button onClick={onList}>??????</Button>
                        <Modal title="???????????? ??????" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                            <Form
                                layout={'vertical'}
                                form={form}
                                onFinish={onSubmit}
                                onFinishFailed={onFailForm}
                            >
                                <Form.Item label="?????????"
                                           name="name"
                                           initialValue={adminInfo}
                                           required={true}
                                           rules={[{
                                               required: false,
                                           },
                                           ]}
                                >
                                    <Input placeholder='?????????' disabled={true}/>
                                </Form.Item>
                                <Form.Item label="??????????????????"
                                           name="rejectedMsg"
                                           required={true}
                                           rules={[{
                                               required: true,
                                               message: "????????????????????? ??????????????????."
                                           },
                                           ]}
                                >
                                    <TextArea placeholder='??????????????????' disabled={false}/>
                                </Form.Item>
                            </Form>
                        </Modal>
                    </div>
                }
            </div>
        </div>
    );
};

export default BuyerApproveDetail;
