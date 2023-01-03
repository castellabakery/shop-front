import React from 'react';
import {Descriptions, Checkbox, Form} from "antd";

import './BuyerDetail.css';
import moment from "moment";

const BuyerDetail_ComDesc_Hospital = function (props) {
    const initData = props.initData;
    console.log(initData);
    return (
        <div className="buyer-detail-com-desc-hospital-layout">
            {
                initData.result.hasOwnProperty('buyer') &&
                <Descriptions title="정보" size={'small'} column={2} bordered>
                    <Descriptions.Item label="유저구분" span={2}>
                        {initData.result.buyer.hasOwnProperty('buyerType') ?
                            (initData.result.buyer['buyerType'] !== "M" ?
                                (initData.result.buyer['buyerType'] !== "W" ?
                                    (initData.result.buyer['buyerType'] !== "P" ?
                                            ""
                                        : "")
                                    : "")
                                : "")
                        : ''}
                    </Descriptions.Item>

                    <Descriptions.Item label="계정상태" span={2}>
                        {initData.result.buyer.hasOwnProperty('buyerState') ?
                            (initData.result.buyer['buyerState'] !== "R" ?
                                (initData.result.buyer['buyerState'] !== "W" ?
                                    (initData.result.buyer['buyerState'] !== "D" ?
                                        (initData.result.buyer['buyerState'] !== "J" ?
                                            (initData.result.buyer['buyerState'] !== "S" ?
                                                ""
                                                : "정지")
                                            : "반려")
                                        : "승인완료")
                                    : "수정승인대기")
                                : "가입승인대기")
                            : ''}
                    </Descriptions.Item>

                    <Descriptions.Item label="ID" span={2}>
                        {initData.result.hasOwnProperty('buyerIdentificationId') ? initData.result['buyerIdentificationId'] : ''}
                    </Descriptions.Item>

                    <Descriptions.Item label="명" span={2}>
                        {initData.result.buyer.hasOwnProperty('corpName') ? initData.result.buyer['corpName'] : ''}
                    </Descriptions.Item>

                    <Descriptions.Item label="성명" span={2}>
                        {initData.result.hasOwnProperty('staffName') ? initData.result['staffName'] : ''}
                    </Descriptions.Item>

                    <Descriptions.Item label="주소" span={2}>
                        {initData.result.buyer.hasOwnProperty('addressPostNo') ? initData.result.buyer['addressPostNo'] : ''}&nbsp;
                        {initData.result.buyer.hasOwnProperty('corpAddress') ? initData.result.buyer['corpAddress'] : ''}&nbsp;
                        {initData.result.buyer.hasOwnProperty('addressDetail') ? initData.result.buyer['addressDetail'] : ''}
                    </Descriptions.Item>

                    <Descriptions.Item label="대표번호" span={2}>
                        {initData.result.buyer.hasOwnProperty('corpTelNo') ? initData.result.buyer['corpTelNo'] : ''}
                    </Descriptions.Item>

                    <Descriptions.Item label="사업자등록증" span={2}>
                        <a
                            href={initData.result.fileList.length > 0 ? initData.result.fileList.map(item => (item.fileType === 8 ? item.fullFilePath : '')).toString().replaceAll(',', '') : ''}
                            download
                        >
                            파일보기
                        </a>
                    </Descriptions.Item>

                    <Descriptions.Item label="가입신청일자" span={2}>
                        {initData.result.buyer.hasOwnProperty('approveDatetime') ? moment(initData.result.buyer['approveDatetime']).format('YYYY-MM-DD HH:mm:ss') : ''}
                    </Descriptions.Item>

                    <Descriptions.Item label="가입승인일자" span={2}>
                        {initData.result.buyer.hasOwnProperty('createdDatetime') ? moment(initData.result.buyer['createdDatetime']).format('YYYY-MM-DD HH:mm:ss') : ''}
                    </Descriptions.Item>
                </Descriptions>
            }
            <br/>
            {
                initData.result.hasOwnProperty('buyer') &&
                <Descriptions title="담당자정보" size={'small'} column={2} bordered>
                    <Descriptions.Item label="담당자" span={2}>
                        {initData.result.hasOwnProperty('staffName') ? initData.result['staffName'] : ''}
                    </Descriptions.Item>

                    <Descriptions.Item label="이메일" span={2}>
                        {initData.result.hasOwnProperty('staffEmail') ? initData.result['staffEmail'] : ''}
                    </Descriptions.Item>

                    <Descriptions.Item label="휴대폰번호" span={2}>
                        {initData.result.hasOwnProperty('staffPhoneNo') ? initData.result['staffPhoneNo'] : ''}
                    </Descriptions.Item>

                    {/*<Descriptions.Item label="선택약관동의" span={2}>*/}
                    {/*    마케팅정보동의  <Checkbox defaultChecked={e => {*/}
                    {/*    if(initData.result.buyer.hasOwnProperty('buyerTermsList')){*/}
                    {/*        const idx = initData.result.buyerTermsList.terms.findIndex(item => item.seq === 1);*/}
                    {/*        if(initData.result.buyerTermsList[idx].agreeYn === "Y") {*/}
                    {/*            return true;*/}
                    {/*        } else {*/}
                    {/*            return false;*/}
                    {/*        }*/}
                    {/*    }*/}
                    {/*}} onChange=""/>*/}
                    {/*    &nbsp;&nbsp;*/}
                    {/*    개인정보 제3자 제공동의<Checkbox defaultChecked={e => {*/}
                    {/*    if(initData.result.buyer.hasOwnProperty('buyerTermsList')){*/}
                    {/*        const idx = initData.result.buyerTermsList.terms.findIndex(item => item.seq === 2);*/}
                    {/*        if(initData.result.buyerTermsList[idx].agreeYn === "Y") {*/}
                    {/*            return true;*/}
                    {/*        } else {*/}
                    {/*            return false;*/}
                    {/*        }*/}
                    {/*    }*/}
                    {/*}} onChange=""/>*/}
                    {/*</Descriptions.Item>*/}
                </Descriptions>
            }
        </div>
    );
};

export default BuyerDetail_ComDesc_Hospital;
