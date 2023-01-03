import React from 'react';
import 'antd/dist/antd.css';
import './BuyerOrder.css';
import {Button, Result, Steps} from "antd";
import {useNavigate, useSearchParams} from "react-router-dom";

const {Step} = Steps;

const BuyerOrderFailed = function () {
    const navigate = useNavigate();

    // const [searchParams, setSearchParams] = useSearchParams();
    // console.log(searchParams.get("corpName"));

    const goMain = () => {
        navigate("/buyer");
    }
    const goCart = () => {
        navigate("/buyer/cart");
    }

    return (
        <div>
            <div className='logoCart'>
                 <img src={"/images/logo_top.svg"} preview={false}></img>
            </div>
            <Steps className="container3step" current={2}>
                <Step title="장바구니" description="" />
                <Step title="주문/결제"  description="" />
                <Step title="주문오류" description="" />
            </Steps>
            <Result
                status="error"
                title={"주문이 실패하였습니다."}
                subTitle={
                    <div className='subtitleSuccess'>
                       <p>관리자에 문의해주세요.</p>
                    </div>
                }
                extra={[
                    <Button style={{ width: 300 }} key="console" onClick={goMain} className="btn-color02-2 btn-huge">메인으로</Button>,
                    <Button style={{ width: 300 }} key="buy" type="primary" onClick={goCart} className="btn-color02 btn-huge">장바구니</Button>,
                ]}
            />
        </div>
    );
};

export default BuyerOrderFailed;