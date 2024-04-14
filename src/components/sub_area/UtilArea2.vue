<script setup>
import SvgIcon from "@/components/SvgIcon.vue";
import { ref, reactive, toRefs, defineProps } from "vue";
import { useI18n } from "vue-i18n";
import axios from "axios";
import { defineEmits } from "vue";

const props = defineProps({
  //子组件接收父组件传递过来的值
  menuData: Object,
  originHostList: Array,
  hostList: Array,
});
const emit = defineEmits(["updateMenuData", "changeHostList"]);

const showPassModal = ref(false)

const configPassword = ref("")
function checkPass() {
  if (String(configPassword.value) === String(import.meta.env.VITE_CONFIG_PASSWORD)) {
    showPassModal.value = false
    configPassword.value = ""
    openConfigModal()
  } else {
    notification.error({
      message: "密码错误",
      description: "请重新输入密码。"
    })
  }
}

function openPassModal() {
  showPassModal.value = true
}

//使用父组件传递过来的值
const { menuData, originHostList, hostList } = toRefs(props);

const menuNameData = reactive({
  l_1s: "",
  l_2s: "",
  l_3s: "",
  l_title1: "",
  name: "",
  r_1s: "",
  r_2s: "",
  r_3s: "",
  r_title1: "",
});

const showConfigModal = ref(false);

const selectedRowKeysBind = ref([]);

function openConfigModal() {
  Object.keys(menuNameData).map(_ => (menuNameData[_] = menuData.value[_]));
  selectedRowKeysBind.value = hostList.value.map(_ => _.hostid)
  showConfigModal.value = true;
}

const configCollapseActiveKey = ref(["title"]);

const { locale } = useI18n();
function setLocale(localeString) {
  locale.value = localeString;
  localStorage.setItem("locale", localeString);
}
import {ZABBIX_API} from "@/constants.js";
import {notification} from "ant-design-vue";
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
      l_title1: menuNameData.l_title1,
    });
    emit("updateMenuData", {
      l_1s: menuNameData.l_1s,
      l_2s: menuNameData.l_2s,
      l_3s: menuNameData.l_3s,
      l_title1: menuNameData.l_title1,
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
]

const onSelectionChange = (selectedRowKeys, selectedRows) => {
  selectedRowKeysBind.value = selectedRowKeys;
}
const changeHostListInChild = () => {
  emit("changeHostList", selectedRowKeysBind.value);
}
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
      @ok="checkPass"
  >
    <a-form>
      <a-form-item>
        <div class="input-label">{{$t('subArea.utilArea.config.password.label')}}</div>
        <a-input-password v-model:value="configPassword" @press-enter="checkPass"></a-input-password>
      </a-form-item>
    </a-form>
  </a-modal>


  <a-modal v-model:open="showConfigModal" :title="$t('subArea.utilArea.config.change.title')" :footer="null"
           :width="800">
    <a-form :wrapper-col="{ span: 16 }">
      <a-collapse v-model:active-key(v-model)="configCollapseActiveKey">
        <a-collapse-panel key="hostSec" :header="$t('main2.hostSec')">
          <a-table :pagination="false" :scroll="{ y: 240 }"
                   :data-source="originHostList"
                   :columns="columns"
                   :rowSelection="{ selectedRowKeys: selectedRowKeysBind, onChange: onSelectionChange }"
                   rowKey="hostid" />
          <div class="act">
            <a-button type="primary" class="mt" @click="changeHostListInChild">ok</a-button>
          </div>
        </a-collapse-panel>
        <a-collapse-panel key="title" :header="$t('main2.title')">
          <a-input v-model:value="menuNameData.name" />
          <div class="act">
            <a-button type="primary" class="mt" @click="changeMainTitle">ok</a-button>
          </div>
        </a-collapse-panel>
        <a-collapse-panel class="menu-setting-wrap" key="leftMenu" :header="$t('main2.leftMenu')">
          <a-input v-model:value="menuNameData.l_title1" />
          <a-input v-model:value="menuNameData.l_1s" />
          <a-input v-model:value="menuNameData.l_2s" />
          <a-input v-model:value="menuNameData.l_3s" />
          <div class="act">
            <a-button type="primary" class="mt" @click="changeLeftMenu">ok</a-button>
          </div>
        </a-collapse-panel>
        <a-collapse-panel class="menu-setting-wrap" key="rightMenu" :header="$t('main2.rightMenu')">
          <a-input v-model:value="menuNameData.r_title1" />
          <a-input v-model:value="menuNameData.r_1s" />
          <a-input v-model:value="menuNameData.r_2s" />
          <a-input v-model:value="menuNameData.r_3s" />
          <div class="act">
            <a-button type="primary" class="mt" @click="changeRightMenu">ok</a-button>
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
