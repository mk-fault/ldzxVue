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
  <div class="container">
    <h1>
      {{ offerStore.offerStudentName }}同学，恭喜你被我校录取！请点击按钮下载电子录取通知书
    </h1>
    <a :href="url" download>
      <el-button type="info">点我下载通知书</el-button>
    </a>
  </div>
</template>

<style scoped lang="scss">
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}
</style>
