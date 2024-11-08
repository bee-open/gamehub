<script setup lang="ts">
import {NConfigProvider, NText} from "naive-ui";

const emit = defineEmits(['closeDialog']);

const closeDialog = function () {
  emit('closeDialog');
}
</script>
<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
  name: "RewardDialog",
  props: {
    reward: {
      type: Number,
      required: true,
    }
  }
});
</script>

<template>
  <n-config-provider :theme-overrides="{ common: { } }">
    <div class="flex flex-col items-center" style="width: 41rem;">
      <div class="bg items-center justify-center flex relative">
        <n-text style="font-size: 2.76rem;color: #DB6329;font-weight: 900;top:1rem;" class="relative">
          Congratulations
        </n-text>
      </div>
      <div class="bg1 items-center justify-center flex relative" style="top:-3rem">
        <img style="width: 65%;" src="./assets/dlg/asset012.png" alt="">
      </div>
      <div class="relative" style="top:-6rem;">
        <n-text style="--n-text-color:#FFC04D;font-size: 5rem;">{{ reward }}</n-text>
      </div>
      <div style="width: 47rem;height:7rem;background-color: #999999;top:-6rem"
           class="flex justify-center items-center rounded-2xl relative"
           @click="closeDialog"
      >
        <n-text style="--n-text-color:#FFC04D;" class="text-2xl">
          Contains NFT additional bonus.
        </n-text>
      </div>
    </div>
  </n-config-provider>
</template>

<style scoped>
.bg {
  background-image: url(./assets/dlg/asset011.png);
  background-size: 41rem 10rem;
  background-repeat: no-repeat;
  width: 41rem;
  height: 10rem;
}


.bg1 {
  background-image: url(./assets/dlg/asset013.png);
  background-size: 27rem 27rem;
  background-repeat: no-repeat;
  width: 27rem;
  height: 27rem;
  padding: 5rem 2rem 4rem 2rem;
}

</style>