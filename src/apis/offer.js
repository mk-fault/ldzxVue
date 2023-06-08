import httpInstance from "@/utils/http";

// 查询通知书API
export const getOfferAPI = (params = {}) => {
  return httpInstance({
    url: "offer/offers/",
    params,
  });
};

// 启用/禁用通知书API
export const changeOfferStatusAPI = ({id, is_using}) => {
    return httpInstance({
        url: `offer/offers/${id}/`,
        method: "patch",
        data: {
            is_using
        }
    });
}

// 预览通知书API
export const previewOfferAPI = (id = '') => {
    return httpInstance({
        url: "offer/preview/",
        responseType: "blob",
        params: {
            offer_id: id
        }
    });
}

// 修改通知书（修改内容）API
export const updateOfferContentAPI = (data) => {
    const {id} = data
    return httpInstance({
        url: `offer/offers/${id}/`,
        method: "patch",
        data
    })
}

// 修改通知书（上传图片）API
export const updateOfferImageAPI = (data) => {
    const {id, formData} = data
    return httpInstance({
        url: `offer/offers/${id}/`,
        method: "patch",
        data: formData
    })
}

