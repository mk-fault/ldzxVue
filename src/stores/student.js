import { defineStore } from "pinia";
import { ref } from "vue";
import { loginAPI, resetAPI } from "@/apis/teacher";
import { getStudentAPI } from '@/apis/student'

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

  // return
  return {
    studentInfo,
    getStudentInfo,
  }
})