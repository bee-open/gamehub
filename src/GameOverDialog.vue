<!--suppress CssUnusedSymbol -->
<script setup lang="ts">
import DialogButton from './DialogButton.vue'

import {NConfigProvider, NFlex, NSpace, NText} from "naive-ui";
import RewardProgressBar from "@/RewardProgressBar.vue";
import {ref} from "vue";
import AlertDialog from "@/AlertDialog.vue";


const props = defineProps({
  score: {
    type: Number,
    required: true,
  },
  scoreDetail: {
    type: String,
    required: true,
  },
  reward: {
    type: Number,
    required: true,
  },
  minLevelScore: {
    type: Number,
    required: true,
  },
  levelScore: {
    type: Number,
    required: true,
  },
  nftHeader: {
    type: String,
    default: "",
  },
  nftHashLevelIcon: {
    type: String,
    default: "",
  },
  buff1: {
    type: Number,
    required: true,
  },
  buff2: {
    type: Number,
    required: true,
  },
  full: {
    type: Boolean,
    required: true,
  },
  userDiamond: {
    type: Number,
    required: true,
  },
  diamond: {
    type: Number,
    required: true,
  },
  diamondCount: {
    type: Number,
    required: true,
  },
  adsCount: {
    type: Number,
    required: true,
  }
});

const themeOverrides = {
  Flex: {
    gapSmall: "0.33rem 0.67rem",
    gapMedium: "0.67rem 1rem",
    gapLarge: "1rem 1.33rem",
  }
}
const emit = defineEmits(['closeDialog', 'diamondRevive', 'adsRevive']);

const showAlert = ref(false);
const hasAlert = ref(false);

const claimReward = function () {
  emit('closeDialog');
}

const adsRevive = function () {
  if (props.adsCount == 0 && !showAlert.value) {
    showAlert.value = true;
  } else {
    emit('adsRevive');
  }
}

const closeAlert = function () {
  showAlert.value = false;
  hasAlert.value = true;
}

const diamondRevive = function () {
  emit('diamondRevive');
}
</script>

<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
  name: "GameOverDialog",
  computed: {
    no_buff() {
      return this.buff1 == 0 && this.buff2 == 0;
    },
  }
})
</script>
<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <AlertDialog
        v-if="showAlert" @closeDialog="closeAlert"
        title="Ad Revives Limit Reached"
        message="You've reached the limit for reviving through ads  today. Please choose another way to revive."
    />
    <n-flex v-if="!showAlert" vertical align="center" class="bg" style="gap:0;">
      <div style="height: 9.75rem;"></div>
      <n-space vertical align="center" style="gap:0;">
        <div style="display: flex; flex-direction:column; align-items: center;">
          <n-flex class="bg1">
            <div>
              <img src="./assets/dlg/asset007.png" alt="reward" style="width: 4rem"/>
            </div>
            <div>
              <n-flex vertical style="gap:0;">
                <n-text class="text2">
                  {{ score }}
                </n-text>
                <n-text class="text3">
                  ({{ scoreDetail }})
                </n-text>
              </n-flex>
            </div>
          </n-flex>
          <div class="bg2">
            &nbsp;
          </div>
        </div>
        <RewardProgressBar :levelScore="levelScore" :score="score" :full="full"/>
      </n-space>
      <n-flex class="bg3" align="center" justify="center">
        <n-text class="text7">Reward!</n-text>
      </n-flex>
      <n-space class="bg4" justify="center" style="gap:1.67rem;padding-top: 1rem;padding-bottom: 3rem">
        <n-flex vertical align="center" style="gap:1rem;">
          <img src="./assets/dlg/asset009.png" alt="star" style="width: 6.25rem;height: 6.42rem;"/>
          <n-text class="text4">x {{ reward }}</n-text>
        </n-flex>
        <img src="./assets/dlg/asset004.png" alt="divider" style="height: 8.33rem;"/>
        <n-flex v-if="score<minLevelScore" align="center" style="padding-left: 0.83rem;width: 14rem;height:10rem;">
          <n-text class="text9">Score Too Low</n-text>
        </n-flex>
        <n-flex v-else-if="no_buff" align="center" style="padding-left: 0.83rem;width: 14rem;">
          <n-text class="text9">Holding NFTs grants up to a 220% bonus.</n-text>
        </n-flex>
        <n-space v-else vertical style="gap:0.25rem;padding-left: 0.83rem;">
          <n-flex align="center">
            <img :src="nftHashLevelIcon" alt="level" class="level"/>
            <n-text class="text5">+{{ buff1 }}%</n-text>
          </n-flex>
          <n-flex align="center">
            <img class="header" :src="nftHeader" alt="header"/>
            <n-text class="text5">+{{ buff2 }}%</n-text>
          </n-flex>
        </n-space>
      </n-space>
      <n-text v-show="diamondCount+adsCount>0" class="text6">Revive Now for Higher Rewards!</n-text>
      <n-space v-if="diamondCount+adsCount>0" align="center" style="padding-top: 1rem;">
        <DialogButton v-if="diamondCount> 0" :mode="1" :diamond="diamond" :count="diamondCount"
                      @click="diamondRevive"/>
        <DialogButton v-if="diamondCount==0" :mode="1" :diamond="diamond" :count="0" disabled/>
        <DialogButton v-if="!hasAlert" :mode="2" :count="adsCount" @click="adsRevive"/>
        <DialogButton v-if="hasAlert" :mode="2" :count="adsCount" disabled/>
      </n-space>
      <n-space v-if="diamondCount+adsCount==0" align="center" style="padding-top: 1rem;">
        <DialogButton :mode="3" @click="claimReward"/>
      </n-space>
      <div v-if="diamondCount+adsCount>0" style="padding-top: 3rem;" @click="claimReward">
        <n-text v-if="score>0 && reward>0" class="text8">
          Claim Reward
        </n-text>
        <n-text v-else class="text8">
          Play Again
        </n-text>
      </div>
    </n-flex>
  </n-config-provider>
</template>

<style scoped>
@font-face {
  font-family: 'ArialMT';
  src: url('./assets/fonts/ArialMT.ttf') format('truetype');
}

@font-face {
  font-family: 'ArialBoldMT';
  src: url('./assets/fonts/ArialMT.ttf') format('truetype');
  font-weight: 900;
  font-style: normal;
}

.n-flex {
  gap: 0.67rem 1rem;
}

.n-space {
  gap: 0.67rem 1rem;
}

.bg {
  background-image: url("./assets/dlg/asset001.png");
  background-repeat: no-repeat;
  background-size: 52.5rem;
  width: 52.5rem;
}

.bg1 {
  background: #FFFFFF5C;
  border-radius: 0.67rem;
  padding: 1.42rem 4.5rem 1.42rem 1.42rem;
}

.bg2 {
  color: #FFFFFF;
  width: 0;
  height: 0;
  border-left: 1.58rem solid transparent;
  border-right: 1.58rem solid transparent;
  border-top: 2.17rem solid; /* 改变这个颜色以适应你的设计 */
  opacity: 0.36;
}

.bg3 {
  background-image: url("./assets/dlg/asset003.png");
  background-size: 27.08rem 4rem;
  width: 27.08rem;
  height: 4rem;
}

.bg4 {
  background-image: url("./assets/dlg/asset002.png");
  background-size: 41.83rem;
  background-repeat: no-repeat;
  width: 41.83rem;
  height: 13.92rem;
}

.n-text {
  font-family: ArialMT, serif;
}

.text2 {
  color: #FFBB3F;
  font-family: ArialBoldMT, serif;
  font-weight: 900;
  font-size: 5rem;
  text-align: center;
  font-style: normal;
  text-transform: none;
  line-height: 5rem;
}

.text3 {
  color: #FFFFFF;
  font-weight: normal;
  font-size: 2rem;
  text-align: center;
  font-style: normal;
  text-transform: none;
  line-height: 2rem;
}

.text4 {
  color: #FF8509;
  font-family: ArialMT, serif;
  font-weight: normal;
  font-size: 3rem;
  line-height: 2.17rem;
}

.text5 {
  color: #FF8509;
  font-size: 2.33rem;
}

.text6 {
  color: #FFF9B9;
  font-size: 2rem;
}

.text7 {
  font-family: ArialBoldMT, serif;
  font-weight: 900;
  font-size: 3rem;
  line-height: 3rem;
  background-image: linear-gradient(90deg, #F5DC90, #FFF9E6, #F5DE98);
  background-clip: text;
  color: transparent;
  -webkit-background-clip: text;
  filter: drop-shadow(0.17rem 0.17rem 0.33rem #CD7C28);
}

.text8 {
  font-family: ArialBoldMT, serif;
  font-weight: 900;
  font-size: 3rem;
  color: #FEFEFE;
  text-decoration: underline;
}

.text9 {
  color: #FF8509;
  font-family: ArialMT, serif;
  font-size: 2rem;
}

.header {
  width: 4.66rem;
  height: 4.66rem;
  border-radius: 1rem;
  border: 0.17rem solid #FFFFFF;
}

.level {
  height: 5rem;
}
</style>