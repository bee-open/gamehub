import './assets/main.css'
import './index.css'
import {createApp} from "vue";
import Sample from "@/sample.vue";

const app = createApp(Sample);
app.mount("#app");