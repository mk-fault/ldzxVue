import { defineStore } from "pinia";
import { ref } from "vue";
import { loginAPI, resetAPI } from "@/apis/teacher";
import { ElMessage } from 'element-plus'
import 'element-plus/theme-chalk/el-message.css'

export const useUserStore = defineStore('user', () => {
  // state
  const userInfo = ref({})

  // action
  // 获取用户信息(登录)
  const getUserInfo = async ({ username, password }) => {
    await loginAPI({ username, password }).then((res,e) => {
      console.log(res)
      if (res.status === 200) {
        userInfo.value = res.data
      } else {
        userInfo.value = {}
      }
    })
  }
  // 退出删除用户信息
  const clearUserInfo = () => {
    userInfo.value = {}
  }
  // 修改密码（用户）
  const resetPassword = async ({ id, username, password }) => {
    await resetAPI({ id, username, password }).then((res,e) => {
      console.log(res)
      if (res.status === 200) {
        userInfo.value = {}
      } else {
        ElMessage.error(res.data.non_field_errors[0]);
      }
    })
  }

  // return
  return {
    userInfo,
    getUserInfo,
    clearUserInfo,
    resetPassword
  }
},{
  // 持久化
  persist: true
})