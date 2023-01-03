import React, {useCallback, useEffect, useRef, useState} from 'react';
import * as BuyerAPI from "../../../../admin/api/Buyer";
import {Message, Table} from "../../../../component";
import {useParams} from "react-router-dom";
import {Button, Checkbox, Descriptions, Input} from "antd";
import {add, buyerDelete, buyerModify, initPassword} from "../../../../admin/api/Buyer";
import moment from "moment";

const SubUserList = function () {
    const params = useParams();
    const id = Number(params.id);
    const table = useRef();
    const [subList, setSubList] = useState([]);
    const [mainId, setMainId] = useState("");
    const [buyerIdentificationId, setBuyerIdentificationId] = useState("");

    const [password, setPassword] = useState("");
    const [staffName, setStaffName] = useState("");
    const [staffTelNo, setStaffTelNo] = useState("");
    const [staffPhoneNo, setStaffPhoneNo] = useState("");
    const [staffEmail, setStaffEmai] = useState("");

    const [seq1, setSeq1] = useState("");
    const [subId, setSubId] = useState("");
    const [staffName1, setStaffName1] = useState("");
    const [staffTelNo1, setStaffTelNo1] = useState("");
    const [staffPhoneNo1, setStaffPhoneNo1] = useState("");
    const [staffEmail1, setStaffEmai1] = useState("");

    const [checkboxList, setCheckboxList] = useState([]);
    const [checkedList, setCheckedList] = useState([]);

    const delSubUser = () => {
        const result = arrangeCheckbox("checked");
        if(!result) return;
        console.log(result);
        let results = false;
        console.log(checkedList);
        checkedList.forEach(item => {
            BuyerAPI.buyerDelete({
                map:{
                    buyerIdentificationCode    : item.code,
                }
            }).then(res => {
                console.log(res);
                if(res.code !== 1000){
                    Message.error(res.message);
                    results = true;
                    return;
                }
            })
                .catch(err => {
                    results = true;
                    Message.error(err.message);
                })
        })
        if(results) return;
        window.location.reload();
    }

    const arrangeCheckbox = (type, seqForSingle) => {
        let result = [];

        if (type === 'all') {
            checkedList.map(item => {
                result.push(item.seq);
            })
        } else if (type === 'checked') {
            checkedList.map(item => {
                if (item.checked === true) result.push(item.seq);
            })
        } else if (type === 'single') {
            result.push(seqForSingle);
        } else {
            Message.error('일시적인 오류입니다. 다시 시도해주세요.');
            return false;
        }

        if (result.length === 0) {
            Message.warn('계정을 선택해주세요.');
            return false;
        }

        return result;
    }

    const onChange = useCallback((checkedList, checkboxList, event, type, record) => {
        if(type === 'all') {
            for(let i=0;i<checkedList.length;i++){
                checkedList[i].checked = event.target.checked;
                if(event.target.checked) {
                    checkboxList.push(checkedList[i].seq);
                } else {
                    checkboxList = [];
                }
            }
        } else {
            const idx = checkedList.findIndex(item => item.seq === record.seq);
            if(idx > -1) checkedList[idx].checked = event.target.checked;

            if(event.target.checked){
                checkboxList.push(record.seq);
            } else {
                const index = checkboxList.indexOf(record.seq);
                if(index > -1) checkboxList.splice(index, 1);
            }
            console.log(checkedList);
            console.log(idx);
            console.log(record);
            setSeq1(record.seq);
            setSubId(checkedList[idx].id);
            setStaffName1(record.staffName);
            setStaffTelNo1(record.staffPhoneNo);
            setStaffPhoneNo1(record.staffPhoneNo);
            setStaffEmai1(record.staffEmail);
        }
        setCheckedList(prev => [...checkedList]);
        setCheckboxList(prev => [...checkboxList])
    }, [setCheckboxList, setCheckedList]);

    const columns = [
        {
            title: () => {
                return (
                    <div>
                        <Checkbox onChange={e => {
                            onChange(checkedList, checkboxList, e, 'all');
                        }}
                                  checked={checkboxList.length === checkedList.length}
                        /> 전체 선택
                    </div>
                );
            },
            dataIndex: 'checkbox',
            key: 'checkbox',
            render: (_, record) => <Checkbox checked={checkboxList.includes(record.seq) ? true : false} onChange={e => {onChange(checkedList, checkboxList, e, 'single', record);}}/>,
        },
        {
            title: 'ID',
            dataIndex: 'buyerIdentificationId',
            key: 'buyerIdentificationId',
        },
        {
            title: '담당자',
            dataIndex: 'staffName',
            key: 'staffName',
        },
        {
            title: '이메일',
            dataIndex: 'staffEmail',
            key: 'staffEmail',
        },
        {
            title: '생성일자',
            dataIndex: 'createdDatetime',
            key: 'createdDatetime',
            render: (_, record) => moment(record.createdDatetime).format('YYYY-MM-DD HH:mm:ss')
        },
        {
            title: '비밀번호',
            dataIndex: '',
            key: '',
            render: (record) => {
                return (
                    <Button onClick={e => {
                        initPassword(e, record)
                    }}>초기화</Button>
                );
            }
        },
    ];

    const _onList = () => {
        const values = {
            pageNo: 1,
            len: 10
        };
        BuyerAPI.buyerSubList(values)
            .then((response) => {
                console.log(response);
                const content = response.data.content;
                setSubList(content);
                setCheckedList(prev => [...prev, ...content.map(item => {
                    return {
                        seq: item.seq,
                        checked: true,
                        quantity: item.quantity,
                        id: item.buyerIdentificationId,
                        code: item.buyerIdentificationCode
                    };
                })]);
                setCheckboxList(prev => [...prev, ...content.map(item => item.seq)])
                // setMainId(content[0].buyerIdentificationId.replace(/[0-9]/g, ""))
            })
            .catch((error) => {
                Message.error(error.message);
            })
    }

    const getUserDetail = () => {
        const values = {
            map:{
            }
        };
        BuyerAPI.buyerGet(values)
            .then((response) => {
                console.log(response);
                setBuyerIdentificationId(response.data.buyerIdentificationId);
            })
            .catch((error) => {
                Message.error(error.message);
            });
    }

    useEffect(() => {
        getUserDetail();
        _onList();
    }, []);

    const initPassword = (event, record) => {
        console.log(event);
        console.log(record);
        BuyerAPI.initPassword({
            map:{
                buyerIdentificationId: record.buyerIdentificationId
            }
        })
            .then(res => {
                console.log(res);
                if(res.code !== 1000){
                    Message.error("비밀번호 초기화에 실패했습니다. 다시 시도해주세요.");
                    return;
                }
                alert("비밀번호가 초기화되었습니다. 초기 비밀번호는 부계정 아이디와 동일합니다.")
                window.location.reload();
            })
            .catch(err => {
                Message.error(err);
            })
    }

    const addSubUser = (password, staffName, staffTelNo, staffPhoneNo, staffEmail) => {
        if(password === undefined || staffName === undefined || staffTelNo === undefined || staffPhoneNo === undefined || staffEmail === undefined
            || password === "" || staffName === "" || staffTelNo === "" || staffPhoneNo === "" || staffEmail === ""
            || password === null || staffName === null || staffTelNo === null || staffPhoneNo === null || staffEmail === null) {
            Message.warn("모든 정보를 입력해주세요."); //TODO
            return;
        }
        BuyerAPI.add({
            map:{
                password    : password,
                staffName   : staffName,
                staffTelNo  : staffTelNo,
                staffPhoneNo: staffPhoneNo,
                staffEmail  : staffEmail
            }
        }).then(res => {
            console.log(res);
            if(res.code !== 1000){
                Message.error(res.message);
                return;
            }
            window.location.reload();
        })
        .catch(err => {
            Message.error(err.message);
        })
    }

    const changeValue = (e, type) => {
        console.log(e.target.value);
        if(type == "password"){
            setPassword(e.target.value);
        } else if(type == "staffEmail"){
            setStaffEmai(e.target.value);
        } else if(type == "staffNo"){
            setStaffPhoneNo(e.target.value);
            setStaffTelNo(e.target.value);
        } else if(type == "staffName"){
            setStaffName(e.target.value);
        } else if(type == "password1"){
            // setPassword1(e.target.value);
        } else if(type == "staffEmail1"){
            setStaffEmai1(e.target.value);
        } else if(type == "staffNo1"){
            setStaffPhoneNo1(e.target.value);
            setStaffTelNo1(e.target.value);
        } else if(type == "staffName1"){
            setStaffName1(e.target.value);
        }
    }

    const modifySubUser = (seq, staffName, staffTelNo, staffPhoneNo, staffEmail) => {
        if(seq === undefined || staffName === undefined || staffTelNo === undefined || staffPhoneNo === undefined || staffEmail === undefined
            || seq === "" || staffName === "" || staffTelNo === "" || staffPhoneNo === "" || staffEmail === ""
            || seq === null || staffName === null || staffTelNo === null || staffPhoneNo === null || staffEmail === null) {
            Message.warn("모든 정보를 입력해주세요.");
            return;
        }
        BuyerAPI.buyerModify({
            map:{
                seq    : seq,
                staffName   : staffName,
                staffTelNo  : staffTelNo,
                staffPhoneNo: staffPhoneNo,
                staffEmail  : staffEmail
            }
        }).then(res => {
            console.log(res);
            if(res.code !== 1000){
                Message.error(res.message);
                return;
            }
            window.location.reload();
        })
            .catch(err => {
                Message.error(err.message);
            })
    }

    return (
        <div>
            <Descriptions title={"메인계정 정보"} bordered>
                <Descriptions.Item label={"아이디"}>
                    {buyerIdentificationId}
                </Descriptions.Item>
            </Descriptions>
            <Descriptions title={"부계정 리스트"}></Descriptions>
            <Table
                columns={columns}
                isInitLoad={true}
                onList={BuyerAPI.buyerSubList}
                innerRef={table}
            />
            <div style={{textAlign:"end"}}>
                <Button style={{width:100}} onClick={e => addSubUser(password, staffName, staffTelNo, staffPhoneNo, staffEmail)}>추가</Button>&nbsp;
                <Button style={{width:100}} onClick={e => modifySubUser(seq1, staffName1, staffTelNo1, staffPhoneNo1, staffEmail1)}>수정</Button>&nbsp;
                <Button style={{width:100}} type={"primary"} onClick={e => delSubUser(e, "checked", "")}>삭제</Button>
            </div>
            <br/>
            <Descriptions layout={"vertical"} column={4} bordered>
                <Descriptions.Item label={"비밀번호"}>
                    <Input.Password onChange={e => changeValue(e, "password")} style={{width: 200}}></Input.Password>
                </Descriptions.Item>
                <Descriptions.Item label={"담당자명"}>
                    <Input onChange={e => changeValue(e, "staffName")} style={{width: 200}}></Input>
                </Descriptions.Item>
                <Descriptions.Item label={"이메일"}>
                    <Input onChange={e => changeValue(e, "staffEmail")} style={{width: 200}}></Input>
                </Descriptions.Item>
                <Descriptions.Item label={"연락처"}>
                    <Input onChange={e => changeValue(e, "staffNo")} style={{width: 200}}></Input>
                </Descriptions.Item>
            </Descriptions>
            <br/>
            <Descriptions layout={"vertical"} column={4} bordered>
                <Descriptions.Item label={"아이디"}>
                    {subId}
                </Descriptions.Item>
                <Descriptions.Item label={"담당자명"}>
                    <Input onChange={e => changeValue(e, "staffName1")} value={staffName1} style={{width: 200}}></Input>
                </Descriptions.Item>
                <Descriptions.Item label={"이메일"}>
                    <Input onChange={e => changeValue(e, "staffEmail1")} value={staffEmail1} style={{width: 200}}></Input>
                </Descriptions.Item>
                <Descriptions.Item label={"연락처"}>
                    <Input onChange={e => changeValue(e, "staffNo1")} value={staffPhoneNo1} style={{width: 200}}></Input>
                </Descriptions.Item>
            </Descriptions>
            <Input type={"hidden"} onChange={e => changeValue(e, "seq1")} value={seq1} style={{width: 200}}></Input>
        </div>
    );
};

export default SubUserList;
