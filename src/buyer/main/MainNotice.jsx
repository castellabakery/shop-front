import React, {useEffect, useState} from 'react';
import {Space, Tag} from "antd";

const MainNotice = function () {

    const [isInitialize, setIsInitialize] = useState(false);

    useEffect(() => {
        if (!isInitialize) {
            setIsInitialize(true);
        }
    }, [isInitialize, setIsInitialize]);

    const columns = [
        {
            title: 'content',
            dataIndex: 'content',
            key: 'content',
        },
        {
            title: 'date',
            dataIndex: 'date',
            key: 'date',
        },
    ];

    const data = [
        {
            key: '1',
            content: '',
            date: '2022',
        }
    ];

    return (
        <div className="main-notice-component">

        </div>
    );
};

export default MainNotice;
