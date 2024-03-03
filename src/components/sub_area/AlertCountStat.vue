<script setup>
import * as echarts from 'echarts'
import {computed, onMounted, ref, watch, onUpdated} from "vue";
import {useDataStore} from "@/stores/dataStore.js";
const dataStore = useDataStore()
const items = ref([
    {
        key: 'cpu',
        label: 'CPU',
        title: 'CPU',
    },
    {
        key: 'memory',
        label: '内存',
        title: 'memory'
    },
    {
        key: 'bandwidth',
        label: '带宽',
        title: 'bandwidth'
    },
    {
        key: 'connection',
        label: '连接数',
        title: 'connection'
    }
])
const selected = ref('')
const flag = ref(false)


// const selected = ref('')
const classSelected = (key) => {
    if (key == selected.value) {
        return 'selected'
    } else {
        return ''
    }
}
function selectItem(key) {
    selected.value = key
}

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
    //     source: dataStore.alertdata3.displayData[selected.value] || [[],[]]
    //     // source: [['host', 'test'],[1,0]]
    // },
    yAxis: {
        type: 'category'
    },
    xAxis: {
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

const alertCountStatChartRef = ref(null)
let alertCountStatChart

onMounted(() => {
    alertCountStatChart = echarts.init(alertCountStatChartRef.value)
    alertCountStatChart.setOption(option, true, true)
    
})

const setValue = ()=> {
    console.log(dataStore.alertdata3.KeySorted)
    if (dataStore.alertdata3.KeySorted.length > 0) {
        selected.value = dataStore.alertdata3.KeySorted[0]
    } else {
        selected.value = ""
    }
    
}

watch(() => dataStore.alertdata3.KeySorted, ()=>{
    setValue() 
})

watch(() => selected.value, () => {
    // selectItem()
    alertCountStatChart.setOption({
        dataset: [
            {
                source: dataStore.alertdata3.displayData[selected.value],
            }
        ]
    });
    flag.value = true
})

watch(() => dataStore.hostIds, async() => {
    await dataStore.updateOnlineData()
    await dataStore.updateMainMonitorEchartsData()
    await dataStore.updateCurrentHostGroupProblems()
    console.log('loading')
    if (flag.value) {
        alertCountStatChart.dispose()

        setValue()
        console.log(dataStore.alertdata3.displayData[selected.value])
        alertCountStatChart = echarts.init(alertCountStatChartRef.value)
        alertCountStatChart.setOption(option, true, true)
        alertCountStatChart.setOption({
        dataset: [
            {
                source: dataStore.alertdata3.displayData[selected.value],
            }
        ]
    });

    
    

    // setTimeout(()=>{setValue()}, 500)

    }

} )




</script>

<template>
    <div class="alert-count-stat">
        <div class="alert-count-stat-title">{{$t("subArea.alertStat.title")}}</div>
        <div class="sub-menu-bar">
            <template v-for="i in dataStore.alertdata3.items" :key="i.key">
                <div class="sub-menu-item" :class="classSelected(i.key)" @click="selectItem(i.key)">{{i.label}}</div>
            </template>

        </div>
        <div class="alert-count-stat-chart" ref="alertCountStatChartRef"></div>
    </div>
</template>

<style lang="scss" scoped>
.alert-count-stat {
    .alert-count-stat-title {
        width: 9.625rem;
        height: 2.5rem;
        background-image: url("@/assets/svgs/titles/alert-count-stat-bg.svg");
        background-repeat: no-repeat;

        color: #FFF;
        font-family: YouSheBiaoTiHei;
        font-size: 1.5rem;
        font-style: normal;
        font-weight: 400;
        line-height: 2.8rem;

        margin-bottom: 1rem;
    }

    .sub-menu-bar {
        display: flex;
        justify-content: center;
        width: 26.625rem;
        height: 3rem;
        margin-left: 2rem;

        .sub-menu-item {
            cursor: pointer;
            width: 25%;
            height: 100%;
            color: #FFF;
            font-size: 0.9375rem;
            font-style: normal;
            font-weight: 400;
            line-height: 3rem;
            border-bottom: 2px solid #fff;

            &.selected {
                border-bottom: 3px solid #0F71F2;
            }
        }
    }
    .alert-count-stat-chart {
        width: 30rem;
        height: 12rem;
    }
}
</style>