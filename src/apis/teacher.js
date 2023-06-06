import httpInstance from "@/utils/http";
// 登录API
export const loginAPI = ({username, password}) => {
  return httpInstance({
    url: "teacher/login/",
    method: "post",
    data:{
        username,
        password
    }
  })
}

// 修改密码API
export const resetAPI = ({id, username, password}) => {
  return httpInstance({
    url: `teacher/teachers/${id}/`,
    method: "put",
    data:{
        username,
        password
    }
  })
}