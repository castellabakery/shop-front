import React, {useState, useEffect} from 'react';
import './App.css';
import {BrowserRouter} from "react-router-dom";
import AdminContainer from "./admin/pages/AdminContainer/AdminContainer";
import BuyerContainer from "./buyer/BuyerContainer";
import AdminLogin from "./admin/pages/Login/login";
import * as LoginAPI from "./admin/api/Login";
import Logout from "./admin/pages/Login/logout";
import {Message} from "./component";
import BuyerLoginContainer from "./buyer/Login/BuyerLoginContainer";

const App = function () {
    let localToken = localStorage.getItem("token");
    if (localToken === null || localToken === "" || localToken === "GO_LOGIN_PAGE") {
        localStorage.setItem("token", "NoToken");
        localToken = localStorage.getItem("token");
    }
    const [initContainer, setInitContainer] = useState();
    const pathname = window.location.pathname;
    useEffect(() => {
        LoginAPI.validateToken({token:localToken}).then((token) => {
            setInitContainer((() => {
                if(token === 'ExpiredJwtException'){
                    localStorage.setItem("token", "NoToken");
                    alert("로그인 세션이 만료되었습니다. 재로그인 해주세요.")
                    return <Logout/>
                }
                if (token !== localToken && (pathname === "/admin/login" || pathname === "/admin" || pathname.indexOf("/admin") === 0)) {
                    return <AdminLogin/>;
                } else if (token !== localToken && (pathname === "/" || pathname === "/buyer" || pathname.indexOf("/buyer") === 0)) {
                    return <BuyerLoginContainer/>;
                } else if (token === localToken && (pathname === "/admin/login" || pathname === "/admin" || pathname.indexOf("/admin") === 0)) {
                    return <AdminContainer/>;
                } else if (token === localToken && (pathname === "/" || pathname === "/buyer" || pathname.indexOf("/buyer") === 0)) {
                    return <BuyerContainer/>;
                } else {
                    return <BuyerLoginContainer pathname={pathname} token={token} localToken={localToken}/>;
                }
            }).call(''))
        }).catch(e => {
            Message.error("일시적인 서버 오류입니다. 다시 시도해주세요.")
            setInitContainer(<BuyerLoginContainer/>);
        });
    }, [])

    return (
        <div className="App">
            <BrowserRouter>
                {initContainer}
            </BrowserRouter>
        </div>
    );
}

export default App;
