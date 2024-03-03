<template>
    <div class="main-monitor">
        <div class="main-monitor-top">
            <div class="main-monitor-title">{{$t("mainMonitor.title")}}</div>
            <a-dropdown>
                <div class="filter">
                    <div class="metric">{{ filterItemMap[dataStore.mainMonitorFilteredItem[0]] }}</div>
                    <SvgIcon name="down-arrow" class="svg" />
                </div>
                <template #overlay>
                    <a-menu
                        v-model:selected-keys="dataStore.mainMonitorFilteredItem"
                        :items="filterItemMenuItems"
                        @click="modifyFilterItem">
                    </a-menu>
                </template>
            </a-dropdown>


        </div>

        <div class="main-monitor-body" ref="mainMonitorBodyRef"></div>
    </div>

</template>

<script setup>
import * as echarts from 'echarts';
import {computed, onMounted, ref, watch} from "vue";
import SvgIcon from "@/components/SvgIcon.vue";
import {useDataStore} from "@/stores/dataStore.js";
import {useI18n} from "vue-i18n";
const dataStore = useDataStore()
const mainMonitorBodyRef = ref(null)

const {t} = useI18n()
const filterItemMap = {
    'cpuUtil': 'CPU',
    'memoryUtil': t("mainMonitor.filterItems.memoryUtil.title"),
    'eth0sent': t("mainMonitor.filterItems.eth0sent.title"),
    'eth0rec': t("mainMonitor.filterItems.eth0rec.title"),
}

const filterItemMenuItems = computed(() => {
    let menuItems = []
    for (let im in filterItemMap) {
        menuItems.push({
            key: im,
            label: filterItemMap[im],
            title: filterItemMap[im]
        })
    }
    return menuItems
})

function modifyFilterItem({key}) {
    dataStore.mainMonitorFilteredItem = [key]
}

// const data1 = [
//     {
//         name: new Date(1690160764000),
//         value: [
//             [
//                 new Date(1690160764000).getFullYear(),
//                 new Date(1690160764000).getMonth(),
//                 new Date(1690160764000).getDate()
//             ].join('/')+' '+
//             [
//                 new Date(1690160764000).getHours(),
//                 new Date(1690160764000).getMinutes(),
//                 new Date(1690160764000).getSeconds()
//             ].join(':'), 21
//         ]
//     },
//     {name:new Date(1690160824000), value:[[new Date(1690160824000).getFullYear(), new Date(1690160824000).getMonth(), new Date(1690160824000).getDate()].join('/')+' '+[new Date(1690160824000).getHours(), new Date(1690160824000).getMinutes(), new Date(1690160824000).getSeconds()].join(':'), 56]},
//     {name:new Date(1690160884000), value:[[new Date(1690160884000).getFullYear(), new Date(1690160884000).getMonth(), new Date(1690160884000).getDate()].join('/')+' '+[new Date(1690160884000).getHours(), new Date(1690160884000).getMinutes(), new Date(1690160884000).getSeconds()].join(':'), 65]},


// ]

const metricNames = [
    {
        name: "CPU",
        dataIndex: "cpu"
    },
    {
        name: "Memory",
        dataIndex: "memory"
    },
    {
        name: "Bandwidth",
        dataIndex: "bandwidth"
    }
]

let myChart
onMounted(() => {
    myChart = echarts.init(mainMonitorBodyRef.value);

    const option = {
        textStyle: {
          color: '#fff'
        },
        tooltip: {
            trigger: 'axis',
            triggerOn: 'mousemove',
            valueFormatter: (value) => `${value.toFixed(2)}%`,
            backgroundColor: 'rgba(34, 130, 250, 0.66);',
            borderColor: 'rgba(34, 130, 250, 0);',
            textStyle: {
                color: '#fff'
            }
        },
        // legend: {
        //     textStyle: {
        //         color: '#fff'
        //     },
        //     data: ['All']
        // },
        grid: {
            // show: false,
            left: '2%',
            right: '2%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'time',
            axisLabel: {
                formatter: {
                    day: '{MM}-{dd}',
                    hour: '{HH}:{mm}'
                }
                // formatter: '{yyyy}-{MM}-{dd}'
                // formatter: function (value, index) {
                //     // 格式化成月/日，只在第一个刻度显示年份
                //     let date = new Date(value);
                //     let texts = [(date.getMonth() + 1), date.getDate()];
                //     if (index === 0) {
                //         texts.unshift(date.getYear());
                //     }
                //     return texts.join('/');
                // }
            }
            // axisLine: {
            //     lineStyle: {
            //         type: 'dashed'
            //     }
            // },
        },
        yAxis: {
            type: 'value',
            splitNumber: 5,
            splitLine: {
                lineStyle: {
                    type: 'dashed',
                    color: 'rgba(255,255,255,0.3)'
                }
            },
            axisLabel: {
                formatter: '{value}%'
            },
            max: 100
        },

        series: [
            {
                type: 'line',
                seriesLayoutBy: 'row',
                stack: 'all',
                smooth: true,
                connectNulls: true,
                // areaStyle: {},
                emphasis: {
                    focus: 'series'
                },
                showSymbol: false,
                // data: data1,
                // data: dataStore.getEchartdata('10084', 'cpuUtil'),
            },
            // {
            //     type: 'line',
            //     seriesLayoutBy: 'row',
            //     stack: 'all',
            //     smooth: true,
            //     // areaStyle: {},
            //     emphasis: {
            //         focus: 'series'
            //     },
            // },
            // {
            //     type: 'line',
            //     seriesLayoutBy: 'row',
            //     stack: 'all',
            //     smooth: true,
            //     // areaStyle: {},
            //     emphasis: {
            //         focus: 'series'
            //     },
            // },
            // {
            //     type: 'line',
            //     seriesLayoutBy: 'row',
            //     stack: 'all',
            //     smooth: true,
            //     // areaStyle: {},
            //     emphasis: {
            //         focus: 'series'
            //     },
            // },
            // {
            //     type: 'line',
            //     seriesLayoutBy: 'row',
            //     stack: 'all',
            //     smooth: true,
            //     // areaStyle: {},
            //     emphasis: {
            //         focus: 'series'
            //     },
            // },
        ]
    };

    myChart.setOption(option)
setInterval(function () {
    dataStore.updateMainMonitorEchartsData()
}, 30000);
})

const trafficCustomOption = {
    yAxis: {
        max: null,
        axisLabel: {
            formatter: (value) => `${(value/1000).toFixed(1)} kbps`
        },
    },
    tooltip: {
        valueFormatter: (value) => `${(value/1000).toFixed(1)} kbps`,
    }
}

const percentageCustomOption = {
    yAxis: {
        axisLabel: {
            formatter: '{value}%'
        },
        max: null
    },
    tooltip: {
        valueFormatter: (value) => `${value.toFixed(2)}%`,
    },
}

const customOptions = {
    eth0rec: trafficCustomOption,
    eth0sent: trafficCustomOption,
    cpuUtil: percentageCustomOption,
    memoryUtil: percentageCustomOption
}
watch(() => dataStore.mainMonitorEchartsData, () => {
    myChart.setOption({
        series: [
            {
                data: dataStore.mainMonitorEchartsData
            }
        ]
    });
    myChart.setOption(customOptions[dataStore.mainMonitorFilteredItem[0]])
})
</script>



<style lang="scss" scoped>
.main-monitor {

    margin-bottom: 3rem;

    .main-monitor-top {
        display: flex;
        align-items: center;
        .main-monitor-title {
            width: 6rem;
            height: 2.6rem;
            background-image: url("@/assets/svgs/titles/main-monitor-bg.svg");
            background-repeat: no-repeat;

            color: #FFF;
            font-family: YouSheBiaoTiHei, serif;
            font-size: 1.5rem;
            font-style: normal;
            font-weight: 400;
            line-height: 2.8rem;
        }

        .filter {
            display: flex;
            align-items: center;

            margin-left: 3rem;
            cursor: pointer;
            .metric {
                color: #FFF;
                font-family: Rubik;
                font-size: 1rem;
                font-style: normal;
                font-weight: 400;
                line-height: normal;
            }
            .svg {
                fill: #fff
            }
        }

    }



    .main-monitor-body {
        width: 100%;
        height: 17rem;
        margin-top: 0.5rem;
    }
}
</style>