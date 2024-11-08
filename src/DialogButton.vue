<!--suppress CssUnusedSymbol -->
<script setup lang="ts">
import adsPic from './assets/dlg/asset005.png';
import diamondPic from './assets/dlg/asset010.png';
import {NButton, NConfigProvider, NText} from "naive-ui";

const themeOverrides = {
  Button: {
    colorSecondary: "#FFC04D",
    colorSecondaryHover: "#FFC04D",
    colorSecondaryPressed: "#FFC04D",
    opacityDisabled: 1,
  },
}
</script>
<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
  name: "DialogButton",
  props: {
    mode: {
      type: Number,
      required: true,
    },
    diamond: {
      type: Number,
      default: 0,
    },
    count: {
      type: Number,
      default: 0,
    },
    disabled: {
      type: Boolean,
      default: false,
    }
  },
  computed: {
    customClass() {
      return this.disabled ? "disabled" : "enabled";
    }
  }
})
</script>

<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <n-button v-if='mode===1' secondary :disabled="disabled" :bordered="false" style="--n-color-disabled:#AAAAAA;">
      <img :src="diamondPic" alt="" style="height: 5rem;"/>
      <n-text class="text1" style="position:relative;left:-5rem;top:1.5rem;">
        x{{ diamond }}
      </n-text>
      <n-text class="text2">Revive({{ count }})</n-text>
    </n-button>
    <n-button v-else-if='mode===2' secondary :bordered="false" :disabled="disabled" color="#FFC04D"
              style="padding-left: 3rem;--n-color-disabled:#AAAAAA;" :class="customClass">
      <img :src="adsPic" alt="" style="height: 5rem;padding-right: 2rem;"/>
      <n-text class="text2">Revive({{ count }})</n-text>
    </n-button>
    <n-button v-else-if='mode===3' secondary :bordered="false" :class="customClass" :disabled="disabled"
              style="width: 28rem;justify-content: center;--n-color-disabled:#AAAAAA;">
      <n-text class="text3">Claim Reward</n-text>
    </n-button>
    <n-button v-else>
      {{ mode }}
    </n-button>
  </n-config-provider>
</template>

<style scoped>
@font-face {
  font-family: 'ArialMT';
  src: url('./assets/fonts/ArialMT.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
}

@font-face {
  font-family: 'ArialBoldMT';
  src: url('./assets/fonts/ArialMT.ttf') format('truetype');
  font-style: normal;
}

.disabled {
  --n-color: #AAAAAA;
  --n-color-hover: #AAAAAA;
  --n-color-pressed: #AAAAAA;
}

.enabled {
  --n-color: #FFC04D;
  --n-color-hover: #FFC04D;
  --n-color-pressed: #FFC04D;
}

.n-button {
  border-radius: 1.33rem;
  width: 22.5rem;
  height: 7.16rem;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
}

.n-text {
  color: #FFFFFF;
  font-family: ArialMT, serif;
  font-size: 2rem;
}

.text1 {
  color: #FFFFFF;
  font-size: 2rem;
  line-height: 2rem;
  font-family: ArialBoldMT, serif;
  font-weight: 900;
  -webkit-text-stroke: 0.1rem #FF8509;
}

.text2 {
  color: #FFFFFF;
  font-family: ArialMT, serif;
  font-size: 2.17rem;
  line-height: 3rem;
}

.text3 {
  color: #FFFFFF;
  font-family: ArialBoldMT, serif;
  font-size: 2.17rem;
  line-height: 3rem;
  font-weight: 900;
}
</style>