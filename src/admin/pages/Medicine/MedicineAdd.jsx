import React, {useCallback, useEffect, useState} from 'react';
import './MedicineDetail.css';
import AdminPageHeader from "../../AdminPageHeader";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import * as MedicineAPI from "../../api/Medicine";
import {Button, Descriptions, Form, Input, InputNumber, Radio, Upload} from "antd";
import {Message} from "../../../component";
import {UploadOutlined} from "@ant-design/icons";
import {Editor} from "react-draft-wysiwyg"
import * as FileAPI from "../../api/File";
import {EditorState} from "draft-js";
import draftToHtml from "draftjs-to-html";

const MedicineAdd = function () {
    const [form] = Form.useForm();
    const urlPrefix = '/admin/medicine';
    const navigate = useNavigate();
    const location = useLocation();
    const [checkData, setCheckData] = useState({
        isLoading: false,
        isInitialize: false,
    });
    const [initData, setInitData] = useState({});

    const [editorState, setEditorState] = useState(EditorState.createEmpty());

    // editor 수정 이벤트
    const onEditorStateChange = (editorState: EditorState) => {
        setEditorState(editorState);
        // (draftToHtml(convertToRaw(editorState.getCurrentContent())));
    };


    // toolbar 설정
    const toolbar = {
        list: { inDropdown: true }, // list 드롭다운
        textAlign: { inDropdown: true }, // align 드롭다운
        link: { inDropdown: true }, // link 드롭다운
        history: { inDropdown: false }, // history 드롭다운
    }

    // 언어 설정
    const localization = {
        locale: 'ko',
    }
    const uploadMaxCount = 1;
    const customRequestFor1 = ({onSuccess, onError, file}) => {
        const fileType = file.type;
        if(fileType == "" || fileType == null || fileType == undefined){
            Message.error('파일 확장자가 없어 업로드할 수 없습니다.');
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
        // param.push(file);
    }
    const [fileList, setFileList] = useState([]);
    const param = [];
    const [pointAmountDisabled, setPointAmountDisabled] = useState(false);
    const [pointPercentDisabled, setPointPercentDisabled] = useState(true);
    const [pointAmount, setPointAmount] = useState('');
    const [pointPercent, setPointPercent] = useState('');

    const onList = useCallback(() => {
        navigate(urlPrefix + '/list' + location.search);
    }, []);
    const onUpdate = () => {
        form.submit();
    }
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

        // values.productDetail = ((values.productDetail === undefined || values.productDetail.blocks[0] === undefined) ? '' : values.productDetail.blocks[0].text);
        values.productDetail = draftToHtml(values.productDetail);

        const func = MedicineAPI.add;
        func(values)
            .then((res) => {
                console.log(res);
                if(res.code !== 1000){
                    Message.error(res.message);
                    return;
                }
                fileList.map(item => {
                    if(item.status === "removed") {
                        // const list = [item.uploadFileName];
                        // uploadFiles(new File([""], "removed.jpg"), -1, 1, list);
                    } else if(item.status === "done") {
                        uploadFiles(item.file, res.data, 1);
                    }
                    console.log(item);
                })
                // fileList.map(item => {
                    // TODO 기존에 있던 데이터 파일 중 removed 인 거 전부 삭제
                    // uploadFiles(item.name, item.file, res.data['seq'], 1);
                    // if(item.status === "removed") {
                    //     const list = [item.uploadFileName];
                    //     uploadFiles(new File([""], "removed.jpg"), -1, 1, list);
                    // }
                // })
                // param.map(item => {
                //     console.log(item);
                //     uploadFiles(item, res.data, 1);
                // })
                Message.success('상품이 ' + '등록' + '되었습니다.');
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
    const onFailForm = (errorInfo) => {
        Message.error(errorInfo['errorFields'][0].errors[0]);
    };
    const uploadFiles = (file, relationSeq, fileType) => {
        const param = new FormData();
        // param.append('alreadyFileName', originFileName);
        param.append('multipartFileList', file);
        param.append('relationSeq', relationSeq);
        param.append('fileType', fileType);

        FileAPI.update(param)
            .then((res) => {
                console.log(res);
            }).catch(e => {
            Message.error("파일 업로드에 실패하였습니다. 시스템 관리자에게 문의해주세요.");
        });
    }
    const changePointType = (event) => {
        const value = event.target.value;
        if(value === 'I') {
            setPointPercent('');
            setPointAmountDisabled(false);
            setPointPercentDisabled(true);
        } else if(value === 'L') {
            setPointAmount('');
            setPointPercentDisabled(false);
            setPointAmountDisabled(true);
        } else if(value === 'N') {
            setPointAmount('');
            setPointPercent('');
            setPointAmountDisabled(true);
            setPointPercentDisabled(true);
        }
    }

    return (
        <div className="buyer-detail-layout">
            <AdminPageHeader title={"상품관리"} subTitle={"관리-상세"}/>
            <div className={'detail_wrap'}>
                <Form
                    layout={'vertical'}
                    form={form}
                    onFinish={onSubmit}
                    onFinishFailed={onFailForm}
                    initialValues={{}}
                >

                    <Descriptions title="기본정보" size={'small'} column={2} bordered>

                        <Descriptions.Item label="제품명" span={2}>
                            <Form.Item label=""
                                       name={"productName"}
                                       rules={[{
                                           required: true,
                                       },
                                       ]}
                            >
                                <Input maxLength={100}
                                       disabled={checkData.isLoading}
                                />
                            </Form.Item>
                        </Descriptions.Item>

                        <Descriptions.Item label="" span={2}>
                            <Form.Item label=""
                                       name={"standard"}
                                       rules={[{
                                           required: true,
                                       },
                                       ]}
                            >
                                <Input maxLength={100}
                                       disabled={checkData.isLoading}
                                />
                            </Form.Item>
                        </Descriptions.Item>

                        <Descriptions.Item label="" span={2}>
                            <Form.Item label=""
                                       name={"unit"}
                                       rules={[{
                                           required: true,
                                       },
                                       ]}
                            >
                                <Input maxLength={100}
                                       disabled={checkData.isLoading}
                                />
                            </Form.Item>
                        </Descriptions.Item>

                        <Descriptions.Item label="" span={2}>
                            <Form.Item label=""
                                       name={"formulaDivision"}
                                       rules={[{
                                           required: true,
                                       },
                                       ]}
                            >
                                <Input maxLength={100}
                                       disabled={checkData.isLoading}
                                />
                            </Form.Item>
                        </Descriptions.Item>

                        <Descriptions.Item label="명" span={2}>
                            <Form.Item label=""
                                       name={"ingredientName"}
                                       rules={[{
                                           required: true,
                                       },
                                       ]}
                            >
                                <Input maxLength={100}
                                       disabled={checkData.isLoading}
                                />
                            </Form.Item>
                        </Descriptions.Item>

                        <Descriptions.Item label="제조사" span={2}>
                            <Form.Item label=""
                                       name={"factory"}
                                       rules={[{
                                           required: true,
                                       },
                                       ]}
                            >
                                <Input maxLength={100}
                                       disabled={checkData.isLoading}
                                />
                            </Form.Item>
                        </Descriptions.Item>

                        <Descriptions.Item label="" span={2}>
                            <Form.Item label=""
                                       name={"specialDivision"}
                                       rules={[{
                                           required: true,
                                       },
                                       ]}
                            >
                                <Radio.Group>
                                    <Radio value={1}></Radio>
                                    <Radio value={2}></Radio>
                                </Radio.Group>
                            </Form.Item>
                        </Descriptions.Item>

                        <Descriptions.Item label="" span={2}>
                            <Form.Item label=""
                                       name={"specialtyDivision"}
                                       rules={[{
                                           required: true,
                                       },
                                       ]}
                            >
                                <Radio.Group>
                                    <Radio value={1}></Radio>
                                    <Radio value={2}></Radio>
                                </Radio.Group>
                            </Form.Item>
                        </Descriptions.Item>

                        <Descriptions.Item label="" span={2}>
                            <Form.Item label=""
                                       name={"medicalDivision"}
                                       rules={[{
                                           required: true,
                                       },
                                       ]}
                            >
                                <Radio.Group>
                                    <Radio value={1}></Radio>
                                    <Radio value={2}></Radio>
                                    <Radio value={3}></Radio>
                                    <Radio value={4}></Radio>
                                    <Radio value={5}></Radio>
                                </Radio.Group>
                            </Form.Item>
                        </Descriptions.Item>

                        <Descriptions.Item label="" span={2}>
                            <Form.Item label=""
                                       name={"insuranceDivision"}
                                       rules={[{
                                           required: true,
                                       },
                                       ]}
                            >
                                <Radio.Group>
                                    <Radio value={1}></Radio>
                                    <Radio value={2}></Radio>
                                </Radio.Group>
                            </Form.Item>
                        </Descriptions.Item>
                    </Descriptions>
                    <br/>

                    <Descriptions title="판매정보" size={'small'} column={2} bordered>
                        <Descriptions.Item label=" 가격" span={2}>
                            <Form.Item label=""
                                       name="buyerTypeProductAmountList_M_amount"
                                       required={false}
                                       rules={[{
                                           required: true,
                                       }, ({setFieldsValue}) => ({
                                           validator: (rule, value) => {
                                               if (value < 1) {
                                                   return Promise.reject('1보다 적게 입력할 수 없습니다..');
                                               }

                                               setFieldsValue({'buyerTypeProductAmountList_M_amount': value});

                                               return Promise.resolve();
                                           }
                                       })

                                       ]}
                            >
                                <InputNumber
                                    style={{
                                        width: '30%',
                                    }}/>
                            </Form.Item>
                        </Descriptions.Item>

                        <Descriptions.Item label=" 가격" span={2}>
                            <Form.Item label=""
                                       name="buyerTypeProductAmountList_W_amount"
                                       required={false}
                                       rules={[{
                                           required: true,
                                       }, ({setFieldsValue}) => ({
                                           validator: (rule, value) => {
                                               if (value < 1) {
                                                   return Promise.reject('1보다 적게 입력할 수 없습니다..');
                                               }

                                               setFieldsValue({'buyerTypeProductAmountList_W_amount': value});

                                               return Promise.resolve();
                                           }
                                       })
                                       ]}
                            >
                                <InputNumber
                                    style={{
                                        width: '30%',
                                    }}/>
                            </Form.Item>
                        </Descriptions.Item>

                        <Descriptions.Item label=" 가격" span={2}>
                            <Form.Item label=""
                                       name="buyerTypeProductAmountList_P_amount"
                                       required={false}
                                       rules={[{
                                           required: true,
                                       }, ({setFieldsValue}) => ({
                                           validator: (rule, value) => {
                                               if (value < 1) {
                                                   return Promise.reject('1보다 적게 입력할 수 없습니다..');
                                               }

                                               setFieldsValue({'buyerTypeProductAmountList_P_amount': value});

                                               return Promise.resolve();
                                           }
                                       })
                                       ]}
                            >
                                <InputNumber
                                    style={{
                                        width: '30%',
                                    }}/>
                            </Form.Item>
                        </Descriptions.Item>

                        <Descriptions.Item label="재고" span={2}>
                            <Form.Item label=""
                                       name={"quantity"}
                                       rules={[{
                                           required: true,
                                       }, ({setFieldsValue}) => ({
                                           validator: (rule, value) => {
                                               if (value < 1) {
                                                   return Promise.reject('1보다 적게 입력할 수 없습니다..');
                                               }

                                               setFieldsValue({'quantity': value});

                                               return Promise.resolve();
                                           }
                                       })
                                       ]}
                            >
                                <InputNumber
                                    maxLength={100}
                                    disabled={checkData.isLoading}/>
                            </Form.Item>
                        </Descriptions.Item>
                    </Descriptions>
                    <br/>

                    <Descriptions title="이미지정보" size={'small'} column={2} bordered>
                        <Descriptions.Item label="썸네일 이미지(권장 사이즈 000x000)" span={1}>
                            <Upload
                                listType="picture"
                                customRequest={customRequestFor1}
                                multiple
                                defaultFileList={fileList}
                                maxCount={1}
                            >
                                <Button icon={<UploadOutlined/>}>Upload</Button>
                            </Upload>
                        </Descriptions.Item>
                    </Descriptions>
                    <br/>

                    <span><h3>상품정보</h3></span>
                    <Form.Item
                        label=""
                        name="productDetail"
                        required={false}
                    >
                        {/*<WEditor productDetail={initData.buyer['productDetail']}/>*/}
                        <Editor/>
                        {/*<TextArea defaultValue={initData.buyer['productDetail']}></TextArea>*/}
                    </Form.Item>
                    <br/>

                    <span><h3>포인트정보</h3></span>
                    <div>
                        <table>
                            <tr>
                                <th>
                                    포인트
                                </th>
                                <Form.Item label=""
                                           name={"usePointYn"}
                                           rules={[{
                                               required: true,
                                           },
                                           ]}
                                >
                                    <Radio.Group>
                                        <td>
                                            <Radio value={"N"}>미사용</Radio>
                                        </td>
                                        <td>
                                            <Radio value={"Y"}>사용</Radio>
                                        </td>
                                    </Radio.Group>
                                </Form.Item>
                            </tr>
                            <tr>
                                <th rowSpan={2}>
                                    정액/정률
                                </th>
                                <td rowSpan={2}>
                                    <Form.Item label=""
                                               name={"pointPayType"}
                                               rules={[{
                                                   required: false,
                                               },
                                               ]}
                                    >
                                        <Radio.Group>
                                            <Radio onChange={changePointType} value={"I"}>정액</Radio>
                                            <br/>
                                            <Radio onChange={changePointType} value={"L"}>정률</Radio>
                                            <br/>
                                            <Radio onChange={changePointType} value={"N"}>적립안함</Radio>
                                        </Radio.Group>
                                    </Form.Item>
                                </td>
                                <td>
                                    <Form.Item
                                        label=" "
                                        name="pointAmount"
                                        required={false}
                                        initialValue={pointAmount}
                                    >
                                        <InputNumber maxLength={100}
                                               disabled={pointAmountDisabled}
                                               value={pointAmount}
                                        />
                                    </Form.Item>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <Form.Item
                                        label=" "
                                        name="pointPercent"
                                        required={false}
                                        initialValue={pointPercent}
                                    >
                                        <InputNumber maxLength={100}
                                               disabled={pointPercentDisabled}
                                               value={pointPercent}
                                        />
                                    </Form.Item>
                                </td>
                            </tr>
                        </table>
                        <table>
                            <tr>
                                <th>
                                    사용유무
                                </th>
                                <Form.Item
                                    label=""
                                    name="useYn"
                                    rules={[{
                                        required: true,
                                    },
                                    ]}
                                >
                                    <Radio.Group>
                                        <td>
                                            <Radio value={"Y"}>사용</Radio>
                                        </td>
                                        <td>
                                            <Radio value={"N"}>미사용</Radio>
                                        </td>
                                    </Radio.Group>
                                </Form.Item>
                            </tr>
                        </table>
                    </div>

                    <div className={'button_div'}>
                        <Button type={'primary'} onClick={onUpdate}>등록</Button>
                        <Button onClick={onList}>목록</Button>
                    </div>
                </Form>
            </div>

        </div>
    );
};

export default MedicineAdd;
