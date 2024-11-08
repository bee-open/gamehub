<!--suppress JSUnusedGlobalSymbols, NsUnresolvedStyleClassReference, JSUnusedLocalSymbols -->
<template>
  <div v-if="dev" class="fixed z-10 text-5xl flex gap-4 flex-wrap">
    <button class="bg-amber-700" @click="reload">Refresh</button>
    <div class="bg-blue-500">Score: {{ score }}</div>
  </div>
  <GameMain :game-url="gameUrl" :user-info="userInfo"></GameMain>
  <div v-show="popup" class="fixed z-1 inset-0 bg-black bg-opacity-50 flex justify-center items-center"
       @click="clickDialogBackground">
    <GameOverDialog
        v-show="popup==='gameOver'"
        :mode="mode"
        :score="score"
        :score-detail="scoreDetail"
        :reward="reward"
        :buff1="userInfo.nft_total_power_ratio"
        :buff2="userInfo.nft_avatar_power_ratio"
        :nft-hash-level-icon="userInfo.bonus"
        :nft-header="userInfo.avatar"
        :minLevelScore="minLevelScore"
        :levelScore="levelScore"
        :full="full"
        :diamond="diamond"
        :userDiamond="userDiamond"
        :diamond-count="diamondCount"
        :ads-count="adsCount"
        @adsRevive="adsRevive"
        @diamondRevive="diamondRevive"
        @closeDialog="closeDialogAndEnd"
    />
    <RewardDialog
        v-show="popup=='reward'"
        :reward="rewardGot"
        @closeDialog="closeDialog"
    />
  </div>
  <LoadingDialog ref="loadingDialog" v-if="loading" :user-info="userInfo"></LoadingDialog>
</template>

<script setup lang="ts">
import GameOverDialog from './GameOverDialog.vue'
import {computed, onMounted, ref} from 'vue'
import {BeeGameSDK, UserInfo} from './bee-game-sdk'
import * as Sentry from "@sentry/vue";
import RewardDialog from "@/RewardDialog.vue";
import {Fail, WaitingWhen, withAsyncBlock, withBlock} from "@/style";
import LoadingDialog from "@/LoadingDialog.vue";
import GameMain from "@/GameMain.vue";

const userInfo = ref(new UserInfo());
const score = ref(0);
const scoreDetail = ref("");
const popup = ref("");
const closeByDialogBackground = ["reward"];
const loading = ref(true);
const minLevelScore = ref(0);
const levelScore = ref(0);
const gameUrl = ref("");
const full = ref(false);
const diamond = ref(0);
const userDiamond = ref(1);
const diamondCount = ref(0);
const adsCount = ref(0);
const mode = ref(0);
const re = ref(false);
const reward = ref(0);
const rewardGot = ref(0);
const loadingDialog = ref<InstanceType<typeof LoadingDialog> | null>(null);

const reload = function () {
  window.location.reload();
}

const params = computed(() => {
  const ret = new Map<string, string>();
  if (window.location.search.length > 1) {
    window.location.search.substring(1).split("&").reduce((acc, pair) => {
      let [key, value] = pair.split("="); // 通过 "=" 分割键和值
      acc.set(key, value); // 在累加器对象上设置键和值
      return acc; // 返回累加器对象，用于下一次迭代
    }, ret);
    return ret;
  } else {
    return ret;
  }
});
const dev = computed(() => {
  return params.value.get("dev")
});
const adsRevive = async function () {
  const rsp = await BeeGameSDK.gameAdsRe();
  const ret = (await window.sdk_open_api.beeOpenReward(rsp.name));
  console.log("ads over", ret);
  if (ret.state == 1) {
    await BeeGameSDK.gameAdsReOver(rsp.name);
    closeDialogAndEnd(true);
  } else {
    // pass
  }
}

const diamondRevive = async function () {
  await BeeGameSDK.gameItemRe(async () => {
    userDiamond.value = 0;
    await window.sdk_open_api.openBuyMasonry();
    return false;
  });
  closeDialogAndEnd(true);
}

const clickDialogBackground = function () {
  if (closeByDialogBackground.includes(popup.value)) {
    popup.value = "";
  } else {
    // pass
  }
}

const closeDialog = function () {
  popup.value = "";
}

const closeDialogAndEnd = function (value = false) {
  re.value = value;
  if (value) {
    // 复活了继续
    closeDialog();
  } else {
    score.value = 0;
    BeeGameSDK.gameComplete().then(async () => {
      if (BeeGameSDK.userGameLogInfo.reward > 0) {
        rewardGot.value = BeeGameSDK.userGameLogInfo.reward;
        await showDialog("reward");
      } else {
        closeDialog();
      }
    });
  }
}

const showDialog = function (dialog: "reward" | "gameOver" | "adsLimit") {
  popup.value = dialog;
  return WaitingWhen(`show dialog [${dialog}]`, () => popup.value)
}

onMounted(async () => {
  let processExpire = 0;
  window.BeeGameSDK = BeeGameSDK;
  BeeGameSDK.regShowProgress(value => {
    loadingDialog.value!.exLoadingProgress = value;
    if (value < 100) {
      if (Date.now() < processExpire) {
        return;
      }
      processExpire = Date.now() + 1000;
    }
    console.log("show progress", value);
  });
  const gameId = params.value.get("game");
  withBlock(window.tracker, (tracker) => {
    tracker.setMetadata("game", gameId || "#nogame#");
  });
  if (!gameId) {
    Fail("no gameId");
  }
  loadingDialog.value!.preload(params.value.get("gameUrl") || `./${gameId}/index.html`).then(url => {
    gameUrl.value = url;
  });
  userInfo.value = await BeeGameSDK.getUserInfo();
  {
    Sentry.setUser({id: userInfo.value.open_id, username: userInfo.value.open_id});
    Sentry.setContext(`play`, {
      "game": gameId,
      "start": new Date(),
    });
    Sentry.setTag("game", gameId);
  }
  await BeeGameSDK.init(gameId, userInfo.value);
  BeeGameSDK.regGameReadyCallback(async () => {
    console.log("game ready");
    await BeeGameSDK.gameStart();
    loading.value = false;
    BeeGameSDK.playCallback();
    Sentry.setContext(`play`, {
      "ready": new Date(),
    });
  });
  BeeGameSDK.regScoreCallback(x => {
    x.scoreEx = Math.floor((userInfo.value.nft_avatar_power_ratio) * x.score / 100.0);
    score.value = x.score + x.scoreEx;
    scoreDetail.value = `${x.score} + ${x.scoreEx}`;
  });
  BeeGameSDK.regFinishGameCallback(async (_score) => {
    return await withAsyncBlock("finishGame", async () => {
      const scoreEx = Math.floor((userInfo.value.nft_avatar_power_ratio) * _score / 100.0);
      console.log("scoreEx", scoreEx);
      score.value = _score + scoreEx;
      scoreDetail.value = `${_score} + ${scoreEx}`;
      await BeeGameSDK.gameOver(_score + scoreEx);
      const scoreRange = Object.keys(BeeGameSDK.gameNode.rewardRange).map(x => parseInt(x)).sort((a, b) => a - b);
      minLevelScore.value = scoreRange[0];
      const tmp = scoreRange.filter(x => x > BeeGameSDK.userGameLogInfo.score)
      if (tmp.length) {
        full.value = false;
        levelScore.value = tmp[0];
      } else {
        full.value = true;
        levelScore.value = scoreRange.reverse()[0];
      }
      if (tmp.length == BeeGameSDK.gameNode.rewardRange.size) {
        mode.value = 1;
      }
      adsCount.value = BeeGameSDK.gameNode.maxAdRevives - BeeGameSDK.userGameLogInfo.ads_log.length;
      diamondCount.value = BeeGameSDK.gameNode.maxDiamondRevives - BeeGameSDK.userGameLogInfo.re_log.length;
      diamond.value = 1;
      reward.value = BeeGameSDK.userGameLogInfo.reward;
      {
        Sentry.setContext(`play`, {
          "over": new Date(),
          "score": _score + scoreEx,
          "scoreEx": scoreEx,
        });
      }
      await showDialog('gameOver');
      if (re.value) {
        return true;
      } else {
        // patch: 确保0分的情况被调用
        BeeGameSDK.scoreCallback({score: 0, scoreEx: 0});
        await BeeGameSDK.gameStart();
        return false;
      }
    })
  });
});

</script>

<style scoped>

</style>
