import React from 'react';
import DaumPostcode from "react-daum-postcode";
 
const PopupPostCode = (props) => {
    const handlePostCode = (data) => {
        let fullAddress = data.address;
        let extraAddress = ''; 
        
        if (data.addressType === 'R') {
          if (data.bname !== '') {
            extraAddress += data.bname;
          }
          if (data.buildingName !== '') {
            extraAddress += (extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName);
          }
          fullAddress += (extraAddress !== '' ? ` (${extraAddress})` : '');
        }
        props.onClick(data.zonecode, fullAddress);
    }
 
    const postCodeStyle = {
        height: "510px",
        padding: "20px 0 0 0",
        overflow: "none"
    };
 
    return(
      <>
        <DaumPostcode autoClose style={postCodeStyle} onComplete={handlePostCode} />
      </>
    )
}

export default PopupPostCode;