import httpInstance from "@/utils/http";

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

