import React from 'react';
import {RecoilRoot} from "recoil"
import {createRoot} from 'react-dom/client';
import './index.css';

import * as serviceWorker from './serviceWorker';
import App from "./App";

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
    <RecoilRoot>
        <App></App>
    </RecoilRoot>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

//  서비스 워커가 뭐지