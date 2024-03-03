import {defineStore} from "pinia";
import {ref} from "vue";
import {useDataStore} from "@/stores/dataStore.js";
import {ZabbixRestService} from "@/api/zabbix.js";
import {ZABBIX_CREDENTIALS} from "@/constants.js";
import {openNotification} from "@/utils/interactions.js";

export const useMetaStore = defineStore("meta", () => {

    const zabbixRestService = ref(null)
    async function initRestService() {
        zabbixRestService.value = new ZabbixRestService(ZABBIX_CREDENTIALS)
        await zabbixRestService.value.refreshAuth()
    }

    /**
     * hostgroup name mapped to hostgroup id, like {"switch": 1}
     */
    const hostGroupMetaInfo = ref({})
    async function updateHostGroupMetaInfo() {
        const res = await zabbixRestService.value.getHostGroup(null) || []
        res.forEach(ele => {
            hostGroupMetaInfo.value[ele.name] = ele.groupid
        })
    }

    // Internal APIs
    async function getAllHostGroups() {
        return await zabbixRestService.value.getAllHostGroups()
    }

    async function getHostByGroupName(groupName) {
        let groupId
        if (hostGroupMetaInfo.value[groupName] >= 0) {
            groupId = hostGroupMetaInfo.value[groupName]
        } else {
            const res = await zabbixRestService.value.getHostGroup(groupName) || []
            if (res.length > 0) {
                groupId = res[0].groupid
            } 
            /* else {
                openNotification(
                    "get host group error",
                    `Host Group name: ${groupName} Not Found in Zabbix.`,
                    "error"
                )
                throw "get host group error"
            } */
        }

        return await zabbixRestService.value.getHostByGroupId(groupId)
    }

    async function getProblemsByGroupId(groupId) {
        return await zabbixRestService.value.getProblemsByGroupId(groupId)
    }

    async function getProblems(hostIds) {
        return await zabbixRestService.value.getProblems(hostIds)
    }

    async function getHostInterface(hostIds) {
        return await zabbixRestService.value.getHostInterface(hostIds)
    }

    async function getItems(hostIds) {
        return await zabbixRestService.value.getItems(hostIds)
    }
    async function getHistoryByItems(itemId, historyType) {
        if (itemId != null) {
            return await zabbixRestService.value.getHistory(itemId, historyType)
        }
        
    }

    return {

        // init zabbix restful api service
        zabbixRestService,
        initRestService,

        // global updating vars/functions
        hostGroupMetaInfo,
        updateHostGroupMetaInfo,

        // store used APIs
        getAllHostGroups,
        getHostByGroupName,
        getProblemsByGroupId,
        getProblems,
        getHostInterface,
        getItems,
        getHistoryByItems,
    }
})