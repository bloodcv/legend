<script setup>
import SvgIcon from "@/components/SvgIcon.vue";
import { ref, reactive, toRefs, defineProps } from "vue";
import { useI18n } from "vue-i18n";
import axios from "axios";
import { defineEmits } from "vue";

const JI_FANG_HUANG_JIN_LINK_NAME = "jiFangHuangJinLink";
const TIME_CYCLE = "timeCycle";
const TIME_GET_HOST_INFO = "timeGetHostInfo";
const TIME_GET_HOST_INFO_DEFAULT = 30000;
const TIME_GET_DEVICE_AND_ALARM = "timeGetDeviceAndAlarm";
const TIME_GET_DEVICE_AND_ALARM_DEFAULT = 60000;
const timeGetHostInfo = ref(
  (Number(localStorage.getItem(TIME_GET_HOST_INFO)) || TIME_GET_HOST_INFO_DEFAULT)/1000
); // 30s
const timeGetDeviceAndAlarm = ref(
  (Number(localStorage.getItem(TIME_GET_DEVICE_AND_ALARM)) ||
    TIME_GET_DEVICE_AND_ALARM_DEFAULT)/1000
); // 1m

const props = defineProps({
  //子组件接收父组件传递过来的值
  menuData: Object,
  originHostList: Array,
  hostList: Array,
});
const emit = defineEmits([
  "updateMenuData",
  "changeHostList",
  "updateTimeCycle",
  "updateChartTimeCycle",
  "updateDeviceAndAlarmTimeCycle",
]);

const showPassModal = ref(false);
const jiFangHuangJinLink = ref(
  localStorage.getItem(JI_FANG_HUANG_JIN_LINK_NAME) || ""
);
const timeCycle = ref(localStorage.getItem(TIME_CYCLE) || 0.5);

const configPassword = ref("");
function checkPass() {
  if (
    String(configPassword.value) ===
    String(import.meta.env.VITE_CONFIG_PASSWORD)
  ) {
    showPassModal.value = false;
    configPassword.value = "";
    openConfigModal();
  } else {
    notification.error({
      message: "密码错误",
      description: "请重新输入密码。",
    });
  }
}

function openPassModal() {
  showPassModal.value = true;
}

//使用父组件传递过来的值
const { menuData, originHostList, hostList } = toRefs(props);

const menuNameData = reactive({
  l_1s: "",
  l_2s: "",
  l_3s: "",
  l_4s: "",
  l_title1: "",
  name: "",
  r_1s: "",
  r_2s: "",
  r_3s: "",
  r_title1: "",
  alert_1: "",
  alert_2: "",
  alert_3: "",
  alert_4: "",
});

const showConfigModal = ref(false);

const selectedRowKeysBind = ref([]);

function openConfigModal() {
  Object.keys(menuNameData).map(_ => (menuNameData[_] = menuData.value[_]));
  selectedRowKeysBind.value = hostList.value.map(_ => _.hostid);
  showConfigModal.value = true;
}

const configCollapseActiveKey = ref(["title"]);

const { locale } = useI18n();
function setLocale(localeString) {
  locale.value = localeString;
  localStorage.setItem("locale", localeString);
}
import { ZABBIX_API } from "@/constants.js";
import { notification } from "ant-design-vue";
const updateMenuApi = ZABBIX_API + "/saveMenu";
const changeMainTitle = async () => {
  try {
    await axios.post(updateMenuApi, {
      name: menuNameData.name,
    });
    emit("updateMenuData", {
      name: menuNameData.name,
    });
  } catch (error) {
    console.error("error: update main title", error.message);
  }
};
const changeLeftMenu = async () => {
  try {
    await axios.post(updateMenuApi, {
      l_1s: menuNameData.l_1s,
      l_2s: menuNameData.l_2s,
      l_3s: menuNameData.l_3s,
      l_4s: menuNameData.l_4s,
      l_title1: menuNameData.l_title1,
    });
    emit("updateMenuData", {
      l_1s: menuNameData.l_1s,
      l_2s: menuNameData.l_2s,
      l_3s: menuNameData.l_3s,
      l_4s: menuNameData.l_4s,
      l_title1: menuNameData.l_title1,
      jiFangHuangJinLink: jiFangHuangJinLink.value,
    });
  } catch (error) {
    console.error("error: update left menu", error.message);
  }
};
const changeRightMenu = async () => {
  try {
    await axios.post(updateMenuApi, {
      r_1s: menuNameData.r_1s,
      r_2s: menuNameData.r_2s,
      r_3s: menuNameData.r_3s,
      r_title1: menuNameData.r_title1,
    });
    emit("updateMenuData", {
      r_1s: menuNameData.r_1s,
      r_2s: menuNameData.r_2s,
      r_3s: menuNameData.r_3s,
      r_title1: menuNameData.r_title1,
    });
  } catch (error) {
    console.error("error: update right menu", error.message);
  }
};
const changeRightBottomMenu = async () => {
  try {
    await axios.post(updateMenuApi, {
      alert_1: menuNameData.alert_1,
      alert_2: menuNameData.alert_2,
      alert_3: menuNameData.alert_3,
      alert_4: menuNameData.alert_4,
    });
    emit("updateMenuData", {
      alert_1: menuNameData.alert_1,
      alert_2: menuNameData.alert_2,
      alert_3: menuNameData.alert_3,
      alert_4: menuNameData.alert_4,
    });
  } catch (error) {
    console.error("error: update right bottom menu", error.message);
  }
};
const changeTimeCycle = async () => {
  try {
    emit("updateTimeCycle", timeCycle.value);
  } catch (error) {
    console.error("error: update time cycle", error.message);
  }
};

const changeChartTimeCycle = async () => {
  try {
    emit("updateChartTimeCycle", timeGetHostInfo.value * 1000);
  } catch (error) {
    console.error("error: update chart time cycle", error.message);
  }
};

const changeDeviceAndAlarmTimeCycle = async () => {
  try {
    emit("updateDeviceAndAlarmTimeCycle", timeGetDeviceAndAlarm.value * 1000);
  } catch (error) {
    console.error("error: update device and alarm time cycle", error.message);
  }
};


const columns = [
  {
    title: "hostid",
    dataIndex: "hostid",
  },
  {
    title: "ip",
    dataIndex: "ip",
  },
  {
    title: "name",
    dataIndex: "name",
  },
  {
    title: "type",
    dataIndex: "type",
  },
];

const onSelectionChange = (selectedRowKeys, selectedRows) => {
  selectedRowKeysBind.value = selectedRowKeys;
};
const changeHostListInChild = () => {
  emit("changeHostList", selectedRowKeysBind.value);
};
</script>

<template>
  <div class="util-area">
    <div class="util-config" @click="openPassModal">
      <img src="../../assets/setting.png" class="tool-icon" />
    </div>
    <a-dropdown placement="bottomRight">
      <div class="util-translate">
        <img src="../../assets/translate.png" class="tool-icon" />
      </div>
      <template #overlay>
        <a-menu>
          <a-menu-item>
            <a href="javascript:;" @click="setLocale('en')">English</a>
          </a-menu-item>
          <a-menu-item>
            <a href="javascript:;" @click="setLocale('zh-cn')">中文</a>
          </a-menu-item>
        </a-menu>
      </template>
    </a-dropdown>
  </div>

  <a-modal
    v-model:open="showPassModal"
    :title="$t('subArea.utilArea.config.password.title')"
    @ok="checkPass">
    <a-form>
      <a-form-item>
        <div class="input-label">
          {{ $t("subArea.utilArea.config.password.label") }}
        </div>
        <a-input-password
          v-model:value="configPassword"
          @press-enter="checkPass"></a-input-password>
      </a-form-item>
    </a-form>
  </a-modal>

  <a-modal
    v-model:open="showConfigModal"
    :title="$t('subArea.utilArea.config.change.title')"
    :footer="null"
    :width="800">
    <a-form :wrapper-col="{ span: 16 }">
      <a-collapse v-model:active-key(v-model)="configCollapseActiveKey">
        <a-collapse-panel key="hostSec" :header="$t('main2.hostSec')">
          <a-table
            :pagination="false"
            :scroll="{ y: 240 }"
            :data-source="originHostList"
            :columns="columns"
            :rowSelection="{
              selectedRowKeys: selectedRowKeysBind,
              onChange: onSelectionChange,
            }"
            rowKey="hostid" />
          <div class="act">
            <a-button type="primary" class="mt" @click="changeHostListInChild"
              >ok</a-button
            >
          </div>
        </a-collapse-panel>
        <a-collapse-panel key="title" :header="$t('main2.title')">
          <a-input v-model:value="menuNameData.name" />
          <div class="act">
            <a-button type="primary" class="mt" @click="changeMainTitle"
              >ok</a-button
            >
          </div>
        </a-collapse-panel>
        <a-collapse-panel
          class="menu-setting-wrap"
          key="leftMenu"
          :header="$t('main2.leftMenu')">
          <div class="menu-setting-wrap-item">
            <label>标题名称</label
            ><a-input v-model:value="menuNameData.l_title1" />
          </div>
          <div class="menu-setting-wrap-item">
            <label>监控总计名称</label
            ><a-input v-model:value="menuNameData.l_1s" />
          </div>
          <div class="menu-setting-wrap-item">
            <label>网络设备名称</label
            ><a-input v-model:value="menuNameData.l_2s" />
          </div>
          <div class="menu-setting-wrap-item">
            <label>服务系统名称</label
            ><a-input v-model:value="menuNameData.l_3s" />
          </div>
          <div class="menu-setting-wrap-item">
            <label>机房环境名称</label
            ><a-input v-model:value="menuNameData.l_4s" />
          </div>
          <div class="menu-setting-wrap-item">
            <label>机房环境链接</label
            ><a-input v-model:value="jiFangHuangJinLink" />
          </div>
          <div class="act">
            <a-button type="primary" class="mt" @click="changeLeftMenu"
              >ok</a-button
            >
          </div>
        </a-collapse-panel>
        <a-collapse-panel
          class="menu-setting-wrap"
          key="rightMenu"
          :header="$t('main2.rightMenu')">
          <div class="menu-setting-wrap-item">
            <label>标题名称</label
            ><a-input v-model:value="menuNameData.r_title1" />
          </div>
          <div class="menu-setting-wrap-item">
            <label>监控总计名称</label
            ><a-input v-model:value="menuNameData.r_1s" />
          </div>
          <div class="menu-setting-wrap-item">
            <label>网络设备名称</label
            ><a-input v-model:value="menuNameData.r_2s" />
          </div>
          <div class="menu-setting-wrap-item">
            <label>服务系统名称</label
            ><a-input v-model:value="menuNameData.r_3s" />
          </div>
          <div class="act">
            <a-button type="primary" class="mt" @click="changeRightMenu"
              >ok</a-button
            >
          </div>
        </a-collapse-panel>
        <a-collapse-panel
          class="menu-setting-wrap"
          key="rightBottomMenu"
          :header="$t('main2.warnType')">
          <div class="menu-setting-wrap-item">
            <label>告警名称</label
            ><a-input v-model:value="menuNameData.alert_1" />
          </div>
          <div class="menu-setting-wrap-item">
            <label>一般名称</label
            ><a-input v-model:value="menuNameData.alert_2" />
          </div>
          <div class="menu-setting-wrap-item">
            <label>严重名称</label
            ><a-input v-model:value="menuNameData.alert_3" />
          </div>
          <div class="menu-setting-wrap-item">
            <label>灾难名称</label
            ><a-input v-model:value="menuNameData.alert_4" />
          </div>
          <div class="act">
            <a-button type="primary" class="mt" @click="changeRightBottomMenu"
              >ok</a-button
            >
          </div>
        </a-collapse-panel>
        <a-collapse-panel
          class="menu-setting-wrap"
          key="timeCycle"
          :header="$t('main2.timeCycle')">
          <a-radio-group v-model:value="timeCycle">
            <a-radio :value="'0.5'">0.5</a-radio>
            <a-radio :value="'1'">1</a-radio>
            <a-radio :value="'7'">7</a-radio>
            <a-radio :value="'30'">30</a-radio>
          </a-radio-group>
          <div class="act">
            <a-button type="primary" class="mt" @click="changeTimeCycle"
              >ok</a-button
            >
          </div>
        </a-collapse-panel>
        <a-collapse-panel
          class="menu-setting-wrap"
          key="chartTimeCycle"
          :header="$t('main2.chartTimeCycle')">
          <a-input-number
            v-model:value="timeGetHostInfo"
            addon-after="s"></a-input-number>
          <div class="act">
            <a-button type="primary" class="mt" @click="changeChartTimeCycle"
              >ok</a-button
            >
          </div>
        </a-collapse-panel>
        <a-collapse-panel
          class="menu-setting-wrap"
          key="deviceAndAlarmTimeCycle"
          :header="$t('main2.deviceAndAlarmTimeCycle')">
          <a-input-number
            v-model:value="timeGetDeviceAndAlarm"
            addon-after="s"></a-input-number>
          <div class="act">
            <a-button
              type="primary"
              class="mt"
              @click="changeDeviceAndAlarmTimeCycle"
              >ok</a-button
            >
          </div>
        </a-collapse-panel>
      </a-collapse>
    </a-form>
  </a-modal>
</template>

<style lang="scss" scoped>
.tool-icon {
  width: 2.25rem;
  height: 2.25rem;
}
.util-area {
  height: 7.44rem;
  width: 100%;
  padding-top: 2rem;

  .util-config {
    float: right;
    margin-right: 1.5rem;
    cursor: pointer;

    .util-config-svg {
      fill: #fff;
      transition: ease 0.3s;
    }

    /* &:hover {
      .util-config-svg {
        fill: #3e74ea;
      }
    } */
  }

  .util-translate {
    float: right;
    margin-right: 1.7rem;
    cursor: pointer;

    .util-config-svg {
      fill: #fff;
      transition: ease 0.3s;
    }

    /* &:hover {
      .util-config-svg {
        fill: #3e74ea;
      }
    } */
  }
}

.input-set {
  .input-label {
    font-weight: bold;
    font-size: 1rem;
    margin-bottom: 0.6rem;
  }

  margin-bottom: 1rem;
}

.menu-setting-wrap {
  .menu-setting-wrap-item {
    display: flex;
    align-items: center;
    label {
      display: block;
      width: 120px;
    }
  }
  input {
    margin: 0.5rem 0;
  }
}

.mt {
  margin-top: 10px;
}

.act {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: end;
}
</style>
