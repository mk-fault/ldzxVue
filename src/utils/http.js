// axios基础的封装
import axios from "axios";
import { ElMessage } from 'element-plus'
import 'element-plus/theme-chalk/el-message.css'
// import { useUserStore } from "@/stores/user";
import router from "@/router";

const httpInstance = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  timeout: 5000,
});

// axios请求拦截器
httpInstance.interceptors.request.use(
  (config) => {
    // 从pinia中获取token
    // const userStore = useUserStore();
    // // 拼接token
    // const token = userStore.userInfo.token
    // if (token) {
    // config.headers.Authorization = `Bearer ${token}`
    // }
    return config;
  },
  (e) => Promise.reject(e)
);

// axios响应拦截器
httpInstance.interceptors.response.use(
  (res) => res.data,
  (e) => {
    // 统一错误提示
    ElMessage.error(e.response.data.msg);
    // 401错误处理
    // const userStore = useUserStore();
    // if (e.response.status === 401) {
    //   userStore.clearUserInfo()
    //   router.push('/login')
    // }

    return Promise.reject(e);
  }
);

export default httpInstance;
