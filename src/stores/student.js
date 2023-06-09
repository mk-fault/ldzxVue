import { defineStore } from "pinia";
import { ref } from "vue";
import {
  getStudentAPI,
  updateStudentAPI,
  deleteStudentAPI,
  addStudentAPI,
  uploadExcelAPI
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
        const results = studentInfo.value.results.map((item) => {
            if (item.sex === '0') {
              return { ...item, sex: "女" };
            } else if (item.sex === '1') {
              return { ...item, sex: "男" };
            } else {
              return item;
            }
          });
        studentInfo.value.results = results;
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
      if (res.status === 204) {
        flag = true;
      } else {
        flag = false;
      }
    });
    return flag;
  };
  // 新增一个学生
  const addStudent = async (data) => {
    let flag = false;
    let eMsg = null;
    await addStudentAPI(data).then((res, e) => {
      if (res.status === 201) {
        flag = true;
      } else {
        eMsg = res.data;
        flag = false;
      }
    });
    return { flag, eMsg };
  }
  // 批量新增学生
  const uploadExcel = async (formData) => {
    let flag = false;
    let eMsg = null;
    await uploadExcelAPI(formData).then((res, e) => {
      if (res.status === 201) {
        flag = true;
      } else {
        eMsg = res.data;
        flag = false;
      }
    });
    return { flag, eMsg };
  }

  // return
  return {
    studentInfo,
    getStudentInfo,
    updateStudent,
    deleteStudent,
    addStudent,
    uploadExcel
  };
});
