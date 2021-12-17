
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
    let settle;
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
    const delayPromise = new Promise((resolve, reject) => {
        settle = () => {
			cleanup();
			if (willResolve) {
				resolve(value);
			} else {
				reject(value);
			}
		};

        rejectFn = reject;
        timeoutId = setTimeout(settle, ms);
    });
    
    if (signal) {
		signal.addEventListener('abort', signalListener, {once: true});
	}

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
const delay6 = createWithTimers();