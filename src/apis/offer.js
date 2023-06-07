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

