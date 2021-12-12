
const randomInteger = (minimum, maximum) => Math.floor((Math.random() * (maximum - minimum + 1)) + minimum);

const createAbortError = () => {
	const error = new Error('Delay aborted');
	error.name = 'AbortError';
	return error;
};

const createDelay = ({willResolve}) => (ms, {value, signal} = {}) => {
    if (signal && signal.aborted) {
		return Promise.reject(createAbortError());
	}

    let timeoutId;
    let rejectFn;
    const signalListener = () => {
        clearTimeout(timeoutId);
        rejectFn(createAbortError());
    }
    const cleanup = () => {
		if (signal) {
			signal.removeEventListener('abort', signalListener);
		}
	};
    const delayPromise = new Promise((relove, reject) => {
        rejectFn = reject;
        timeoutId = setTimeout(() => {
            cleanup();
            if(willResolve){
                relove(value);
            }
            else{
                reject(value);
            }
        }, ms);
    });
    
    if (signal) {
		signal.addEventListener('abort', signalListener, {once: true});
	}

    return delayPromise;
}

const createWithTimers = clearAndSet => {
    const delay = createDelay({...clearAndSet, willResolve: true});
    delay.reject = createDelay({...clearAndSet, willResolve: false});
    delay.range = (minimum, maximum, options) => delay(randomInteger(minimum, maximum), options);
    return delay;
}
const delay5 = createWithTimers();