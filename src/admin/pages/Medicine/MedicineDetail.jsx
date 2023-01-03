import React, {useCallback, useEffect, useRef, useState} from 'react';
import './MedicineDetail.css';
import AdminPageHeader from "../../AdminPageHeader";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import * as MedicineAPI from "../../api/Medicine";
import {Button, Descriptions, Form, Input, InputNumber, Radio, Upload} from "antd";
import {Message} from "../../../component";
import {UploadOutlined} from "@ant-design/icons";
import {Editor} from "react-draft-wysiwyg"
import * as FileAPI from "../../api/File";

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { ContentState, convertToRaw, EditorState, convertFromRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';

const MedicineDetail = function () {
    const [form] = Form.useForm();
    const urlPrefix = '/admin/medicine';
    const navigate = useNavigate();
    const location = useLocation();
    const params = useParams();
    const id = Number(params.id);
    const uploadMaxCount = 1;
    const [checkData, setCheckData] = useState({
        isLoading: false,
        isInitialize: false,
    });
    const [initData, setInitData] = useState({});
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const [pointDisabled, setPointDisabled] = useState(false);
    const [pointChecked, setPointChecked] = useState(false);

    // editor 수정 이벤트
    const onEditorStateChange = (editorState: EditorState) => {
        try {
            // console.log(editorState);
            setEditorState(editorState);
            // (draftToHtml(convertToRaw(editorState.getCurrentContent())));

        } catch(err){
            Message.error("입력한 값을 다시 확인해주세요.")
        }
        form.setFieldValue("productDetail", editorState);

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

    const customRequestFor1 = ({onSuccess, onError, file}, fileList) => {
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
    }
    const [fileList, setFileList] = useState([]);
    const [pointAmountDisabled, setPointAmountDisabled] = useState(true);
    const [pointPercentDisabled, setPointPercentDisabled] = useState(true);
    const [pointAmount, setPointAmount] = useState('');
    const [pointPercent, setPointPercent] = useState('');
    const [productDetail, setProductDetail] = useState('');

    useEffect(() => {
        if (!checkData.isInitialize) {
            setCheckData((p) => {
                return {
                    ...p,
                    isInitialize: true,
                    isLoading: true,
                }
            })

            MedicineAPI.get({map: {seq: id}})
                .then((response) => {
                    // console.log(response);
                    if(response.data['pointPayType'] === "N"){
                        setPointDisabled(true);
                    }
                    if(response.data['pointPayType'] === 'I') {
                        setPointAmountDisabled(false);
                        setPointAmount(response.data['point']);
                    } else if(response.data['pointPayType'] === 'L') {
                        setPointPercentDisabled(false);
                        setPointPercent(response.data['point']);
                    }
                    const blocksFromHtml = htmlToDraft(response.data.productDetail);
                    if (blocksFromHtml) {
                        const { contentBlocks, entityMap } = blocksFromHtml;
                        const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
                        const editorState = EditorState.createWithContent(contentState);
                        setEditorState(editorState);
                    }
                    setProductDetail(response.data.productDetail);
                    form.setFieldsValue({
                        productDetail: response.data.productDetail
                    });
                    // onEditorStateChange(EditorState.createWithContent(ContentState.createFromText(response.data.productDetail)));
                    setFileList((response.data.fileList !== undefined ? response.data.fileList.map(item => {
                        if(item.delYn === "Y") return {};
                        return {
                            uid: item.seq,
                            name: item.orgFileName,
                            uploadFileName:item.uploadFileName,
                            status: 'done',
                            url: item.fullFilePath,
                            thumbUrl: item.fullFilePath,
                        };
                    }) : []));
                    form.setFieldsValue({
                        buyer: response.data || {},
                    });
                    setInitData((p) => {
                        return {
                            ...p,
                            buyer: response.data || {},
                        }
                    });
                    setCheckData((p) => {
                        return {
                            ...p,
                            isLoading: false,
                        }
                    })
                })
                .catch((error) => {
                    Message.error(error.message);
                })
        }
    }, [setInitData]);
    const onList = useCallback(() => {
        navigate(urlPrefix + '/list' + location.search);
    }, []);
    const onUpdate = () => {
        form.submit();
    }

    const onRemove = (e) => {
        // console.log(e);

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
        // console.log(values);
        // values.productDetail = ((values.productDetail === undefined || values.productDetail.blocks[0] === undefined) ? '' : values.productDetail.blocks[0].text);
        values.productDetail = draftToHtml(values.productDetail);
        if(values.productDetail === "" || values.productDetail === undefined || values.productDetail === null) {
            // console.log(editorState);
            values.productDetail = draftToHtml(editorState.getCurrentContent());
            // console.log(values.productDetail);
        }
        if(values.productDetail === "" || values.productDetail === undefined || values.productDetail === null) {
            // console.log(productDetail);
            values.productDetail = productDetail;
            // console.log(values.productDetail);
        }
        // const blocksFromHtml = htmlToDraft(editorState);
        // if (blocksFromHtml) {
        //     const { contentBlocks, entityMap } = editorState;
        //     const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
        //     const editorState_ = EditorState.createWithContent(contentState);
        //     setEditorState(editorState_);
        // }

        values.seq = id;

        const func = MedicineAPI.update;
        func(values)
            .then(() => {
                fileList.map(item => {
                    if(item.status === "removed") {
                        uploadFiles(new File([""], "removed.jpg"), -1, 1, item.uploadFileName);
                    } else if(item.status === "done") {
                        uploadFiles(item.file, id, 1);
                    }
                })
                Message.success('상품이 ' + '수정' + '되었습니다.');
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

    }, [checkData, setCheckData]);
    const onFailForm = (errorInfo) => {
        Message.error(errorInfo['errorFields'][0].errors[0]);
    };
    const uploadFiles = (file, relationSeq, fileType, originFileName) => {
        const param = new FormData();
        if(originFileName !== undefined && originFileName !== null && originFileName !== "") param.append('alreadyFileName', originFileName);
        param.append('multipartFileList', file);
        param.append('relationSeq', relationSeq);
        param.append('fileType', fileType);
        console.log(originFileName);
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
            setPointChecked("I")
            setPointPercent('');
            setPointAmountDisabled(false);
            setPointPercentDisabled(true);
        } else if(value === 'L') {
            setPointChecked('L')
            setPointAmount('');
            setPointPercentDisabled(false);
            setPointAmountDisabled(true);
        } else if(value === 'N') {
            setPointChecked('N')
            setPointAmount('');
            setPointPercent('');
            setPointAmountDisabled(true);
            setPointPercentDisabled(true);
        }
    }

    const validation = (e) => {
        // console.log(e)
    }

    const nopointcheck = useRef();
    const changePointUse = useCallback((e) => {
        // console.log(e);
        if(e.target.value == "N"){
            setPointAmount('');
            setPointPercent('');
            setPointAmountDisabled(true);
            setPointPercentDisabled(true);
            setPointDisabled(true)
        } else {
            // console.log(nopointcheck.current.state.checked);
            nopointcheck.current.state.checked = true;
            // console.log(nopointcheck.current.state.checked);
            setPointChecked(true);
            setPointDisabled(false)
        }
    }, [nopointcheck]);

    return (
        <div className="buyer-detail-layout">
            <AdminPageHeader title={"상품관리"} subTitle={"-상세"}/>
            <div className={'detail_wrap'}>
                {
                    initData.hasOwnProperty('buyer') &&

                    <Form
                        layout={'vertical'}
                        form={form}
                        onFinish={onSubmit}
                        onFinishFailed={onFailForm}
                        initialValues={{
                            productDetail: editorState
                        }}
                    >

                        <Descriptions title="기본정보" size={'small'} column={2} bordered>


                            <Descriptions.Item label="제품명" span={2}>
                                <Form.Item label=""
                                           name={"productName"}
                                           rules={[{
                                               required: true,
                                           },
                                           ]}
                                           initialValue={initData.buyer.hasOwnProperty('productName') ? initData.buyer['productName'] : ''}
                                >
                                    <Input maxLength={100}
                                           defaultValue={initData.buyer.hasOwnProperty('productName') ? initData.buyer['productName'] : ''}
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
                                           initialValue={initData.buyer.hasOwnProperty('standard') ? initData.buyer['standard'] : ''}
                                >
                                    <Input maxLength={100}
                                           defaultValue={initData.buyer.hasOwnProperty('standard') ? initData.buyer['standard'] : ''}
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
                                           initialValue={initData.buyer.hasOwnProperty('unit') ? initData.buyer['unit'] : ''}
                                >
                                    <Input maxLength={100}
                                           defaultValue={initData.buyer.hasOwnProperty('unit') ? initData.buyer['unit'] : ''}
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
                                           initialValue={initData.buyer.hasOwnProperty('formulaDivision') ? initData.buyer['formulaDivision'] : ''}
                                >
                                    <Input maxLength={100}
                                           defaultValue={initData.buyer.hasOwnProperty('formulaDivision') ? initData.buyer['formulaDivision'] : ''}
                                    />
                                </Form.Item>
                            </Descriptions.Item>


                            <Descriptions.Item label="" span={2}>
                                <Form.Item label=""
                                           name={"ingredientName"}
                                           rules={[{
                                               required: true,
                                           },
                                           ]}
                                           initialValue={initData.buyer.hasOwnProperty('ingredientName') ? initData.buyer['ingredientName'] : ''}
                                >
                                    <Input maxLength={100}
                                           defaultValue={initData.buyer.hasOwnProperty('ingredientName') ? initData.buyer['ingredientName'] : ''}
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
                                           initialValue={initData.buyer.hasOwnProperty('factory') ? initData.buyer['factory'] : ''}
                                >
                                    <Input maxLength={100}
                                           defaultValue={initData.buyer.hasOwnProperty('factory') ? initData.buyer['factory'] : ''}
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
                                           initialValue={(initData.buyer.hasOwnProperty('specialDivision') ? Number(initData.buyer['specialDivision']) : -1)}
                                >
                                    <Radio.Group
                                        defaultValue={(initData.buyer.hasOwnProperty('specialDivision') ? Number(initData.buyer['specialDivision']) : -1)}>
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
                                           initialValue={(initData.buyer.hasOwnProperty('specialtyDivision') ? Number(initData.buyer['specialtyDivision']) : -1)}
                                >
                                    <Radio.Group
                                        defaultValue={(initData.buyer.hasOwnProperty('specialtyDivision') ? Number(initData.buyer['specialtyDivision']) : -1)}>
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
                                           initialValue={(initData.buyer.hasOwnProperty('medicalDivision') ? Number(initData.buyer['medicalDivision']) : -1)}
                                >
                                    <Radio.Group
                                        defaultValue={(initData.buyer.hasOwnProperty('medicalDivision') ? Number(initData.buyer['medicalDivision']) : -1)}>
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
                                           initialValue={(initData.buyer.hasOwnProperty('insuranceDivision') ? Number(initData.buyer['insuranceDivision']) : -1)}
                                >
                                    <Radio.Group
                                        defaultValue={(initData.buyer.hasOwnProperty('insuranceDivision') ? Number(initData.buyer['insuranceDivision']) : -1)}>
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
                                           required={true}
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
                                           initialValue={initData.buyer.hasOwnProperty('buyerTypeProductAmountList') ? initData.buyer.buyerTypeProductAmountList.map(item =>
                                               (item['buyerType'] === 'M' ? item['amount'] : '')
                                           ).toString().replaceAll(',', ' ').trim() : ''}
                                >
                                    <InputNumber
                                        style={{
                                            width: '30%',
                                        }}
                                        onChange={validation}
                                        defaultValue={initData.buyer.hasOwnProperty('buyerTypeProductAmountList') ? initData.buyer.buyerTypeProductAmountList.map(item =>
                                            (item['buyerType'] === 'M' ? item['amount'] : '')
                                        ).toString().replaceAll(',', ' ').trim() : ''}/>
                                </Form.Item>
                            </Descriptions.Item>

                            <Descriptions.Item label=" 가격" span={2}>
                                <Form.Item label=""
                                           name="buyerTypeProductAmountList_W_amount"
                                           required={true}
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
                                           initialValue={initData.buyer.hasOwnProperty('buyerTypeProductAmountList') ? initData.buyer.buyerTypeProductAmountList.map(item =>
                                               (item['buyerType'] === 'W' ? item['amount'] : '')
                                           ).toString().replaceAll(',', ' ').trim() : ''}
                                >
                                    <InputNumber
                                        style={{
                                            width: '30%',
                                        }}
                                        onChange={validation}
                                        defaultValue={initData.buyer.hasOwnProperty('buyerTypeProductAmountList') ? initData.buyer.buyerTypeProductAmountList.map(item =>
                                            (item['buyerType'] === 'W' ? item['amount'] : '')
                                        ).toString().replaceAll(',', ' ').trim() : ''}/>
                                </Form.Item>
                            </Descriptions.Item>

                            <Descriptions.Item label=" 가격" span={2}>
                                <Form.Item label=""
                                           name="buyerTypeProductAmountList_P_amount"
                                           required={true}
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
                                           onChange={validation}
                                           initialValue={initData.buyer.hasOwnProperty('buyerTypeProductAmountList') ? initData.buyer.buyerTypeProductAmountList.map(item =>
                                               (item['buyerType'] === 'P' ? item['amount'] : '')
                                           ).toString().replaceAll(',', ' ').trim() : ''}
                                >
                                    <InputNumber
                                        style={{
                                            width: '30%',
                                        }}
                                        onChange={validation}
                                        defaultValue={initData.buyer.hasOwnProperty('buyerTypeProductAmountList') ? initData.buyer.buyerTypeProductAmountList.map(item =>
                                            (item['buyerType'] === 'P' ? item['amount'] : '')
                                        ).toString().replaceAll(',', ' ').trim() : ''}/>
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
                                           initialValue={initData.buyer.hasOwnProperty('quantity') ? initData.buyer['quantity'] : ''}
                                >
                                    <InputNumber
                                        onChange={validation}
                                        defaultValue={initData.buyer.hasOwnProperty('quantity') ? initData.buyer['quantity'] : ''}
                                        maxLength={100}/>
                                </Form.Item>
                            </Descriptions.Item>
                        </Descriptions>
                        <br/>

                        <Descriptions title="이미지정보" size={'small'} column={2} bordered>
                            <Descriptions.Item label="썸네일 이미지(권장 사이즈 000x000)" span={1}>
                                <Upload
                                    listType="picture"
                                    customRequest={({onSuccess, onError, file}) => customRequestFor1({onSuccess, onError, file}, fileList)}
                                    multiple
                                    defaultFileList={fileList}
                                    maxCount={uploadMaxCount}
                                    onRemove={onRemove}
                                    progress={{
                                        progress:{
                                            format:(percent) => 100
                                        }
                                    }}
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
                            initialValue={editorState}
                        >
                            <Editor
                                editorClassName="editor" // Editor 적용 클래스
                                toolbarClassName="toolbar" // Toolbar 적용 클래스
                                toolbar={toolbar}
                                placeholder="내용을 입력하세요."
                                localization={localization}
                                editorState={editorState}
                                onEditorStateChange={onEditorStateChange}
                            />
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
                                               initialValue={(initData.buyer.hasOwnProperty('pointPayType') ? (initData.buyer['pointPayType'] !== "N" ? "Y" : "N") : "N")}
                                    >
                                        <Radio.Group
                                            defaultValue={(initData.buyer.hasOwnProperty('pointPayType') ? (initData.buyer['pointPayType'] !== "N" ? "Y" : "N") : "N")}>
                                            <td>
                                                <Radio onChange={changePointUse} value={"N"}>미사용</Radio>
                                            </td>
                                            <td>
                                                <Radio onChange={changePointUse} value={"Y"}>사용</Radio>
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
                                                   initialValue={(initData.buyer.hasOwnProperty('pointPayType') ? initData.buyer['pointPayType'] : "N")}
                                        >
                                            <Radio.Group
                                                defaultValue={(initData.buyer.hasOwnProperty('pointPayType') ? initData.buyer['pointPayType'] : "N")}>
                                                <Radio disabled={pointDisabled} onChange={changePointType} value={"I"}>정액</Radio>
                                                <br/>
                                                <Radio disabled={pointDisabled} onChange={changePointType} value={"L"}>정률</Radio>
                                                <br/>
                                                <Radio state={pointChecked} ref={nopointcheck} disabled={pointDisabled} onChange={changePointType} value={"N"}>적립안함</Radio>
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
                                                   onChange={validation}
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
                                                   onChange={validation}
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
                                        required={true}
                                        initialValue={(initData.buyer.hasOwnProperty('useYn') ? initData.buyer['useYn'] : "N")}
                                    >
                                        <Radio.Group
                                            defaultValue={(initData.buyer.hasOwnProperty('useYn') ? initData.buyer['useYn'] : "N")}>
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
                            <Button type={'primary'} onClick={onUpdate}>수정</Button>
                            <Button onClick={onList}>목록</Button>
                        </div>
                    </Form>

                }
            </div>

        </div>
    );
};

export default MedicineDetail;
