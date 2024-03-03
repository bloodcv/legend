import { createApp } from 'vue'
import {createPinia} from "pinia";
import './style.css'
import App from './App.vue'
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';
import {router} from "@/routes/index.js";

import './scss/custom.scss'
import {useDataStore} from "@/stores/dataStore.js";
import {useMetaStore} from "@/stores/metaStore.js";
import {useSignStore} from "@/stores/signStore.js";
import {i18n} from "@/plugins/i18n/index.js";

const app = createApp(App);
const piniaInstance = createPinia();

const signStore = useSignStore(piniaInstance);

(async () => {
    const metaStore = useMetaStore(piniaInstance)
    await metaStore.initRestService()

    await metaStore.updateHostGroupMetaInfo()

    const dataStore = useDataStore(piniaInstance)
    await dataStore.updateHostGroupData()
    await dataStore.updateAllMetricsData()
    await dataStore.updateOnlineData()
    // await dataStore.updateMonitorData()
    // await dataStore.updateHostHistoryData()
    await dataStore.updateMainMonitorEchartsData()
    await dataStore.updateCurrentHostGroupProblems()
    await dataStore.initMenuItemLocal()
    await dataStore.initTitle()

    app.use(piniaInstance)
    app.use(Antd)
    app.use(router)
    app.use(i18n)
    app.mount('#app');
})();

