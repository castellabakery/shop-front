import React from 'react'
import {message} from 'antd'
import 'antd/dist/antd.css'

class CommonMessage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            styles: {
                marginTop: '20vh',
                marginBottom: '-20vh',
            },
        };
    }

    success = (content) => {
        if (!this.valid(content)) {
            return false;
        }

        message.success({
            content: content,
            style: this.state.styles,
        })
    }

    error = (content) => {
        if (!this.valid(content)) {
            return false;
        }

        message.error({
            content: content,
            style: this.state.styles,
        })
    }

    warn = (content) => {
        if (!this.valid(content)) {
            return false;
        }

        message.warn({
            content: content,
            style: this.state.styles,
        })
    }

    valid = (content) => {
        return null !== content &&
            undefined !== content &&
            0 < content.length;
    }
}

const Message = new CommonMessage();
export default Message;