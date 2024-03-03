<script setup>
import {computed, h, reactive, ref} from "vue";
import SvgIcon from "../SvgIcon.vue";
import {useDataStore} from "@/stores/dataStore.js";
import LicenseArea from "@/components/sub_area/LicenseArea.vue";

const dataStore = useDataStore()

const currentItem = ref(['menu-item-1'])

function handleMenuItemChange(value) {
    dataStore.updateMenuItemKey(value.key)
    dataStore.updateHostGroupData()
}

const ampm = computed(() => {
    return dataStore.currentTime.format("A")
})
</script>

<template>
    <div class="side-area">
        <div class="sidebar">
            <div class="datetime">
                <div class="time">
                    <div class="pm-am">
                        <img src="/pm.svg" alt="" v-if="ampm === 'PM'">
                        <img src="/am.svg" alt="" v-if="ampm === 'AM'">
                    </div>
                    <div class="time">{{dataStore.currentTime.format("hh:mm:ss")}}</div>
                </div>
                <div class="date">{{dataStore.currentTime.format("YYYY-MM-DD")}}</div>
            </div>

            <div class="menu">
                <a-menu
                    v-model:selected-keys="currentItem"
                    @click="handleMenuItemChange"
                    :items="dataStore.menuItems"
                ></a-menu>
            </div>
            <LicenseArea class="license-area" />
        </div>
        <div class="right-divider">
            <div class="menu-item-mask">
                <div class="circle"></div>
            </div>
            <div class="divider"></div>

        </div>
    </div>

</template>

<style lang="scss" scoped>

.side-area {
    display: flex;

    .sidebar {
        position: relative;
    //width: 21rem;
        height: 67.5rem;
    //background-color: #1C2445;
    //margin: 20px 0;
        .license-area {
            position: absolute;
            bottom: 4rem;
            left: 2rem;
        }
        .datetime {
            display: flex;
            flex-direction: column;
            align-items: end;

            margin-right: 1.5rem;
            margin-left: 2.36rem;
            margin-top: 3.12rem;

            color: #FFF;
            font-family: Rubik,serif;

            .time {

                display: flex;
                align-items: center;

                .pm-am {
                    margin-right: 1.75rem;
                }

                .time {

                    font-size: 2.62681rem;
                }
            }

            .date {
                font-size: 1.75125rem;
                margin-right: .2rem;
            }
        }

        .menu {
            margin-top: 3.89rem;


        }
    }

    .right-divider {
        height: 67.5rem;

        .menu-item-mask {
            position: absolute;
            height: 3.5625rem;
            width: 3rem;
            background-color: #051b34;

            top: 13.8rem;

            .circle {
                position: absolute;
                top: calc(50% - 0.3rem);
                left: calc(50% - 0.3rem);
                height: 0.6rem;
                width: 0.6rem;
                background-color: #0F71F2;
                border-radius: 1rem;
            }
        }
        .divider {
            width: 0;
            height: 52.625rem;
            border: #0F71F2 1px solid;
            margin-top: 7.44rem;
            margin-left: 1.5rem;
        }
    }
}

</style>