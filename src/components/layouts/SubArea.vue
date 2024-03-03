<script setup>

import UtilArea from "@/components/sub_area/UtilArea.vue";
import OnlineStatus from "@/components/sub_area/OnlineStatus.vue";
import AlertCount from "@/components/sub_area/AlertCount.vue";
import AlertCountStat from "@/components/sub_area/AlertCountStat.vue";
import LicenseArea from "@/components/sub_area/LicenseArea.vue";
</script>

<template>

    <div class="sub-area">
        <div class="right-divider">
            <div class="divider"></div>
        </div>
        <div class="sub-area-content">
            <UtilArea />
            <OnlineStatus />
            <AlertCount />
            <AlertCountStat />
        </div>


    </div>
</template>

<style lang="scss" scoped>


.sub-area {
    margin-left: 4rem;
    display: flex;
    .right-divider {
        height: 67.5rem;
        .divider {
            width: 0;
            height: 52.625rem;
            border: #0F71F2 1px solid;
            margin-top: 7.44rem;
        }
    }
    .sub-area-content {
        margin-left: 1.6rem;
    }
}
</style>