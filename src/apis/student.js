import httpInstance from "@/utils/http";

// 获取学生信息API
export const getStudentAPI = (params = {}) => {
    return httpInstance({
      url: "student/students/",
      params
    })
  }