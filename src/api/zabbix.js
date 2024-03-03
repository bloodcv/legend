import axios from "axios";
import {ZABBIX_API} from "@/constants.js";
import dayjs from "dayjs";
import {openNotification} from "@/utils/interactions.js";
/**
 *
 * @return {Promise<axios.AxiosResponse<any>>} {
 *     duration: xxx,
 *     server_number: xxx,
 *     alert_number: xxx
 * }
 */
export const postOnce = async (data) => {
    return await axios.request({
        method: "post",
        url: ZABBIX_API,
        headers: {"Content-Type": "application/json-rpc"},
        data: JSON.stringify(data)
    })
}

export class ZabbixRestRequest {
    body
    constructor(method, params, token) {
        this.body = {
            "jsonrpc": "2.0",
            "method": method,
            "id": 1,
            "auth": token,
            "params": params
        }
    }

    // Handle each response here. return <res.data.result>
    async do() {
        let result
        await postOnce(this.body)
            .then((res) => {
                if (res.status == 200) {
                    result = res.data.result
                } else {
                    openNotification(
                        "Request failure",
                        `${this.body.method} Response not equals to 200`,
                        "error"
                    )
                    throw "Request failure"
                }
            })
            .catch((err) => {
                openNotification(
                    "Request failure",
                    `${this.body.method} Response Throw Error: ${err.message}`,
                    "error"
                )
            })
        return result
    }

}

export class ZabbixRestService {
    _credentials
    _token
    _authExpireTime
    constructor(credentials) {
        this._credentials = credentials
    }

    isAuthExpired() {
        return dayjs().isAfter(this._authExpireTime);
    }

    buildRequest(method, params) {
        return new ZabbixRestRequest(method, params, this._token)
    }

    async refreshAuth() {
        const method = "user.login"
        const authRequest = new ZabbixRestRequest(method, this._credentials, null)
        const res = await authRequest.do()
        this._authExpireTime = dayjs().add(3, 'hour')
        this._token = res
    }

    async getHost() {
        const method = "host.get"
        const request = this.buildRequest(method, {})
        return await request.do()
    }

    async getHostGroup(hostGroupName) {
        let filter
        if (hostGroupName === null) {
            filter = {}
        } else {
            filter = {
                name: [hostGroupName]
            }
        }
        const method = "hostgroup.get"
        const params = {
            output: 'extend',
            filter
        }
        const request = this.buildRequest(method, params)
        return await request.do()
    }

    async getAllHostGroups() {
        const method = "hostgroup.get"
        const params = {
            output: ['groupid', 'name']
        }
        const request = this.buildRequest(method, params)
        return await request.do()
    }

    async getHostByGroupId(groupId) {
        const method = "host.get"
        const request = this.buildRequest(method, {
            groupids: groupId
        })
        return await request.do()
    }

    async getProblemsByGroupId(groupId) {
        const method = "problem.get"
        const params = {
            "output": "extend",
            "selectAcknowledges": "extend",
            "selectTags": "extend",
            "selectSuppressionData": "extend",
            "groupids": groupId,
            "recent": "true",
        }
        const request = this.buildRequest(method, params)
        return await request.do()
    }

    async getProblems(hostIds) {
        const method = "problem.get"
        const params = {
            "output": "extend",
            "selectAcknowledges": "extend",
            "selectTags": "extend",
            "selectSuppressionData": "extend",
            "hostids": hostIds,
            "recent": "true",
        }
        const request = this.buildRequest(method, params)
        return await request.do()
    }

    async getHostInterface(hostIds) {
        const method = "hostinterface.get"
        const params = {
            "output": "extend",
            "hostids": hostIds,
        }
        const request = this.buildRequest(method, params)
        return await request.do()
    }

    async getItems(hostIds) {
        const method = "item.get"
        const params = {
            "output": "extend",
            "hostids": hostIds,
            "search": {
                "name": [
                    'CPU utilization',
                    'memory utilization',
                    'Bits received',
                    'Bits sent',
                    'Space utilization'
                ],
            },
            "sortfield": "name",
            'searchByAny': true,
        }
        const request = this.buildRequest(method, params)
        return await request.do()
    }

    /**
     *
     * @param itemId
     * @param historyType {number} 要返回的历史对象的类型。
     * 可能的取值：
     * 0 - 浮点数；
     * 1 - 字符；
     * 2 - 日志；
     * 3 - 无符号数；
     * 4 - 文本。
     *
     * @return {Promise<*>}
     */
    async getHistory(itemId, historyType) {
        const method = "history.get"
        const fromTime = (new Date().getTime() - 7*24*3600*1000) /1000 |0
        const params = {
            "time_from": fromTime,
            "output": "extend",
            "history": historyType,
            "itemids": itemId,
            "sortfield": "clock",
            // "limit": 1
        }
        const request = this.buildRequest(method, params)
        return await request.do()
    }
}
