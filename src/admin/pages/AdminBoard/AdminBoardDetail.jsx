import React, {useCallback, useEffect, useRef, useState} from 'react';
import './AdminBoardDetail.css';
import AdminPageHeader from "../../AdminPageHeader";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import * as AdminBoardAPI from "../../api/AdminBoard";
import {Button, Descriptions, Form, Input, InputNumber, Radio, Upload} from "antd";
import {Message} from "../../../component";
import {UploadOutlined} from "@ant-design/icons";
import {Editor} from "react-draft-wysiwyg"
import * as FileAPI from "../../api/File";

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { ContentState, convertToRaw, EditorState, convertFromRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import TextArea from "antd/es/input/TextArea";

const AdminBoardDetail = function () {
    const [form] = Form.useForm();
    const urlPrefix = '/admin/board';
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

            AdminBoardAPI.get({map: {seq: id}})
                .then((response) => {
                    console.log(response);
                    form.setFieldsValue({
                        board: response.data || {},
                    });
                    setInitData((p) => {
                        return {
                            ...p,
                            board: response.data || {},
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

    const onDelete = () => {
        AdminBoardAPI.delAdminBoard({map:{seq:id}})
            .then(res => {
                console.log(res);
                if(res.code !== 1000){
                    Message.error("공지사항 삭제에 실패하였습니다. - "+ res.message);
                    return;
                }
                Message.success("공지사항 삭제에 성공하였습니다.");
                onList();
            })
            .catch(err => {
                Message.error("공지사항 삭제에 실패하였습니다. - "+err);
            })
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

        values.seq = id;
        values.boardType = "1";

        const func = AdminBoardAPI.addModify;
        func(values)
            .then((res) => {
                if(res.code !== 1000){
                    Message.error("공지사항 수정에 실패했습니다. - "+res.message);
                    return;
                }
                Message.success('공지사항이 ' + '수정' + '되었습니다.');
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

    const validation = (e) => {
        // console.log(e)
    }

    return (
        <div className="buyer-detail-layout">
            <AdminPageHeader title={"공지사항 관리"} subTitle={"공지사항-상세"}/>
            <div className={'detail_wrap'}>
                {
                    initData.hasOwnProperty('board') &&

                    <Form
                        layout={'vertical'}
                        form={form}
                        onFinish={onSubmit}
                        onFinishFailed={onFailForm}
                    >

                        <Descriptions title="기본정보" size={'small'} column={2} bordered>

                            <Descriptions.Item label="제목" span={2}>
                                <Form.Item label=""
                                           name={"title"}
                                           required={false}
                                           rules={[{
                                               required: true,
                                           },
                                           ]}
                                           initialValue={initData.board.hasOwnProperty('title') ? initData.board['title'] : ''}
                                >
                                    <Input
                                        defaultValue={initData.board.hasOwnProperty('title') ? initData.board['title'] : ''}
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
                                           initialValue={initData.board.hasOwnProperty('content') ? initData.board['content'] : ''}
                                >
                                    <TextArea
                                           defaultValue={initData.board.hasOwnProperty('content') ? initData.board['content'] : ''}
                                    />
                                </Form.Item>
                            </Descriptions.Item>

                            <Descriptions.Item label="노출여부" span={2}>
                                <Form.Item label=""
                                           name={"displayYn"}
                                           rules={[{
                                               required: true,
                                           },
                                           ]}
                                           initialValue={(initData.board.hasOwnProperty('displayYn') ? initData.board['displayYn'] : -1)}
                                >
                                    <Radio.Group
                                        defaultValue={(initData.board.hasOwnProperty('displayYn') ? initData.board['displayYn'] : -1)}>
                                        <Radio value={"Y"}>노출</Radio>
                                        <Radio value={"N"}>미노출</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </Descriptions.Item>

                        </Descriptions>

                        <div className={'button_div'}>
                            <Button type={'primary'} onClick={onUpdate}>수정</Button>
                            <Button type={'primary'} onClick={onDelete}>삭제</Button>
                            <Button onClick={onList}>목록</Button>
                        </div>
                    </Form>

                }
            </div>

        </div>
    );
};

export default AdminBoardDetail;
