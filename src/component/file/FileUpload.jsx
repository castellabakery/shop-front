import React from 'react';
import {Button, Upload} from "antd";
import {UploadOutlined} from "@ant-design/icons";

import {Message} from "../Message";

import * as FileAPI from "../../admin/api/File";

const FileUpload = (props) => {
    const customRequest = ({onSuccess, onError, file}) => {
        onSuccess("Ok");
        const param = {
            files: file
        }
        FileAPI.upload(param)
        .then(() => {
            Message.success("success");
            onSuccess(null, file);
        }).catch(e => {
            Message.error("failed - " + e);
            onError(null, file);
        });
    }

    return (
        <Upload
            listType="picture"
            customRequest={customRequest}
            multiple
            maxCount={1}
        >
            <Button icon={<UploadOutlined/>}>Upload</Button>
        </Upload>
    )
}

export default FileUpload;