const delay1 = (ms) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, ms);
    });
}

const delay2 = (ms, { value } = {}) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(value);
        }, ms);
    });
}

const delay3 = (ms, {value, willResolve} = {}) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if(willResolve){
                resolve(value);
            }
            else{
                reject(value);
            }
        }, ms);
    });
}