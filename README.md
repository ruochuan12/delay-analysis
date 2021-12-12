---
highlight: darcula
theme: smartblue
---

# 面试官：请手写一个带取消功能的延迟函数，axios 取消功能的原理是什么
## 1. 前言

>大家好，我是[若川](https://lxchuan12.gitee.io)。最近组织了[源码共读活动](https://juejin.cn/pin/7005372623400435725)，感兴趣的可以加我微信 [ruochuan12](https://juejin.cn/pin/7005372623400435725) 参与，或者关注我的[公众号若川视野](https://lxchuan12.gitee.io)，回复“源码”参与。已进行三个月，大家一起交流学习，共同进步，很多人都表示收获颇丰。

想学源码，极力推荐之前我写的[《学习源码整体架构系列》](https://juejin.cn/column/6960551178908205093) 包含`jQuery`、`underscore`、`lodash`、`vuex`、`sentry`、`axios`、`redux`、`koa`、`vue-devtools`、`vuex4`、`koa-compose`、`vue 3.2 发布`、`vue-this`、`create-vue`、`玩具vite`等10余篇源码文章。

[本文仓库 only-allow-analysis，求个star^_^](https://github.com/lxchuan12/only-allow-analysis.git)

最近组织了[源码共读活动](https://juejin.cn/pin/7005372623400435725)，每周大家一起学习200行左右的源码。每周一期，已进行到14期。于是搜寻各种值得我们学习，且代码行数不多的源码。

阅读本文，你将学到：
```bash
1. 如何学习调试源码
2. 学会 npm 钩子
3. 学会 "preinstall": "npx only-allow pnpm" 一行代码统一规范包管理器
4. 学到 only-allow 原理
5. 等等
```
## 2. 场景

## delay

一步步来实现一个比较完善的 delay 函数。

### 第一版

```js
(async() => {
    await delay1(1000);
    console.log('输出这句');
})();
```

实现

```js
const delay1 = (ms, { value }) => {
    return new Promise((relove, reject) => {
        setTimeout(() => {
            relove(value);
        }, ms);
    });
}
```

### 第二版

```js
(async() => {
    const result = await delay2(1000, { value: '我是若川' });
    console.log('输出结果', result);
})();
```

```js
const delay2 = (ms, { value } = {}) => {
    return new Promise((relove, reject) => {
        setTimeout(() => {
            relove(value);
        }, ms);
    });
}
```

### 第三版

```js
(async() => {
    try{
        const result = await delay3(1000, { value: '我是若川', willResolve: false });
        console.log('永远不会输出这句');
    }
    catch(err){
        console.log('输出结果', err);
    }
})();
```

```js
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
```


### 第四版

#### 需求

```js
(async() => {
    try{
        const result = await delay4.reject(1000, { value: '我是若川', willResolve: false });
        console.log('永远不会输出这句');
    }
    catch(err){
        console.log('输出结果', err);
    }

    const result2 = await delay4.range(10, 20000, { value: '我是range' });
    console.log('输出结果', result2);
})();
```

#### 实现

```js
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
```


### 第五版

```js

```
## delay

```js
'use strict';

// From https://github.com/sindresorhus/random-int/blob/c37741b56f76b9160b0b63dae4e9c64875128146/index.js#L13-L15
const randomInteger = (minimum, maximum) => Math.floor((Math.random() * (maximum - minimum + 1)) + minimum);

const createAbortError = () => {
	const error = new Error('Delay aborted');
	error.name = 'AbortError';
	return error;
};

const createDelay = ({clearTimeout: defaultClear, setTimeout: set, willResolve}) => (ms, {value, signal} = {}) => {
    // 省略代码
};

const createWithTimers = clearAndSet => {
	const delay = createDelay({...clearAndSet, willResolve: true});
	delay.reject = createDelay({...clearAndSet, willResolve: false});
	delay.range = (minimum, maximum, options) => delay(randomInteger(minimum, maximum), options);
	return delay;
};

const delay = createWithTimers();
delay.createWithTimers = createWithTimers;

module.exports = delay;
// TODO: Remove this for the next major release
module.exports.default = delay;
```

## createDelay

```js
```

## axios 取消请求


## 总结

最后可以持续关注我@若川。欢迎加我微信 [ruochuan12](https://juejin.cn/pin/7005372623400435725) 交流，参与 [源码共读](https://juejin.cn/pin/7005372623400435725) 活动，每周大家一起学习200行左右的源码，共同进步。
