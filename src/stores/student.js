import { defineStore } from "pinia";
import { ref } from "vue";
import { loginAPI, resetAPI } from "@/apis/teacher";
import { getStudentAPI, updateStudentAPI } from '@/apis/student'

import { ElMessage } from 'element-plus'
import 'element-plus/theme-chalk/el-message.css'

export const useStudentStore = defineStore('student', () => {
  // state
  const studentInfo = ref({})

  // action
  // 获取学生信息
  const getStudentInfo = async (parama={}) => {
    await getStudentAPI(parama).then((res,e) => {
      if (res.status === 200) {
        studentInfo.value = res.data
      } else {
        studentInfo.value = {}
      }
    })
  }
  // 修改学生信息
  const updateStudent = async (data) => {
    let flag = false
    let eMsg = null
    await updateStudentAPI(data).then((res,e) => {
        console.log(res)
        if (res.status === 200) {
            flag = true
        } else {
            eMsg = res.data
            // ElMessageBox.alert(res.data, '提示')
            flag = false
        }
    })
    return {flag, eMsg}
  }

  // return
  return {
    studentInfo,
    getStudentInfo,
    updateStudent
  }
})