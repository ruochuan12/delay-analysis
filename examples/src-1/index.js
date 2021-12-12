// 
const delay1 = (ms) => {
    return new Promise((relove, reject) => {
        setTimeout(() => {
            relove();
        }, ms);
    });
}

const delay2 = (ms, { value } = {}) => {
    return new Promise((relove, reject) => {
        setTimeout(() => {
            relove(value);
        }, ms);
    });
}

const delay3 = (ms, {value, willResolve} = {}) => {
    return new Promise((relove, reject) => {
        setTimeout(() => {
            if(willResolve){
                relove(value);
            }
            else{
                reject(value);
            }
        }, ms);
    });
}