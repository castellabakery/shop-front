import React, {useMemo, useRef, useState} from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import * as FileAPI from "../../admin/api/File";
import {Message} from "../Message";

const EditorComponent = () => {
    const [value, setValue] = useState('');
    const quillRef = useRef();

    const formats = [
        //'font',
        'header',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image',
        'align', 'color', 'background',
    ]

    const imageHandler = () => {
        console.log('test');
        const input = document.createElement('input');

        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        document.body.appendChild(input);

        input.click();

        input.onchange = async () => {
            const [file] = input.files;

            // const { preSignedPutUrl: presignedURL, readObjectUrl: imageURL } = (await getS3PresignedURL(file.name)).data;
            // await uploadImage(presignedURL, file);

            console.log(file);
            const param = new FormData();
            param.append('multipartFileList', file);
            param.append('relationSeq', -1);
            param.append('fileType', 10);

            FileAPI.updateForProductDetail(param)
                .then((res) => {
                    console.log(res);
                }).catch(e => {
                    Message.error("파일 업로드에 실패하였습니다. 시스템 관리자에게 문의해주세요.");
                });


            const range = quillRef.current.getEditorSelection();
            quillRef.current.getEditor().insertEmbed(range.index, 'image', "https://xx.s3.ap-northeast-2.amazonaws.com/xx/xx.jpg")
            quillRef.current.getEditor().setSelection(range.index + 1);
            document.body.querySelector(':scope > input').remove()
        };
    }

    const modules = useMemo(
        () => ({
            toolbar: {
                container: [
                    ["bold", "italic", "underline", "strike", "blockquote"],
                    [{ size: ["small", false, "large", "huge"] }, { color: [] }],
                    [
                        { list: "ordered" },
                        { list: "bullet" },
                        { indent: "-1" },
                        { indent: "+1" },
                        { align: [] },
                    ],
                    ["image"],
                ],
                handlers: {
                    image: imageHandler,
                },
            },
        }),
        []
    );

    return (
            <div style={{height: "650px"}}>
                <ReactQuill
                    ref={quillRef}
                    style={{height: "600px"}}
                    theme="snow"
                    modules={modules}
                    formats={formats}
                    value={value}
                    onChange={setValue} />
            </div>
        )

}
export default EditorComponent