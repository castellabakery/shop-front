import React, {useEffect, useState} from 'react';
import {Button, Card, Descriptions, InputNumber} from 'antd';
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';

import './BestCard.css';

const BestCard = function (props) {

    const {keyPrefix, imageList, sliderWidth, sliderHeight, intervalSecond, isAutoPlay, isBullets} = props;

    const [isInitialize, setIsInitialize] = useState(false);

    useEffect(() => {
        if (!isInitialize) {
            setIsInitialize(true);
        }
    }, [isInitialize, setIsInitialize]);


    return (
        <div className="best-card-component">

            <div className={"card-image"}>
                <Card

                    style={{ width: 300 }}
                    cover={
                        <img
                            alt="example"
                            src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                        />
                    }
                    actions={[
                        // <SettingOutlined key="setting" />,
                        // <EditOutlined key="edit" />,
                        <InputNumber min={1} max={10} defaultValue={1} className={"count-input"} formatter={value => value+' 개'}/>,
                        <Button>담기</Button>
                        // <EllipsisOutlined key="ellipsis" />,
                    ]}
                >
                    <Card.Meta
                        // avatar={<Card.Avatar src="https://joeschmoe.io/api/v1/random" />}
                        title="듀오덤 (DuoDerm)"
                        description={<Descriptions><Descriptions.Item span={2} label={"4*4(E*traThin)"}>BOX(10EA)</Descriptions.Item></Descriptions>}
                    />
                    <Card.Meta
                        // avatar={<Card.Avatar src="https://joeschmoe.io/api/v1/random" />}
                        title="17,050원"
                    />
                </Card>
            </div>

        </div>
    );
};

export default BestCard;
