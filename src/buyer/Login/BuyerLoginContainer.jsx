import React, {useEffect, useState} from 'react';
import 'antd/dist/antd.css';
import '../BuyerContainer.css';
import {Image, Layout, Modal} from 'antd';
import BuyerLoginRouter from "./BuyerLoginRouter";
import {Link, useNavigate} from "react-router-dom";
import * as BuyerAPI from "../../admin/api/Buyer";
import {Message} from "../../component";
import TextArea from "antd/es/input/TextArea";

const {Header, Footer} = Layout;

const BuyerLoginContainer = function (props) {
    const navigate = useNavigate();
    const token = props.token;
    const localToken = props.localToken;
    const pathname = props.pathname;
    useEffect(() => {
        if (token === localToken && (pathname === "/login")) {
            // navigate("/buyer");
            window.location.href = "/buyer";
        }
        showTerms("1");
        showTerms("2");
    }, [])

    const [isModalVisible1, setIsModalVisible1] = useState(false);
    const showModal1 = () => {
        setIsModalVisible1(true);
    };
    const closeModal1 = () => {
        setIsModalVisible1(false);
    };
    const [isModalVisible2, setIsModalVisible2] = useState(false);
    const showModal2 = () => {
        setIsModalVisible2(true);
    };
    const closeModal2 = () => {
        setIsModalVisible2(false);
    };
    const [terms1, setTerms1] = useState("");
    const [terms2, setTerms2] = useState("");

    const changeHTML = (str) => {
        let parser = new DOMParser();
        let doc = parser.parseFromString(str, 'text/html');
        return doc.body;
    }

    const showTerms = (seq) => {
        BuyerAPI.getTerms({
            map:{
                seq: seq
            }
        })
            .then(res => {
                console.log(res);
                if(seq === "1"){
                    setTerms1(changeHTML(res.data.content).innerHTML);
                } else if(seq === "2"){
                    setTerms2(changeHTML(res.data.content).innerHTML);
                }
                // setIsResult(true)
            })
            .catch(err => {
                Message.error(err);
            })
    }

    return (
        <div>
            {/*<BrowserRouter>*/}
            <Layout className="buyer-container-layout">
                <Header className={"buyer-header loginHeader"}>
                    <a href={"/login"}>{<Image src={"/images/logo_top.svg"} preview={false}></Image>}</a>
                </Header>
                <div className={"buyer-content-layout"}>
                    <BuyerLoginRouter/>
                </div>
                <Footer className={"buyer-footer"}>
                    <div className={"buyer-footer-content"}>
                    </div>
                </Footer>
            </Layout>
            {/*</BrowserRouter>*/}
            <Modal title="이용약관" visible={isModalVisible1} onOk={closeModal1} onCancel={closeModal1}>
                <TextArea autoSize={true} value={terms1}></TextArea>
            </Modal>
            <Modal title="개인정보 수집 및 이용 동의" visible={isModalVisible2} onOk={closeModal2} onCancel={closeModal2}>
                <TextArea autoSize={true} value={terms2}></TextArea>
            </Modal>
        </div>
    );
};

export default BuyerLoginContainer;