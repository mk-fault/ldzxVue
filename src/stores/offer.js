import { defineStore } from "pinia";
import { ref } from "vue";
import { getOfferAPI, changeOfferStatusAPI, previewOfferAPI, updateOfferAPI } from "@/apis/offer";

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
    let flag = false
    await changeOfferStatusAPI({ id, is_using }).then((res, e) => {
      console.log(res);
      if (res.status === 200) {
        flag = true
      } else {
        flag = false
      }
    });
    return flag
  };

  // 预览offer
  const previewOffer = async (id) => {
    let flag = false
    let data = null
    let eMsg = null
    await previewOfferAPI(id).then((res, e) => {
        console.log(res)
        if (res.status === 200) {
            flag = true
            data = res.data
        } else {
            flag = false
            eMsg = res.data
        }
    })
    return {flag, eMsg, data}
  }

  // 修改offer
  const updateOffer = async (data) => {
    let flag = false
    let eMsg = null
    await updateOfferAPI(data).then((res, e) => {
        console.log(res)
        if (res.status === 200) {
            flag = true
        } else {
            flag = false
            eMsg = res.data
        }
    })
    return {flag, eMsg}
  }

  return {
    offerInfo,
    getOfferInfo,
    changeOfferStatus,
    previewOffer,
    updateOffer
  };
});
