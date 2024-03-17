<script setup>
import SvgIcon from "@/components/SvgIcon.vue";
import { ref } from "vue";
import { useI18n } from "vue-i18n";

const showConfigModal = ref(false);

function openConfigModal() {
  showConfigModal.value = true;
}

function updateConfigFormData() {}

const configCollapseActiveKey = ref(["title"]);

const { locale } = useI18n();
function setLocale(localeString) {
  locale.value = localeString;
  localStorage.setItem("locale", localeString);
}

</script>

<template>
  <div class="util-area">
    <div class="util-config" @click="openConfigModal">
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
    v-model:open="showConfigModal"
    :title="$t('subArea.utilArea.config.change.title')"
    @ok="updateConfigFormData">
    <a-form :wrapper-col="{ span: 16 }">
      <a-collapse v-model:active-key(v-model)="configCollapseActiveKey">
        <a-collapse-panel key="hostSec" :header="$t('main2.hostSec')">
          <h1>展示主机</h1>
        </a-collapse-panel>
        <a-collapse-panel key="title" :header="$t('main2.title')">
          <a-input value="" />
        </a-collapse-panel>
        <a-collapse-panel class="menu-setting-wrap" key="leftMenu" :header="$t('main2.leftMenu')">
          <a-input value="" />
          <a-input value="" />
          <a-input value="" />
          <a-input value="" />
        </a-collapse-panel>
        <a-collapse-panel class="menu-setting-wrap" key="rightMenu" :header="$t('main2.rightMenu')">
          <a-input value="" />
          <a-input value="" />
          <a-input value="" />
          <a-input value="" />
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
</style>
