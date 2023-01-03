import React from 'react';
import {Spin} from 'antd'
import 'antd/dist/antd.css'
import './Loading.css';

const Loading = (props) => {
    const hasChildren = props.children !== undefined;
    let children;
    if (hasChildren) {
        children = props.children;
    } else {
        children = null;
    }

    return (
        <Spin className={props.className} spinning={props.loading} size="large" tip="Loading...">
            {children}
        </Spin>
    );
};

export default Loading;