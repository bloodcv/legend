<script setup>
// eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJpc3MtZG9tYWluLmNvbSIsIm5iZiI6MTcxMDI5MzY0MywiaWF0IjoxNzEwMjkzNjQzLCJleHAiOjE3NDE4Mjk2NDN9.VfToKA6uYMEKkbvrz9xsPhUfsCiMaFakxM6LXeqV7v4
import axios from "axios";
import dayjs from "dayjs";
import * as echarts from "echarts";
import {
  nextTick,
  onMounted,
  onUnmounted,
  reactive,
  ref,
} from "vue";
import { KJUR } from "jsrsasign";
import SvgIcon from "@/components/SvgIcon.vue";
import UtilArea2 from "@/components/sub_area/UtilArea2.vue";

const lineOption = {
  grid: {
    left: "3%",
    right: "4%",
    bottom: "3%",
    containLabel: true,
  },
};

const yAxisOption = {
  type: "value",
  splitLine: {
    show: true,
    lineStyle: {
      color: "rgba(255, 255, 255, 0.1)",
    },
  },
};

const textStyle = {
  color: "#fff",
};
const EnvInfoApi = "http://101.132.244.36/api/getHostNumber";
const hostInfoApi = "http://101.132.244.36/api/getHostInfo"; // hostid 10084
const menuNameApi = "http://101.132.244.36/api/getMenuList";
// const updateMenuApi = "http://101.132.244.36/api/saveMenu";
const defaultTimeGetHostInfo = 30000; // 30s
const defaultTimeGetDeviceAndAlarm = 60000; // 1m
const source = axios.CancelToken.source();

const menuNameData = reactive({
  l_1: "",
  l_2: "",
  l_3: "",
  l_title: "",
  name: "",
  r_1: "",
  r_2: "",
  r_3: "",
  r_title: "",
});
const deviceData = reactive({
  total: 0,
  network: 0,
  system: 0,
});
const alarmData = reactive({
  total: 0,
  network: 0,
  system: 0,
});
const alarmTypeData = reactive({
  commonly: 0,
  disaster: 0,
  serious: 0,
  warn: 0,
});
const enterpriseInfo = reactive({
  name: "",
  status: 0,
  url: "",
});
const runday = ref("");
const currentTime = ref(dayjs().format("HH:mm:ss"));
const currentTimeUpdate = ref();
const currentDate = ref(dayjs().format("YYYY-MM-DD"));
const serverDeadLine = ref("");
const deviceAndAlarmUpdate = ref();
const curHostIdx = ref(-1);
const nextHostIdx = ref(0);
const hostUpdate = ref();
const originHostList = ref([])
const hostList = ref([]);
const hostMap = ref(new Map());
const chartFirstRef = ref();
let chartFirstInstance = null;
const chartSecondRef = ref();
let chartSecondInstance = null;
const chartThirdRef = ref();
let chartThirdInstance = null;
const chartFourthRef = ref();
let chartFourthInstance = null;

/**
 * resolve number to show at least three digits and fill by 0 in head
 */
const resolveNumber = (day = 0) => {
  if (day > 999) {
    return day.toString();
  }
  return ("000" + day.toString()).slice(-3);
};

/**
 * set host list which type is <hostItemType>[]
 *
 * set host map which type is Map<string, hostIdx>
 */
const setHostInfo = list => {
  originHostList.value = [...JSON.parse(JSON.stringify(list))]
  hostList.value = [...list];
  const map = new Map();
  list.map((_, idx) => map.set(_.hostid, idx));
  hostMap.value = map;
};

/**
 * set chart info and current host index
 * @param detail host info contain alarm and chart info
 * @param idx index in host list for current show host
 */
const setHostDetail = (detail, idx) => {
  // console.log(detail);
  Object.keys(alarmTypeData).map(_ => (alarmTypeData[_] = detail.alarm[_]));
  curHostIdx.value = idx;
  const {
    cpu: firstData,
    ram: secondData,
    bandwidth: thirdData,
    disk: fourthData,
  } = detail.chart;
  chartFirstInstance.setOption({
    title: {
      text: firstData.name,
      textStyle,
      textAlign: "center",
      left: "50%",
    },
    tooltip: {
      trigger: "axis",
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: [...firstData.x_axis],
    },
    yAxis: yAxisOption,
    series: [
      {
        data: [...firstData.data],
        type: "line",
      },
    ],
  });
  chartSecondInstance.setOption({
    title: {
      text: secondData.name,
      textStyle,
      textAlign: "center",
      left: "50%",
    },
    tooltip: {
      trigger: "axis",
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: [...secondData.x_axis],
    },
    yAxis: yAxisOption,
    series: [
      {
        data: [...secondData.data],
        type: "line",
      },
    ],
  });
  chartThirdInstance.setOption({
    title: {
      text: thirdData.name,
      textStyle,
      textAlign: "center",
      left: "33%",
    },
    legend: {
      data: ["下行", "上行"],
      textStyle: {
        color: '#fff'
      }
    },
    tooltip: {
      trigger: "axis",
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: [...thirdData.x_axis],
    },
    yAxis: yAxisOption,
    series: [
      {
        name: "下行",
        data: [...thirdData.data[0]],
        type: "line",
      },
      {
        name: "上行",
        data: [...thirdData.data[1]],
        type: "line",
      },
    ],
  });
  chartFourthInstance.setOption({
    title: {
      text: fourthData.name,
      textStyle,
      textAlign: "center",
      left: "50%",
    },
    tooltip: {
      trigger: "axis",
    },
    xAxis: {
      type: "category",
      data: [...fourthData.x_axis],
    },
    yAxis: yAxisOption,
    series: [
      {
        data: [...fourthData.data],
        type: "line",
      },
    ],
  });
};

/**
 * get menu name in top in left part and right part
 */
const getMenuName = async () => {
  try {
    const {
      data: { data: menuNameRes },
    } = await axios.get(menuNameApi);
    Object.keys(menuNameData).map(_ => (menuNameData[_] = menuNameRes[_]));
  } catch (error) {
    console.error("error: get menu", error);
  }
};

/**
 * get menu data
 *
 * get host list
 *
 * get runday number
 */
const getEnvInfo = async (init = false) => {
  try {
    const {
      data: { data: envInfoRes },
    } = await axios.get(EnvInfoApi);
    Object.keys(deviceData).map(_ => (deviceData[_] = envInfoRes.device[_]));
    Object.keys(alarmData).map(_ => (alarmData[_] = envInfoRes.alarm[_]));
    if (init) {
      Object.keys(enterpriseInfo).map(
        _ => (enterpriseInfo[_] = envInfoRes.enterpriseInfo[_])
      );
      runday.value = envInfoRes.runday || 0;
      setHostInfo(envInfoRes.list);
    }
  } catch (error) {
    console.error("error: get env info", error);
  }
};

/**
 * get host info by id
 */
const getHostInfoById = async () => {
  const currentHostIdx = nextHostIdx.value;
  try {
    const {
      data: { data: hostDetail },
    } = await axios.get(hostInfoApi, {
      params: {
        hostid: hostList.value[currentHostIdx].hostid,
      },
      cancelToken: source.token,
    });
    setHostDetail(hostDetail, currentHostIdx);
    nextHostIdx.value =
      nextHostIdx.value === hostList.value.length - 1
        ? 0
        : nextHostIdx.value + 1;
  } catch (error) {
    console.error("error: get host info", error);
  }
};

/**
 * get host info by id every defaultTimeGetHostInfo ms
 */
const beginHostUpdate = () => {
  getHostInfoById();
  hostUpdate.value = setInterval(() => {
    getHostInfoById();
  }, defaultTimeGetHostInfo);
};

/**
 * get device & alarm info every defaultTimeGetDeviceAndAlarm ms
 */
const beginDeviceAndAlarmUpdate = async () => {
  await getEnvInfo(true);
  deviceAndAlarmUpdate.value = setInterval(() => {
    getEnvInfo();
  }, defaultTimeGetDeviceAndAlarm);
};

/**
 * resize echart when window width or height be changed
 */
const handleResize = () => {
  chartFirstInstance && chartFirstInstance.resize();

  chartSecondInstance && chartSecondInstance.resize();

  chartThirdInstance && chartThirdInstance.resize();

  chartFourthInstance && chartFourthInstance.resize();
};

/**
 * create instance for every chart ele
 */
const initChart = () => {
  chartFirstInstance = echarts.init(chartFirstRef.value);
  chartFirstInstance.setOption(JSON.parse(JSON.stringify(lineOption)));
  chartSecondInstance = echarts.init(chartSecondRef.value);
  chartSecondInstance.setOption(JSON.parse(JSON.stringify(lineOption)));
  chartThirdInstance = echarts.init(chartThirdRef.value);
  chartThirdInstance.setOption(JSON.parse(JSON.stringify(lineOption)));
  chartFourthInstance = echarts.init(chartFourthRef.value);
  chartFourthInstance.setOption(JSON.parse(JSON.stringify(lineOption)));
  nextTick(() => {
    window.addEventListener("resize", handleResize);
  });
};

const updateMenuData = (params) => {
  Object.keys(params).map(_ => menuNameData[_] = params[_])
}

const changeHostList = (param) => {
  hostUpdate.value = null;
  const newHostList = originHostList.value.filter((_ => {
    return param.includes(_.hostid)
  }))
  hostList.value = [...newHostList]
  curHostIdx.value = -1
  nextHostIdx.value = 0
  beginHostUpdate()
}

onMounted(async () => {
  const auth = window.localStorage.getItem("code");
  // init update currentTime bg one second
  currentTimeUpdate.value = setInterval(() => {
    currentTime.value = dayjs().format("HH:mm:ss");
  }, 1000);
  // init serverDeadLine
  if (auth) {
    serverDeadLine.value = dayjs(
      KJUR.jws.JWS.parse(auth).payloadObj.exp * 1000
    ).format("YYYY-MM-DD");
    getMenuName();
    await beginDeviceAndAlarmUpdate();
    beginHostUpdate();
  }
  initChart();
});

const cleanAction = () => {
  // remove interval event
  currentTimeUpdate.value = null;
  deviceAndAlarmUpdate.value = null;
  hostUpdate.value = null;
  window.removeEventListener("resize", handleResize);
  window.removeEventListener("beforeunload", cleanAction);
};

onUnmounted(() => cleanAction());
window.addEventListener("beforeunload", cleanAction);
</script>

<template>
  <div class="main-wrap">
    <div class="header">
      <span>{{ menuNameData.name }}</span>
      <div class="tool-wrap">
        <UtilArea2 :menuData="menuNameData" :originHostList="originHostList" :hostList="hostList" @updateMenuData="updateMenuData" @changeHostList="changeHostList" />
      </div>
    </div>
    <a-row class="content-wrap">
      <a-col :span="6" class="part left-part">
        <div class="info-wrap">
          <h3 class="info-text">({{ menuNameData.l_title }})</h3>
          <div class="info-item">
            <SvgIcon name="switch-menu" class="icon-tag" />
            <span class="info-text"
              >{{ menuNameData.l_1 }} [{{
                resolveNumber(deviceData.total)
              }}]台</span
            >
          </div>
          <div class="info-item">
            <SvgIcon name="server-menu" class="icon-tag" />
            <span class="info-text"
              >{{ menuNameData.l_2 }} [{{
                resolveNumber(deviceData.network)
              }}]台</span
            >
          </div>
          <div class="info-item">
            <SvgIcon name="vm-menu" class="icon-tag" />
            <span class="info-text"
              >{{ menuNameData.l_3 }} [{{
                resolveNumber(deviceData.system)
              }}]台</span
            >
          </div>
        </div>
        <div class="info-wrap">
          <h3 class="info-text">(时间栏)</h3>
          <div class="info-item">
            <SvgIcon name="runday" class="icon-tag" />
            <span class="info-text"
              >系统运行 {{ resolveNumber(runday) }} 天</span
            >
          </div>
          <div class="info-item">
            <SvgIcon name="time" class="icon-tag" />
            <span class="info-text">当前时间 {{ currentTime }}</span>
          </div>
          <div class="info-item">
            <SvgIcon name="date" class="icon-tag" />
            <span class="info-text">当前日期 {{ currentDate }}</span>
          </div>
          <div class="info-item">
            <SvgIcon name="stop" class="icon-tag" />
            <span class="info-text"
              >服务期限
              <span class="red-text">&nbsp;{{ serverDeadLine }}</span></span
            >
          </div>
        </div>
      </a-col>
      <a-col :span="12" class="part center-part">
        <div class="host-info-head info-text" v-if="curHostIdx > -1">
          当前设备:&nbsp;&nbsp;{{
            hostList[curHostIdx].type
          }}类设备&nbsp;&nbsp;{{ hostList[curHostIdx].name }}
        </div>
        <div class="chart-wrap">
          <div class="chart-item chart-first">
            <div class="chart-content" ref="chartFirstRef"></div>
          </div>
          <div class="chart-item chart-second">
            <div class="chart-content" ref="chartSecondRef"></div>
          </div>
          <div class="chart-item chart-third">
            <div class="chart-content" ref="chartThirdRef"></div>
          </div>
          <div class="chart-item chart-fourth">
            <div class="chart-content" ref="chartFourthRef"></div>
          </div>
        </div>
      </a-col>
      <a-col :span="6" class="part right-part">
        <div class="info-wrap">
          <h3 class="info-text">({{ menuNameData.r_title }})</h3>
          <div class="info-item">
            <SvgIcon name="switch-menu" class="icon-tag" />
            <span class="info-text"
              >{{ menuNameData.r_1 }} [<span class="red-text">{{
                resolveNumber(alarmData.total)
              }}</span
              >]台</span
            >
          </div>
          <div class="info-item">
            <SvgIcon name="server-menu" class="icon-tag" />
            <span class="info-text"
              >{{ menuNameData.r_2 }} [<span class="red-text">{{
                resolveNumber(alarmData.network)
              }}</span
              >]台</span
            >
          </div>
          <div class="info-item">
            <SvgIcon name="vm-menu" class="icon-tag" />
            <span class="info-text"
              >{{ menuNameData.r_3 }} [<span class="red-text">{{
                resolveNumber(alarmData.system)
              }}</span
              >]台</span
            >
          </div>
        </div>
        <div class="info-wrap">
          <h3 class="info-text">(报警类型栏)</h3>
          <div class="info-item">
            <span class="info-text">
              <span class="warn-type-serial">①</span>{{$t('main2.rightBottomWarn')}} [
              <span class="red-text">{{
                resolveNumber(alarmTypeData.warn)
              }}</span
              >]次</span
            >
          </div>
          <div class="info-item">
            <span class="info-text"
              ><span class="warn-type-serial">②</span>{{$t('main2.rightBottomCommon')}} [<span
                class="red-text"
                >{{ resolveNumber(alarmTypeData.commonly) }}</span
              >]次</span
            >
          </div>
          <div class="info-item">
            <span class="info-text"
              ><span class="warn-type-serial">③</span>{{$t('main2.rightBottomSerious')}} [<span
                class="red-text"
                >{{ resolveNumber(alarmTypeData.serious) }}</span
              >]次</span
            >
          </div>
          <div class="info-item">
            <span class="info-text"
              ><span class="warn-type-serial">④</span>{{$t('main2.rightBottomDisaster')}} [<span
                class="red-text"
                >{{ resolveNumber(alarmTypeData.disaster) }}</span
              >]次</span
            >
          </div>
        </div>
      </a-col>
    </a-row>
    <div class="footer" v-if="enterpriseInfo.status">
      <span>Powered By</span
      ><a :href="enterpriseInfo.url">{{ enterpriseInfo.name }}</a>
    </div>
  </div>
</template>

<style scoped lang="scss">
.header {
    position: relative;
    .tool-wrap {
position: absolute;
right: 0;
top: 0;
    }
}
.main-wrap {
  width: 100%;
  height: 100%;
  min-width: 1500px;
  overflow-x: auto;
  overflow-y: hidden;
  display: flex;
  flex-direction: column;
}

.red-text {
  color: rgb(241, 54, 54);
}

.icon-tag {
  fill: #64b5f6;
}

.info-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.info-text {
  font-size: 2rem;
  display: flex;
  align-items: center;
}

.warn-type-serial {
  font-size: 2.5rem;
  margin-right: 10px;
}

.info-item {
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: start;
  width: 25rem;

  .icon-tag {
    margin-right: 10px;
  }
}

.header {
  padding: 1rem 0;
  display: flex;
  align-items: center;
  justify-content: center;

  span {
    font-size: 2.8rem;
    font-weight: 500;
    display: inline-block;
    background-image: url("@/assets/svgs/title-bg.svg");
    background-repeat: no-repeat;
    background-size: cover;
    padding: 0 1rem 22px 4rem;
    line-height: 2rem;
  }
}

.footer {
  padding: 1rem 0;
  text-align: center;
}

.content-wrap {
  flex: 1;
  display: flex;
}

.part {
  height: 100%;
}

.left-part,
.right-part {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.center-part {
  padding: 0 3rem;
  position: relative;
  display: flex;
  flex-direction: column;

  &::before,
  &::after {
    position: absolute;
    content: "";
    width: 2px;
    top: 0;
    bottom: 0;
    background-color: #4479aa;
  }

  &::before {
    left: 0;
  }

  &::after {
    right: 0;
  }

  .host-info-head {
    justify-content: center;
  }

  .chart-wrap {
    flex: 1;
    display: flex;
    flex-direction: column;

    .chart-item {
      flex: 1;
      padding-top: 1rem;
      .chart-content {
        width: 100%;
        height: 100%;
      }
    }
  }
}

.util-area {
    height: 7.44rem;
    width: 100%;
    padding-top: 1rem;

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
</style>
