import { defineStore } from "pinia";
import { ref } from "vue";
import { loginAPI, resetAPI,getTeacherAPI, deactiveTeacherAPI, reactiveTeacherAPI, deleteTeacherAPI, addTeacherAPI } from "@/apis/teacher";
import { ElMessage } from 'element-plus'
import 'element-plus/theme-chalk/el-message.css'

export const useUserStore = defineStore('user', () => {
  // state
  const userInfo = ref({})
  const teacherInfo = ref({})

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
    let flag = false
    let eMsg = null
    await resetAPI({ id, username, password }).then((res,e) => {
      if (res.status === 200) {
        userInfo.value = {}
        flag = true
      } else {
        flag = false 
        eMsg = res.data.non_field_errors[0]
      }
    })
    return { flag, eMsg }
  }
  // 获取教师信息
  const getTeacherInfo = async() => {
    await getTeacherAPI().then((res,e) => {
        if (res.status === 200) {
            teacherInfo.value = res.data
        } else {
            teacherInfo.value = {}
        }
    })
  }
  // 新增教师
  const addTeacher = async(data) => {
    let flag = false
    let eMsg = null
    await addTeacherAPI(data).then((res,e) => {
        if (res.status === 201) {
            flag = true
        } else {
            console.log(res)
            flag = false
            eMsg = res.data.username[0]
        }
    })
    return {flag, eMsg}
  }
  // 失活教师
    const deactiveTeacher = async(id) => {
        let flag = false
        let eMsg = null
        await deactiveTeacherAPI(id).then((res,e) => {
            if (res.status === 200) {
                flag = true
            } else {
                flag = false 
                eMsg = res.data.msg
            }
        })
        return { flag, eMsg }
    }
    // 激活教师
    const reactiveTeacher = async(id) => {
        let flag = false
        let eMsg = null
        await reactiveTeacherAPI(id).then((res,e) => {
            if (res.status === 200) {
                flag = true
            } else {
                flag = false 
                eMsg = res.data.msg
            }
        })
        return { flag, eMsg }
    }
    // 删除教师
    const deleteTeacher = async(id) => {
        let flag = false
        await deleteTeacherAPI(id).then((res,e) => {
            console.log(res)
            if (res.status === 204) {
                flag = true
            } else {
                flag = false 
            }
        })
        console.log(flag)
        return flag
    }

  // return
  return {
    userInfo,
    teacherInfo,
    getUserInfo,
    clearUserInfo,
    resetPassword,
    getTeacherInfo,
    deactiveTeacher,
    reactiveTeacher,
    deleteTeacher,
    addTeacher
  }
},{
  // 持久化
  persist: true
})