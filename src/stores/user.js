import { defineStore } from "pinia";
import { ref } from "vue";
import { loginAPI } from "@/apis/login";

export const useUserStore = defineStore('user', () => {
  // state
  const userInfo = ref({})
  // action
  // 获取用户信息
  const getUserInfo = async ({ username, password }) => {
    const res = await loginAPI({ username, password })
    userInfo.value = res
  }
  // 退出删除用户信息
  const clearUserInfo = () => {
    userInfo.value = {}
  }
  // return
  return {
    userInfo,
    getUserInfo,
    clearUserInfo
  }
},{
  // 持久化
  persist: true
})