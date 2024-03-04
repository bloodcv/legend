import { defineStore } from "pinia";
import { computed, h, ref } from "vue";
import { useMetaStore } from "@/stores/metaStore.js";
import dayjs from "dayjs";
import SvgIcon from "@/components/SvgIcon.vue";
import { aggMeanByDuration } from "@/utils/processors.js";
import {useI18n} from "vue-i18n";
import {ACTIVE_DATE} from "@/constants.js";


export const useDataStore = defineStore("data", () => {

    const title = ref("可视化监控中心")
    function initTitle() {
        if (localStorage.getItem("title") === null) {
            localStorage.setItem("title", title.value)
        } else {
            title.value = localStorage.getItem("title")
        }
    }

    const metaStore = useMetaStore()

    const timeframeDuration = 'fiveMins'
    const menuItems = computed(() => {
        let items = []
        for (let key in sidebarMenuHostgroupMap.value) {
            items.push({
                key,
                label: sidebarMenuHostgroupMap.value[key].label,
                icon: sidebarMenuHostgroupMap.value[key].icon
            })
        }
        return items
    })
    const sidebarMenuHostgroupMap = ref({
        'menu-item-1': {
            hostgroup: "Zabbix servers",
            label: "交换机",
            icon: h(SvgIcon, { name: "switch-menu" })
        },
        'menu-item-2': {
            hostgroup: "Applications",
            label: "服务器",
            icon: h(SvgIcon, { name: "server-menu" })
        },
        'menu-item-3': {
            hostgroup: "Virtual machines",
            label: "虚拟主机",
            icon: h(SvgIcon, { name: "vm-menu" })
        },
        'menu-item-4': {
            hostgroup: "Databases",
            label: "机房",
            icon: h(SvgIcon, { name: "house-menu" })
        }
    })
    function initMenuItemLocal() {
        for (let k in sidebarMenuHostgroupMap.value) {
            if (localStorage.getItem(`${k}-hostgroup`) === null) {
                localStorage.setItem(`${k}-hostgroup`, sidebarMenuHostgroupMap.value[k].hostgroup)
                localStorage.setItem(`${k}-label`, sidebarMenuHostgroupMap.value[k].label)
            } else {
                sidebarMenuHostgroupMap.value[k].hostgroup = localStorage.getItem(`${k}-hostgroup`)
                sidebarMenuHostgroupMap.value[k].label = localStorage.getItem(`${k}-label`)
            }
        }

    }

    const currentMenuItemKey = ref('menu-item-1')
    function updateMenuItemKey(key) {
        currentMenuItemKey.value = key
    }
    const currentHostgroupName = computed(() => { return sidebarMenuHostgroupMap.value[currentMenuItemKey.value] })
    const currentHostgroupId = computed(() => { return metaStore.hostGroupMetaInfo[currentHostgroupName] })
    const hostIds = ref([])
    const hostObjs = ref([])
    const currentAvailableHostIds = ref([])

    async function updateHostGroupData() {
        const res = await metaStore.getHostByGroupName(currentHostgroupName.value.hostgroup) || []
        hostIds.value = [] // host ids of current hostgroup 
        hostObjs.value = []
        res.forEach(element => {
            let obj = {
                id: element.hostid,
                name: element.name
            }
            hostObjs.value.push(obj)
            hostIds.value.push(element.hostid)
            currentHostObj.value = obj

        })
    }

    const currentHostObj = ref({
        id: "",
        name: ""
    })
    function updateHostData(hostData) {
        currentHostObj.value = hostData
    }

    const currentMonitorData = ref([])
    async function updateMonitorData() {
        currentMonitorData.value = []
        const itemResults = await metaStore.getItems(hostIds.value)
        // console.log(itemResults)
        hostIds.value.forEach(hostId => {
            let newMonitorObj = {
                hostId: hostId,
                cpuUtil: {
                    itemid: null,
                    lastclock: null,
                    lastvalue: null,
                    valueType: null,
                },
                memoryUtil: { itemid: null, lastclock: null, lastvalue: null, valueType:null},
                spaceUtil: { itemid: null, lastclock: null, lastvalue: null, valueType:null },
                eth0sent: { itemid: null, lastclock: null, lastvalue: null, valueType:null },
                eth0rec: { itemid: null, lastclock: null, lastvalue: null, valueType:null },

            }
            itemResults.forEach(itemResult => {
                if (itemResult.hostid === hostId) {
                    if(itemResult.name.toUpperCase().includes('Bits received'.toUpperCase()) && Number(itemResult.lastvalue) !== 0) {
                            newMonitorObj.eth0rec.itemid = itemResult.itemid
                            newMonitorObj.eth0rec.lastclock = itemResult.lastclock
                            newMonitorObj.eth0rec.lastvalue = itemResult.lastvalue
                            newMonitorObj.eth0rec.valueType = itemResult.value_type
                    }
                    else if (itemResult.name.toUpperCase().includes('Bits sent'.toUpperCase()) && Number(itemResult.lastvalue) !== 0) {
                            newMonitorObj.eth0sent.itemid = itemResult.itemid
                            newMonitorObj.eth0sent.lastclock = itemResult.lastclock
                            newMonitorObj.eth0sent.lastvalue = itemResult.lastvalue
                            newMonitorObj.eth0sent.valueType = itemResult.value_type
                    }
                    else if (itemResult.name.toUpperCase().includes('CPU utilization'.toUpperCase()) && Number(itemResult.lastvalue) !== 0) {
                            newMonitorObj.cpuUtil.itemid = itemResult.itemid
                            newMonitorObj.cpuUtil.lastclock = itemResult.lastclock
                            newMonitorObj.cpuUtil.lastvalue = itemResult.lastvalue
                            newMonitorObj.cpuUtil.valueType = itemResult.value_type
                    }
                    else if (itemResult.name.toUpperCase().includes('Memory utilization'.toUpperCase()) && Number(itemResult.lastvalue) !== 0) {
                            newMonitorObj.memoryUtil.itemid = itemResult.itemid
                            newMonitorObj.memoryUtil.lastclock = itemResult.lastclock
                            newMonitorObj.memoryUtil.lastvalue = itemResult.lastvalue
                            newMonitorObj.memoryUtil.valueType = itemResult.value_type
                    }   else if (itemResult.name.toUpperCase().includes('Space utilization'.toUpperCase()) && Number(itemResult.lastvalue) !== 0) {
                            newMonitorObj.spaceUtil.itemid = itemResult.itemid
                            newMonitorObj.spaceUtil.lastclock = itemResult.lastclock
                            newMonitorObj.spaceUtil.lastvalue = itemResult.lastvalue
                            newMonitorObj.spaceUtil.valueType = itemResult.value_type
                    }
                } else {
                    // console.log(2)
                }

            })
            currentMonitorData.value.push(newMonitorObj)
        });
    }

    const instantMetricData = ref({
        cpuUsage: 0,
        memoryUsage: 0,
        spaceUsage: 0
    })

    function updateInstantMetricData() {
        for (let md of currentMonitorData.value) {
            if (md.hostId === currentHostObj.value.id) {
                if (md.cpuUtil.lastvalue !== null) {
                    instantMetricData.value.cpuUsage = parseInt(md.cpuUtil.lastvalue)
                } else {
                    instantMetricData.value.cpuUsage = 0
                }
                if (md.memoryUtil.lastvalue !== null) {
                    instantMetricData.value.memoryUsage = parseInt(md.memoryUtil.lastvalue)
                } else {
                    instantMetricData.value.memoryUsage = 0
                }
                if (md.spaceUtil.lastvalue !== null) {
                    instantMetricData.value.spaceUsage = parseInt(md.spaceUtil.lastvalue)
                } else {
                    instantMetricData.value.spaceUsage = 0
                }
            }
        }
    }

    const currentHostHistoryData = ref([])
    async function updateHostHistoryData() {
        await updateMonitorData()
        updateInstantMetricData()
        // get cpu and memory's history data of given host id
        currentHostHistoryData.value = []
        for (let monitorData of currentMonitorData.value) {
            let hostsHistoryData = {
                host: null,
                hostid: monitorData.hostId,
                data: {
                    series: []
                }
            }
            hostObjs.value.forEach(hostObj => {
                if (hostObj.id === monitorData.hostId) { hostsHistoryData.host = hostObj.name }
            })

            // Network send
            const trafficSentHistoryDataRes = await metaStore.getHistoryByItems(monitorData.eth0sent.itemid, monitorData.eth0sent.valueType)
            if (trafficSentHistoryDataRes && trafficSentHistoryDataRes.length > 0) {
                var processedTrafficSentHisData = aggMeanByDuration(trafficSentHistoryDataRes, timeframeDuration)
            } else {
                processedTrafficSentHisData = null
            }
            let bitSentHistory = {
                name: 'eth0sent',
                x_axis: [],
                data: [],
            }
            if (processedTrafficSentHisData != null) {
                processedTrafficSentHisData.forEach(res => {
                    bitSentHistory.x_axis.push(res.clock)
                    bitSentHistory.data.push(res.value)
                })
            }

            // Network rec
            const trafficRecHistoryDataRes = await metaStore.getHistoryByItems(monitorData.eth0rec.itemid, monitorData.eth0rec.valueType)
            if (trafficRecHistoryDataRes&&trafficRecHistoryDataRes.length > 0) {
                var processedTrafficRecHisData = aggMeanByDuration(trafficRecHistoryDataRes, timeframeDuration)
            } else {
                processedTrafficRecHisData = null
            }
            let bitRecHistory = {
                name: 'eth0rec',
                x_axis: [],
                data: [],
            }
            if (processedTrafficRecHisData != null) {
                processedTrafficRecHisData.forEach(res => {
                    bitRecHistory.x_axis.push(res.clock)
                    bitRecHistory.data.push(res.value)
                })
            }

            // CPU
            const cpuUtilHistoryDataRes = await metaStore.getHistoryByItems(monitorData.cpuUtil.itemid, monitorData.cpuUtil.valueType)
            if (cpuUtilHistoryDataRes&&cpuUtilHistoryDataRes.length > 0) {
                var processedCpuHisData = aggMeanByDuration(cpuUtilHistoryDataRes, timeframeDuration)
            } else {
                processedCpuHisData = null
            }

            let cpuHistory = {
                name: 'cpuUtil',
                x_axis: [],
                data: [],
            }
            if (processedCpuHisData != null) {
                processedCpuHisData.forEach(res => {
                    cpuHistory.x_axis.push(res.clock)
                    cpuHistory.data.push(res.value)
                })
            }

            // Memory
            const memoryUtilHistoryDataRes = await metaStore.getHistoryByItems(monitorData.memoryUtil.itemid, monitorData.memoryUtil.valueType)
            if (memoryUtilHistoryDataRes&&memoryUtilHistoryDataRes.length > 0) {
                var processedMemHisData = aggMeanByDuration(memoryUtilHistoryDataRes, timeframeDuration)
            } else {
                processedMemHisData = null
            }
            
            let memoryHistory = {
                name: 'memoryUtil',
                x_axis: [],
                data: [],
            }
            if (processedMemHisData != null) {
                processedMemHisData.forEach(res => {
                    memoryHistory.x_axis.push(res.clock)
                    memoryHistory.data.push(res.value)
                })
            }

            hostsHistoryData.data.series.push(cpuHistory)
            hostsHistoryData.data.series.push(memoryHistory)
            hostsHistoryData.data.series.push(bitSentHistory)
            hostsHistoryData.data.series.push(bitRecHistory)
            currentHostHistoryData.value.push(hostsHistoryData)
        }
    }

    const usageData = ref({
        cpu: 0,
        memory: 0,
        bandwidth: 0
    })
    async function updateUsage() {
        const descMap = {
            map: "Linux: CPU utilization",
            memory: "Linux: memory utilization",
            bandwidth: "Interface eth0: Bits sent"
        }
        const res = await metaStore.getItems(currentHostObj.id)
        res.forEach(ele => {
            for (let i in descMap) {
                if (descMap[i] === ele.name) {
                    usageData[i] = parseInt(ele.lastvalue)
                }

            }
        })
    }

    // Top Metrics Overall Data
    const topMetrics = computed(() => {
        const {t} = useI18n()
        return {
            duration: {
                title: t("topMetrics.duration.title"),
                data: currentTime.value.diff(activationDate.value, "day"),
                unit: t("topMetrics.duration.unit"),
                logo_name: "metric-duration"
            },
            device: {
                title: t("topMetrics.device.title"),
                data: hostIds.value.length,
                unit: t("topMetrics.device.unit"),
                logo_name: "metric-device-number"
            },
            alert: {
                title: t("topMetrics.alert.title"),
                data: (alertsWithin7days.value || []).length,
                unit: t("topMetrics.alert.unit"),
                logo_name: "metric-alert-number"
            },
        }
    })

    // 系统使用时长
    const currentTime = ref(dayjs())
    const activationDate = ref(dayjs(ACTIVE_DATE))
    const expireDate = ref(dayjs("2024-07-01"))
    function updateCurrentTime() {
        currentTime.value = dayjs()
    }

    // 7天内总告警数
    const alertsWithin7days = ref([])
    async function updateAlertCount() {
        alertsWithin7days.value = await metaStore.getProblemsByGroupId(currentHostgroupId.value)
    }

    const onlineStatusData = ref({
        healthCount: 0,
        warningCount: 0,
        dangerCount: 0,
    })

    const currentHostGroupProblems = ref([])

    // {hostname:xxx, problems:[1,0]}

    // SubArea, Part1
    async function updateOnlineData() {
        const problemsRes = await metaStore.getProblems(hostIds.value) || []
        let healthCount = 0
        let warningCount = 0
        let dangerCount = 0
        let availableHostsId = []
        warningCount = problemsRes.length
        const hostsAvailableRes = await metaStore.getHostInterface(hostIds.value) || []
        hostsAvailableRes.forEach(element => {

            if (element.available == 1) {
                healthCount++
                availableHostsId.push(element.hostid)
            } else {
                console.log(element)
                dangerCount++
            }
        })
        onlineStatusData.value.healthCount = healthCount
        onlineStatusData.value.warningCount = warningCount
        onlineStatusData.value.dangerCount = dangerCount
        currentAvailableHostIds.value = availableHostsId
    }

    const itemHistory = ref([])
    function getItemHistory(data) {
        itemHistory.value = data
    }

    // ContentArea, MainMonitor
    const mainMonitorFilteredItem = ref(["cpuUtil"])  // cpuUtil, memoryUtil
    const mainMonitorEchartsData = ref([])

    var alertdata1 = computed(() => {
        let data = [[], []]
        currentHostGroupProblems.value.forEach(element => {
            data[0].push(element.hostname)
            data[1].push(element.data.length)
        });
        return data
    })

    var alertdata2 = computed(() => {
        let data = [['Not classified', 'Information', 'Warning', 'Average', 'High', 'Disaster'], [0, 0, 0, 0, 0, 0]]
        currentHostGroupProblems.value.forEach(i => {
            i.data.forEach(j => {
                data[1][Number(j.severity)]++
            })
        });
        return data
    })
    var alertdata3 = computed(() => {
        let data = {}
        currentHostGroupProblems.value.forEach(i => {
            i.data.forEach(j => {
                j.tags.forEach(k => {
                    if (k.tag == 'component') {
                        if (data[k.value] == undefined) {
                            data[k.value] = {}
                            data[k.value][i.hostname] = 1
                            data[k.value].sum = 1
                        } else {
                            if (data[k.value][i.hostname]) {
                                data[k.value][i.hostname]++
                            } else {
                                data[k.value][i.hostname] = 1
                            }
                            data[k.value].sum++
                        }
                    }
                })
            })
        });
        let KeySorted = Object.keys(data).sort((a, b)=>{return data[b].sum - data[a].sum}) // desc order of component name
        // const {t} = useI18n()
        // let map = {
        //     'system': t("subArea.alertStat.metrics.system"),
        //     'network': t("subArea.alertStat.metrics.network"),
        //     'storage': t("subArea.alertStat.metrics.storage"),
        //     'security': t("subArea.alertStat.metrics.security"),
        //     'raw': t("subArea.alertStat.metrics.raw"),
        //     'memory': t("subArea.alertStat.metrics.memory")
        // }
        let map = {
            'system': "系统",
            'network': "网络",
            'storage': "储存",
            'security': "安全",
            'raw': "raw",
            'memory': "内存",
        }
        var items = []
        let displayData = {}
        KeySorted.forEach(i=>{
            let obj = {
                key: i,
                label: (map[i] !== undefined) ? map[i] : i,
                title:i
            }
            displayData[i] = [[],[]]
            hostObjs.value.forEach(j => {
                displayData[i][0].push(j.name)
                displayData[i][1].push((data[i][j.name]) ? data[i][j.name]:0)
        })
            items.push(obj)
        })
        
        return {
            data,
            KeySorted,
            items,
            displayData,
        }
    })

    async function updateCurrentHostGroupProblems() {
        currentHostGroupProblems.value = []
        for (let obj of hostObjs.value) {
            let problem = {
                hostname: obj.name,
                data: []
            }
            const res = await metaStore.getProblems(obj.id)
            res.forEach((i) => {
                let d = {
                    severity: null,
                    tags: []
                }
                d.severity = i.severity
                d.tags = i.tags
                problem.data.push(d)
            })
            currentHostGroupProblems.value.push(problem)
        }

    }

    function applyMainMonitorEchartsData() {
        let data = []
        currentHostHistoryData.value.forEach((hostHistoryData) => {
            const hhd = JSON.parse(JSON.stringify(hostHistoryData))
            if (currentHostObj.value.id == hhd.hostid) {
                hhd.data.series.forEach((seriesData) => {
                    if (mainMonitorFilteredItem.value[0] == seriesData.name) {
                        // console.log(seriesData)
                        let x = seriesData.x_axis // timestamp
                        let y = seriesData.data // value
                        for (let index = 0; index < x.length; index++) {
                            let obj = {
                                name: null,
                                value: [],
                            }
                            obj.name = new Date(x[index])
                            // console.log(obj.name.getFullYear())
                            let formatTime = dayjs(obj.name).format('YYYY-MM-DDTHH:mm:ss')
                            obj.value.push(formatTime)
                            obj.value.push(y[index])
                            data.push(obj)
                        }
                    }
                })
            }
        })
        // console.log(data)
        mainMonitorEchartsData.value = data
    }

    async function updateMainMonitorEchartsData() {
        await updateHostHistoryData()
        applyMainMonitorEchartsData()
    }

    async function updateAllMetricsData() {
        updateCurrentTime()
        await updateAlertCount()
    }

    return {
        title,
        initTitle,

        menuItems,
        sidebarMenuHostgroupMap,
        initMenuItemLocal,

        topMetrics,
        currentTime,
        // activationDate,
        expireDate,
        updateCurrentTime,

        updateAlertCount,

        hostObjs,
        hostIds,
        updateHostGroupData,

        updateMenuItemKey,

        currentHostObj,
        updateHostData,

        usageData,
        updateUsage,

        onlineStatusData,
        updateOnlineData,

        currentMonitorData,
        updateMonitorData,
        instantMetricData,

        getItemHistory,

        updateAllMetricsData,

        currentHostHistoryData,
        updateHostHistoryData,

        mainMonitorFilteredItem,
        mainMonitorEchartsData,
        applyMainMonitorEchartsData,
        updateMainMonitorEchartsData,

        updateCurrentHostGroupProblems,
        currentHostGroupProblems,

        alertdata1,
        alertdata2,
        alertdata3,

    }
})