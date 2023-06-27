import httpInstance from "@/utils/http";

// 获取类别信息API
export const getTypeAPI = (params = {}) => {
    return httpInstance({
      url: "student/types/",
      params,
    });
  };