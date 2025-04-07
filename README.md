# pinia学习
## 定义 Store

Store 是用 defineStore() 定义的

1. 第一个参数是你的应用中 Store 的唯一 ID,返回的函数命名为 use... 是一个符合组合式函数风格的约定.
2. 第二个参数可接受两类值：Setup 函数或 Option 对象.
###  Option Store
```js
// Option Store
import { defineStore } from 'pinia'
export const useCounterStore = defineStore('counter', {
    state: () => ({ count: 0 }),
    getters: {
        doubleCount: (state) => state.count * 2,
    },
    actions: {
        increment() {
            this.count++
        },
    },
})
```
### Setup Store
在 Setup Store 中：

- ref() 就是 state 属性
- computed() 就是 getters
- function() 就是 actions

```js
// Setup Store
export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const doubleCount = computed(() => count.value * 2)
  function increment() {
    count.value++
  }

  return { count, doubleCount, increment }
})
```
### 使用 Store
```vue
<template>
  <div>
    {{ store.count }}
    {{ store.doubleCount  }}
    <button @click="add">add</button>
  </div>
</template>

<script setup>
import { useCounterStore } from '@/stores/index'
// 可以在组件中的任意位置访问 `store` 变量 ✨
const store = useCounterStore()
console.log(store.count);
const add = () => {
  store.increment()
}
</script>
```

### 从 Store 解构
使用 storeToRefs()从 store 中提取属性时保持其响应性
作为 action 的 increment 可以直接解构
```js
import { storeToRefs } from "pinia";
const { count } = storeToRefs(store);
const { increment } = store;
const add = () => {
  //   count.value++;
  increment();
};
```

## State

### 变更 state

#### $patch

除了用 `store.count++` 直接改变 store，你还可以调用 `$patch` 方法。它允许你用一个 `state` 的补丁对象在同一时间更改多个属性：

```js
store.$patch({
  count: 1,
  name: 'DIO',
})
```
```js
store.$patch((state) => {
  state.count=1;
  state.name = 'DIO';
})
```
#### $state

```js
store.$state={
  count: 1,
  name: 'DIO',
}
```
#### actions
```js
// store.js
    actions: {
        increment() {
            this.age++
        },
    },

// 组件中
const add = () => {
    store.increment()
}
```
### api
#### $reset
使用选项式 API 时，你可以通过调用 store 的 $reset() 方法将 state 重置为初始值
```js
const store = useStore()
store.$reset()
```
在 Setup Stores 中，您需要创建自己的 $reset() 方法：
```js
export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  function $reset() {
    count.value = 0
  }
  return { count, $reset }
})
```
#### $subscribe
可以通过 store 的 $subscribe() 方法侦听 state 及其变化。
```js
store.$subscribe((args,state)=>{
  console.log(args);
  console.log(state);
})
```
#### $onAction
可以通过 store 的 $onAction() 方法侦听 actions 及其变化。
```js
const unsubscribe = someStore.$onAction(
  ({
    name, // action 名称
    store, // store 实例，类似 `someStore`
    args, // 传递给 action 的参数数组
    after, // 在 action 返回或解决后的钩子
    onError, // action 抛出或拒绝的钩子
  }) => {
    // 为这个特定的 action 调用提供一个共享变量
    const startTime = Date.now()
    // 这将在执行 "store "的 action 之前触发。
    console.log(`Start "${name}" with params [${args.join(', ')}].`)

    // 这将在 action 成功并完全运行后触发。
    // 它等待着任何返回的 promise
    after((result) => {
      console.log(
        `Finished "${name}" after ${
          Date.now() - startTime
        }ms.\nResult: ${result}.`
      )
    })

    // 如果 action 抛出或返回一个拒绝的 promise，这将触发
    onError((error) => {
      console.warn(
        `Failed "${name}" after ${Date.now() - startTime}ms.\nError: ${error}.`
      )
    })
  }
)

// 手动删除监听器
unsubscribe()
```

## pinia-plugin-persistedstate

1.安装依赖项

```sh
pnpm add pinia-plugin-persistedstate
```

2.将插件添加到你的 pinia 实例中

```typescript
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
```

### 用法
```typescript
// 在声明您的store时，请将新persist选项设置为 true。
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useStore = defineStore(
    'main',
    () => {
        const count = ref(0)
        const doubleCount = computed(() => count.value * 2)
        function increment() {
            count.value++
        }
        return { count, doubleCount, increment }
    },
    {
        persist: true,
    },
)

const useCounterStore = defineStore('counter', {
  state: () => ({ count: 0}),
  getters: {
    doubleCount: (state) => state.count * 2,
  },
  actions: {
    increment() {
      this.count++
    },
  },
  persist: true
})
```
### persist配置
```typescript
  persist: {
    key: 'counter', // 可选的存储键名
    storage: localStorage, // 默认是 localStorage
    paths: ['count', 'name'] // 可选，指定要持久化的state字段
  }
```
