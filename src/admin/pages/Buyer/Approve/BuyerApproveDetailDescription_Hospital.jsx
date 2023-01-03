import React from 'react';
import {Checkbox, Descriptions} from "antd";

import '../BuyerDetail.css';
import moment from "moment";

const BuyerApproveDetailDescription_Hospital = function (props) {
    const initData = props.detailData;
    const wInitData = props.wDetailData;
    const isResult = props.isResult;
    console.log(initData);
    console.log(wInitData);
    console.log(wInitData.result.buyer);
    return (
        <div>
            {
                initData.result['state'] === 'R' &&
                <Descriptions title="정보" size={'small'} column={2} bordered>
                    <Descriptions.Item label="유저구분" span={2}>
                        {initData.result.hasOwnProperty('buyerType') ?
                            (initData.result['buyerType'] !== "W" ?
                                (initData.result['buyerType'] !== "M" ?
                                    (initData.result['buyerType'] !== "P" ?
                                        ""
                                    : "")
                                : "")
                            : "")
                        : ''}
                    </Descriptions.Item>

                    <Descriptions.Item label="ID" span={2}>
                        {initData.result.hasOwnProperty('buyerIdentificationId') ? initData.result['buyerIdentificationId'] : ''}
                    </Descriptions.Item>

                    <Descriptions.Item label="명" span={2}>
                        {initData.result.hasOwnProperty('corpName') ? initData.result['corpName'] : ''}
                    </Descriptions.Item>

                    <Descriptions.Item label="성명" span={2}>
                        {initData.result.hasOwnProperty('corpStaffName') ? initData.result['corpStaffName'] : ''}
                    </Descriptions.Item>

                    <Descriptions.Item label="주소" span={2}>
                        {initData.result.hasOwnProperty('addressPostNo') ? initData.result['addressPostNo'] : ''}&nbsp;
                        {initData.result.hasOwnProperty('corpAddress') ? initData.result['corpAddress'] : ''}&nbsp;
                        {initData.result.hasOwnProperty('addressDetail') ? initData.result['addressDetail'] : ''}
                    </Descriptions.Item>

                    <Descriptions.Item label="대표번호" span={2}>
                        {initData.result.hasOwnProperty('corpTelNo') ? initData.result['corpTelNo'] : ''}
                    </Descriptions.Item>

                    <Descriptions.Item label="Fax번호" span={2}>
                        {initData.result.hasOwnProperty('corpFaxNo') ? initData.result['corpFaxNo'] : ''}
                    </Descriptions.Item>

                    <Descriptions.Item label="사업자등록번호" span={2}>
                        {initData.result.hasOwnProperty('corpNo') ? initData.result['corpNo'] : ''}
                    </Descriptions.Item>

                    <Descriptions.Item label="사업자등록증" span={2}>
                        <a
                            href={initData.result.fileList.length > 0 ? (initData.result.fileList.map(item => (item.fileType === 6 ? item.fullFilePath : ''))).toString().replaceAll(',', '') : ''}
                            download
                        >
                            {initData.result.fileList.length > 0 ? "파일보기" : "파일없음"}
                        </a>
                    </Descriptions.Item>

                    <Descriptions.Item label="가입신청일자" span={2}>
                        {initData.result.hasOwnProperty('createdDatetime') ? moment(initData.result['createdDatetime']).format('YYYY-MM-DD HH:mm:ss') : ''}
                    </Descriptions.Item>
                </Descriptions>
            }
            <br/>
            {
                initData.result['state'] === 'R' &&
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
            {
                isResult && initData.result['state'] === 'W' &&
                <Descriptions title="정보" size={'small'} column={2} bordered>
                    <Descriptions.Item label="유저구분" span={2}>
                        {initData.result.hasOwnProperty('buyerType') ?
                            (initData.result['buyerType'] !== "W" ?
                                (initData.result['buyerType'] !== "M" ?
                                    (initData.result['buyerType'] !== "P" ?
                                        ""
                                        : "")
                                    : "")
                                : "")
                            : ''}
                    </Descriptions.Item>

                    <Descriptions.Item label="ID" span={2}>
                        {initData.result.hasOwnProperty('buyerIdentificationId') && wInitData.result.hasOwnProperty('buyer') ?
                            (initData.result['buyerIdentificationId'] != wInitData.result['buyerIdentificationId'] ?
                                    <h4 style={{color:"red"}}> {initData.result['buyerIdentificationId']} </h4> :
                                    wInitData.result['buyerIdentificationId']
                            ) :
                            ''}
                    </Descriptions.Item>

                    <Descriptions.Item label="명" span={2}>
                        {initData.result.hasOwnProperty('corpName') && wInitData.result.hasOwnProperty('buyer') ?
                            (initData.result['corpName'] != wInitData.result.buyer['corpName'] ?
                                    <h4 style={{color:"red"}}> {initData.result['corpName']} </h4> :
                                    wInitData.result.buyer['corpName']
                            ) :
                            ''}
                    </Descriptions.Item>

                    <Descriptions.Item label="성명" span={2}>
                        {initData.result.hasOwnProperty('corpStaffName') && wInitData.result.hasOwnProperty('buyer') ?
                            (initData.result['corpStaffName'] != wInitData.result.buyer['corpStaffName'] ?
                                    <h4 style={{color:"red"}}> {initData.result['corpStaffName']} </h4> :
                                    wInitData.result.buyer['corpStaffName']
                            ) :
                            ''}
                    </Descriptions.Item>

                    <Descriptions.Item label="주소" span={2}>
                        {initData.result.hasOwnProperty('corpAddress') && wInitData.result.hasOwnProperty('buyer') ?
                            (initData.result['corpAddress'] != wInitData.result.buyer['corpAddress'] || initData.result['addressPostNo'] != wInitData.result.buyer['addressPostNo'] || initData.result['addressDetail'] != wInitData.result.buyer['addressDetail'] ?
                                    <h4 style={{color:"red"}}> {initData.result['addressPostNo']}&nbsp;{initData.result['corpAddress']}&nbsp;{initData.result['addressDetail']} </h4> :
                                    wInitData.result.buyer['addressPostNo'] + wInitData.result.buyer['corpAddress'] + wInitData.result.buyer['addressDetail']
                            ) :
                            ''}
                    </Descriptions.Item>

                    <Descriptions.Item label="대표번호" span={2}>
                        {initData.result.hasOwnProperty('corpTelNo') && wInitData.result.hasOwnProperty('buyer') ?
                            (initData.result['corpTelNo'] != wInitData.result.buyer['corpTelNo'] ?
                                    <h4 style={{color:"red"}}> {initData.result['corpTelNo']} </h4> :
                                    wInitData.result.buyer['corpTelNo']
                            ) :
                            ''}
                    </Descriptions.Item>

                    <Descriptions.Item label="Fax번호" span={2}>
                        {initData.result.hasOwnProperty('corpFaxNo') && wInitData.result.hasOwnProperty('buyer') ?
                            (initData.result['corpFaxNo'] != wInitData.result.buyer['corpFaxNo'] ?
                                    <h4 style={{color:"red"}}> {initData.result['corpFaxNo']} </h4> :
                                    wInitData.result.buyer['corpFaxNo']
                            ) :
                            ''}
                    </Descriptions.Item>

                    <Descriptions.Item label="사업자등록번호" span={2}>
                        {initData.result.hasOwnProperty('corpNo') && wInitData.result.hasOwnProperty('buyer') ?
                            (initData.result['corpNo'] != wInitData.result.buyer['corpNo'] ?
                                    <h4 style={{color:"red"}}> {initData.result['corpNo']} </h4> :
                                    wInitData.result.buyer['corpNo']
                            ) :
                            ''}
                    </Descriptions.Item>


                    <Descriptions.Item label="사업자등록증" span={2}>
                        <a
                            href={initData.result.hasOwnProperty('fileList') && wInitData.result.hasOwnProperty('fileList') ?
                                (initData.result.fileList.filter(item => item.fileType === 6).length > 0 ?
                                    initData.result.fileList.filter(item => item.fileType === 6).map(item => item.fullFilePath).toString().replaceAll(',', '') :
                                    (wInitData.result.fileList.length > 0 ? wInitData.result.fileList.filter(item => item.fileType === 8).map(item => item.fullFilePath).toString().replaceAll(',', '') : '')
                                ) : ''
                            }
                            download
                        >
                            {initData.result.hasOwnProperty('fileList') && wInitData.result.hasOwnProperty('fileList') ?
                                (initData.result.fileList.length > 0 ?
                                    (initData.result.fileList.filter(item => item.fileType === 6).length > 0 ? <font style={{color:"red"}}>파일보기</font> : '파일보기') :
                                    (wInitData.result.fileList.length > 0 ? '파일보기' : '파일없음')) : '파일없음'
                            }
                        </a>
                        {/*<a*/}
                        {/*    href={initData.result.fileList.length > 0 ? initData.result.fileList.map(item => (item.fileType === 6 ? item.fullFilePath : '')).toString().replaceAll(',', '') : ''}*/}
                        {/*    download*/}
                        {/*>*/}
                        {/*    파일보기*/}
                        {/*</a>*/}
                    </Descriptions.Item>

                    <Descriptions.Item label="가입신청일자" span={2}>
                        {initData.result.hasOwnProperty('createdDatetime') && wInitData.result.hasOwnProperty('buyer') ?
                            (initData.result['createdDatetime'] != wInitData.result['createdDatetime'] ?
                                    <h4 style={{color:"red"}}> {moment(initData.result['createdDatetime']).format('YYYY-MM-DD HH:mm:ss')} </h4> :
                                    moment(wInitData.result.buyer['createdDatetime']).format('YYYY-MM-DD HH:mm:ss')
                            ) :
                            ''}
                    </Descriptions.Item>
                </Descriptions>
            }
            <br/>
            {
                isResult && initData.result['state'] === 'W' &&
                <Descriptions title="담당자정보" size={'small'} column={2} bordered>
                    <Descriptions.Item label="담당자" span={2}>
                        {initData.result.hasOwnProperty('staffName') && wInitData.result.hasOwnProperty('buyer') ?
                            (initData.result['staffName'] != wInitData.result['staffName'] ?
                                    <h4 style={{color:"red"}}> {initData.result['staffName']} </h4> :
                                    wInitData.result['staffName']
                            ) :
                            ''}
                    </Descriptions.Item>

                    <Descriptions.Item label="이메일" span={2}>
                        {initData.result.hasOwnProperty('staffEmail') && wInitData.result.hasOwnProperty('buyer') ?
                            (initData.result['staffEmail'] != wInitData.result['staffEmail'] ?
                                    <h4 style={{color:"red"}}> {initData.result['staffEmail']} </h4> :
                                    wInitData.result['staffEmail']
                            ) :
                            ''}
                    </Descriptions.Item>

                    <Descriptions.Item label="휴대폰번호" span={2}>
                        {initData.result.hasOwnProperty('staffPhoneNo') && wInitData.result.hasOwnProperty('buyer') ?
                            (initData.result['staffPhoneNo'] != wInitData.result['staffPhoneNo'] ?
                                    <h4 style={{color:"red"}}> {initData.result['staffPhoneNo']} </h4> :
                                    wInitData.result['staffPhoneNo']
                            ) :
                            ''}
                    </Descriptions.Item>

                    {/*<Descriptions.Item label="선택약관동의" span={2}>*/}
                    {/*    마케팅정보동의  <Checkbox defaultChecked={e => {*/}
                    {/*    if(initData.result.buyer.hasOwnProperty('buyerTermsList') && wInitData.result.buyer.hasOwnProperty('buyerTermsList')){*/}
                    {/*        if(initData.result[''] != wInitData.result['']){*/}
                    {/*            const idx = initData.result.buyerTermsList.terms.findIndex(item => item.seq === 1);*/}
                    {/*            if(initData.result.buyerTermsList[idx].agreeYn === "Y") {*/}
                    {/*                return true;*/}
                    {/*            } else {*/}
                    {/*                return false;*/}
                    {/*            }*/}
                    {/*        } else {*/}
                    {/*            const idx = wInitData.result.buyerTermsList.terms.findIndex(item => item.seq === 1);*/}
                    {/*            if(wInitData.result.buyerTermsList[idx].agreeYn === "Y") {*/}
                    {/*                return true;*/}
                    {/*            } else {*/}
                    {/*                return false;*/}
                    {/*            }*/}
                    {/*        }*/}
                    {/*    }*/}
                    {/*}} onChange=""/>*/}
                    {/*    &nbsp;&nbsp;*/}
                    {/*    개인정보 제3자 제공동의<Checkbox defaultChecked={e => {*/}
                    {/*    if(initData.result.buyer.hasOwnProperty('buyerTermsList') && wInitData.result.buyer.hasOwnProperty('buyerTermsList')){*/}
                    {/*        if(initData.result[''] != wInitData.result['']){*/}
                    {/*            const idx = initData.result.buyerTermsList.terms.findIndex(item => item.seq === 2);*/}
                    {/*            if(initData.result.buyerTermsList[idx].agreeYn === "Y") {*/}
                    {/*                return true;*/}
                    {/*            } else {*/}
                    {/*                return false;*/}
                    {/*            }*/}
                    {/*        } else {*/}
                    {/*            const idx = wInitData.result.buyerTermsList.terms.findIndex(item => item.seq === 2);*/}
                    {/*            if(wInitData.result.buyerTermsList[idx].agreeYn === "Y") {*/}
                    {/*                return true;*/}
                    {/*            } else {*/}
                    {/*                return false;*/}
                    {/*            }*/}
                    {/*        }*/}
                    {/*    }*/}
                    {/*}} onChange=""/>*/}
                    {/*</Descriptions.Item>*/}
                </Descriptions>
            }

        </div>
    );
};

export default BuyerApproveDetailDescription_Hospital;