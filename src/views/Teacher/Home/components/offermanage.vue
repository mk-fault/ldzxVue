<script setup>
import { useOfferStore } from "@/stores/offer";
import { ElMessage } from "element-plus";
import { ref, onMounted } from "vue";

const offerStore = useOfferStore();

// 加载通知书信息
const tableData = ref([]);
const loading = ref({});
onMounted(async () => {
  await offerStore.getOfferInfo();
  tableData.value = offerStore.offerInfo.results;
  tableData.value.forEach((item) => {
    loading.value[item.id] = false;
  });
});

// 分页查询
const query = ref({
  page: 1,
});
// 分页查询操作
const handlePageChange = async (cp) => {
  query.value.page = cp;
  await offerStore.getOfferInfo(query.value);
  tableData.value = offerStore.offerInfo.results;
  loading.value = {};
  tableData.value.forEach((item) => {
    loading.value[item.id] = false;
  });
};

// 修改表单
const editForm = ref({
  id: "",
  background_pic: "",
  is_using: false,
  text: "",
});

// 启用/禁用开关
const handleStatusChange = async (row) => {
  if (row.is_using) {
    editForm.value = row;
    const { id, is_using } = editForm.value;
    const flag = await offerStore.changeOfferStatus({ id, is_using });
    // 原来是禁用的,现在启用成功
    if (flag) {
      ElMessage.success(`通知书${id}号启动成功`);
    } else {
      ElMessage.error("启动失败,请重试");
    }
  } else {
    editForm.value = row;
    const { id, is_using } = editForm.value;
    const flag = await offerStore.changeOfferStatus({ id, is_using });
  }

  editForm.value = {};
  await offerStore.getOfferInfo(query.value);
  tableData.value = offerStore.offerInfo.results;
  loading.value = {};
  tableData.value.forEach((item) => {
    loading.value[item.id] = false;
  });
};

// 通知书预览
const imgUrl = ref("");
const previewVisiable = ref(false);

const handlePreview = async (row) => {
  loading.value[row.id] = true;
  const res = await offerStore.previewOffer(row.id);
  if (res.flag) {
    const url = window.URL.createObjectURL(new Blob([res.data]));
    imgUrl.value = url;
    previewVisiable.value = true;
    loading.value[row.id] = false;
  }
};

/*------------ 通知书修改 --------------------*/
const editVisible = ref(false);
const imageUrl = ref("")
const handleEdit = (row) => {
  editForm.value = row;
  imageUrl.value = row.background_pic;
  editVisible.value = true;
};
const upload = ref(null)
const beforeUpload = (file) => {
  if (file.type !== 'image/jpeg') {
    ElMessage.error('上传图片只能是 JPG 格式!')
    return false
  } 
  return true
}
const onExceed = (files) => {
    upload.value.clearFiles()
    const file = files[0]
    upload.value.handleStart(file)
    console.log(file)
}
const uploadImg = async(item) => {
    console.log(item.file)
}
const doEdit = async() => {
    const { id, text } = editForm.value;
    const res = await offerStore.updateOffer({id, text})
    if(res.flag) {
        ElMessage.success("修改成功")
        editVisible.value = false
        await offerStore.getOfferInfo(query.value);
    } else {
        ElMessage.error("修改失败")
        ElMessageBox.alert(res.eMsg,"提示")
    }
}
</script>

<template>
  <div>
    <div class="container">
      <!-- 顶部按钮区 -->
      <el-button type="primary" style="float: right; margin-bottom: 8px"
        >新增</el-button
      >

      <!-- 表格 -->
      <el-table
        :data="tableData"
        border
        height="774"
        class="table"
        ref="multipleTable"
        header-cell-class-name="table-header"
      >
        <el-table-column
          prop="id"
          label="通知书编号"
          width="100"
          align="center"
        ></el-table-column>
        <el-table-column label="背景图片" align="center" width="500">
          <template #default="scope">
            <el-image
              class="table-td-thumb"
              :src="scope.row.background_pic"
              :z-index="10"
              :preview-src-list="[scope.row.background_pic]"
              preview-teleported
            >
            </el-image>
          </template>
        </el-table-column>
        <el-table-column
          prop="text"
          label="通知书内容"
          width="529"
        ></el-table-column>
        <el-table-column
          prop="is_using"
          label="是否启用"
          width="100"
          align="center"
        >
          <template #default="scope">
            <el-switch
              size="large"
              v-model="scope.row.is_using"
              @change="handleStatusChange(scope.row)"
            />
          </template>
        </el-table-column>

        <el-table-column label="操作" width="350" align="center">
          <template #default="scope">
            <el-button
              type="success"
              @click="handlePreview(scope.row)"
              v-loading="loading[scope.row.id]"
              >预览</el-button
            >
            <el-button type="primary" @click="handleEdit(scope.row)"
              >编辑</el-button
            >
            <el-button type="danger" @click="handleDelete(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          background
          layout="prev, pager, next"
          :current-page="query.page"
          :total="offerStore.offerInfo.count"
          :page-size="2"
          @current-change="handlePageChange"
        ></el-pagination>
      </div>

      <!-- 预览弹出框 -->
      <el-dialog
        title="通知书预览"
        v-model="previewVisiable"
        top="10px"
        width="35%"
        align-center="true"
        center="true"
      >
        <img :src="imgUrl" alt="" class="offerImg" />
      </el-dialog>

      <!-- 编辑弹出框 -->
      <el-dialog title="编辑" v-model="editVisible" width="35%">
        <el-form label-width="90px">
          <el-form-item label="通知书编号">
            <el-input v-model="editForm.id" disabled></el-input>
          </el-form-item>
          <el-form-item label="背景图片">
              <el-upload
                action="#"
                :limit="1"
                :on-exceed="onExceed"
                :show-file-list="true"
                :http-request="uploadImg"
                :before-upload="beforeUpload"
                ref="upload"
              >
                <img v-if="imageUrl" :src="imageUrl" class="editImg"/>
                <el-button type="info">上传图片</el-button>
              </el-upload>
          </el-form-item>
          <el-form-item label="通知书内容">
            <el-input v-model="editForm.text" type="textarea"></el-input>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="editVisible = false">取 消</el-button>
            <el-button type="primary" @click="doEdit">确 定</el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<style scoped>
.editImg {
    width: 100px;
    height: 100px;
    margin-right: 50px;
}
.offerImg {
  width: 600px;
  height: 840px;
  margin: 0 auto;
}
.ordersel {
  float: left;
}
.container {
  padding-left: 13px;
  padding-right: 13px;
  padding-top: 5px;
  padding-bottom: 13px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 5px;
}
.handle-box {
  margin-bottom: 20px;
}

.handle-select {
  width: 120px;
}

.handle-input {
  width: 300px;
}
.table {
  width: 100%;
  font-size: 14px;
}
.red {
  color: #f56c6c;
}
.mr10 {
  margin-right: 10px;
}
.table-td-thumb {
  display: block;
  margin: auto;
  width: 250px;
  height: 350px;
}
</style>
