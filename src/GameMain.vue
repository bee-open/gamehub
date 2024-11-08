<script setup lang="ts">
import type {UserInfo} from "@/bee-game-sdk";
import img_back from '@/assets/main/back.png';
import avatar_gold from '@/assets/main/head/avatar_gold.png';
import gold from '@/assets/main/head/gold.png';
import masonry from '@/assets/main/head/masonry.png';
import quality from '@/assets/popups/quality_1.png';
import {onMounted} from "vue";

interface GameMainProps {
  gameUrl: string;
  userInfo: UserInfo;
}

function back() {

}

defineProps<GameMainProps>()

onMounted(() => {

});

function init() {
}

defineExpose({
  init
})

</script>

<template>
  <div class="main flex flex-col">
    <div class="head">
      <img alt="" :src=img_back @click="back"
           :style='{height: "calc(.4 * var(--local-rem))", marginRight: "calc(.2 * var(--local-rem))"}'/>
      <div class="head_left">
        <div :style='{backgroundImage: userInfo.avatar}' class="avatar_image">
        </div>
        <div class="head_left_gold_box">
          <div>
            <img :src=avatar_gold
                 :style='{ width: "calc(.4 * var(--local-rem))", height: "calc(.4 * var(--local-rem))", marginRight: "calc(.1 * var(--local-rem))" }'
                 alt=""/>
            <img :src=gold :style='{ width: "calc(.4 * var(--local-rem))", height: "calc(.4 * var(--local-rem))" }'
                 alt=""/>
          </div>
          <div class=avatar_image_text>+{{ userInfo.nft_avatar_power_ratio }}%</div>
        </div>
      </div>
      <div class=head_middle :style='{height: "100%"}'>
        <img :src=quality alt=""/>
        <div class=head_middle_image_text>
          <img :src=gold :style='{ width: "calc(.4 * var(--local-rem))", height: "calc(.4 * var(--local-rem))" }'
               alt=""/>
          <div>+{{ userInfo.nft_total_power_ratio || 0 }}%</div>
        </div>
      </div>
      <div class=head_middle_right_input>
        <img :src=gold :style='{ width: "calc(.4 * var(--local-rem))" }' alt=""/>
        0
      </div>
      <div class=head_middle_right_input>
        <img :src=masonry :style='{ width: "calc(.4 * var(--local-rem))" }' alt=""/>
        0
      </div>
    </div>
    <iframe class="flex-grow border-none" allow="clipboard-write"
            :src="gameUrl">
    </iframe>
  </div>
</template>

<style scoped>
.main {
  --local-rem: 53px;
}

.main {
  top: 0;
  position: absolute;
  height: 100%;
  width: 100dvw;
  background-color: #4f4444;
  padding-top: calc(0.134 * var(--local-rem))
}

.main .back {
  box-sizing: border-box;
}

.head {
  height: calc(1 * var(--local-rem));
  background-color: var(--primary-color);
  display: flex;
  align-items: center;
  box-sizing: border-box;
  padding: calc(.1 * var(--local-rem)) calc(.2 * var(--local-rem))
}

.head .avatar_image {
  box-sizing: border-box;
  border: 1px solid var(--popups-head-avatar-image-border-color);
  border-radius: .1rem;
  flex-shrink: 0;
  height: calc(.8 * var(--local-rem));
  width: calc(.8 * var(--local-rem));
  background-size: cover;
  position: relative
}

.head .head_left {
  width: 28%;
  display: flex;
  background-color: var(--popups-avatar-btn-background-color);
  border-radius: calc(.1 * var(--local-rem))
}

.head .head_left .avatar_image {
  margin-right: calc(.1 * var(--local-rem))
}

.head .head_left .head_left_gold_box {
  display: flex;
  flex-wrap: wrap
}

.head .head_left .head_left_gold_box div {
  width: 100%;
  display: flex;
  justify-content: center
}

.head .head_left .avatar_image_text {
  width: 100%;
  display: flex;
  justify-content: center;
  color: var(--popups-avatar-power-text-color)
}

.head .head_middle {
  height: 100%;
  width: 23%;
  display: flex;
  background-color: var(--popups-avatar-btn-background-color);
  margin-left: calc(.05 * var(--local-rem));
  border-radius: calc(.1 * var(--local-rem));
}

.head .head_middle .head_middle_image_text {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center
}

.head .head_middle .head_middle_image_text div {
  width: 100%;
  text-align: center;
  color: var(--popups-avatar-power-text-color)
}

.head .head_middle_right_input {
  display: flex;
  background-color: var(--popups-avatar-btn-background-color);
  margin-left: calc(.05 * var(--local-rem));
  box-sizing: border-box;
  padding: calc(.1 * var(--local-rem));
  border-radius: calc(.1 * var(--local-rem));
  width: calc(1.5 * var(--local-rem));
  align-items: center
}

.head .head_middle_right_input img {
  margin-right: calc(.05 * var(--local-rem))
}
</style>