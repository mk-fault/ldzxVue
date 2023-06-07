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

// 新增一个学生API
export const addStudentAPI = (data) => {
    return httpInstance({
        url: 'student/students/',
        method: 'POST',
        data
    })
}