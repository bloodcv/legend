import { notification } from 'ant-design-vue';
const [api, contextHolder] = notification.useNotification();
export function openNotification(msg, description, type) {
    api[type]({
        message: msg,
        description: description
    })
}