import {createRouter, createWebHistory} from "vue-router";
import Main from "@/components/Main.vue";
import Protected from "@/components/Protected.vue";
import {useSignStore} from "@/stores/signStore.js";

export const router = createRouter({
    // mode: "history",
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            name: 'main',
            path: '/',
            component: Main,
            beforeEnter: checkToken
        },
        {
            name: 'protected',
            path: '/protected',
            component: Protected
        },
    ]
})

function checkToken(to) {
    if (localStorage.getItem("code") === null) {
        return {name: 'protected'}
    } else {
        const code = localStorage.getItem("code")
        const signStore = useSignStore()
        if (signStore.verify(code)) {
            signStore.parsePayload(code)
        } else {
            return {name: 'protected'}
        }
        return true
    }
}