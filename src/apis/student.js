import httpInstance from "@/utils/http";

// 获取学生信息API
export const getStudentAPI = (params = {}) => {
    return httpInstance({
      url: "student/students/",
      params
    })
  }

// 修改学生信息API
export const updateStudentAPI = ({id,student_id,name,sex,class_num,admission_date}) => {
    return httpInstance({
      url: `student/students/${id}/`,
      method: "PUT",
      data: {
        id,
        student_id,
        name,
        sex,
        class_num,
        admission_date
      }
    })
  }