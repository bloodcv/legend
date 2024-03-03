<script setup>

import SideBar from "@/components/layouts/SideBar.vue";
import SubArea from "@/components/layouts/SubArea.vue";
import ContentArea from "@/components/layouts/ContentArea.vue";
import {useDataStore} from "@/stores/dataStore.js";
import {onMounted, watch} from "vue";

const dataStore = useDataStore()

setInterval(async () => {
    await dataStore.updateAllMetricsData()
    // await dataStore.updateUsage()
    // const res = await metaStore.getItems(dataStore.currentHostObj.id)
}, 3000)

setInterval(() => {
    dataStore.updateCurrentTime()
}, 1000)

// watch(() => dataStore.hostIds, async () => {
//     console.log("start watch hostIds")
//     await dataStore.updateOnlineData()
//     await dataStore.updateMainMonitorEchartsData()
//     await dataStore.updateCurrentHostGroupProblems()
// } )

watch(() => dataStore.mainMonitorFilteredItem, () => {
    console.log("main montiro filtered item changed")
    dataStore.applyMainMonitorEchartsData()
})

// watch(() => dataStore.currentHostObj, () => {
//     console.log("current host obj changed")
//     dataStore.updateMainMonitorEchartsData()
// })
</script>

<template>
    <a-row>
        <a-col :span="4.5">
            <SideBar class="side-bar" />
        </a-col>
        <a-col :span="11">
            <ContentArea />
        </a-col>
        <a-col :span="8.5">
            <SubArea />
        </a-col>
    </a-row>
</template>

<style scoped lang="scss">
.side-bar {
    margin-right: 4rem;
}
</style>