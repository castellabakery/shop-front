import React, {useEffect, useState} from 'react';

const Error = function () {

    const [isInitialize, setIsInitialize] = useState(false);

    useEffect(() => {
        if (!isInitialize) {
            setIsInitialize(true);
        }
    }, [isInitialize, setIsInitialize]);

    return (
        <div className="App">

                <h1>
                   페이지 오류입니다. 다시 시도해주세요.
                </h1>

        </div>
    );
};

export default Error;
