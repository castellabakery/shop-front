import React, {useState, useCallback, useRef} from 'react';
import {useLocation, useNavigate, useParams} from "react-router-dom";
import axios from 'axios';
import 'antd/dist/antd.css';
import '../../../main/BuyerMain.css';
import '../BuyerSignup.css';
import {
    Button,
    Col,
    Descriptions,
    Form,
    Input,
    Layout,
    Row,
    Select,
    Steps,
    Upload,
    Modal, Checkbox
} from 'antd';
import {Message} from "../../../../component";
import {UploadOutlined} from "@ant-design/icons";
import * as FileAPI from "../../../../admin/api/File";
import PopupPostCode from '../Common/PostCode/PopupPostCode';

const {Content} = Layout;
const {Step} = Steps;
const param1 = [];
const param2 = [];

const BuyerSignupHospital = function () {
    const [form] = Form.useForm();
    const params = useParams();
    const location = useLocation();
    const ci = (location.state !== undefined && location.state !== null ? (location.state.hasOwnProperty('sConnInfo') ? location.state.sConnInfo : "") : []);
    const sMobileNo = (location.state !== undefined && location.state !== null ? (location.state.hasOwnProperty('sMobileNo') ? location.state.sMobileNo : "") : []);
    const sName = (location.state !== undefined && location.state !== null ? (location.state.hasOwnProperty('sName') ? location.state.sName : "") : []);
    const navigate = useNavigate();
    const layout = {};
    const [checkData, setCheckData] = useState({
        isLoading: false,
        isInitialize: false,
    });
    const [initializeData, setInitializeData] = useState({
        key: '',
        buyerIdentificationId: '',
        corpAddress: '',
        ci: ci, // 임시
        buyerType: 'M', // 임시
    });
    const [fileCheck, setFileCheck] = useState(false);


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

        if(values.addressDetail === "" || values.addressDetail === undefined || values.addressDetail == null){
            Message.error("상세 주소를 입력해주세요.");
            return;
        }

        if(!fileCheck){
            Message.error("사업자등록증을 첨부해주세요.");
            return;
        }

        values.tmpBuyerTermsList = tmpTermsList;
        console.log(values);
        if (checkData.isLoading) {
            return;
        }
        setCheckData((p) => {
            return {
                ...p,
                isLoading: true,
            }
        });

        axios.post(process.env.REACT_APP_API_HOST+"/buyer/tmp/add", { "map": values })
        .then((res) => {
            if(res.data.data.seq){

                fileList.map(item => {
                    if(item.status === "done") {
                        uploadFiles(item.file, res.data.data.seq, 6);
                    }
                    console.log(item);
                })

                fileList2.map(item => {
                    if(item.status === "done") {
                        uploadFiles(item.file, res.data.data.seq, 7);
                    }
                    console.log(item);
                })

                // param1.map(item => {
                //     uploadFiles(item, res.data.data.seq, 6);
                // })
                // param2.map(item => {
                //     uploadFiles(item, res.data.data.seq, 7);
                // })
                navigate("/login/signup/hospital/step4");
            } else{
                // 회원가입 롤백
            }
        }).catch((error) => {
            Message.error(error.message);
            setCheckData((p) => {
                return {
                    ...p,
                    isLoading: false,
                }
            })
        });
    }, [checkData, setCheckData, initializeData, fileCheck]);
    const onFailForm = (errorInfo) => {
        Message.error(errorInfo['errorFields'][0].errors[0]);
    };
    const uploadMaxCount = 1;
    const customRequest = ({onSuccess, onError, file}) => {
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
        setFileCheck(true);

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

        param1.push(file);
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

        param2.push(file);
    }

    const uploadFiles = (file, relationSeq, fileType) => {
        const paramt = new FormData();
        // paramt.append('alreadyFileName', originFileName);
        paramt.append('multipartFileList', file);
        paramt.append('relationSeq', relationSeq);
        paramt.append('fileType', fileType);

        FileAPI.uploadWithout(paramt)
            .then((res) => {
                console.log(res);
            }).catch(e => {
            Message.error("파일 업로드에 실패하였습니다. 시스템 관리자에게 문의해주세요.");
        });
    }
    const [fileList, setFileList] = useState([]);
    const [fileList2, setFileList2] = useState([]);

    // 아이디
    const onChangeId = useCallback((e) => {
        // 아이디 중복 체크
        if (form.getFieldError('buyerIdentificationId').length === 0 && form.getFieldValue('buyerIdentificationId')) {
            axios.post(process.env.REACT_APP_API_HOST+"/buyer/exists/buyer-identification-id", {
                "map": {
                    "buyerIdentificationId": form.getFieldValue('buyerIdentificationId')
                }
            })
            .then((res) => {
              if (res.data.data === true) {
                form.setFields([{
                  name: 'buyerIdentificationId',
                  errors: ['이미 사용중인 아이디입니다.'],
                }]);
              }
            }).catch((error) => { 
                Message.error(error.message);
            });
        }
    });

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

    // 비밀번호 
    const passwordChk = useRef();
    const [isPasswordConfirm, setIsPasswordConfirm] = useState(true);
    const onChangePassword = ((e) => {
        if(form.getFieldValue('password') != passwordChk.current.input.value){
            setIsPasswordConfirm(false);
        } else{
            setIsPasswordConfirm(true);
        }
    })

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
    
    return (
        <div>
            <Content className='buyer-signup-container'>
                <Row>
                    <Col span={"24"}>
                        <Steps current={1} className="container3step">
                            <Step title="본인인증 및 약관동의" description="" />
                            <Step title="회원정보입력"  description="" />
                            <Step title="가입완료" description="" />
                        </Steps>
                    </Col>
                </Row>
                <Row className="buyer-signup-form">
                    <Col>
                        <div className='loginTextbox spacerTop'></div>
                        <Descriptions title={"회원가입 ()"} className="spacerTop"></Descriptions>
                        <Form {...layout}
                            form={form}
                            onFinish={onSubmit}
                            onFinishFailed={onFailForm}
                            initialValues={{
                                'buyerIdentificationId': initializeData.id,
                                'address': initializeData.address,
                                'ci': initializeData.ci,
                                'buyerType': initializeData.buyerType,
                            }}
                            className="registrationForm"
                        >
                            <Form.Item label="아이디"
                                       name="buyerIdentificationId"
                                       hasFeedback
                                       allowClear
                                       rules={[{
                                            required: true,
                                            message: "아이디를 입력해주세요.",
                                        }, ({setFieldsValue}) => ({
                                               validator: (rule, value) => {
                                                   if (value.replace(/\s/g, "").length < value.length){
                                                       return Promise.reject('공백은 입력할 수 없습니다.');
                                                   }

                                                   if (value.length > 10) {
                                                       return Promise.reject('10자 이내로 입력해주세요.');
                                                   }

                                                   if (value.replace(/[ㄱ-히|ㅏ-ㅣ|가-힣]/g, "").length < value.length){
                                                       return Promise.reject('한글은 포함할 수 없습니다.');
                                                   }


                                                   if (value.replace(/[0-9]/g, "").length < value.length){
                                                       return Promise.reject('계정에 숫자는 포함할 수 없습니다.');
                                                   }

                                                   setFieldsValue({'buyerIdentificationId': value});

                                                   return Promise.resolve();
                                               }
                                           })
                                       ]}
                            >
                                <Input className='input-middle' onChange={onChangeId} disabled={checkData.isLoading}/>
                            </Form.Item>

                            <Form.Item label="비밀번호"
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
                                <Input.Password className='input-middle' onChange={onChangePassword} disabled={checkData.isLoading}/>
                            </Form.Item>

                            <Form.Item label="비밀번호 확인"
                                       required="true"
                                       name={"passwordChk"}
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
                                <Input.Password className='input-middle' ref={passwordChk} onChange={onChangePassword} disabled={checkData.isLoading}/>
                            </Form.Item>

                            <Form.Item label="명"
                                       name="corpName"
                                       rules={[{
                                           required: true,
                                           message: "명을 입력해주세요.",
                                       }, ({setFieldsValue}) => ({
                                           validator: (rule, value) => {
                                               if (value.replace(/\s/g, "").length < value.length){
                                                   return Promise.reject('공백은 입력할 수 없습니다.');
                                               }

                                               if (value.length > 20) {
                                                   return Promise.reject('20자 이내로 입력해주세요.');
                                               }

                                               setFieldsValue({'corpName': value});

                                               return Promise.resolve();
                                           }
                                       })]}
                            >
                                <Input maxLength={100} className='input-middle' disabled={checkData.isLoading}/>
                            </Form.Item>

                             <Form.Item label=" 성명"
                                       name="corpStaffName"
                                       required={false}
                                       rules={[{
                                           required: false,
                                       },
                                           ({setFieldsValue}) => ({
                                               validator: (rule, value) => {

                                                   if (value === '') {
                                                       return Promise.resolve();
                                                   }

                                                   if (value.length > 5) {
                                                       return Promise.reject('5자 이내로 입력해주세요.');
                                                   }

                                                   if (value.replace(/[0-9]/g, "").length < value.length){
                                                       return Promise.reject('이름에 숫자는 포함할 수 없습니다.');
                                                   }

                                                   setFieldsValue({'corpStaffName': value});

                                                   return Promise.resolve();
                                               }
                                           })
                                       ]}
                            >
                                <Input placeholder='' maxLength={100}
                                       disabled={checkData.isLoading}/>
                            </Form.Item>

                            <Form.Item label="주소"
                                       name="corpAddress"
                                       rules={[{
                                           required: true,
                                           message: " 주소를 입력해주세요.",
                                       }, ({setFieldsValue}) => ({
                                        validator: (rule, value) => {

                                            if (value.length > 100) {
                                                return Promise.reject('100자 이내로 입력해주세요.');
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
                                <Input name='corpAddressEtc' maxLength={50} onBlur={onBlurAddress} className='input-large' disabled={checkData.isLoading}/>
                            </Form.Item>

                            <Form.Item label="대표 번호"
                                       name="corpTelNo"
                                       rules={[{
                                           required: true,
                                           message: "대표 번호를 입력해주세요.",
                                        },
                                           ({setFieldsValue}) => ({
                                               validator: (rule, value) => {
                                                   if (value.replace(/\s/g, "").length < value.length){
                                                       return Promise.reject('공백은 입력할 수 없습니다.');
                                                   }

                                                   if (value.replace(/[^0-9]/g, "").length < value.length){
                                                       return Promise.reject('문자는 포함할 수 없습니다.');
                                                   }

                                                   if (value.length > 11) {
                                                       return Promise.reject('11자 이내로 입력해주세요.');
                                                   }

                                                   if (value.length === 10) {
                                                       value.replace(/^(\d{0,2})(\d{0,3})(\d{0,4})$/g, "$1-$2-$3").replace(/\-{1,2}$/g, "");
                                                   } else if (value.length === 11) {
                                                       value.replace(/^(\d{0,3})(\d{0,4})(\d{0,4})$/g, "$1-$2-$3").replace(/\-{1,2}$/g, "");
                                                   }

                                                   setFieldsValue({'corpTelNo': value});

                                                   return Promise.resolve();
                                               }
                                           })
                                       ]}
                            >
                                <Input className='input-middle' maxLength={11}/>
                            </Form.Item>

                            <Form.Item label="FAX 번호"
                                       name="corpFaxNo"
                                       rules={[{
                                           required: true,
                                           message: "FAX 번호를 입력해주세요.",
                                       },
                                           ({setFieldsValue}) => ({
                                               validator: (rule, value) => {
                                                   if (value.replace(/\s/g, "").length < value.length){
                                                       return Promise.reject('공백은 입력할 수 없습니다.');
                                                   }

                                                   if (value.replace(/[^0-9]/g, "").length < value.length){
                                                       return Promise.reject('문자는 포함할 수 없습니다.');
                                                   }

                                                   if (value.length > 11) {
                                                       return Promise.reject('11자 이내로 입력해주세요.');
                                                   }

                                                   if (value.length === 10) {
                                                       value.replace(/^(\d{0,2})(\d{0,3})(\d{0,4})$/g, "$1-$2-$3").replace(/\-{1,2}$/g, "");
                                                   } else if (value.length === 11) {
                                                       value.replace(/^(\d{0,3})(\d{0,4})(\d{0,4})$/g, "$1-$2-$3").replace(/\-{1,2}$/g, "");
                                                   }

                                                   setFieldsValue({'corpFaxNo': value});

                                                   return Promise.resolve();
                                               }
                                           })
                                    ]}
                            >
                                <Input maxLength={11} className="input-middle"/>
                            </Form.Item>

                            <Form.Item label="사업자등록번호"
                                       name="corpNo"
                                       rules={[{
                                           required: true,
                                           message: "사업자등록번호를 입력해주세요.",
                                       },
                                           ({setFieldsValue}) => ({
                                               validator: (rule, value) => {
                                                   if (value.replace(/\s/g, "").length < value.length){
                                                       return Promise.reject('공백은 입력할 수 없습니다.');
                                                   }

                                                   if (value.replace(/[^0-9]/g, "").length < value.length){
                                                       return Promise.reject('문자는 포함할 수 없습니다.');
                                                   }

                                                   if (value.length > 10) {
                                                       return Promise.reject('10자 이내로 입력해주세요.');
                                                   }

                                                   setFieldsValue({'corpNo': value});

                                                   return Promise.resolve();
                                               }
                                           })
                                    ]}
                            >
                                <Input maxLength={10} className="input-middle"/>
                            </Form.Item>
                            
                            <Form.Item label="사업자등록증"
                                       tooltip={"확장자가 없는 파일은 업로드하실 수 없습니다."}
                                        id="file_1"
                                        required="true"
                                        rules={[{
                                           required: true,
                                           message: "사업자등록증를 첨부해주세요.",
                                       }, 
                                    ]}
                            >
                                <Upload
                                    listType="picture"
                                    customRequest={customRequest}
                                    multiple
                                    // defaultFileList={fileList}
                                    maxCount={1}
                                    onRemove={(e) => setFileCheck(false)}
                                >
                                    <Button icon={<UploadOutlined/>}>파일 첨부</Button>
                                </Upload>
                            </Form.Item>

                            <Form.Item hidden="true"
                                       name="ci"
                                       initialValue={ci}
                            ><Input value={ci} />
                            </Form.Item>
                            <Form.Item hidden="true"
                                       name="buyerType"
                            ><Input value="M" />
                            </Form.Item>
                            <Form.Item hidden="true"
                                       name="addressDetail"
                            ><Input value={corpAddressDetail} />
                            </Form.Item>
                            <Form.Item hidden="true"
                                       name="addressPostNo"
                            ><Input value={postCode} />
                            </Form.Item>

                            <Descriptions className='align-center spacerTop' title={"담당자 정보"}></Descriptions>
                            <Form.Item label="담당자 성명"
                                       initialValue={sName}
                                       className="borderTop"
                                       name="staffName"
                                       rules={[{
                                           required: false,
                                       },
                                           ({setFieldsValue}) => ({
                                               validator: (rule, value) => {

                                                   if (value.replace(/[0-9]/g, "").length < value.length){
                                                       return Promise.reject('숫자는 포함할 수 없습니다.');
                                                   }

                                                   if (value.length > 5) {
                                                       return Promise.reject('5자 이내로 입력해주세요.');
                                                   }

                                                   setFieldsValue({'staffName': value});

                                                   return Promise.resolve();
                                               }
                                           })
                                       ]}
                            >
                                <Input disabled defaultValue={sName} disabled={true} className="input-middle"/>
                            </Form.Item>
                            <Form.Item label="휴대폰번호"
                                       initialValue={sMobileNo}
                                       name="staffPhoneNo"
                                       rules={[{
                                           required: false,
                                       },
                                           ({setFieldsValue}) => ({
                                               validator: (rule, value) => {

                                                   if (value.replace(/[^0-9]/g, "").length < value.length){
                                                       return Promise.reject('문자는 포함할 수 없습니다.');
                                                   }

                                                   if (value.length > 11) {
                                                       return Promise.reject('11자 이내로 입력해주세요.');
                                                   }

                                                   if (value.length === 10) {
                                                       value.replace(/^(\d{0,2})(\d{0,3})(\d{0,4})$/g, "$1-$2-$3").replace(/\-{1,2}$/g, "");
                                                   } else if (value.length === 11) {
                                                       value.replace(/^(\d{0,3})(\d{0,4})(\d{0,4})$/g, "$1-$2-$3").replace(/\-{1,2}$/g, "");
                                                   }

                                                   setFieldsValue({'staffPhoneNo': value});

                                                   return Promise.resolve();
                                               }
                                           })
                                       ]}
                            >
                                <Input disabled defaultValue={sMobileNo} disabled={true} className="input-middle"/>
                                
                            </Form.Item>
                            <Form.Item label="이메일"
                                       name="staffEmail"
                                       rules={[{
                                           required: true,
                                           message: "이메일을 입력해주세요.",
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

                                                   setFieldsValue({'staffEmail': value});

                                                   return Promise.resolve();
                                               }
                                           })
                                       ]}
                            >
                                <Input className="input-large" onChange={onChangeEmail}/>
                            </Form.Item>
                            {/* <Form.Item label="마케팅정보동의"*/}
                            {/*           name="marketing"*/}
                            {/*           required={false}*/}
                            {/*           rules={[{*/}
                            {/*               required: false,*/}
                            {/*           },*/}
                            {/*               ({setFieldsValue}) => ({*/}
                            {/*                   validator: (rule, value) => {*/}

                            {/*                       if (value === '') {*/}
                            {/*                           return Promise.resolve();*/}
                            {/*                       }*/}

                            {/*                       if (value.length > 100) {*/}
                            {/*                           return Promise.reject('100자 이내로 입력해주세요.');*/}
                            {/*                       }*/}

                            {/*                       setFieldsValue({'address': value});*/}

                            {/*                       return Promise.resolve();*/}
                            {/*                   }*/}
                            {/*               })*/}
                            {/*           ]}*/}
                            {/*>*/}
                            {/*    <Checkbox/> 내용을 읽고 이에 동의합니다. <Button>전체보기</Button>*/}
                            {/*</Form.Item>*/}
                            {/*<Form.Item label="제3자 제공동의"*/}
                            {/*           name="thirdparty"*/}
                            {/*           required={false}*/}
                            {/*           rules={[{*/}
                            {/*               required: false,*/}
                            {/*           },*/}
                            {/*               ({setFieldsValue}) => ({*/}
                            {/*                   validator: (rule, value) => {*/}

                            {/*                       if (value === '') {*/}
                            {/*                           return Promise.resolve();*/}
                            {/*                       }*/}

                            {/*                       if (value.length > 100) {*/}
                            {/*                           return Promise.reject('100자 이내로 입력해주세요.');*/}
                            {/*                       }*/}

                            {/*                       setFieldsValue({'address': value});*/}

                            {/*                       return Promise.resolve();*/}
                            {/*                   }*/}
                            {/*               })*/}
                            {/*           ]}*/}
                            {/*>*/}
                            {/*    <Checkbox/> 내용을 읽고 이에 동의합니다. <Button>전체보기</Button>*/}
                            {/*</Form.Item>*/}
                            <div className='align-center spacerTop'>
                                <Button href="/login/signup/hospital/step1" htmlType={"submit"} className={"login-form-button btn-color02-2 btn-huge btn-fix1"} style={{width : "200px"}}>취소</Button> <Button type={"primary"} htmlType={"submit"} className={"login-form-button btn-color02 btn-huge btn-fix1"} style={{width : "200px"}}>회원가입</Button>
                            </div>
                        </Form>
                    </Col>
                </Row>
            </Content>
        </div>
    );
};

export default BuyerSignupHospital;