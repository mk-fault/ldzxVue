<script setup>
import { useOfferStore } from "@/stores/offer";

const offerStore = useOfferStore();
const offerPath = offerStore.offerPath;
const ori_url = "http://127.0.0.1:8000";
const url = computed(() => {
  return ori_url + offerPath;
});
</script>

<template>
  <h1>我是通知书界面</h1>
  <h2>{{ url }}</h2>
  <a :href="url" download>
    <el-button>点我下载通知书</el-button>
  </a>
</template>

<style scoped lang="scss"></style>
