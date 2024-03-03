<script setup>
import {theme} from "ant-design-vue";
</script>

<template>
    <a-config-provider
        :theme="{
            token: {
                colorBgBase: '#071C36FF',
            //     colorText: '#fff'
            },
          algorithm: theme.darkAlgorithm,

        }"
    >
        <router-view></router-view>
    </a-config-provider>
</template>

<style scoped>
</style>
