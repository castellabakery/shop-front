import React, {useCallback, useEffect, useState} from 'react';
import './AdminBoardDetail.css';
import AdminPageHeader from "../../AdminPageHeader";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import * as AdminBoardAPI from "../../api/AdminBoard";
import {Button, Descriptions, Form, Input, InputNumber, Radio, Upload} from "antd";
import {Message} from "../../../component";
import {UploadOutlined} from "@ant-design/icons";
import {Editor} from "react-draft-wysiwyg"
import * as FileAPI from "../../api/File";
import {EditorState} from "draft-js";
import draftToHtml from "draftjs-to-html";
import TextArea from "antd/es/input/TextArea";

const AdminBoardAdd = function () {
    const [form] = Form.useForm();
    const urlPrefix = '/admin/board';
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

    const uploadMaxCount = 1;
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
    const [fileList, setFileList] = useState([]);

    const onList = useCallback(() => {
        navigate(urlPrefix + '/list' + location.search);
    }, []);
    const onUpdate = () => {
        form.submit();
    }
    const onSubmit = useCallback((values) => {
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

        values.boardType = "1";

        const func = AdminBoardAPI.addModify;
        func(values)
            .then((res) => {
                console.log(res);
                if(res.code !== 1000){
                    Message.error(res.message);
                    return;
                }
                Message.success('공지사항이 ' + '등록' + '되었습니다.');
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

    return (
        <div className="buyer-detail-layout">
            <AdminPageHeader title={"공지사항 관리"} subTitle={"공지사항-상세"}/>
            <div className={'detail_wrap'}>
                <Form
                    layout={'vertical'}
                    form={form}
                    onFinish={onSubmit}
                    onFinishFailed={onFailForm}
                    initialValues={{}}
                >

                    <Descriptions title="기본정보" size={'small'} column={2} bordered>

                        <Descriptions.Item label="제목" span={2}>
                            <Form.Item label=""
                                       name={"title"}
                                       required={true}
                                       rules={[{
                                           required: true,
                                       },
                                       ]}
                            >
                                <Input
                                />
                            </Form.Item>
                        </Descriptions.Item>

                        <Descriptions.Item label="내용" span={2}>
                            <Form.Item label=""
                                       name={"content"}
                                       rules={[{
                                           required: true,
                                       },
                                       ]}
                            >
                                <TextArea/>
                            </Form.Item>
                        </Descriptions.Item>

                        <Descriptions.Item label="노출여부" span={2}>
                            <Form.Item label=""
                                       name={"displayYn"}
                                       rules={[{
                                           required: true,
                                       },
                                       ]}
                            >
                                <Radio.Group>
                                    <Radio value={"Y"}>노출</Radio>
                                    <Radio value={"N"}>미노출</Radio>
                                </Radio.Group>
                            </Form.Item>
                        </Descriptions.Item>

                    </Descriptions>

                    <div className={'button_div'}>
                        <Button type={'primary'} onClick={onUpdate}>등록</Button>
                        <Button onClick={onList}>목록</Button>
                    </div>
                </Form>
            </div>

        </div>
    );
};

export default AdminBoardAdd;
