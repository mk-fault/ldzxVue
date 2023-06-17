import httpInstance from "@/utils/http";
import axios from "axios";

// 获取学生信息API
export const getStudentAPI = (params = {}) => {
  return httpInstance({
    url: "student/students/",
    params,
  });
};

// 修改学生信息API
export const updateStudentAPI = ({
  id,
  student_id,
  name,
  sex,
  class_num,
  admission_date,
}) => {
  return httpInstance({
    url: `student/students/${id}/`,
    method: "PUT",
    data: {
      id,
      student_id,
      name,
      sex,
      class_num,
      admission_date,
    },
  });
};

// 删除学生API
export const deleteStudentAPI = (id) => {
  return httpInstance({
    url: `student/students/${id}/`,
    method: "DELETE",
  });
};

// 批量删除学生API
export const multiDeleteStudentAPI = (delete_list) => {
    return httpInstance({
        url: 'student/multi_delete/',
        method: 'POST',
        data: {
            delete_list: delete_list
        }
    })
}

// 新增一个学生API
export const addStudentAPI = (data) => {
    return httpInstance({
        url: 'student/students/',
        method: 'POST',
        data
    })
}

// 批量新增学生API
export const uploadExcelAPI = (formData) => {
    return httpInstance({
        url: 'student/multi_create/',
        method: 'POST',
        data: formData
    })
}

// 获取批量添加学生模板API
export const getStudentTemplateAPI = () => {
    return axios({
        url: 'http://127.0.0.1:80/media/student/template.xlsx',
        method: 'GET',
        responseType: 'blob'
    })
}
