<script setup lang="ts">
import {NProgress} from "naive-ui";
import moment from "moment";
import {UserInfo} from "@/bee-game-sdk";
import {computed, ref} from "vue";
import {GetText, WaitingWhen} from "@/style";


interface LoadingDialogProps {
  userInfo: UserInfo
}

const progress = computed(() => {
  return loadingProgress.value * 0.9 + exLoadingProgress.value * 0.1;
});

const loadingProgress = ref(0);
const exLoadingProgress = ref(0);
const props = defineProps<LoadingDialogProps>()

function preload(raw: string): Promise<string> {
  let baseUrl = raw;
  if (!raw.endsWith("/")) {
    baseUrl = baseUrl.substring(0, baseUrl.lastIndexOf("/") + 1);
  }
  const start = Date.now();
  console.log("preload start", baseUrl);
  loadingProgress.value = 0;
  exLoadingProgress.value = 0;
  const group = new Array<Promise<void>>();
  const detail = new Map<string, {
    total: number,
    loaded: number,
  }>();
  let total = 0;

  function current() {
    let tmp = 0;
    for (let [url, data] of detail.entries()) {
      tmp += data.loaded;
    }
    return tmp;
  }

  const ts = moment().format('YYYY-MM-DD_HH:mm');
  return new Promise((resolve) => {
    GetText(`${baseUrl}files.lst?${ts}`).then(async text => {
      for (const line of text.split("\n")) {
        if (line.trim().length == 0) {
          continue;
        }
        const tmp = /^(?<url>[^ ]+)\s+(?<size>\d+)$/.exec(line);
        if (!tmp || !tmp.groups) {
          console.warn("not valid files line", line);
          continue;
        }
        let url = `${baseUrl}${tmp.groups["url"]}`;
        let size = parseInt(tmp.groups["size"]);
        url = url.replace(".//", "");
        url = url.replace("./", "");
        detail.set(url, {
          total: size,
          loaded: 0,
        });
        total += size;
        group.push(new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open("GET", url, true);
          xhr.addEventListener('progress', e => {
            if (e.lengthComputable) {
              detail.get(url)!.loaded = e.loaded;
              loadingProgress.value = current() * 100 / total;
            }
          });
          xhr.addEventListener('load', () => {
            const data = detail.get(url)!;
            data.loaded = data.total;
            console.debug("load over", url);
            resolve();
          });
          xhr.addEventListener('abort', reject);
          xhr.addEventListener('error', reject);
          xhr.send();
        }));
      }
      await Promise.allSettled(group);
      loadingProgress.value = 100;
      await WaitingWhen("waiting userinfo ready", () => props.userInfo.open_id === "");
    }).catch(e => {
      console.warn("preload error", e);
    }).finally(() => {
      console.log("preload finally", baseUrl, Date.now() - start);
      resolve(baseUrl);
    });
  });
}

defineExpose({
  preload,
  exLoadingProgress,
})
</script>

<template>
  <div class="fixed w-full h-full loading-bg flex flex-col items-center">
    <div style="height: 8rem;"></div>
    <img src="./assets/dlg/asset014.png" alt="bg" style="width: 50rem"/>
    <div style="height: 5rem;"></div>
    <n-progress
        type="line"
        color="#FFC04D"
        border-radius="1rem"
        :show-indicator="false"
        status="success"
        :percentage="progress"
        style="--n-rail-color:#F99D001A;--n-rail-height:1rem;width: 38rem;height:2rem;"/>
  </div>
</template>

<style scoped>
.loading-bg {
  background: radial-gradient(0% 0% at 0% 0%, #FFFEF9 0%, #FFFBCB 100%);
}
</style>