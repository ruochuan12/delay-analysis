
const randomInteger = (minimum, maximum) => Math.floor((Math.random() * (maximum - minimum + 1)) + minimum);

const createDelay = ({willResolve}) => (ms, {value} = {}) => {
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

const createWithTimers = () => {
    const delay = createDelay({willResolve: true});
    delay.reject = createDelay({willResolve: false});
    delay.range = (minimum, maximum, options) => delay(randomInteger(minimum, maximum), options);
    return delay;
}
const delay4 = createWithTimers();