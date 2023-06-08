import { defineStore } from "pinia";
import { ref } from "vue";
import {
  getOfferAPI,
  changeOfferStatusAPI,
  previewOfferAPI,
  updateOfferContentAPI,
  updateOfferImageAPI,
  deleteOfferAPI,
  addOfferAPI
} from "@/apis/offer";

export const useOfferStore = defineStore("offer", () => {
  // state
  const offerInfo = ref({});

  // action
  // 获取offer信息
  const getOfferInfo = async (params = {}) => {
    await getOfferAPI(params).then((res, e) => {
      console.log(res);
      if (res.status === 200) {
        offerInfo.value = res.data;
      } else {
        offerInfo.value = {};
      }
    });
  };

  // 启用/禁用offer
  const changeOfferStatus = async ({ id, is_using }) => {
    let flag = false;
    await changeOfferStatusAPI({ id, is_using }).then((res, e) => {
      console.log(res);
      if (res.status === 200) {
        flag = true;
      } else {
        flag = false;
      }
    });
    return flag;
  };

  // 预览offer
  const previewOffer = async (id) => {
    let flag = false;
    let data = null;
    let eMsg = null;
    await previewOfferAPI(id).then((res, e) => {
      console.log(res);
      if (res.status === 200) {
        flag = true;
        data = res.data;
      } else if (res.status === 405) {
        flag = false;
        eMsg = "通知书内容错误,请按照要求进行设置";
      } else {
        flag = false;
        eMsg = "通知书不存在，请刷新后重试";
      }
    });
    return { flag, eMsg, data };
  };

  // 修改offer内容
  const updateOfferContent = async (data) => {
    let flag = false;
    let eMsg = null;
    await updateOfferContentAPI(data).then((res, e) => {
      if (res.status === 200) {
        flag = true;
      } else {
        flag = false;
        eMsg = res.data;
      }
    });
    return { flag, eMsg };
  };

  // 修改offer背景图片
  const updateOfferImage = async (data) => {
    let flag = false;
    let eMsg = null;
    await updateOfferImageAPI(data).then((res, e) => {
      console.log(res);
      if (res.status === 200) {
        flag = true;
      } else {
        flag = false;
        eMsg = res.data;
      }
    });
    return { flag, eMsg };
  };

  // 删除offer
  const deleteOffer = async (id) => {
    let flag = false;
    await deleteOfferAPI(id).then((res, e) => {
      console.log(res);
      if (res.status === 204) {
        flag = true;
      } else {
        flag = false;
      }
    });
    return flag;
  };

  //添加offer
  const addOffer = async (data) => {
    let flag = false;
    let eMsg = null;
    await addOfferAPI(data).then((res, e) => {
      console.log(res);
      if (res.status === 201) {
        flag = true;
      } else {
        flag = false;
        eMsg = res.data;
      }
    });
    return { flag, eMsg };
  }

  return {
    offerInfo,
    getOfferInfo,
    changeOfferStatus,
    previewOffer,
    updateOfferImage,
    updateOfferContent,
    deleteOffer,
    addOffer
  };
});
