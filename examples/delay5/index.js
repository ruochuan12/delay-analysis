const randomInteger = (minimum, maximum) => Math.floor((Math.random() * (maximum - minimum + 1)) + minimum);

const createDelay = ({willResolve}) => (ms, {value} = {}) => {
    let timeoutId;
    let settle;
    const delayPromise = new Promise((resolve, reject) => {
        settle = () => {
            if(willResolve){
                resolve(value);
            }
            else{
                reject(value);
            }
        }
        timeoutId = setTimeout(settle, ms);
    });

    delayPromise.clear = () => {
        clearTimeout(timeoutId);
		timeoutId = null;
		settle();
    };

    return delayPromise;
}

const createWithTimers = () => {
    const delay = createDelay({willResolve: true});
    delay.reject = createDelay({willResolve: false});
    delay.range = (minimum, maximum, options) => delay(randomInteger(minimum, maximum), options);
    return delay;
}
const delay5 = createWithTimers();