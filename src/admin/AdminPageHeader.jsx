import React from 'react';
import {Divider} from "antd";
import './AdminPageHeader.css';

const AdminPageHeader = function (props) {

    const {title, subTitle} = props;

    return (
        <div className="admin-page-header">

            {
                title &&
                <>
                    <div className={"page-title"}>
                        {title}
                        {
                            subTitle &&
                            <span className={"sub-title"}>{subTitle}</span>
                        }
                    </div>
                    <Divider/>
                </>
            }

        </div>
    );
};

export default AdminPageHeader;
