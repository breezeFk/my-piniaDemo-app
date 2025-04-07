<template>
  <div>
    useCounterStore：
    <br />
    {{ store.count }} {{ store.name }} {{ store.age }}
    <br />
    {{ store.doubleCount }}
    <br />
    storeToRefs--Count:{{ count }}
    <br />
    <button @click="add">add</button>
    <button @click="reset">$reset</button>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useCounterStore, useAgeStore } from "@/stores/index";
// 可以在组件中的任意位置访问 `store` 变量 ✨
const store = useCounterStore();


const age = () => {
  ageStore.increment();
};
const { count } = storeToRefs(store);
const { increment } = store;
const add = async() => {
  const ss=await store.increment();
  console.log(ss);
  store.count=Number(ss)
    // count.value++;
//   store.$patch({
//   count: 1,
//   name: 'DIO',
// })
// store.$patch((state) => {
//   state.count=1;
//   state.name = 'DIO';
// })
// store.$state={
//   count: 1,
//   name: 'DIO',
// }
// console.log(store);
};
const unsubscribe = store.$onAction(
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

// store.$subscribe((args,state)=>{
//   console.log(args);
//   console.log(state);
// })
const reset = () => {
  store.$reset();
};
</script>

<style>
</style>