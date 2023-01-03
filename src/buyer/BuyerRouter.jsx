import React from 'react';

import {Route, Routes} from "react-router-dom";
import Error from "../component/Error";

import BuyerMain from "./main/BuyerMain";
import BuyerMedicineList from "./Medicine/BuyerMedicineList";
import BuyerMedicineDetail from "./Medicine/BuyerMedicineDetail";
import BuyerCart from "./Cart/BuyerCart";
import BuyerOrder from "./Order/BuyerOrder";
import BuyerOrderSuccess from "./Order/BuyerOrderSuccess";
import BuyerMypage from "./Mypage/BuyerMypage";
import BuyerOrderList from "./Mypage/Order/BuyerOrderList";
import BuyerOrderDetail from "./Mypage/Order/BuyerOrderDetail";
import BuyerPointList from "./Mypage/Point/PointList";
import BuyerUserDetail_Hospital from "./Mypage/User/Hospital/BuyerUserDetail";
import BuyerUserDetail_Company from "./Mypage/User/Company/BuyerUserDetail";
import BuyerUserDetail_Pharmacy from "./Mypage/User/Pharmacy/BuyerUserDetail";
import Logout from "../buyer/Login/logout";
import SubUserList from "./Mypage/User/Sub/SubUserList";
import BuyerVaccount from './Mypage/Vaccount/BuyerVaccount';
import Register from './Mypage/Vaccount/Register';
import BuyerOrderFailed from "./Order/BuyerOrderFailed";
import BuyerAdminBoardList from "./AdminBoard/BuyerAdminBoardList";
import BuyerAdminBoardDetail from "./AdminBoard/BuyerAdminBoardDetail";

const BuyerRouter = function () {

    return (
        <div>
            <Routes>
                <Route path="/" element={<BuyerMain/>}/>
                <Route path="/buyer" element={<BuyerMain/>}/>
                <Route path="/buyer/medicine/list" element={<BuyerMedicineList/>}/>
                <Route path="/buyer/medicine/detail/:id" element={<BuyerMedicineDetail/>}/>
                <Route path="/buyer/cart" element={<BuyerCart/>}/>
                <Route path="/buyer/order" element={<BuyerOrder/>}/>
                <Route path="/buyer/order/success" element={<BuyerOrderSuccess/>}/>
                <Route path="/buyer/order/failed" element={<BuyerOrderFailed/>}/>
                <Route path="/buyer/mypage" element={<BuyerMypage/>}/>
                <Route path="/buyer/mypage/order/list" element={<BuyerOrderList/>}/>
                <Route path="/buyer/mypage/order/detail/:id" element={<BuyerOrderDetail/>}/>
                <Route path="/buyer/mypage/point/list" element={<BuyerPointList />}/>
                <Route path="/buyer/mypage/user/detail/hospital" element={<BuyerUserDetail_Hospital />}/>
                <Route path="/buyer/mypage/user/detail/company" element={<BuyerUserDetail_Company />}/>
                <Route path="/buyer/mypage/user/detail/pharmacy" element={<BuyerUserDetail_Pharmacy />}/>
                <Route path="/buyer/mypage/user/sub" element={<SubUserList />}/>
                <Route path="/buyer/mypage/vaccount" element={<BuyerVaccount />}/>
                <Route path="/buyer/mypage/vaccount/register" element={<Register />}/>
                <Route path="/buyer/board/list" element={<BuyerAdminBoardList/>}/>
                <Route path="/buyer/board/detail/:id" element={<BuyerAdminBoardDetail/>}/>
                <Route path="/buyer/logout" element={<Logout />}/>
                <Route path="*" element={<Error/>}/>
            </Routes>

        </div>
    );

}

export default BuyerRouter;