<script setup>
import {onMounted, ref, watch, computed} from "vue";
import * as echarts from 'echarts'
import {useDataStore} from "@/stores/dataStore.js";
const dataStore = useDataStore()
const alertCountChartRef = ref(null)
const option = {
    textStyle: {
        color: '#fff'
    },
    grid: {
        // show: false,
        top: '15%',
        left: '2%',
        right: '2%',
        bottom: '3%',
        containLabel: true
    },
    // dataset: {
    //     source: [
    //         ['Cache Server', 'Account Server', 'DB6'],
    //         [137, 88, 56],
    //     ]
    // },
    xAxis: {
        type: 'category'
    },
    yAxis: {
        type: 'value',
        splitNumber: 5,
        splitLine: {
            lineStyle: {
                type: 'dashed',
                color: 'rgba(255,255,255,0.3)'
            }
        }
    },
    series: [
        {
            type: 'bar',
            seriesLayoutBy: 'row',
            itemStyle: {
                borderRadius: 8,
                color: '#0F71F2'
            }
        }
    ]
}

let alertCountChart
onMounted(() => {
    alertCountChart = echarts.init(alertCountChartRef.value)
    alertCountChart.setOption(option)
})




watch(() => dataStore.alertdata1, () => {
    alertCountChart.setOption({
        dataset: [
            {
                source: dataStore.alertdata1,
            }
        ]
    });
})

</script>

<template>
<div class="alert-count">
    <div class="alert-count-title">{{$t("subArea.alertChart.title")}}</div>
    <div class="alert-count-chart" ref="alertCountChartRef"></div>
</div>
</template>

<style lang="scss" scoped>
.alert-count {
    margin-bottom: 4.5rem;
    .alert-count-title {
        width: 11rem;
        height: 2.5rem;
        background-image: url("@/assets/svgs/titles/alert-count-bg.svg");
        background-repeat: no-repeat;

        color: #FFF;
        font-family: YouSheBiaoTiHei;
        font-size: 1.5rem;
        font-style: normal;
        font-weight: 400;
        line-height: 2.8rem;
    }

    .alert-count-chart {
        width: 30rem;
        height: 12rem;
    }
}
</style>