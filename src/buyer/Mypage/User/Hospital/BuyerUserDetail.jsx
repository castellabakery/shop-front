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
                    alert("이전 비밀번호가 다릅니다.");
                    window.location.reload();
                    return;
                }
                alert("비밀번호 변경이 실패하였습니다. 다시 시도해주세요.");
                window.location.reload();
                return;
            }
            Message.success('비밀번호 변경이 완료되었습니다.');
            window.location.reload();
            // onList();
        }).catch((error) => {
            alert("비밀번호 변경이 실패하였습니다. 다시 시도해주세요.");
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
                    Message.error("회원정보 수정이 실패하였습니다. 다시 시도해주세요.");
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
                Message.success('회원정보 수정이 ' + '요청' + '되었습니다.');
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
            Message.error('파일 확장자가 없어 업로드할 수 없습니다.');
            return;
        }
        const isLt2M = file.size / 1024 / 1024 < 1;
        if (!isLt2M) {
            Message.error('파일 크기는 1MB 이상 업로드할 수 없습니다.');
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
            Message.error('파일 확장자가 없어 업로드할 수 없습니다.');
            return;
        }
        const isLt2M = file.size / 1024 / 1024 < 1;
        if (!isLt2M) {
            Message.error('파일 크기는 1MB 이상 업로드할 수 없습니다.');
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
            Message.error("파일 업로드에 실패하였습니다. 시스템 관리자에게 문의해주세요.");
        });
    }

    // 주소 관련
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

    // 비밀번호
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

    // 이메일
    const onChangeEmail = useCallback((e) => {
        console.log(e.target.value);
        // 이메일 중복 체크
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
                            errors: ['이미 사용중인 이메일입니다.'],
                        }]);
                    }
                }).catch((error) => {
                Message.error(error.message);
            });
        }
    });

    return (
        <div className={"text-left"}>
            <div className='pageTitle'>회원정보</div>
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
                        <Descriptions title="정보" size={'small'} column={4} bordered extra={"V 는 필수 입력사항 입니다."}>
                            <Descriptions.Item label="아이디" span={4}>
                                {initializeData.hasOwnProperty('buyerIdentificationId') ? initializeData['buyerIdentificationId'] : ""}
                            </Descriptions.Item>

                            <Descriptions.Item label="명" span={2}>
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
                                                        return Promise.reject('공백은 입력할 수 없습니다.');
                                                    }
                                                    if (isUpdate) {
                                                        return Promise.resolve();
                                                    }
                                                    if (value === '') {
                                                        return Promise.reject('정보를 입력해주세요.');
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

                            <Descriptions.Item label="성명" span={2}>
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
                                                        return Promise.reject('정보를 입력해주세요.');
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

                            <Descriptions.Item label="주소" span={4}>
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
                                                        return Promise.reject('정보를 입력해주세요.');
                                                    }
                                                    setFieldsValue({'corpAddress': value});
                                                    return Promise.resolve();
                                                }
                                            })
                                        ]}
                                    >
                                        <Input maxLength={100} className="input-middle" value={postCode} disabled/>
                                        <Button onClick={openPostCode} style={{float: 'left'}}>주소검색</Button>
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

                            <Descriptions.Item label="대표번호" span={2}>
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
                                                        return Promise.reject('공백은 입력할 수 없습니다.');
                                                    }
                                                    if (isUpdate) {
                                                        return Promise.resolve();
                                                    }
                                                    if (value === '') {
                                                        return Promise.reject('정보를 입력해주세요.');
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

                            <Descriptions.Item label="FAX번호" span={2}>
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
                                                        return Promise.reject('공백은 입력할 수 없습니다.');
                                                    }

                                                    if (isUpdate) {
                                                        return Promise.resolve();
                                                    }
                                                    if (value === '') {
                                                        return Promise.reject('정보를 입력해주세요.');
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

                            <Descriptions.Item label="사업자등록번호" span={4}>
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
                                                        return Promise.reject('공백은 입력할 수 없습니다.');
                                                    }
                                                    if (isUpdate) {
                                                        return Promise.resolve();
                                                    }
                                                    if (value === '') {
                                                        return Promise.reject('정보를 입력해주세요.');
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

                            <Descriptions.Item label="사업자등록증" span={4}>
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
                        <Descriptions title="담당자정보" size={'small'} column={2} bordered className='spacerTop'>
                            <Descriptions.Item label="담당자성명" span={4}>
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
                                                        return Promise.reject('정보를 입력해주세요.');
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

                            <Descriptions.Item label="휴대폰번호" span={4}>
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
                                                        return Promise.reject('정보를 입력해주세요.');
                                                    }
                                                    setFieldsValue({'staffPhoneNo': value});
                                                    return Promise.resolve();
                                                }
                                            })
                                        ]}
                                    >
                                        <Input defaultValue={initializeData['staffPhoneNo']} placeholder='휴대폰번호'
                                               maxLength={10} disabled={true}/>
                                    </Form.Item>
                                    : ''}
                            </Descriptions.Item>

                            <Descriptions.Item label="이메일" span={4}>
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
                                                        return Promise.reject('공백은 입력할 수 없습니다.');
                                                    }
                                                    if (value.replace(/^[^ㄱ-히|ㅏ-ㅣ|가-힣]$/g, "").length < value.length){
                                                        return Promise.reject('한글은 포함할 수 없습니다.');
                                                    }

                                                    if (value.length > 30) {
                                                        return Promise.reject('30자 이내로 입력해주세요.');
                                                    }

                                                    const regex=/([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;

                                                    if(value.match(regex) == null){
                                                        return Promise.reject('올바른 이메일 형식이 아닙니다.');
                                                    }
                                                    if (value === '') {
                                                        return Promise.reject('정보를 입력해주세요.');
                                                    }
                                                    setFieldsValue({'staffEmail': value});
                                                    return Promise.resolve();
                                                }
                                            })
                                        ]}
                                    >
                                        <Input defaultValue={initializeData['staffEmail']} placeholder='이메일'
                                               onChange={onChangeEmail}/>
                                    </Form.Item>
                                    : ''}
                            </Descriptions.Item>
                        </Descriptions>
                    }
                </Form>
                <div className={'textCenter spacerTop'}>
                    <Button onClick={showModal} className="btn-color02-2 btn-huge" style={{ width: 300 }}>비밀번호 변경</Button>
                    <Button onClick={form.submit} type={'primary'} className="btn-color02 btn-huge" style={{ width: 300 }}>변경신청</Button>
                </div>
                <Modal title="비밀번호 변경" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                    <Form
                        layout={'vertical'}
                        form={form2}
                        onFinish={onSubmit2}
                        onFinishFailed={onFailForm}
                    >
                        <Form.Item label="기존비밀번호"
                                   name="orgPassword"
                                   rules={[{
                                       required: true,
                                       message: "기존 비밀번호를 입력해주세요.",
                                   }, ({setFieldsValue}) => ({
                                       validator: (rule, value) => {
                                           if (value.replace(/\s/g, "").length < value.length){
                                               return Promise.reject('공백은 입력할 수 없습니다.');
                                           }
                                           if (value.length > 15) {
                                               return Promise.reject('15자 이내로 입력해주세요.');
                                           }

                                           setFieldsValue({'orgPassword': value});

                                           return Promise.resolve();
                                       }
                                   })]}
                        >
                            <Input.Password value={oldPassValue} onChange={setOldPassValue}/>
                        </Form.Item>
                        <Form.Item label="변경비밀번호"
                                   name="password"
                                   rules={[{
                                       required: true,
                                       message: "비밀번호를 입력해주세요.",
                                   }, ({setFieldsValue}) => ({
                                       validator: (rule, value) => {
                                           if (value.replace(/\s/g, "").length < value.length){
                                               return Promise.reject('공백은 입력할 수 없습니다.');
                                           }
                                           if (value.length > 15) {
                                               return Promise.reject('15자 이내로 입력해주세요.');
                                           }

                                           setFieldsValue({'password': value});

                                           return Promise.resolve();
                                       }
                                   })]}
                        >
                            <Input.Password value={passValue} onChange={onChangePassword}/>
                        </Form.Item>
                        <Form.Item label="비밀번호확인"
                                   name="passwordCheck"
                                   rules={[{
                                       required: true,
                                       message: "비밀번호를 입력해주세요.",
                                   }, ({setFieldsValue}) => ({
                                       validator: (rule, value) => {
                                           if (value.replace(/\s/g, "").length < value.length){
                                               return Promise.reject('공백은 입력할 수 없습니다.');
                                           }
                                           if(!isPasswordConfirm) {
                                               return Promise.reject("비밀번호가 일치하지 않습니다.");
                                           }


                                           if (value.length > 15) {
                                               return Promise.reject('15자 이내로 입력해주세요.');
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