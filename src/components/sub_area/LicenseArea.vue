<script setup>
import {useSignStore} from "@/stores/signStore.js";
import {computed} from "vue";
import * as constants from "@/constants";
import dayjs from "dayjs";

const signStore = useSignStore()
const expireAt = computed(() => {
    return dayjs(signStore.payLoad.exp * 1000).format("YYYY.MM.DD")
})
</script>

<template>
<div class="license-area">
    <div class="license-to">© Powered by {{constants.ISS_DOMAIN}}</div>
    <div class="expire-at">Expire at <span class="date">{{expireAt}}</span></div>
</div>
</template>

<style lang="scss" scoped>
.license-area {
    display: flex;
    flex-direction: column;
    align-items: center;

    margin-top: 2rem;

    .license-to {
        color: #D0CEDE;
        text-align: center;
        font-family: Rubik;
        font-size: 0.9375rem;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
    }
    .expire-at {
        color: #FFF;
        font-family: Rubik;
        font-size: 1.75125rem;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
        .date {
            color: #00AFF5;
        }
    }
}
</style>