import React from 'react';
import {Route, Routes} from "react-router-dom";
import Error from "../../component/Error";
import BuyerLoginMain from "./BuyerLoginMain";
import BuyerFindid from "./Find/BuyerFindid";
import BuyerSignupHospital1 from "./Signup/Step1/BuyerSignupHospital";
import BuyerSignupHospital1_2 from "./Signup/Step1_2/BuyerSignupHospital";
import BuyerSignupHospital1_3 from "./Signup/Step1_3/BuyerSignupHospital";
import BuyerSignupPharmacy1 from "./Signup/Step1/BuyerSignupPharmacy";
import BuyerSignupPharmacy1_2 from "./Signup/Step1_2/BuyerSignupPharmacy";
import BuyerSignupPharmacy1_3 from "./Signup/Step1_3/BuyerSignupPharmacy";
import BuyerSignupCompany1 from "./Signup/Step1/BuyerSignupCompany";
import BuyerSignupCompany1_2 from "./Signup/Step1_2/BuyerSignupCompany";
import BuyerSignupCompany1_3 from "./Signup/Step1_3/BuyerSignupCompany";
import BuyerSignupHospital2 from "./Signup/Step2/BuyerSignupHospital";
import BuyerSignupPharmacy2 from "./Signup/Step2/BuyerSignupPharmacy";
import BuyerSignupCompany2 from "./Signup/Step2/BuyerSignupCompany";
import BuyerSignupHospital3 from "./Signup/Step3/BuyerSignupHospital";
import BuyerSignupPharmacy3 from "./Signup/Step3/BuyerSignupPharmacy";
import BuyerSignupCompany3 from "./Signup/Step3/BuyerSignupCompany";
import BuyerSignupHospital4 from "./Signup/Step4/BuyerSignupHospital";
import BuyerSignupPharmacy4 from "./Signup/Step4/BuyerSignupPharmacy";
import BuyerSignupCompany4 from "./Signup/Step4/BuyerSignupCompany";
import PopupPostCode from './Signup/Common/PostCode/PopupPostCode';
import HealthCheck from "../../component/health/HealthCheck";

const BuyerLoginRouter = function () {

    return (
        <div>
            <Routes>
                <Route path="/" element={<BuyerLoginMain/>}/>
                <Route path="/login" element={<BuyerLoginMain/>}/>
                <Route path="/login/findid" element={<BuyerFindid/>}/>
                <Route path="/login/signup/hospital/step1" element={<BuyerSignupHospital1/>}/>
                <Route path="/login/signup/hospital/step1/success" element={<BuyerSignupHospital1_2/>}/>
                <Route path="/login/signup/hospital/step1/fail" element={<BuyerSignupHospital1_3/>}/>
                <Route path="/login/signup/pharmacy/step1" element={<BuyerSignupPharmacy1/>}/>
                <Route path="/login/signup/pharmacy/step1/success" element={<BuyerSignupPharmacy1_2/>}/>
                <Route path="/login/signup/pharmacy/step1/fail" element={<BuyerSignupPharmacy1_3/>}/>
                <Route path="/login/signup/company/step1" element={<BuyerSignupCompany1/>}/>
                <Route path="/login/signup/company/step1/success" element={<BuyerSignupCompany1_2/>}/>
                <Route path="/login/signup/company/step1/fail" element={<BuyerSignupCompany1_3/>}/>
                <Route path="/login/signup/hospital/step2" element={<BuyerSignupHospital2/>}/>
                <Route path="/login/signup/pharmacy/step2" element={<BuyerSignupPharmacy2/>}/>
                <Route path="/login/signup/company/step2" element={<BuyerSignupCompany2/>}/>
                <Route path="/login/signup/hospital/step3" element={<BuyerSignupHospital3/>}/>
                <Route path="/login/signup/pharmacy/step3" element={<BuyerSignupPharmacy3/>}/>
                <Route path="/login/signup/company/step3" element={<BuyerSignupCompany3/>}/>
                <Route path="/login/signup/hospital/step4" element={<BuyerSignupHospital4/>}/>
                <Route path="/login/signup/pharmacy/step4" element={<BuyerSignupPharmacy4/>}/>
                <Route path="/login/signup/company/step4" element={<BuyerSignupCompany4/>}/>
                <Route path="/login/signup/common/postcode/popuppostcode" element={<PopupPostCode/>}/>
                <Route path="/health" element={<HealthCheck/>}/>
                <Route path="*" element={<BuyerLoginMain/>}/>
            </Routes>
        </div>
    );
}
export default BuyerLoginRouter;