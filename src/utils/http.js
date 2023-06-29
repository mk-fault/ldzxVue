// axios基础的封装
import axios from "axios";
import { ElMessage } from "element-plus";
import "element-plus/theme-chalk/el-message.css";
import { useUserStore } from "@/stores/user";
import router from "@/router";

const httpInstance = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  //   baseURL: "http://192.168.58.6:8000/api",

  timeout: 5000,
});

// axios请求拦截器
httpInstance.interceptors.request.use(
  (config) => {
    // 从pinia中获取token
    const userStore = useUserStore();
    // 拼接token
    const token = userStore.userInfo.access;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (e) => Promise.reject(e)
);

// axios响应拦截器
httpInstance.interceptors.response.use(
  (res) => res,
  (e) => {
    // 统一错误提示
    // ElMessage.error(e.response.data.msg);
    // 401错误处理
    if (e.response.status === 401) {
      // 清除token
      const userStore = useUserStore();
      userStore.clearUserInfo();
      ElMessage.error("登录已过期，请重新登录");
      router.push("/teacher/login");
    }
    // return Promise.reject(e);
    return e.response;
  }
);

export default httpInstance;
