
const randomInteger = (minimum, maximum) => Math.floor((Math.random() * (maximum - minimum + 1)) + minimum);

const createAbortError = () => {
	const error = new Error('Delay aborted');
	error.name = 'AbortError';
	return error;
};

const createDelay = ({clearTimeout: defaultClear, setTimeout: set, willResolve}) => (ms, {value, signal} = {}) => {
    if (signal && signal.aborted) {
		return Promise.reject(createAbortError());
	}

    let timeoutId;
    let settle;
    let rejectFn;
    const clear = defaultClear || clearTimeout;

    const signalListener = () => {
        clear(timeoutId);
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
        timeoutId = (set || setTimeout)(settle, ms);
    });
    
    if (signal) {
		signal.addEventListener('abort', signalListener, {once: true});
	}

    delayPromise.clear = () => {
		clear(timeoutId);
		timeoutId = null;
		settle();
	};

    return delayPromise;
}

const createWithTimers = clearAndSet => {
    const delay = createDelay({...clearAndSet, willResolve: true});
    delay.reject = createDelay({...clearAndSet, willResolve: false});
    delay.range = (minimum, maximum, options) => delay(randomInteger(minimum, maximum), options);
    return delay;
}
const delay7 = createWithTimers();
delay7.createWithTimers = createWithTimers;