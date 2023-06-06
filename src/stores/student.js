import { defineStore } from "pinia";
import { ref } from "vue";
import { loginAPI, resetAPI } from "@/apis/teacher";
import {
  getStudentAPI,
  updateStudentAPI,
  deleteStudentAPI,
} from "@/apis/student";

import { ElMessage } from "element-plus";
import "element-plus/theme-chalk/el-message.css";

export const useStudentStore = defineStore("student", () => {
  // state
  const studentInfo = ref({});

  // action
  // 获取学生信息
  const getStudentInfo = async (parama = {}) => {
    await getStudentAPI(parama).then((res, e) => {
      if (res.status === 200) {
        studentInfo.value = res.data;
      } else {
        studentInfo.value = {};
      }
    });
  };
  // 修改学生信息
  const updateStudent = async (data) => {
    let flag = false;
    let eMsg = null;
    await updateStudentAPI(data).then((res, e) => {
      if (res.status === 200) {
        flag = true;
      } else {
        eMsg = res.data;
        flag = false;
      }
    });
    return { flag, eMsg };
  };
  // 删除学生信息
  const deleteStudent = async (id) => {
    let flag = false;
    await deleteStudentAPI(id).then((res, e) => {
        console.log(res)
        console.log(res.status)
      if (res.status === 204) {
        flag = true;
      } else {
        flag = false;
      }
    });
    console.log(flag)
    return flag;
  };

  // return
  return {
    studentInfo,
    getStudentInfo,
    updateStudent,
    deleteStudent
  };
});
