export default {
    title: "Monitoring Dashboard",
    topMetrics: {
        duration: {
            title: "系统使用时长",
            unit: "天"
        },
        device: {
            title: "监控设备个数",
            unit: "台"
        },
        alert: {
            title: "7天内总告警数",
            unit: "条"
        }
    },
    mainMonitor: {
        title: "主监控",
        filterItems: {
            memoryUtil: {
                title: "内存"
            },
            eth0sent: {
                title: "流量（上行）"
            },
            eth0rec: {
                title: "流量（下行）"
            }
        }
    },
    instantMetrics: {
        title: "即时状态监控",
        cpuUsage: {
            title: "CPU占用率"
        },
        memoryUsage: {
            title: "内存占用率"
        },
        spaceUsage: {
            title: "硬盘占用率"
        },
        instanceSelectTableCols: {
            modalTitle: "更换机器",
            modalAction: "更换",
            id: {
                title: "机器ID"
            },
            name: {
                title: "机器名"
            },
            change: {
                title: "更换机器"
            }
        }
    },
    subArea: {
        utilArea: {
            config: {
                password: {
                    title: "输入配置密码",
                    label: "配置密码"
                },
                change: {
                    title: "配置修改",
                    mainTitle: {
                        header: "主标题",
                        label: "主标题文字"
                    },
                    leftBar: {
                        header: "左侧目录配置",
                        alert: "左侧目录按钮根据Zabbix Hostgroup信息进行分类，请在下面配置左侧面板【显示的字样】，以及对应的【Zabbix Hostgroup名称】。",
                        labelTemplate: "菜单按钮",
                        menuItemText: "显示的标题字样",
                        zabbixHostGroup: "Zabbix Hostgroup名称"
                    }
                }
            }
        },
        onlineStatus: {
            title: "主机在线状态",
            warning: "警告",
            health: "健康",
            danger: "危险"
        },
        alertChart: {
            title: "告警数量柱状图"
        },
        alertStat: {
            title: "告警数量统计",
            metrics: {
                system: '系统',
                network: '网络',
                storage: '储存',
                security:'安全',
                raw: 'raw',
                memory:'内存'
            }
        }
    },
    main2: {
        title: '主标题',
        titleText: '主标题文字',
        leftMenu: '左侧菜单',
        rightMenu: '右侧菜单',
        hostSec: '展示主机',
        rightBottomWarn: '告警',
        rightBottomCommon: '一般',
        rightBottomSerious: '严重',
        rightBottomDisaster: '灾难',
    }
}