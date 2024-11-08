<script setup lang="ts">
import {ref} from "vue";
import {NButton, NSelect, NSpace} from "naive-ui";
import RewardDialog from "@/RewardDialog.vue";
import LoadingDialog from "@/LoadingDialog.vue";
import {UserInfo} from "@/bee-game-sdk";
import GameOverDialog from "@/GameOverDialog.vue";

const allMode = ref(["loading", "gameOver-1", "gameOver-2", "gameOver-3", "reward-1"].map(x => ({
  label: x,
  value: x,
})))
const mode = ref(allMode.value[0].value)

function prev() {
  mode.value = allMode.value[(allMode.value.findIndex(x => x.value === mode.value) - 1 + allMode.value.length) % allMode.value.length].value;
}

function next() {
  mode.value = allMode.value[(allMode.value.findIndex(x => x.value == mode.value) + 1) % allMode.value.length].value;
}

const loadingProgress = ref(50);
const start = new Date().getTime();
setInterval(() => {
  loadingProgress.value = ((new Date().getTime() - start) / 1000) % 10 * 10;
}, 100)
const userInfo = ref(new UserInfo());
</script>

<template>
  <n-space justify="space-between">
    <n-button @click="prev">Prev</n-button>
    <n-select v-model:value="mode" :options="allMode"/>
    <n-button @click="next">Next</n-button>
  </n-space>
  <n-space vertical class="fixed w-full h-full">
    <div v-show="mode=='loading'">
      <LoadingDialog :user-info="userInfo"></LoadingDialog>
    </div>
    <div v-show="mode=='gameOver-1'">
      <GameOverDialog :ads-count=0 :diamond-count=0 :diamond=0 :user-diamond=0 :full=true :buff2=0 :buff1=0
                      :level-score=0 :min-level-score=0 :reward=0 score-detail="" :score=0>
      </GameOverDialog>
    </div>
    <div v-show="mode=='gameOver-2'">
      <GameOverDialog
          :ads-count=0
          :diamond-count=5
          :diamond=0
          :user-diamond=0
          :full=false
          :buff2=0
          :buff1=0
          :level-score=1000
          :min-level-score=1000
          :reward=3
          score-detail=""
          :score=2
      >
      </GameOverDialog>
    </div>
    <div v-show="mode=='gameOver-3'">
      <GameOverDialog
          :ads-count=0
          :diamond-count=5
          :diamond=0
          :user-diamond=0
          :full=false
          :buff2=0
          :buff1=0
          :level-score=3000
          :min-level-score=1000
          :reward=3
          score-detail=""
          :score=2000
      >
      </GameOverDialog>
    </div>
    <div v-show="mode=='reward-1'">
      <RewardDialog :reward=1></RewardDialog>
    </div>
  </n-space>
</template>

<style scoped>

</style>