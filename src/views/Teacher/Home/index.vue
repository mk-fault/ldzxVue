<script setup>
import HomeHeader from './components/header.vue';
import { useUserStore } from '@/stores/user';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus'
import 'element-plus/theme-chalk/el-message.css'

const userStore = useUserStore();
const router = useRouter();
const dialogFormVisible = ref(userStore.userInfo.is_simple);

if (Object.keys(userStore.userInfo).length === 0) {
  router.replace('/teacher/login')
}
</script>

<template>
  <HomeHeader />
    <!-- 提示密码过于简单 -->
  <el-dialog v-model="dialogFormVisible" title="警告">
    <span>您的密码过于简单，请及时修改密码</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">

</style>