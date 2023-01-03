import React from 'react';

import {BrowserRouter, Route, Routes} from "react-router-dom";
import AdminLogin from "../../../admin/pages/Login/login";
import Error from "../../../component/Error";

const LoginRouter = function () {
    return (
        <BrowserRouter>
            <div>
                <Routes>
                    <Route path="/admin/login" element={<AdminLogin/>}/>
                    {/*<Route path="/buyer/login" element={<BuyerLoginContainer/>}/>*/}
                    {/*<Route path="*" element={<Error/>}/>*/}
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default LoginRouter;