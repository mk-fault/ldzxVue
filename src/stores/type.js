import { defineStore } from "pinia";
import { ref } from "vue";
import { getTypeAPI } from "@/apis/type";

export const useTypeStore = defineStore("type", () => {
    // state
    const typeList = ref([]);

    // action
    // 获取类别信息
    const getTypeInfo = async () => {
        await getTypeAPI().then((res, e) => {
            if (res.status === 200) {
                typeList.value = res.data.results;
            } else {
                typeList.value = [];
            }
        });
    }

    return {
        typeList,
        getTypeInfo
    }
})