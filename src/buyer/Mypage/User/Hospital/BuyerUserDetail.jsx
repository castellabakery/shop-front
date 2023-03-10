import React, {useCallback, useEffect, useRef, useState} from 'react';
import 'antd/dist/antd.css';
import {Button, Descriptions, Form, Input, Modal, Popconfirm, Upload} from 'antd';
import {useNavigate, useParams} from "react-router-dom";
import {Message} from "../../../../component";
import './BuyerUserDetail.css';
import * as BuyerAPI from "../../../../admin/api/Buyer";
import * as FileAPI from "../../../../admin/api/File";
import PopupPostCode from "../../../Login/Signup/Common/PostCode/PopupPostCode";
import {UploadOutlined} from "@ant-design/icons";
import {buyerTmpModify} from "../../../../admin/api/Buyer";
import axios from "axios";

const BuyerUserDetail = function () {
    const [initializeData, setInitializeData] = useState({
        result: {},
    });
    const [isResult, setIsResult] = useState(false);
    const isUpdate = false;
    const [form] = Form.useForm();
    const [form2] = Form.useForm();
    const params = useParams();
    const id = Number(params.id);
    const navigate = useNavigate();
    const [checkData, setCheckData] = useState({
        isLoading: false,
        isInitialize: false,
    });
    const [fileList, setFileList] = useState([]);
    const [fileList2, setFileList2] = useState([]);
    const [oldPassValue, setOldPassValue] = useState([]);
    const [passValue, setPassValue] = useState([]);
    const [passCheckValue, setPassCheckValue] = useState([]);

    const uploadMaxCount = 1;

    useEffect(() => {
        _onList();
    }, []);
    const _onList = () => {
        const values = {
            map:{
            }
        };
        BuyerAPI.buyerGet(values)
            .then((response) => {
                console.log(response);
                let res = response.data;
                setInitializeData(res);
                setAddress(res.buyer.corpAddress);
                setCorpAddressDetail(res.buyer.addressDetail);
                setPostCode(res.buyer.addressPostNo);
                form.setFieldsValue({
                    addressPostNo: res.buyer.addressPostNo,
                    addressDetail: res.buyer.addressDetail
                })
                form.setFieldsValue({
                    addressPostNo: res.buyer.addressPostNo,
                    addressDetail: res.buyer.addressDetail
                })
                const arr1 = response.data.fileList.filter(item => item.delYn === "N" && item.fileType === 8)
                    .map(item => {
                        console.log(item);
                        return {
                            uid: item.seq,
                            name: item.orgFileName,
                            uploadFileName:item.uploadFileName,
                            status: 'done',
                            url: item.fullFilePath,
                            thumbUrl: item.fullFilePath,
                        };
                    })
                setFileList(arr1);
                const arr2 = response.data.fileList.filter(item => item.delYn === "N" && item.fileType === 9)
                    .map(item => {
                        console.log(item);
                        return {
                            uid: item.seq,
                            name: item.orgFileName,
                            uploadFileName:item.uploadFileName,
                            status: 'done',
                            url: item.fullFilePath,
                            thumbUrl: item.fullFilePath,
                        };
                    })
                setFileList2(arr2);
                setIsResult(true);
            })
            .catch((error) => {
                Message.error(error.message);
            });
    }

    const onSubmit2 = useCallback(values => {
        const func = BuyerAPI.modifyPassword;
        func({
            map:{
                oldPassword: values.orgPassword,
                newPassword: values.password
            }
        })
        .then((res) => {
            console.log(res);
            if(res.code !== 1000){
                if(res.code !== 1006){
                    alert("?????? ??????????????? ????????????.");
                    window.location.reload();
                    return;
                }
                alert("???????????? ????????? ?????????????????????. ?????? ??????????????????.");
                window.location.reload();
                return;
            }
            Message.success('???????????? ????????? ?????????????????????.');
            window.location.reload();
            // onList();
        }).catch((error) => {
            alert("???????????? ????????? ?????????????????????. ?????? ??????????????????.");
            window.location.reload();
        });
    }, [])

    const onSubmit = useCallback((values) => {
        let tmpTermsList = [];
        tmpTermsList.push({
            terms:{
                seq: 1
            },
            agreeYn: "Y"
        })
        tmpTermsList.push({
            terms:{
                seq: 2
            },
            agreeYn: "Y"
        })

        values.tmpBuyerTermsList = tmpTermsList;

        const func = BuyerAPI.buyerTmpModify;
        func({ "map": values })
            .then((res) => {
                console.log(res);
                if(res.code !== 1000){
                    Message.error("???????????? ????????? ?????????????????????. ?????? ??????????????????.");
                    return;
                }
                fileList.map(item => {
                    if(item.status === "removed") {
                        uploadFiles(new File([""], "removed.jpg"), -1, 6, item.uploadFileName);
                    } else if(item.status === "done") {
                        uploadFiles(item.file, res.data.seq, 6);
                    }
                })
                fileList2.map(item => {
                    if(item.status === "removed") {
                        uploadFiles(new File([""], "removed.jpg"), -1, 7, item.uploadFileName);
                    } else if(item.status === "done") {
                        uploadFiles(item.file, res.data.seq, 7);
                    }
                })
                console.log(fileList);
                console.log(fileList2);
                Message.success('???????????? ????????? ' + '??????' + '???????????????.');
                // window.location.reload();
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
    }, [checkData, setCheckData, isUpdate, initializeData]);
    const onFailForm = (errorInfo) => {
        Message.error(errorInfo['errorFields'][0].errors[0]);
    };
    const onList = useCallback(() => {
        navigate('/buyer/mypage');
    }, []);
    const customRequestFor1 = ({onSuccess, onError, file}) => {
        const fileType = file.type;
        if(fileType == "" || fileType == null || fileType == undefined){
            Message.error('?????? ???????????? ?????? ???????????? ??? ????????????.');
            return;
        }
        const isLt2M = file.size / 1024 / 1024 < 1;
        if (!isLt2M) {
            Message.error('?????? ????????? 1MB ?????? ???????????? ??? ????????????.');
            return;
        }
        onSuccess("Ok");
        if(uploadMaxCount === 1){
            fileList.forEach(item => {
                item.status = "removed";
            })
        }
        fileList.push({
            uid: "",
            name: "",
            uploadFileName:"",
            status: 'done',
            url: "",
            thumbUrl: "",
            file: file
        });
        setFileList(fileList);
    }
    const customRequestFor2 = ({onSuccess, onError, file}) => {
        const fileType = file.type;
        if(fileType == "" || fileType == null || fileType == undefined){
            Message.error('?????? ???????????? ?????? ???????????? ??? ????????????.');
            return;
        }
        const isLt2M = file.size / 1024 / 1024 < 1;
        if (!isLt2M) {
            Message.error('?????? ????????? 1MB ?????? ???????????? ??? ????????????.');
            return;
        }
        onSuccess("Ok");
        if(uploadMaxCount === 1){
            fileList2.forEach(item => {
                item.status = "removed";
            })
        }
        fileList2.push({
            uid: "",
            name: "",
            uploadFileName:"",
            status: 'done',
            url: "",
            thumbUrl: "",
            file: file
        });
        setFileList2(fileList2);
    }
    const uploadFiles = (file, relationSeq, fileType, originFileName) => {
        const param = new FormData();
        if(originFileName !== undefined && originFileName !== null && originFileName !== "") param.append('alreadyFileName', originFileName);
        param.append('multipartFileList', file);
        param.append('relationSeq', relationSeq);
        param.append('fileType', fileType);
        console.log(originFileName);
        console.log(file);
        console.log(relationSeq);
        console.log(fileType);
        FileAPI.update(param)
            .then((res) => {
                console.log(res);
            }).catch(e => {
            Message.error("?????? ???????????? ?????????????????????. ????????? ??????????????? ??????????????????.");
        });
    }

    // ?????? ??????
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [postCode, setPostCode] = useState('');
    const [address, setAddress] = useState('');
    const [corpAddressDetail, setCorpAddressDetail] = useState('');
    const openPostCode = () => {
        setIsPopupOpen(true);
    }
    const closePostCode = () => {
        setIsPopupOpen(false);
    }
    const onClickPostCode = (postCode, address) => {
        setPostCode(postCode);
        setAddress(address);
        form.setFieldValue('addressPostNo', postCode);
        form.setFieldValue('corpAddress', address);
        closePostCode();
    }
    const onBlurAddress = (e) => {
        // form.setFieldValue('corpAddress', address + " " + e.target.value);
        setCorpAddressDetail(e.target.value);
        form.setFieldValue('addressDetail', e.target.value);
    }

    // ????????????
    const passwordChk = useRef();
    const [isPasswordConfirm, setIsPasswordConfirm] = useState(true);
    const onChangePassword = ((e) => {
        if(form2.getFieldValue('password') != passwordChk.current.input.value){
            console.log(form2.getFieldValue('password'));
            console.log(passwordChk.current.input.value);
            setIsPasswordConfirm(false);
        } else{
            console.log(form2.getFieldValue('password'));
            console.log(passwordChk.current.input.value);
            setIsPasswordConfirm(true);
            console.log(e);
            setPassValue(e);
        }
    })

    const onChangePassword2 = ((e) => {
        if(form2.getFieldValue('password') != passwordChk.current.input.value){
            console.log(form2.getFieldValue('password'));
            console.log(passwordChk.current.input.value);
            setIsPasswordConfirm(false);
        } else{
            console.log(form2.getFieldValue('password'));
            console.log(passwordChk.current.input.value);
            setIsPasswordConfirm(true);
        }
        setPassCheckValue(e);
    })

const [isModalVisible, setIsModalVisible] = useState(false);
    const showModal = () => {
        setIsModalVisible(true);
    };
    const handleOk = () => {
        form2.submit();
        // setIsModalVisible(false);
    };
    const handleCancel = () => {
        setIsModalVisible(false);
    };

    // ?????????
    const onChangeEmail = useCallback((e) => {
        console.log(e.target.value);
        // ????????? ?????? ??????
        if (form.getFieldError('staffEmail').length === 0 && form.getFieldValue('staffEmail')) {
            axios.post(process.env.REACT_APP_API_HOST+"/buyer/exists/email", {
                "map": {
                    "email": form.getFieldValue('staffEmail')
                }
            })
                .then((res) => {
                    console.log(res);
                    if (res.data.data === true) {
                        form.setFields([{
                            name: 'staffEmail',
                            errors: ['?????? ???????????? ??????????????????.'],
                        }]);
                    }
                }).catch((error) => {
                Message.error(error.message);
            });
        }
    });

    return (
        <div className={"text-left"}>
            <div className='pageTitle'>????????????</div>
            <div className='pageSubtitle'></div>

            <div className={'detail_wrap'}>
                <Form
                    layout={'vertical'}
                    form={form}
                    onFinish={onSubmit}
                    onFinishFailed={onFailForm}
                >
                    <Form.Item hidden="true"
                               name="addressDetail"
                    ><Input value={corpAddressDetail} />
                    </Form.Item>
                    <Form.Item hidden="true"
                               name="addressPostNo"
                    ><Input value={postCode} />
                    </Form.Item>
                    {
                        initializeData.hasOwnProperty('buyer') &&
                        <Descriptions title="??????" size={'small'} column={4} bordered extra={"V ??? ?????? ???????????? ?????????."}>
                            <Descriptions.Item label="?????????" span={4}>
                                {initializeData.hasOwnProperty('buyerIdentificationId') ? initializeData['buyerIdentificationId'] : ""}
                            </Descriptions.Item>

                            <Descriptions.Item label="???" span={2}>
                                {initializeData.buyer.hasOwnProperty('corpName') ?
                                    <Form.Item
                                        name="corpName"
                                        initialValue={initializeData.buyer['corpName']}
                                        required={true}
                                        rules={[
                                            {
                                                required: false,
                                            },
                                            ({setFieldsValue}) => ({
                                                validator: (rule, value) => {
                                                    if (value.replace(/\s/g, "").length < value.length){
                                                        return Promise.reject('????????? ????????? ??? ????????????.');
                                                    }
                                                    if (isUpdate) {
                                                        return Promise.resolve();
                                                    }
                                                    if (value === '') {
                                                        return Promise.reject('????????? ??????????????????.');
                                                    }
                                                    setFieldsValue({'corpName': value});
                                                    return Promise.resolve();
                                                }
                                            })
                                        ]}
                                    >
                                        <Input defaultValue={initializeData.buyer['corpName']} maxLength={10}
                                               disabled={checkData.isLoading}/>
                                    </Form.Item>
                                    : ''}
                            </Descriptions.Item>

                            <Descriptions.Item label="??????" span={2}>
                                {initializeData.buyer.hasOwnProperty('corpStaffName') ?
                                    <Form.Item
                                        name="corpStaffName"
                                        initialValue={initializeData.buyer['corpStaffName']}
                                        required={true}
                                        rules={[
                                            {
                                                required: false,
                                            },
                                            ({setFieldsValue}) => ({
                                                validator: (rule, value) => {
                                                    if (isUpdate) {
                                                        return Promise.resolve();
                                                    }
                                                    if (value === '') {
                                                        return Promise.reject('????????? ??????????????????.');
                                                    }
                                                    setFieldsValue({'corpStaffName': value});
                                                    return Promise.resolve();
                                                }
                                            })
                                        ]}
                                    >
                                        <Input defaultValue={initializeData.buyer['corpStaffName']} maxLength={10}
                                               disabled={checkData.isLoading}/>
                                    </Form.Item>
                                    : ''}
                            </Descriptions.Item>

                            <Descriptions.Item label="??????" span={4}>
                                {initializeData.buyer.hasOwnProperty('corpAddress') ?
                                    <Form.Item
                                        name="corpAddress"
                                        initialValue={initializeData.buyer['corpAddress']}
                                        required={true}
                                        rules={[
                                            {
                                                required: false,
                                            },
                                            ({setFieldsValue}) => ({
                                                validator: (rule, value) => {
                                                    if (isUpdate) {
                                                        return Promise.resolve();
                                                    }
                                                    if (value === '') {
                                                        return Promise.reject('????????? ??????????????????.');
                                                    }
                                                    setFieldsValue({'corpAddress': value});
                                                    return Promise.resolve();
                                                }
                                            })
                                        ]}
                                    >
                                        <Input maxLength={100} className="input-middle" value={postCode} disabled/>
                                        <Button onClick={openPostCode} style={{float: 'left'}}>????????????</Button>
                                        <Modal
                                            visible={isPopupOpen}
                                            onOk={closePostCode}
                                            onCancel={closePostCode}
                                            footer={null}
                                        >
                                            <PopupPostCode onClick={(postCode, address) => onClickPostCode(postCode, address)} />
                                        </Modal>
                                        <Input className='input-large' value={address} disabled/>
                                        <Input defaultValue={corpAddressDetail} name='corpAddressEtc' onBlur={onBlurAddress} className='input-large' disabled={checkData.isLoading}/>
                                    </Form.Item>
                                    : ''}
                            </Descriptions.Item>

                            <Descriptions.Item label="????????????" span={2}>
                                {initializeData.buyer.hasOwnProperty('corpTelNo') ?
                                    <Form.Item
                                        name="corpTelNo"
                                        initialValue={initializeData.buyer['corpTelNo']}
                                        required={true}
                                        rules={[
                                            {
                                                required: false,
                                            },
                                            ({setFieldsValue}) => ({
                                                validator: (rule, value) => {
                                                    if (value.replace(/\s/g, "").length < value.length){
                                                        return Promise.reject('????????? ????????? ??? ????????????.');
                                                    }
                                                    if (isUpdate) {
                                                        return Promise.resolve();
                                                    }
                                                    if (value === '') {
                                                        return Promise.reject('????????? ??????????????????.');
                                                    }
                                                    setFieldsValue({'corpTelNo': value});
                                                    return Promise.resolve();
                                                }
                                            })
                                        ]}
                                    >
                                        <Input className='input-middle' maxLength={11}/>
                                    </Form.Item>
                                    : ''}
                            </Descriptions.Item>

                            <Descriptions.Item label="FAX??????" span={2}>
                                {initializeData.buyer.hasOwnProperty('corpFaxNo') ?
                                    <Form.Item
                                        name="corpFaxNo"
                                        initialValue={initializeData.buyer['corpFaxNo']}
                                        required={true}
                                        rules={[
                                            {
                                                required: false,
                                            },
                                            ({setFieldsValue}) => ({
                                                validator: (rule, value) => {
                                                    if (value.replace(/\s/g, "").length < value.length){
                                                        return Promise.reject('????????? ????????? ??? ????????????.');
                                                    }

                                                    if (isUpdate) {
                                                        return Promise.resolve();
                                                    }
                                                    if (value === '') {
                                                        return Promise.reject('????????? ??????????????????.');
                                                    }
                                                    setFieldsValue({'corpFaxNo': value});
                                                    return Promise.resolve();
                                                }
                                            })
                                        ]}
                                    >
                                        <Input maxLength={11} className="input-middle"/>
                                    </Form.Item>
                                    : ''}
                            </Descriptions.Item>

                            <Descriptions.Item label="?????????????????????" span={4}>
                                {initializeData.buyer.hasOwnProperty('corpNo') ?
                                    <Form.Item
                                        name="corpNo"
                                        initialValue={initializeData.buyer['corpNo']}
                                        required={true}
                                        rules={[
                                            {
                                                required: false,
                                            },
                                            ({setFieldsValue}) => ({
                                                validator: (rule, value) => {
                                                    if (value.replace(/\s/g, "").length < value.length){
                                                        return Promise.reject('????????? ????????? ??? ????????????.');
                                                    }
                                                    if (isUpdate) {
                                                        return Promise.resolve();
                                                    }
                                                    if (value === '') {
                                                        return Promise.reject('????????? ??????????????????.');
                                                    }
                                                    setFieldsValue({'corpNo': value});
                                                    return Promise.resolve();
                                                }
                                            })
                                        ]}
                                    >
                                        <Input maxLength={10} className="input-middle"/>
                                    </Form.Item>
                                    : ''}
                            </Descriptions.Item>

                            <Descriptions.Item label="??????????????????" span={4}>
                                <Upload
                                    listType="picture"
                                    customRequest={customRequestFor1}
                                    multiple
                                    defaultFileList={fileList}
                                    maxCount={uploadMaxCount}
                                >
                                    <Button icon={<UploadOutlined/>}>Upload</Button>
                                </Upload>
                            </Descriptions.Item>
                        </Descriptions>
                    }
                    <br/>
                    {
                        initializeData.hasOwnProperty('buyer') &&
                        <Descriptions title="???????????????" size={'small'} column={2} bordered className='spacerTop'>
                            <Descriptions.Item label="???????????????" span={4}>
                                {initializeData.hasOwnProperty('staffName') ?
                                    <Form.Item
                                        name="staffName"
                                        initialValue={initializeData['staffName']}
                                        required={true}
                                        rules={[
                                            {
                                                required: false,
                                            },
                                            ({setFieldsValue}) => ({
                                                validator: (rule, value) => {
                                                    if (isUpdate) {
                                                        return Promise.resolve();
                                                    }
                                                    if (value === '') {
                                                        return Promise.reject('????????? ??????????????????.');
                                                    }
                                                    setFieldsValue({'staffName': value});
                                                    return Promise.resolve();
                                                }
                                            })
                                        ]}
                                    >
                                        <Input defaultValue={initializeData['staffName']} maxLength={10}
                                               disabled={true}/>
                                    </Form.Item>
                                    : ''}
                            </Descriptions.Item>

                            <Descriptions.Item label="???????????????" span={4}>
                                {initializeData.hasOwnProperty('staffPhoneNo') ?
                                    <Form.Item
                                        name="staffPhoneNo"
                                        initialValue={initializeData['staffPhoneNo']}
                                        required={true}
                                        rules={[
                                            {
                                                required: false,
                                            },
                                            ({setFieldsValue}) => ({
                                                validator: (rule, value) => {
                                                    if (isUpdate) {
                                                        return Promise.resolve();
                                                    }
                                                    if (value === '') {
                                                        return Promise.reject('????????? ??????????????????.');
                                                    }
                                                    setFieldsValue({'staffPhoneNo': value});
                                                    return Promise.resolve();
                                                }
                                            })
                                        ]}
                                    >
                                        <Input defaultValue={initializeData['staffPhoneNo']} placeholder='???????????????'
                                               maxLength={10} disabled={true}/>
                                    </Form.Item>
                                    : ''}
                            </Descriptions.Item>

                            <Descriptions.Item label="?????????" span={4}>
                                {initializeData.hasOwnProperty('staffEmail') ?
                                    <Form.Item
                                        name="staffEmail"
                                        initialValue={initializeData['staffEmail']}
                                        required={true}
                                        rules={[
                                            {
                                                required: true,
                                            },
                                            ({setFieldsValue}) => ({
                                                validator: (rule, value) => {
                                                    if (value.replace(/\s/g, "").length < value.length){
                                                        return Promise.reject('????????? ????????? ??? ????????????.');
                                                    }
                                                    if (value.replace(/^[^???-???|???-???|???-???]$/g, "").length < value.length){
                                                        return Promise.reject('????????? ????????? ??? ????????????.');
                                                    }

                                                    if (value.length > 30) {
                                                        return Promise.reject('30??? ????????? ??????????????????.');
                                                    }

                                                    const regex=/([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;

                                                    if(value.match(regex) == null){
                                                        return Promise.reject('????????? ????????? ????????? ????????????.');
                                                    }
                                                    if (value === '') {
                                                        return Promise.reject('????????? ??????????????????.');
                                                    }
                                                    setFieldsValue({'staffEmail': value});
                                                    return Promise.resolve();
                                                }
                                            })
                                        ]}
                                    >
                                        <Input defaultValue={initializeData['staffEmail']} placeholder='?????????'
                                               onChange={onChangeEmail}/>
                                    </Form.Item>
                                    : ''}
                            </Descriptions.Item>
                        </Descriptions>
                    }
                </Form>
                <div className={'textCenter spacerTop'}>
                    <Button onClick={showModal} className="btn-color02-2 btn-huge" style={{ width: 300 }}>???????????? ??????</Button>
                    <Button onClick={form.submit} type={'primary'} className="btn-color02 btn-huge" style={{ width: 300 }}>????????????</Button>
                </div>
                <Modal title="???????????? ??????" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                    <Form
                        layout={'vertical'}
                        form={form2}
                        onFinish={onSubmit2}
                        onFinishFailed={onFailForm}
                    >
                        <Form.Item label="??????????????????"
                                   name="orgPassword"
                                   rules={[{
                                       required: true,
                                       message: "?????? ??????????????? ??????????????????.",
                                   }, ({setFieldsValue}) => ({
                                       validator: (rule, value) => {
                                           if (value.replace(/\s/g, "").length < value.length){
                                               return Promise.reject('????????? ????????? ??? ????????????.');
                                           }
                                           if (value.length > 15) {
                                               return Promise.reject('15??? ????????? ??????????????????.');
                                           }

                                           setFieldsValue({'orgPassword': value});

                                           return Promise.resolve();
                                       }
                                   })]}
                        >
                            <Input.Password value={oldPassValue} onChange={setOldPassValue}/>
                        </Form.Item>
                        <Form.Item label="??????????????????"
                                   name="password"
                                   rules={[{
                                       required: true,
                                       message: "??????????????? ??????????????????.",
                                   }, ({setFieldsValue}) => ({
                                       validator: (rule, value) => {
                                           if (value.replace(/\s/g, "").length < value.length){
                                               return Promise.reject('????????? ????????? ??? ????????????.');
                                           }
                                           if (value.length > 15) {
                                               return Promise.reject('15??? ????????? ??????????????????.');
                                           }

                                           setFieldsValue({'password': value});

                                           return Promise.resolve();
                                       }
                                   })]}
                        >
                            <Input.Password value={passValue} onChange={onChangePassword}/>
                        </Form.Item>
                        <Form.Item label="??????????????????"
                                   name="passwordCheck"
                                   rules={[{
                                       required: true,
                                       message: "??????????????? ??????????????????.",
                                   }, ({setFieldsValue}) => ({
                                       validator: (rule, value) => {
                                           if (value.replace(/\s/g, "").length < value.length){
                                               return Promise.reject('????????? ????????? ??? ????????????.');
                                           }
                                           if(!isPasswordConfirm) {
                                               return Promise.reject("??????????????? ???????????? ????????????.");
                                           }


                                           if (value.length > 15) {
                                               return Promise.reject('15??? ????????? ??????????????????.');
                                           }

                                           return Promise.resolve();
                                       }
                                   })]}
                                   validateStatus={isPasswordConfirm == true ? "success" : "error"}
                        >
                            <Input.Password value={passCheckValue} ref={passwordChk} onChange={onChangePassword2}/>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </div>
    );
};

export default BuyerUserDetail;