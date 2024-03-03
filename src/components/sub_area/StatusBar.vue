<script setup>
import {
    DANGER_COLOR,
    DANGER_LABEL_NAME,
    HEALTH_COLOR,
    HEALTH_LABEL_NAME,
    WARNING_COLOR,
    WARNING_LABEL_NAME
} from "@/constants.js";
import {computed} from "vue";
import {useI18n} from "vue-i18n";

const props = defineProps({
    percentage: Number,
    status: String
})

const {t} = useI18n()
const statusMetaInfo = computed(() => {
    let statusColor
    let statusLabel
    switch (props.status) {
        case "health":
            statusColor = HEALTH_COLOR
            statusLabel = t("subArea.onlineStatus.health")
            break
        case "warning":
            statusColor = WARNING_COLOR
            statusLabel = t("subArea.onlineStatus.warning")
            break
        case "danger":
            statusColor = DANGER_COLOR
            statusLabel = t("subArea.onlineStatus.danger")
            break
    }
    return {
        statusColor,
        statusLabel
    }
})

// 进度条底色
const progressTrailColor = '#546780'
</script>

<template>
    <div class="status-bar">
        <div class="info">
            <div class="info-name">{{statusMetaInfo.statusLabel}}</div>
            <div class="info-percent">{{percentage}}%</div>
        </div>
        <a-progress
            :percent="props.percentage"
            :stroke-color="statusMetaInfo.statusColor"
            :trail-color="progressTrailColor"
            :size="[100, 15]"
            :showInfo="false"
        />
    </div>

</template>

<style lang="scss" scoped>
.status-bar {
    background-color: #021328;
    width: 90%;
    height: 3rem;
    display: flex;
    flex-direction: column;

    .info {
        display: flex;
        justify-content: space-between;
        //width: 15rem;
        //padding-inline-end: calc(2em + 8px);

        color: #CDE0F3;
        font-family: Rubik, serif;
        font-size: 1rem;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
    }
}

</style>