<script setup>
import {ref} from "vue";
import {useSignStore} from "@/stores/signStore.js";
import {notification} from "ant-design-vue";
import {useRouter} from "vue-router";

const code = ref("")
const signStore = useSignStore()
const router = useRouter()

const confirm = () => {
    if (signStore.verify(code.value)) {
        localStorage.setItem("code", code.value)
        router.push({name: 'main'})
    } else {
        notification.error({
            message: "验证码无效",
            description: "请重新输入验证码。"
        })
    }
}
</script>

<template>
    <a-card class="protected-card">
        <h1>欢迎来到可视化监控中心！</h1>
        <div class="label">请输入验证码，后台来为您进行验证：</div>
        <a-alert class="alert" type="info" message="⚠️ 此验证码保存于浏览器中，如果更换浏览器或清空缓存，请重新输入验证码。" />
        <a-textarea class="input" v-model:value="code" @pressEnter="confirm" />
        <a-button type="primary" @click="confirm">验证</a-button>
    </a-card>
</template>

<style scoped lang="scss">
.protected-card {
    margin: 15rem auto;
    width: 50%;
    .label {
        margin-top: 3rem;
        margin-bottom: 1rem;
    }
    .alert {
        margin: 0 auto 2rem;
        width: 50%;
    }
    .input {
        margin-bottom: 3rem;
    }
}
</style>