<script setup>

import SvgIcon from "@/components/SvgIcon.vue";
import TopMetric from "@/components/content_area/TopMetric.vue";
import {useDataStore} from "@/stores/dataStore.js";
import MainMonitor from "@/components/content_area/MainMonitor.vue";
import {computed, nextTick, onBeforeMount, onMounted, ref} from "vue";
import InstantMetric from "@/components/content_area/InstantMetric.vue";
import {useMetaStore} from "@/stores/metaStore.js";
import {useI18n} from "vue-i18n";

const dataStore = useDataStore()
const metaStore = useMetaStore()
const {t} = useI18n()
onBeforeMount(async() => {
    await nextTick()
    await dataStore.updateHostGroupData()
})

// Instance Selection Modal
const displayInstSelectModal = ref(false)
function openInstSelectModal() {
    displayInstSelectModal.value = true
}
function changeInstance(record) {
    displayInstSelectModal.value = false
    dataStore.updateHostData(record)
}
const instanceSelectTableCols = [
    {
        title: t("instantMetrics.instanceSelectTableCols.id.title"),
        dataIndex: 'id',
        key: 'id'
    },
    {
        title: t("instantMetrics.instanceSelectTableCols.name.title"),
        dataIndex: 'name',
        key: 'name'
    },
    {
        title: t("instantMetrics.instanceSelectTableCols.change.title"),
        dataIndex: 'change',
    }
]

const longTitle = computed(() => {
    return dataStore.title.length >= 8
})
</script>

<template>
    <div class="content-area">
        <div class="title" :class="{'long-title': longTitle}">
            <span>{{dataStore.title}}</span>
        </div>

        <div class="top-metrics">
            <template v-for="item in dataStore.topMetrics">
                <TopMetric
                    :title="item.title"
                    :data="item.data"
                    :unit="item.unit"
                >
                    <template #logo>
                        <SvgIcon :name="item.logo_name" />
                    </template>
                </TopMetric>
            </template>

        </div>

        <MainMonitor />

        <div class="panel">
            <div class="panel-title">{{$t("instantMetrics.title")}}</div>
            <div class="panel-body">
                <div class="panel-metrics">
                    <InstantMetric :metric-data="dataStore.instantMetricData.cpuUsage" :title="$t('instantMetrics.cpuUsage.title')" />
                    <InstantMetric :metric-data="dataStore.instantMetricData.memoryUsage" :title="$t('instantMetrics.memoryUsage.title')" />
                    <InstantMetric :metric-data="dataStore.instantMetricData.spaceUsage" :title="$t('instantMetrics.spaceUsage.title')" />
                </div>
                <div class="instance-selection" @click="openInstSelectModal">
                    <div class="pre-dot"></div>
                    <div class="hostname">{{dataStore.currentHostObj.name}}</div>
                    <SvgIcon name="down-arrow" />
                </div>
            </div>

        </div>
    </div>

    <a-modal v-model:open="displayInstSelectModal" :title="$t('instantMetrics.instanceSelectTableCols.modalTitle')" :footer="null" class="modal">
        <a-table :dataSource="dataStore.hostObjs" :columns="instanceSelectTableCols">
            <template #bodyCell="{ column, text, record }">
                <template v-if="column.dataIndex === 'change'">
                    <a-button type="primary" @click="changeInstance(record)">{{$t('instantMetrics.instanceSelectTableCols.modalAction')}}</a-button>
                </template>
            </template>
        </a-table>
    </a-modal>
</template>

<style lang="scss" scoped>
.content-area {
    width: 100%;
//height: 67.5rem;
//background-color: #1C2445;

    .title {
        width: 30rem;
        height: 4.4375rem;
        margin: 3.25rem auto 5.37rem auto;
        line-height: 2rem;
        background-image: url("@/assets/svgs/title-bg.svg");
        background-repeat: no-repeat;

        color: white;
        font-size: 2.8125rem;
        font-weight: 500;

        &.long-title {
            font-size: 2.1rem;
        }

        span {
            margin-left: 2rem;
        }
    }

    .top-metrics {
        display: flex;
        justify-content: space-between;
        margin-bottom: 3rem;
    }

    .panel {
        .panel-title {
            width: 10rem;
            height: 2.5rem;
            background-image: url("@/assets/svgs/titles/panel-bg.svg");
            background-repeat: no-repeat;

            color: #FFF;
            font-family: YouSheBiaoTiHei, serif;
            font-size: 1.5rem;
            font-style: normal;
            font-weight: 400;
            line-height: 2.8rem;
        }

        .panel-body {
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            .panel-metrics {
                width: 100%;
                display: flex;
                justify-content: space-between;
            }
        }
        .instance-selection {
            display: flex;
            align-items: center;
            margin-top: 2rem;
            cursor: pointer;
            .pre-dot {
                width: 0.5rem;
                height: 0.5rem;
                border-radius: 0.5rem;
                background-color: #00FF6A;
                margin-right: 0.5rem;
            }
            .hostname {
                color: #FFF;
                font-family: Rubik;
                font-size: 1rem;
                font-style: normal;
                font-weight: 400;
                line-height: normal;
            }
            svg {
                fill: #fff;
            }
        }
    }

}
</style>