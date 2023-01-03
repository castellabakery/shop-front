import React from 'react';
import {Route, Routes} from "react-router-dom";

import AdminMain from "./pages/Main/AdminMain";

import BuyerList from "./pages/Buyer/BuyerList";
import BuyerDetail from "./pages/Buyer/BuyerDetail";
import BuyerAdd from "./pages/Buyer/BuyerAdd";
import BuyerUpdate from "./pages/Buyer/BuyerUpdate";
import BuyerApproveList from "./pages/Buyer/Approve/BuyerApproveList";
import BuyerApproveDetail from "./pages/Buyer/Approve/BuyerApproveDetail";

import MedicineList from "./pages/Medicine/MedicineList";
import MedicineDetail from "./pages/Medicine/MedicineDetail";
import MedicineUpdate from "./pages/Medicine/MedicineUpdate";
import MedicineAdd from "./pages/Medicine/MedicineAdd";

import OrderList from "./pages/Order/OrderList";
import OrderDetail from "./pages/Order/OrderDetail";
import OrderUpdate from "./pages/Order/OrderUpdate";
import OrderAdd from "./pages/Order/OrderAdd";
import OrderStatistics from "./pages/Order/OrderStatistics";

import Logout from "./pages/Login/logout";
import Error from "../component/Error";
import FileUpload from "../component/file/FileUpload";
import PointList from "./pages/Benefit/PointList";
import AdminBoardList from "./pages/AdminBoard/AdminBoardList";
import AdminBoardAdd from "./pages/AdminBoard/AdminBoardAdd";
import AdminBoardDetail from "./pages/AdminBoard/AdminBoardDetail";
import VirtualAccountList from "./pages/VirtualAccount/VirtualAccountList";
import WEditor from "../component/editor/WEditor";

const AdminRouter = function () {
    return (
        <div>
            <Routes>
                <Route path="/" element={<AdminMain/>}/>
                <Route path="/admin" element={<AdminMain/>}/>
                <Route path="/admin/buyer/list" element={<BuyerList/>}/>
                <Route path="/admin/buyer/detail/:id" element={<BuyerDetail/>}/>
                <Route path="/admin/buyer/add" element={<BuyerAdd/>}/>
                <Route path="/admin/buyer/update/:id" element={<BuyerUpdate/>}/>
                <Route path="/admin/approve/list" element={<BuyerApproveList/>}/>
                <Route path="/admin/approve/detail/:id" element={<BuyerApproveDetail/>}/>
                <Route path="/admin/medicine/list" element={<MedicineList/>}/>
                <Route path="/admin/medicine/add" element={<MedicineAdd/>}/>
                <Route path="/admin/medicine/detail/:id" element={<MedicineDetail/>}/>
                <Route path="/admin/medicine/update/:id" element={<MedicineUpdate/>}/>
                <Route path="/admin/order/list" element={<OrderList/>}/>
                <Route path="/admin/order/add" element={<OrderAdd/>}/>
                <Route path="/admin/order/detail/:id" element={<OrderDetail/>}/>
                <Route path="/admin/order/update/:id" element={<OrderUpdate/>}/>
                <Route path="/admin/order/statistics" element={<OrderStatistics/>}/>
                <Route path="/admin/point/list" element={<PointList/>}/>
                <Route path="/admin/board/list" element={<AdminBoardList/>}/>
                <Route path="/admin/board/add" element={<AdminBoardAdd/>}/>
                <Route path="/admin/board/detail/:id" element={<AdminBoardDetail/>}/>
                <Route path="/admin/vaccount" element={<VirtualAccountList/>}/>
                <Route path="/admin/logout" element={<Logout/>}/>
                {/*<Route path="/admin/upload/test" element={<FileUpload/>}/>*/}
                <Route path="/admin/test/editor" element={<WEditor/>}/>
                <Route path="*" element={<Error/>}/>
            </Routes>
        </div>
    );
}

export default AdminRouter;