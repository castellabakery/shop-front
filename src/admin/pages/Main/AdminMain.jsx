import React, {useEffect, useState} from 'react';

const AdminMain = function () {

    const [isInitialize, setIsInitialize] = useState(false);

    useEffect(() => {
        if (!isInitialize) {
            setIsInitialize(true);
        }
    }, [isInitialize, setIsInitialize]);


    return (
        <div className="App">

                <h1>
                    admin main
                </h1>

        </div>
    );
};

export default AdminMain;
