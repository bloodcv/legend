<script setup>
import * as echarts from 'echarts'
import {computed, onMounted, ref, watch} from "vue";
import {
    DANGER_COLOR,
    DANGER_LABEL_NAME,
    HEALTH_COLOR,
    HEALTH_LABEL_NAME,
    WARNING_COLOR,
    WARNING_LABEL_NAME
} from "@/constants.js";
import StatusBar from "@/components/sub_area/StatusBar.vue";
import {useDataStore} from "@/stores/dataStore.js";
import {useI18n} from "vue-i18n";

const i18n = useI18n()
const dataStore = useDataStore()

const percentages = computed(() => {
    let total = dataStore.onlineStatusData.healthCount + dataStore.onlineStatusData.warningCount + dataStore.onlineStatusData.dangerCount
    const healthPercentage = Number(((dataStore.onlineStatusData.healthCount / total) * 100).toFixed())
    const warningPercentage = Number(((dataStore.onlineStatusData.warningCount / total) * 100).toFixed())
    const dangerPercentage = 100 - healthPercentage -warningPercentage
    return {
        healthPercentage,
        warningPercentage,
        dangerPercentage
    }
})

const onlineStatusPieRef = ref(null)

let option = {
    tooltip: {
        trigger: 'item'
    },
    // legend: {
    //   top: '5%',
    //   left: 'center'
    // },
    series: [
        {
            name: 'Access From',
            type: 'pie',
            radius: ['75%', '90%'],
            avoidLabelOverlap: false,
            itemStyle: {
                borderRadius: 2,
                borderColor: 'rgba(255,255,255,0)',
                borderWidth: 1
            },
            label: {
                show: false,
                position: 'center'
            },
            emphasis: {
                label: {
                    show: false
                }
            },
            labelLine: {
                show: false
            },
            data: [
            ]
        }
    ]
};

const {t} = useI18n()
const currentStatusName = computed(() => {
    if (percentages.value.healthPercentage >= 50) {
        return t("subArea.onlineStatus.health")
    } else if (percentages.value.warningPercentage >= 50) {
        return t("subArea.onlineStatus.warning")
    } else {
        return t("subArea.onlineStatus.danger")
    }
})

let onlineStatusPieChart

onMounted(() => {
    onlineStatusPieChart = echarts.init(onlineStatusPieRef.value)
    onlineStatusPieChart.setOption(option)
    onlineStatusPieChart.setOption({
        series: [{
            data: [
                { value: dataStore.onlineStatusData.healthCount, name: HEALTH_LABEL_NAME, itemStyle: {
                        color: HEALTH_COLOR
                    } },
                { value: dataStore.onlineStatusData.warningCount, name: WARNING_LABEL_NAME, itemStyle: {
                        color: WARNING_COLOR
                    } },
                { value: dataStore.onlineStatusData.dangerCount, name: DANGER_LABEL_NAME, itemStyle: {
                        color: DANGER_COLOR
                    } }
            ]
        }]
    })
})

watch(dataStore.onlineStatusData, (newValue) => {
    onlineStatusPieChart.setOption({
        series: [{
            data: [
                { value: newValue.healthCount, name: HEALTH_LABEL_NAME, itemStyle: {
                        color: HEALTH_COLOR
                    } },
                { value: newValue.warningCount, name: WARNING_LABEL_NAME, itemStyle: {
                        color: WARNING_COLOR
                    } },
                { value: newValue.dangerCount, name: DANGER_LABEL_NAME, itemStyle: {
                        color: DANGER_COLOR
                    } }
            ]
        }]
    })
})
</script>

<template>
    <div class="online-status">
        <div class="online-status-title">{{$t('subArea.onlineStatus.title')}}</div>
        <div class="online-status-body">
            <div class="status-pie">
                <div class="status-pie-indicator">
                    <div class="percentage">{{percentages.healthPercentage}}%</div>
                    <div class="status-name">{{currentStatusName}}</div>
                </div>
                <div class="status-pie-canvas" ref="onlineStatusPieRef"></div>

            </div>
            <div class="status-bars">
                <StatusBar :percentage="percentages.healthPercentage" status="health" />
                <StatusBar :percentage="percentages.warningPercentage" status="warning" />
                <StatusBar :percentage="percentages.dangerPercentage" status="danger" />
            </div>
<!--            <a-button @click="dataStore.addMockData" >add 1</a-button>-->

        </div>
    </div>
</template>

<style lang="scss" scoped>
.online-status {
    width: 500px;
    margin-bottom: 4.5rem;
    .online-status-title {
        width: 10rem;
        height: 2.5rem;
        background-image: url("@/assets/svgs/titles/online-status-bg.svg");
        background-repeat: no-repeat;

        margin-bottom: 1.3rem;

        color: #FFF;
        font-family: YouSheBiaoTiHei, serif;
        font-size: 1.5rem;
        font-style: normal;
        font-weight: 400;
        line-height: 2.8rem;
    }

    .online-status-body {
        display: flex;
        $pie-width: 10.3125rem;
        .status-pie {
            position: relative;
            width: $pie-width;
            height: $pie-width;
            margin-right: 2rem;
            .status-pie-canvas {
                width: $pie-width;
                height: $pie-width;
            }

            .status-pie-indicator {
                width: 5.5625rem;
                height: 4.75rem;
                position: absolute;
                left: calc(50% - 5.5625rem / 2);
                top: calc(50% - 4.75rem / 2);
                .percentage {
                    color: #00E5EB;
                    font-family: YouSheBiaoTiHei, serif;
                    font-size: 2.5rem;
                    font-style: normal;
                    font-weight: 400;
                    line-height: normal;
                }
                .status-name {
                    color: #DFDFDF;
                    font-family: Rubik, serif;
                    font-size: 1.25rem;
                    font-style: normal;
                    font-weight: 400;
                    line-height: normal;
                }
            }
        }

        .status-bars {
            display: flex;
            flex-direction: column;
            justify-content: space-evenly;
            width: 100%;

        }
    }
}
</style>