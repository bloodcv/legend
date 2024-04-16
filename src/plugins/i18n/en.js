export default {
    title: "Monitoring Dashboard",
    topMetrics: {
        duration: {
            title: "Uptime Days",
            unit: ""
        },
        device: {
            title: "Instance Count",
            unit: ""
        },
        alert: {
            title: "Alert Count",
            unit: ""
        }
    },
    mainMonitor: {
        title: "Chart",
        filterItems: {
            memoryUtil: {
                title: "Memory"
            },
            eth0sent: {
                title: "Traffic(upstream)"
            },
            eth0rec: {
                title: "Traffic(downstream)"
            }
        }
    },
    instantMetrics: {
        title: "Panels",
        cpuUsage: {
            title: "CPU Usage"
        },
        memoryUsage: {
            title: "Memory Usage"
        },
        spaceUsage: {
            title: "Disk Usage"
        },
        instanceSelectTableCols: {
            modalTitle: "Change Instance",
            modalAction: "Change",
            id: {
                title: "Host ID"
            },
            name: {
                title: "Host Name"
            },
            change: {
                title: "Change Instance"
            }
        }
    },
    subArea: {
        utilArea: {
            config: {
                password: {
                    title: "Input config password",
                    label: "Config Password"
                },
                change: {
                    title: "Config",
                    mainTitle: {
                        header: "Main Title",
                        label: "Main Title Text"
                    },
                    leftBar: {
                        header: "Left Sidebar Menu",
                        alert: "The menu items on the left sidebar are classified according to the Zabbix Hostgroup information. Please configure the [Menu Item Display Text] and the corresponding [Zabbix Hostgroup name] for each menu item.",
                        labelTemplate: "Menu Item",
                        menuItemText: "Menu Item Text",
                        zabbixHostGroup: "Zabbix Hostgroup"
                    }
                }
            }
        },
        onlineStatus: {
            title: "Online Stat",
            warning: "Warning",
            health: "Health",
            danger: "Danger"
        },
        alertChart: {
            title: "Alert Chart"
        },
        alertStat: {
            title: "Alert Stat",
            metrics: {
                system: 'System',
                network: 'Network',
                storage: 'Storage',
                security: 'Security',
                raw: 'raw',
                memory: 'Memory'
            }
        }
    },
    main2: {
        title: 'Main Title',
        titleText: 'Main Title Text',
        leftMenu: 'Left Menu',
        rightMenu: 'Right Menu',
        hostSec: 'Show Hosts',
        rightBottomWarn: 'Warn',
        rightBottomCommon: 'Common',
        rightBottomSerious: 'Serious',
        rightBottomDisaster: 'Disaster',
        tai: '',
        ci: 'Times',
        warnType: 'Warn Type',
        time: 'Time',
        day: 'Days',
        runDay: 'Run Day',
        nowTime: 'Now Time',
        nowDate: 'Now Date',
        serverLimit: 'Server Limit',
        nowDevice: 'Now Device',
        timeCycle: 'Time Cycle',
        chartTimeCycle: "Chart Time Cycle",
        deviceAndAlarmTimeCycle: "Device And Alarm Time Cycle"
    }
}