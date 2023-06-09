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

// 获取教师信息API
export const getTeacherAPI = () => {
    return httpInstance({
        url: "teacher/teachers/",
    });
}

// 添加教师API
export const addTeacherAPI = (data) => {
    return httpInstance({
        url: "teacher/teachers/",
        method: "post",
        data
    })
}

// 重置教师密码API
export const adminResetAPI = (id) => {
    return httpInstance({
        url: `teacher/teachers/${id}/`,
        method: "patch",
    })
}

// 删除教师API
export const deleteTeacherAPI = (id) => {
    return httpInstance({
        url: `teacher/teachers/${id}/`,
        method: "delete",
    })
}

// 失活教师
export const deactiveTeacherAPI = (id) => {
    return httpInstance({
        url: "teacher/deactive/",
        method: "post",
        data: {
            id:id
        }
    })
}

// 激活教师
export const reactiveTeacherAPI = (id) => {
    return httpInstance({
        url: "teacher/reactive/",
        method: "post",
        data: {
            id:id
        }
    })
}