import React, {useEffect, useState} from 'react';
import './BuyerMain.css';
import BuyerMedicineList from "../Medicine/BuyerMedicineList";

const BuyerMain = function () {

    const [isInitialize, setIsInitialize] = useState(false);

    useEffect(() => {
        if (!isInitialize) {
            setIsInitialize(true);
        }
    }, [isInitialize, setIsInitialize]);

    return (
        <div className="buyer-main-component">

            <section className='homeLogo'>
                <div><img src="/images/logo_home.svg" /></div>
            </section>

            <BuyerMedicineList nowPage={"main"}/>

        </div>
    );
};

export default BuyerMain;
