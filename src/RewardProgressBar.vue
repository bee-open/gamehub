<script setup lang="ts">

import {NConfigProvider, NFlex, NProgress, NText} from "naive-ui";

const themeOverrides = {
  // ProgressTheme
  Progress: {}
}
</script>
<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
  name: "RewardProgressBar",
  props: {
    levelScore: {
      type: Number,
      required: true,
    },
    score: {
      type: Number,
      required: true,
    },
    full: {
      type: Boolean,
      required: true,
    }
  },
  computed: {
    percent() {
      if (this.full) {
        return 20;
      } else {
        return 50;
      }
    },
  }
})
</script>

<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <div style="width: 31.67rem;height: 7rem;">
      <div style="height: 1.25rem"></div>
      <n-progress
          type="line"
          color="#FFC04D"
          border-radius="0.5rem"
          rail-style="background-color: #FFFFFF5C;"
          :show-indicator="false"
          status="success"
          :percentage="percent"
          style="--n-rail-height:1rem;"
      />
      <n-flex v-if="!full" vertical style="position: relative;top:-3.37rem;left:23rem;gap:0;">
        <n-flex>
          <div style="width: 1.67rem;"></div>
          <img src="./assets/dlg/asset006.png" alt="box" style="width: 5.17rem;"/>
        </n-flex>
        <n-flex style="gap:0.42rem;">
          <img src="./assets/dlg/asset007.png" style="height: 1.67rem;" alt="reward"/>
          <n-text class="text1">{{ levelScore }}</n-text>
        </n-flex>
      </n-flex>
      <n-flex v-else vertical style="position: relative;top:-3.37rem;gap:0;">
        <n-flex>
          <div style="width: 1.67rem;"></div>
          <img src="./assets/dlg/asset008.png" alt="box" style="width: 5.17rem;"/>
        </n-flex>
        <n-flex style="gap:0.42rem;">
          <img src="./assets/dlg/asset007.png" style="height: 1.67rem;" alt="reward"/>
          <n-text class="text1">{{ levelScore }}(max)</n-text>
        </n-flex>
      </n-flex>
    </div>
  </n-config-provider>
</template>

<style scoped>
.text1 {
  font-family: ArialBoldMT, serif;
  font-size: 2rem;
  color: #FFFFFF;
  line-height: 2rem;
  text-align: center;
  font-style: normal;
  text-transform: none;
}
</style>