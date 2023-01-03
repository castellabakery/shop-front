import * as CommonJs from "../lib/Common";
import * as LoginAPI from "../admin/api/Login";

export const NewPromise = (promise) => {
    return new Promise(function (resolve, reject) {
        promise
            .then((response) => {
                if (200 === response.status) {
                    resolve(response.data);
                } else {
                    reject({error: {}, message: response.statusText});
                }
            })
            .catch((error) => {
                const errorMessage = CommonJs.extractErrorMessage(error);
                reject({error: error, message: errorMessage});
            });
    });
};

export const NewPromiseForDownload = (promise) => {
    return new Promise(function (resolve, reject) {
        promise
            .then((response) => {
                if (200 === response.status) {
                    try {
                        let blob = new Blob([response.data], {type: response.headers['content-type']});
                        let fileName = getFileName(response.headers['content-disposition']);
                        fileName = decodeURI(fileName);

                        if (window.navigator.msSaveOrOpenBlob) {
                            window.navigator.msSaveOrOpenBlob(blob, fileName);
                        } else {
                            let link = document.createElement('a');
                            link.href = window.URL.createObjectURL(blob);
                            link.target = '_self';
                            if (fileName) link.download = fileName;
                            link.click()
                        }

                        resolve(response.data);
                    } catch (e) {
                        reject({error: {}, status: 500, message: e.message});
                    }
                } else {
                    reject({error: {}, status: response.status, message: response.statusText});
                }
            })
            .catch((error) => {
                let errorMessage = CommonJs.extractErrorMessage(error);
                if (!errorMessage) {
                    errorMessage = error.message;
                }

                reject({error: error, status: -1, message: errorMessage});
            });
    });
};

function getFileName(contentDisposition) {
    let fileName = contentDisposition
        .split(';')
        .filter((ele) => {
            return ele.toLowerCase().indexOf('filename') > -1
        })
        .map((ele) => {
            let val = ele.replace(/"/g, '');
            const idx = val.indexOf('=');
            if (idx !== -1) {
                val = val.substring(idx + 1);
            }
            return val;
        });
    return fileName[0] ? fileName[0] : null
}

export const getCookie = (cookie_name) => {
    let x, y;
    const val = document.cookie.split(';');
    // const val = LoginAPI.getToken().then((v) => {
    //     console.log(v);
    // });
    for (let i = 0; i < val.length; i++) {
        x = val[i].substr(0, val[i].indexOf('='));
        y = val[i].substr(val[i].indexOf('=') + 1);
        x = x.replace(/^\s+|\s+$/g, '');
        // 앞과 뒤의 공백 제거하기
        if (x == cookie_name) {
            return unescape(y);
            // unescape로 디코딩 후 값 리턴
        }
    }
}