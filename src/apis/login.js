import httpInstance from "@/utils/http";
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