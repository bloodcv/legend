<script setup>
// eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJpc3MtZG9tYWluLmNvbSIsIm5iZiI6MTcxMDI5MzY0MywiaWF0IjoxNzEwMjkzNjQzLCJleHAiOjE3NDE4Mjk2NDN9.VfToKA6uYMEKkbvrz9xsPhUfsCiMaFakxM6LXeqV7v4
import axios from "axios";
import dayjs from "dayjs";
import * as echarts from "echarts";
import { nextTick, onMounted, onUnmounted, reactive, ref } from "vue";
import { KJUR } from "jsrsasign";
import SvgIcon from "@/components/SvgIcon.vue";
import UtilArea2 from "@/components/sub_area/UtilArea2.vue";

const JI_FANG_HUANG_JIN_LINK_NAME = 'jiFangHuangJinLink'
const TIME_CYCLE = 'timeCycle'
const TIME_GET_HOST_INFO = "timeGetHostInfo"
const TIME_GET_HOST_INFO_DEFAULT = 30000
const TIME_GET_DEVICE_AND_ALARM = "timeGetDeviceAndAlarm"
const TIME_GET_DEVICE_AND_ALARM_DEFAULT = 60000

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
      color: "rgba(255, 255, 255, 0.5)",
    },
  },
  axisLine: {
    lineStyle: {
      color: "#fff",
    },
  },
};

const textStyle = {
  color: "#fff",
};
import { ZABBIX_API } from "@/constants.js";
const EnvInfoApi = ZABBIX_API + "/getHostNumber";
const hostInfoApi = ZABBIX_API + "/getHostInfo"; // hostid 10084
const menuNameApi = ZABBIX_API + "/getMenuList";
// const updateMenuApi = "http://101.132.244.36/api/saveMenu";
// const timeGetHostInfo = ref(30000); // 30s
const timeGetHostInfo = ref(Number(localStorage.getItem(TIME_GET_HOST_INFO)) || TIME_GET_HOST_INFO_DEFAULT); // 30s
const timeGetDeviceAndAlarm = ref(Number(localStorage.getItem(TIME_GET_DEVICE_AND_ALARM)) || TIME_GET_DEVICE_AND_ALARM_DEFAULT); // 1m
// const timeGetDeviceAndAlarm = ref(60000); // 1m
const source = axios.CancelToken.source();

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
const rundays = ref("");
const expireDateStatus = ref("");
const currentTime = ref(dayjs().format("HH:mm:ss"));
const currentTimeUpdate = ref();
const currentDate = ref(dayjs().format("YYYY-MM-DD"));
const serverDeadLine = ref("");
const deviceAndAlarmUpdate = ref();
const curHostIdx = ref(-1);
const nextHostIdx = ref(0);
const hostUpdate = ref();
const originHostList = ref([]);
const hostList = ref([]);
const hostMap = ref(new Map());
const chartFirstRef = ref();
const chartDataTemp = reactive({
  firstData: {},
  secondData: {},
  thirdData: {},
  fourthData: {},
});
let chartFirstInstance = null;
const chartSecondRef = ref();
let chartSecondInstance = null;
const chartThirdRef = ref();
let chartThirdInstance = null;
const chartFourthRef = ref();
let chartFourthInstance = null;
const timeCycle = ref(localStorage.getItem(TIME_CYCLE) || 0.5)

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
  originHostList.value = [...JSON.parse(JSON.stringify(list))];
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
  chartDataTemp.firstData = firstData;
  chartDataTemp.secondData = secondData;
  chartDataTemp.thirdData = thirdData;
  chartDataTemp.fourthData = fourthData;
  chartFirstInstance.setOption({
    title: {
      text:
        localStorage.getItem("locale") === "en"
          ? firstData.enName
          : firstData.name,
      textStyle,
      textAlign: "left",
    },
    tooltip: {
      trigger: "axis",
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      axisLine: {
        lineStyle: {
          color: "#fff",
        },
      },
      data: [...firstData.x_axis],
    },
    yAxis: yAxisOption,
    series: [
      {
        data: [...firstData.data],
        type: "line",
        lineStyle: {
          color: "#F2D66E",
        },
        showSymbol: false,
      },
    ],
  });
  chartSecondInstance.setOption({
    title: {
      text:
        localStorage.getItem("locale") === "en"
          ? secondData.enName
          : secondData.name,
      textStyle,
      textAlign: "left",
    },
    tooltip: {
      trigger: "axis",
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      axisLine: {
        lineStyle: {
          color: "#fff",
        },
      },
      data: [...secondData.x_axis],
    },
    yAxis: yAxisOption,
    series: [
      {
        data: [...secondData.data],
        type: "line",
        lineStyle: {
          color: "#F2D66E",
        },
        showSymbol: false,
      },
    ],
  });
  chartThirdInstance.setOption({
    title: {
      text:
        localStorage.getItem("locale") === "en"
          ? thirdData.enName
          : thirdData.name,
      textStyle,
      textAlign: "left",
    },
    legend: {
      data: ["down", "up"],
      textStyle: {
        color: "#fff",
      },
    },
    tooltip: {
      trigger: "axis",
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      axisLine: {
        lineStyle: {
          color: "#fff",
        },
      },
      data: [...thirdData.x_axis],
    },
    yAxis: yAxisOption,
    series: [
      {
        name: "down",
        data: [...thirdData.data[0]],
        type: "line",
        lineStyle: {
          color: "#F2D66E",
        },
        showSymbol: false,
      },
      {
        name: "up",
        data: [...thirdData.data[1]],
        type: "line",
        showSymbol: false,
      },
    ],
  });
  chartFourthInstance.setOption({
    title: {
      text:
        localStorage.getItem("locale") === "en"
          ? fourthData.enName
          : fourthData.name,
      textStyle,
      textAlign: "left",
    },
    tooltip: {
      trigger: "axis",
    },
    xAxis: {
      type: "category",
      axisLine: {
        lineStyle: {
          color: "#fff",
        },
      },
      data: [...fourthData.x_axis],
    },
    yAxis: yAxisOption,
    series: [
      {
        data: [...fourthData.data],
        type: "line",
        lineStyle: {
          color: "#F2D66E",
        },
        showSymbol: false,
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
 * get rundays number
 */
const getEnvInfo = async (init = false) => {
  try {
    const {
      data: { data: envInfoRes },
    } = await axios.get(EnvInfoApi);
    Object.keys(deviceData).map(_ => (deviceData[_] = envInfoRes.devices[_]));
    Object.keys(alarmData).map(_ => (alarmData[_] = envInfoRes.alarm[_]));
    if (init) {
      Object.keys(enterpriseInfo).map(
        _ => (enterpriseInfo[_] = envInfoRes.enterpriseInfo[_])
      );
      rundays.value = envInfoRes.rundays || 0;
      expireDateStatus.value = envInfoRes.expireDateStatus;
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
        time_cycle: Number(timeCycle.value)
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
  clearInterval(hostUpdate.value)
  getHostInfoById();
  hostUpdate.value = setInterval(() => {
    getHostInfoById();
  }, timeGetHostInfo.value);
};

/**
 * get device & alarm info every defaultTimeGetDeviceAndAlarm ms
 */
const beginDeviceAndAlarmUpdate = async () => {
  clearInterval(deviceAndAlarmUpdate.value)
  await getEnvInfo(true);
  deviceAndAlarmUpdate.value = setInterval(() => {
    getEnvInfo();
  }, timeGetDeviceAndAlarm.value);
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

const jiFangHuangJinLink = ref(
  localStorage.getItem(JI_FANG_HUANG_JIN_LINK_NAME) || ""
);
const jumpJiFangHuangJin = () => {
  if (jiFangHuangJinLink.value) {
    window.open(jiFangHuangJinLink.value, "_blank");
  }
};
const updateMenuData = params => {
  jiFangHuangJinLink.value = params.jiFangHuangJinLink || "";
  localStorage.setItem(JI_FANG_HUANG_JIN_LINK_NAME, jiFangHuangJinLink.value)
  delete params.jiFangHuangJinLink;
  Object.keys(params).map(_ => (menuNameData[_] = params[_]));
};

const updateTimeCycle = params => {
  timeCycle.value = params
  localStorage.setItem(TIME_CYCLE, timeCycle.value)
  beginHostUpdate()
}

const updateChartTimeCycle = params => {
  timeGetHostInfo.value = Number(params) || TIME_GET_HOST_INFO_DEFAULT
  localStorage.setItem(TIME_GET_HOST_INFO, timeGetHostInfo.value)
  beginHostUpdate()
}
const updateDeviceAndAlarmTimeCycle = params => {
  timeGetDeviceAndAlarm.value = Number(params) || TIME_GET_DEVICE_AND_ALARM_DEFAULT
  localStorage.setItem(TIME_GET_DEVICE_AND_ALARM, timeGetDeviceAndAlarm.value)
  beginDeviceAndAlarmUpdate()
}

const changeHostList = param => {
  clearInterval(hostUpdate.value)
  const newHostList = originHostList.value.filter(_ => {
    return param.includes(_.hostid);
  });
  hostList.value = [...newHostList];
  const map = new Map();
  newHostList.map((_, idx) => map.set(_.hostid, idx));
  hostMap.value = map;
  curHostIdx.value = -1;
  nextHostIdx.value = 0;
  beginHostUpdate();
};

const languageChange = e => {
  if (e.key === "locale") {
    chartFirstInstance.setOption({
      title: {
        text:
          e.newValue === "en"
            ? chartDataTemp.firstData.enName
            : chartDataTemp.firstData.name,
      },
    });
    chartSecondInstance.setOption({
      title: {
        text:
          e.newValue === "en"
            ? chartDataTemp.secondData.enName
            : chartDataTemp.secondData.name,
      },
    });
    chartThirdInstance.setOption({
      title: {
        text:
          e.newValue === "en"
            ? chartDataTemp.thirdData.enName
            : chartDataTemp.thirdData.name,
      },
    });
    chartFourthInstance.setOption({
      title: {
        text:
          e.newValue === "en"
            ? chartDataTemp.fourthData.enName
            : chartDataTemp.fourthData.name,
      },
    });
  }
};

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

  (function () {
    //定义一个变量让setItem函数的值指向它
    let originalSetItem = localStorage.setItem;
    //重写setItem函数
    localStorage.setItem = function (key, newValue) {
      //创建setItemEvent事件
      let event = new Event("setItemEvent");
      event.key = key;
      event.newValue = newValue;
      //提交setItemEvent事件
      window.dispatchEvent(event);
      //执行原setItem函数
      originalSetItem.apply(this, arguments);
    };
  })();

  // window.addEventListener("storage", languageChange);

  //添加setItemEvent监听事件
  window.addEventListener("setItemEvent", languageChange);
});

const cleanAction = () => {
  // remove interval event
  clearInterval(currentTimeUpdate.value)
  clearInterval(deviceAndAlarmUpdate.value)
  clearInterval(hostUpdate.value)
  window.removeEventListener("resize", handleResize);
  window.removeEventListener("beforeunload", cleanAction);
  window.removeEventListener("setItemEvent", languageChange);
};

onUnmounted(() => cleanAction());
window.addEventListener("beforeunload", cleanAction);
</script>

<template>
  <div class="main-wrap">
    <div class="header">
      <div class="left-bg"></div>
      <span class="header-title">{{ menuNameData.name }}</span>
      <div class="right-bg"></div>
      <div class="tool-wrap">
        <UtilArea2
          :menuData="menuNameData"
          :originHostList="originHostList"
          :hostList="hostList"
          @updateMenuData="updateMenuData"
          @updateTimeCycle="updateTimeCycle"
          @changeHostList="changeHostList"
          @updateChartTimeCycle="updateChartTimeCycle"
          @updateDeviceAndAlarmTimeCycle="updateDeviceAndAlarmTimeCycle" />
      </div>
    </div>
    <a-row class="content-wrap">
      <a-col :span="4" class="part left-part">
        <div class="info-wrap">
          <h3 class="info-text">{{ menuNameData.l_title1 }}</h3>
          <div class="info-item">
            <!-- <SvgIcon name="switch-menu" class="icon-tag" /> -->
            <span class="info-text" v-if="menuNameData.l_1s"
              >{{ menuNameData.l_1s }} [{{ resolveNumber(deviceData.total) }}]
              {{ $t("main2.tai") }}</span
            >
          </div>
          <div class="info-item">
            <!-- <SvgIcon name="server-menu" class="icon-tag" /> -->
            <span class="info-text" v-if="menuNameData.l_2s"
              >{{ menuNameData.l_2s }} [{{ resolveNumber(deviceData.network) }}]
              {{ $t("main2.tai") }}</span
            >
          </div>
          <div class="info-item">
            <!-- <SvgIcon name="vm-menu" class="icon-tag" /> -->
            <span class="info-text" v-if="menuNameData.l_3s"
              >{{ menuNameData.l_3s }} [{{ resolveNumber(deviceData.system) }}]
              {{ $t("main2.tai") }}</span
            >
          </div>
          <div class="info-item link-item" @click="jumpJiFangHuangJin">
            <!-- <SvgIcon name="vm-menu" class="icon-tag" /> -->
            <span class="info-text" v-if="menuNameData.l_4s"
              >{{ menuNameData.l_4s }} [{{ resolveNumber(0) }}]
              {{ $t("main2.tai") }}</span
            >
          </div>
        </div>
        <div class="info-wrap">
          <h3 class="info-text">{{ $t("main2.time") }}</h3>
          <div class="info-item">
            <!-- <SvgIcon name="rundays" class="icon-tag" /> -->
            <span class="info-text"
              >{{ $t("main2.runDay") }} {{ resolveNumber(rundays) }}
              {{ $t("main2.day") }}</span
            >
          </div>
          <div class="info-item">
            <!-- <SvgIcon name="time" class="icon-tag" /> -->
            <span class="info-text"
              >{{ $t("main2.nowTime") }} {{ currentTime }}</span
            >
          </div>
          <div class="info-item">
            <!-- <SvgIcon name="date" class="icon-tag" /> -->
            <span class="info-text"
              >{{ $t("main2.nowDate") }} {{ currentDate }}</span
            >
          </div>
          <div class="info-item" v-if="expireDateStatus">
            <!-- <SvgIcon name="stop" class="icon-tag" /> -->
            <span class="info-text"
              >{{ $t("main2.serverLimit") }}&nbsp;{{ serverDeadLine }}
              </span
            >
          </div>
        </div>
      </a-col>
      <a-col :span="16" class="part center-part">
        <div class="host-info-head info-text" v-if="curHostIdx > -1">
          {{ $t("main2.nowDevice") }}:&nbsp;&nbsp;{{
            hostList[curHostIdx].name
          }}
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
      <a-col :span="4" class="part right-part">
        <div class="info-wrap">
          <h3 class="info-text">{{ menuNameData.r_title1 }}</h3>
          <div class="info-item">
            <!-- <SvgIcon name="switch-menu" class="icon-tag" /> -->
            <span class="info-text" v-if="menuNameData.r_1s"
              >{{ menuNameData.r_1s }} [<span>{{
                resolveNumber(alarmData.total)
              }}</span
              >] {{ $t("main2.tai") }}</span
            >
          </div>
          <div class="info-item">
            <!-- <SvgIcon name="server-menu" class="icon-tag" /> -->
            <span class="info-text" v-if="menuNameData.r_2s"
              >{{ menuNameData.r_2s }} [<span>{{
                resolveNumber(alarmData.network)
              }}</span
              >] {{ $t("main2.tai") }}</span
            >
          </div>
          <div class="info-item">
            <!-- <SvgIcon name="vm-menu" class="icon-tag" /> -->
            <span class="info-text" v-if="menuNameData.r_3s"
              >{{ menuNameData.r_3s }} [<span>{{
                resolveNumber(alarmData.system)
              }}</span
              >] {{ $t("main2.tai") }}</span
            >
          </div>
        </div>
        <div class="info-wrap">
          <h3 class="info-text">{{ $t("main2.warnType") }}</h3>
          <div class="info-item" v-if="menuNameData.alert_1">
            <span class="info-text">
              <!-- <span class="warn-type-serial">①</span> -->
              <!-- {{ $t("main2.rightBottomWarn") }} -->
              {{ menuNameData.alert_1 }}
              <span
                >&nbsp;&nbsp;[{{
                  resolveNumber(alarmTypeData.warn)
                }}]&nbsp;&nbsp;</span
              >{{ $t("main2.ci") }}</span
            >
          </div>
          <div class="info-item">
            <span class="info-text" v-if="menuNameData.alert_2">
              <!-- <span class="warn-type-serial">②</span> -->
              <!-- {{ $t("main2.rightBottomCommon") }} -->
              {{ menuNameData.alert_2 }}
              <span
                >&nbsp;&nbsp;[{{
                  resolveNumber(alarmTypeData.commonly)
                }}]&nbsp;&nbsp;</span
              >{{ $t("main2.ci") }}</span
            >
          </div>
          <div class="info-item">
            <span class="info-text" v-if="menuNameData.alert_3">
              <!-- <span class="warn-type-serial">③</span> -->
              <!-- {{ $t("main2.rightBottomSerious") }} -->
              {{ menuNameData.alert_3 }}
              <span
                >&nbsp;&nbsp;[{{
                  resolveNumber(alarmTypeData.serious)
                }}]&nbsp;&nbsp;</span
              >{{ $t("main2.ci") }}</span
            >
          </div>
          <div class="info-item">
            <span class="info-text" v-if="menuNameData.alert_4">
              <!-- <span class="warn-type-serial">④</span> -->
              <!-- {{ $t("main2.rightBottomDisaster") }} -->
              {{ menuNameData.alert_4 }}
              <span
                >&nbsp;&nbsp;[{{
                  resolveNumber(alarmTypeData.disaster)
                }}]&nbsp;&nbsp;</span
              >{{ $t("main2.ci") }}</span
            >
          </div>
        </div>
      </a-col>
    </a-row>
    <div class="footer" v-if="enterpriseInfo.status">
      <span>Powered By</span
      ><a :href="enterpriseInfo.url" target="_blank">{{
        enterpriseInfo.name
      }}</a>
    </div>
  </div>
</template>

<style scoped lang="scss">
.link-item {
  cursor: pointer;
}
.main-wrap {
  background: url("../assets/main-bg.png") no-repeat center/100% 100%;
}
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 3.7rem;
  margin-bottom: 2rem;
  .tool-wrap {
    position: absolute;
    right: 0;
    top: 0;
  }

  .left-bg,
  .right-bg {
    position: relative;
    width: 30%;
    height: 100%;
    top: 5px;
    background: url("../assets/header-aside-bg.png") no-repeat center/100% 100%;
    &::before {
      position: absolute;
      content: "";
      width: 3rem;
      height: 0.5rem;
      top: 0.5rem;
      background: url("../assets/header-aside-dot.png") no-repeat center/100%
        100%;
    }
  }
  .left-bg {
    &::before {
      left: 65%;
      transform: rotateY(180deg);
    }
  }
  .right-bg {
    transform: rotateY(180deg);
    &::before {
      left: 65%;
      transform: rotateY(180deg);
    }
  }
  .header-title {
    flex: 1;
    color: #fff;
    font-size: 3rem;
    /* font-family: YouSheBiaoTiHei; */
    font-weight: 600;
    display: inline-block;
    position: relative;
    padding-top: 2rem;
    &::before,
    &::after {
      position: absolute;
      content: "";
      width: 3.875rem;
      height: 0.5rem;
      bottom: 0.5rem;
      background: url("../assets/header-title-bg.png") no-repeat center/100%;
    }
    &::before {
      left: 1rem;
    }
    &::after {
      right: 1rem;
      transform: rotateY(180deg);
    }
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
  min-height: 24.125rem;
  align-items: start;
  .info-item:last-child {
    margin-bottom: 0;
  }
  background: no-repeat url("../assets/infoWrapBg.png") center center/100% 100%;
  h3 {
    font-family: YouSheBiaoTiHei;
    font-weight: 400;
    font-size: 2.25rem;
    color: #ffffff;
    line-height: 1;
    margin-bottom: 3rem;
    padding: 1rem 0 0 1.125rem;
  }
}

.info-text {
  word-break: break-all;
  font-family: Adobe Heiti Std;
  font-size: 1.3rem;
  display: flex;
  align-items: center;
  color: #fff;
}

.warn-type-serial {
  transform: scale(1.2);
  margin-right: 10px;
}

.info-item {
  margin-bottom: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: start;
  padding-left: 2rem;
  width: 100%;

  .icon-tag {
    margin-right: 10px;
  }
}

.footer {
  padding: 1rem 0;
  text-align: center;
  span {
    display: inline-block;
    margin-right: 1rem;
    color: #fff;
  }
  a {
    color: #fff;
  }
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
  justify-content: space-around;
  padding: 0 1.1875rem;
}

.center-part {
  padding: 0 3rem;
  /* position: relative; */
  display: flex;
  flex-direction: column;

  /* &::before,
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
  } */

  .host-info-head {
    justify-content: center;
  }

  .chart-wrap {
    flex: 1;
    display: flex;
    flex-direction: column;

    .chart-item {
      flex: 1;
      display: flex;
      align-items: center;

      .chart-content {
        width: 100%;
        height: 90%;
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
      fill: #a3caf3;
      transition: ease 0.3s;
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
      fill: #a3caf3;
      transition: ease 0.3s;
    }

    &:hover {
      .util-config-svg {
        fill: #3e74ea;
      }
    }
  }
}
</style>
