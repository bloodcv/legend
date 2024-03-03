<script setup>
defineProps({
    title: String,
    data: Number,
    unit: String
})
</script>

<template>
    <div class="top-metric">
        <div class="logo-wrap">
            <div class="logo">
                <slot name="logo"></slot>
            </div>
        </div>
        <div class="data-area">
            <div class="title">{{title}}</div>
            <div class="data">
                <div class="count">{{data}}</div>
                <div class="unit">{{unit}}</div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.top-metric {
    display: flex;

    .logo-wrap {
        position: relative;
        width: 4.3125rem;
        height: 4.3125rem;
        border-radius: 4.3125rem;
        background: linear-gradient(225deg, #2280F5 0%, rgba(34, 128, 245, 0.64) 100%);

        margin-right: 1.69rem;

        .logo {
            position: absolute;
            top: calc(50% - 1.23rem);
            left: calc(50% - 1.16rem);
            svg {
                height: 2.4rem;
                width: 2.4rem;
            }
        }
    }

    .data-area {
        display: flex;
        flex-direction: column;
        .title {
            font-size: 1.125rem;
            color: white;
        }

        .data {
            display: flex;
            align-items: end;
            justify-content: space-evenly;
            .count {
                color: #0F71F2;
                font-family: YouSheBiaoTiHei, serif;
                font-size: 3.125rem;
                font-style: normal;
                font-weight: 400;
                line-height: 3.125rem;
            }
            .unit {
                color: #FFF;
                font-family: YouSheBiaoTiHei, serif;
                font-size: 1.4375rem;
                font-style: normal;
                font-weight: 400;
                line-height: 2.5rem;
            }
        }
    }
}
</style>