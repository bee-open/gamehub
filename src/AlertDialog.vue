<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
  name: "AlertDialog"
})
</script>
<script setup lang="ts">
const emit = defineEmits(['closeDialog']);
defineProps({
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  }
});
const closeDialog = function () {
  emit('closeDialog');
}
</script>

<template>
  <div class="bg-white py-20 px-16 rounded-3xl" style="width: 55rem;min-height:25rem;" @click="closeDialog">
    <div class="text-center">
      <n-text class="text-5xl text1">
        {{ title }}
      </n-text>
    </div>
    <div class="pt-12">
      <n-text class="text2">
        {{ message }}
      </n-text>
    </div>
  </div>
</template>

<style scoped>
.text1 {
  font-size: 3rem;
  line-height: 3rem;
  font-weight: 800;
}

.text2 {
  font-size: 2rem;
  line-height: 3rem;
}
</style>