<script setup>

import SvgIcon from "@/components/SvgIcon.vue";
import {onMounted, ref} from "vue";
import {useMetaStore} from "@/stores/metaStore.js";
import {notification} from "ant-design-vue";
import {useI18n} from "vue-i18n";
import {openNotification} from "@/utils/interactions.js";

const showConfigModal = ref(false)
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
function openConfigModal() {
    showConfigModal.value = true
}

const configFormData = ref({
    title: localStorage.getItem("title"),
    leftSideBar: {
        'menu-item-1': {
            label: localStorage.getItem("menu-item-1-label"),
            hostgroup: localStorage.getItem("menu-item-1-hostgroup")
        },
        'menu-item-2': {
            label: localStorage.getItem("menu-item-2-label"),
            hostgroup: localStorage.getItem("menu-item-2-hostgroup")
        },
        'menu-item-3': {
            label: localStorage.getItem("menu-item-3-label"),
            hostgroup: localStorage.getItem("menu-item-3-hostgroup")
        },
        'menu-item-4': {
            label: localStorage.getItem("menu-item-4-label"),
            hostgroup: localStorage.getItem("menu-item-4-hostgroup")
        },
    }
})

function updateConfigFormData() {
    // title data reload
    localStorage.setItem('title', configFormData.value.title)
    // leftSideBar data reload
    for (let mi in configFormData.value.leftSideBar) {
        localStorage.setItem(`${mi}-label`, configFormData.value.leftSideBar[mi].label)
        localStorage.setItem(`${mi}-hostgroup`, configFormData.value.leftSideBar[mi].hostgroup)
    }

    window.location.reload()
}

const hostgroupOptions = ref([])

const configCollapseActiveKey = ref(['leftbar'])

const metaStore = useMetaStore()
onMounted(async () => {
    const res = await metaStore.getAllHostGroups()
    hostgroupOptions.value = []
    res.forEach(ele => {
        hostgroupOptions.value.push({
            label: ele.name,
            value: ele.name
        })
    })
})

const {locale} = useI18n()
function setLocale(localeString) {
    locale.value = localeString
    localStorage.setItem("locale", localeString)
    // window.location.reload()
}

</script>

<template>
    <div class="util-area">
        <div class="util-config" @click="openPassModal">
            <SvgIcon name="util-area-config" class="util-config-svg" />
        </div>
        <a-dropdown placement="bottomRight">
            <div class="util-translate">
                <SvgIcon name="util-area-translate" class="util-config-svg" />
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

    <a-modal
        v-model:open="showConfigModal"
        :title="$t('subArea.utilArea.config.change.title')"
        @ok="updateConfigFormData"
    >

        <a-form
            :model="configFormData"
            :label-col="{ span: 8 }"
            :wrapper-col="{ span: 16 }"
        >
            <a-collapse v-model:active-key(v-model)="configCollapseActiveKey">
                <a-collapse-panel key="title" :header="$t('subArea.utilArea.config.change.mainTitle.header')">
                    <div class="input-label">{{$t('subArea.utilArea.config.change.mainTitle.label')}}</div>
                    <a-input v-model:value="configFormData.title"></a-input>
                </a-collapse-panel>
                <a-collapse-panel key="leftbar" :header="$t('subArea.utilArea.config.change.leftBar.header')">
                    <a-alert :message="$t('subArea.utilArea.config.change.leftBar.alert')" type="info" />
                    <br>
                    <div class="input-set" v-for="i in [1,2,3,4]">
                        <div class="input-label">{{$t('subArea.utilArea.config.change.leftBar.labelTemplate')}} {{i}}</div>
                        <a-input-group compact>
                            <a-input v-model:value="configFormData.leftSideBar[`menu-item-${i}`].label" :placeholder="$t('subArea.utilArea.config.change.leftBar.menuItemText')" style="width: 40%" />
                            <a-select v-model:value="configFormData.leftSideBar[`menu-item-${i}`].hostgroup" :placeholder="$t('subArea.utilArea.config.change.leftBar.zabbixHostGroup')" style="width: 60%" :options="hostgroupOptions" />
                        </a-input-group>
                    </div>
                </a-collapse-panel>
            </a-collapse>

        </a-form>
    </a-modal>
</template>

<style lang="scss" scoped>
.util-area {
    height: 7.44rem;
    width: 100%;
    padding-top: 2rem;

    .util-config {
        float: right;
        margin-right: 1.5rem;
        cursor: pointer;
        .util-config-svg {
            fill: #A3CAF3;
            transition: ease .3s;
        }

        &:hover {
            .util-config-svg {
                fill: #3e74ea;
            }
        }


    }

    .util-translate {
        float: right;
        margin-right: 1.7rem;
        cursor: pointer;
        .util-config-svg {
            fill: #A3CAF3;
            transition: ease .3s;
        }

        &:hover {
            .util-config-svg {
                fill: #3e74ea;
            }
        }
    }
}

.input-set {
    .input-label {
        font-weight: bold;
        font-size: 1rem;
        margin-bottom: .6rem;
    }
    margin-bottom: 1rem;
}
</style>