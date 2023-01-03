import React from 'react';
import 'antd/dist/antd.css';
import './BuyerOrder.css';
import {Button, Result, Steps} from "antd";
import {useNavigate, useSearchParams} from "react-router-dom";

const {Step} = Steps;

const BuyerOrderSuccess = function () {
    const navigate = useNavigate();

    const [searchParams, setSearchParams] = useSearchParams();
    console.log(searchParams.get("corpName"));

    const goMain = () => {
        navigate("/buyer");
    }
    const goMypage = () => {
        navigate("/buyer/mypage");
    }

    return (
        <div>
            <div className='logoCart'>
                 <img src={"/images/logo_top.svg"} preview={false}></img>
            </div>
        
            <Steps className="container3step" current={2}>
                <Step title="장바구니" description="" />
                <Step title="주문/결제"  description="" />
                <Step title="주문완료" description="" />
            </Steps>
            <Result
                status="success"
                title={searchParams.get("corpName")+"님의 주문의 정상적으로 완료되었습니다."}
                subTitle={
                    <div className='subtitleSuccess'>
                        <p>빠르고 안전하게 배송해드리겠습니다.</p>
                        <div>주문번호:{searchParams.get("orderNo")}</div>
                        <p>마이페이지에서 주문 진행 상황을 확인할 수 있습니다.</p>
                    </div>
                }
                extra={[
                    <Button style={{ width: 300 }} key="console" onClick={goMain} className=" btn-color02-2 btn-huge">메인으로</Button>,
                    <Button style={{ width: 300 }} key="buy" type="primary" onClick={goMypage} className=" btn-color02 btn-huge">마이페이지</Button>,
                ]}
            />
        </div>
    );
};

export default BuyerOrderSuccess;