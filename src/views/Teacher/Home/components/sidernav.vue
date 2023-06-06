<template>
  <div class="sidebar">
    <el-menu
      class="sidebar-el-menu"
      :default-active="onRoutes"
      background-color="#324157"
      text-color="#bfcbd9"
      active-text-color="#20a0ff"
      router
    >
      <template v-for="item in items" :key="item.index">
        <el-menu-item :index="item.index">
          <i class="iconfont" :class="item.icon" style="margin-right: 10px"></i>
          <template #title>
            <span style="font-size: 15px;">{{ item.title }}</span>
          </template>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useUserStore } from "@/stores/user";

const user_items = [
  {
    index: "/teacher/studentmanage",
    title: "学生信息管理",
    icon: "icon-xuesheng",
  },
  {
    index: "/teacher/offermanage",
    title: "录取通知书管理",
    icon: "icon-zhengshu",
  },
];

const admin_items = [
  {
    index: "/teacher/studentmanage",
    title: "学生信息管理",
    icon: "icon-xuesheng",
  },
  {
    index: "/teacher/offermanage",
    title: "录取通知书管理",
    icon: "icon-zhengshu",
  },
  {
    index: "/teacher/teachermanage",
    title: "教师管理",
    icon: "icon-jiaoshi",
  },
];

const route = useRoute();
const onRoutes = computed(() => {
  return route.path;
});

const userStore = useUserStore();
const items = computed(() => {
  return userStore.userInfo.is_admin ? admin_items : user_items;
});
</script>

<style scoped>
.sidebar {
  display: block;
  position: absolute;
  left: 0;
  top: 70px;
  bottom: 0;
  overflow-y: scroll;
}
.sidebar::-webkit-scrollbar {
  width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
  width: 250px;
}
.sidebar > ul {
  height: 100%;
}
</style>
