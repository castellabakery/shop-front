import React, {useEffect, useState} from 'react';

import {Button, Typography} from "antd";

import './MainServiceCenter.css';

const MainServiceCenter = function () {

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
            content: '이벤트 상품 구입 시 주의사항에 대해서 안내드립니다.',
            date: '2021.07.05',
        },
        {
            key: '2',
            content: '배송지연 문의 시 주의사항에 대해서 안내드립니다.',
            date: '2021.07.04',
        },
        {
            key: '3',
            content: '안내사항입니다.',
            date: '2021.07.03',
        },
        {
            key: '4',
            content: '안내사항입니다.',
            date: '2021.07.03',
        },
    ];

    return (
        <div className="main-service-center-component">
            <div className={"content-layout homeService"}>
            </div>

        </div>
    );
};

export default MainServiceCenter;
