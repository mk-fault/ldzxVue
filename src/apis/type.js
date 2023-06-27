import httpInstance from "@/utils/http";

// 获取类别信息API
export const getTypeAPI = () => {
    return httpInstance({
        url: "student/types/",
    });
}