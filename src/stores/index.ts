import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
const useCounterStore = defineStore('counter', {
    state: () => ({ count: 0, name: 'Eduardo' }),
    getters: {
        doubleCount: (state) => state.count * 2,
    },
    actions: {
        increment() {
            return new Promise((resolve) => {
                setTimeout(() => resolve(123), 1000)
            })
        },
    },
    persist: true
})

const useAgeStore = defineStore('age', {
    state: () => ({ age: 18 }),
    getters: {
        doubleaAge: (state) => state.age * 2,
    },
    actions: {
        increment() {
            this.age++
        },
    },
})
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
export { useCounterStore, useAgeStore }