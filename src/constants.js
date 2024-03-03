export const HEALTH_LABEL_NAME = '健康'
export const HEALTH_COLOR = '#00E5EB'
export const WARNING_LABEL_NAME = '警告'
export const WARNING_COLOR = '#FFB803'
export const DANGER_LABEL_NAME = '危险'
export const DANGER_COLOR = '#DD4747'

const ZABBIX_SCHEMA = import.meta.env.VITE_ZABBIX_SCHEMA
const ZABBIX_DOMAIN = import.meta.env.VITE_ZABBIX_DOMAIN
export const ZABBIX_API = `${ZABBIX_SCHEMA}://${ZABBIX_DOMAIN}/api_jsonrpc.php`

export const ZABBIX_CREDENTIALS = {
    username: import.meta.env.VITE_ZABBIX_ACCOUNT,
    password: import.meta.env.VITE_ZABBIX_PASSWORD
}

export const SALT = String(import.meta.env.VITE_SALT)
export const ISS_DOMAIN = import.meta.env.VITE_ISS_DOMAIN
// export const ZABBIX_CREDENTIALS = {
//     username: 'Admin',
//     password: 'zabbix'
// }

export const ACTIVE_DATE = import.meta.env.VITE_ACTIVE_DATE
