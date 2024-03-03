<script setup>
import * as echarts from 'echarts';
import {computed, onMounted, ref, watch} from "vue";
import {DANGER_COLOR, HEALTH_COLOR, WARNING_COLOR} from "@/constants.js";

const props = defineProps({
    metricData: Number,
    title: String
})
const instantPanelCanvasRef = ref(null)

/**
 * 小于t1为健康，大于t1小于t2为警告，大于t2为危险
 * @type {{t1: number, t2: number}}
 */
const thresholds = {
    t1: 0.7,
    t2: 0.9
}

const color = computed(() => {
    if (props.metricData <= thresholds.t1 * 100) {
        return HEALTH_COLOR
    } else if (props.metricData <= thresholds.t2 * 100) {
        return WARNING_COLOR
    } else {
        return DANGER_COLOR
    }
})

const option = computed(() => {
    return {
        series: [
            {
                type: 'gauge',
                center: ['50%', '60%'],
                startAngle: 220,
                endAngle: -40,
                min: 0,
                max: 100,
                splitNumber: 10,
                itemStyle: {
                    color: '#fff'
                },
                progress: {
                    show: true,
                    width: 11
                },
                pointer: {
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        width: 2,
                        color: [
                            [thresholds.t1, HEALTH_COLOR],
                            [thresholds.t2, WARNING_COLOR],
                            [1, DANGER_COLOR]
                        ]
                    }
                },
                axisTick: {
                    distance: 14,
                    splitNumber: 2,
                    lineStyle: {
                        width: 1,
                        color: '#999'
                    }
                },
                splitLine: {
                    distance: 15,
                    length: 8,
                    lineStyle: {
                        width: 2,
                        color: '#999'
                    }
                },
                axisLabel: {
                    distance: 5,
                    color: '#999',
                    fontSize: 8
                },
                anchor: {
                    show: false
                },
                title: {
                    show: false
                },
                detail: {
                    valueAnimation: true,
                    width: '60%',
                    lineHeight: 40,
                    borderRadius: 8,
                    offsetCenter: [0, '-5%'],
                    fontSize: 50,
                    fontWeight: 'bolder',
                    formatter: '{value}',
                    fontFamily: 'YouSheBiaoTiHei',
                    color: '#2280F5'
                    // color: 'inherit'
                },
                data: [
                    {
                        value: 45
                    }
                ]
            },
        ]
    }
});

let myChart
onMounted(() => {
    myChart = echarts.init(instantPanelCanvasRef.value)
    myChart.setOption(option.value)
    myChart.setOption({
        series: [
            {
                data: [{
                    value: props.metricData
                }],
                itemStyle: {
                    color: color.value
                }
            }
        ]
    })
})

watch(() => props.metricData, () => {
    myChart.setOption({
        series: [
            {
                data: [{
                    value: props.metricData
                }]
            }
        ]
    })
})
</script>

<template>
    <div class="instant-metric-area">
        <div class="instant-panel" ref="instantPanelCanvasRef"></div>
        <div class="instant-metric-title">{{title}}</div>

    </div>

</template>

<style lang="scss" scoped>


.instant-metric-area {
    display: flex;
    flex-direction: column;
    align-items: center;
    .instant-panel {
        height: 15rem;
        width: 15rem;
    }
    .instant-metric-title {
        color: #E2ECF8;
        font-size: 1.07781rem;
        font-style: normal;
        font-weight: 400;
        line-height: normal;

        position: relative;
        margin-top: -2.3rem;
    }

}
</style>