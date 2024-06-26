<script setup>
import { useOfferStore } from "@/stores/offer";
import { useTypeStore } from "@/stores/type";
import { ElMessage } from "element-plus";
import "element-plus/theme-chalk/el-message.css";
import { ref, onMounted } from "vue";
import zhcn from "element-plus/lib/locale/lang/zh-cn";

const offerStore = useOfferStore();
const typeStore = useTypeStore();
let local = zhcn;
/*------------ 通知书数据渲染 --------------------*/

// 查询参数
const query = ref({
  page: 1,
  type: "",
});

// 加载通知书信息
const tableData = ref([]);
const loading = ref({});
const offerType = ref("");
onMounted(async () => {
  await offerStore.getOfferInfo();
  await typeStore.getTypeList();
  tableData.value = offerStore.offerInfo.results;
  tableData.value.forEach((item) => {
    loading.value[item.id] = false;
  });
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

// 选择类型
const handleTypeChange = async (val) => {
  query.value.type = val;
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
  upload: false,
  school: "",
  type: "",
  time: "",
  web_path: "",
});

/*------------ 通知书启用/禁用 --------------------*/
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

/*------------ 通知书预览 --------------------*/
const imgUrl = ref("");
const previewVisiable = ref(false);

const handlePreview = async (row) => {
  loading.value[row.id] = true;
  const res = await offerStore.previewOffer(row.id);
  if (res.flag) {
    const url = window.URL.createObjectURL(new Blob([res.data]));
    imgUrl.value = url;
    // window.URL.revokeObjectURL(url)
    previewVisiable.value = true;
    loading.value[row.id] = false;
  } else {
    ElMessage.error("预览失败");
    ElMessageBox.alert(res.eMsg, "提示");
    loading.value[row.id] = false;
  }
};

/*------------ 通知书修改 --------------------*/
const editVisible = ref(false);
const imageUrl = ref("");
// 打开修改弹窗
const handleEdit = (row) => {
  editForm.value = row;
  imageUrl.value = row.background_pic;
  editVisible.value = true;
};
// 上传图片
const upload = ref(null);
// 检查图片格式
const beforeUpload = (file) => {
  editForm.value.upload = true; // 标记此次需要上传图片
  if (file.type !== "image/jpeg") {
    ElMessage.error("上传图片只能是 JPG 格式!");
    return false;
  }
  return true;
};
// 限制上传一张图片，超出则替换
const onExceed = (files) => {
  upload.value.clearFiles();
  const file = files[0];
  upload.value.handleStart(file);
};
// 上传图片逻辑
const uploadImg = async (item) => {
  let formData = new FormData();
  formData.append("background_pic", item.file);
  const res = await offerStore.updateOfferImage({
    id: editForm.value.id,
    formData,
  });
  if (res.flag) {
    ElMessage.success("修改成功");
    editVisible.value = false;
    await offerStore.getOfferInfo(query.value);
    tableData.value = offerStore.offerInfo.results;
    editForm.value = {};
  } else {
    ElMessage.error("修改失败");
    ElMessageBox.alert(res.eMsg, "提示");
  }
  upload.value.clearFiles();
};
// 修改通知书内容
const doEdit = async () => {
  const { id, text, school, time, type, web_path } = editForm.value;
  const res = await offerStore.updateOfferContent({
    id,
    text,
    school,
    time,
    type,
    web_path,
  });
  // 当没有上传图片时，直接修改内容
  if (res.flag && !editForm.value.upload) {
    ElMessage.success("修改成功");
    editVisible.value = false;
    await offerStore.getOfferInfo(query.value);
    tableData.value = offerStore.offerInfo.results;
    editForm.value = {};
  } else if (!res.flag) {
    ElMessage.error("通知书内容修改失败");
    ElMessageBox.alert("通知书修改失败", "提示");
    tableData.value = offerStore.offerInfo.results;
  }
};
// 点击确定时触发上传图片逻辑
const doUpload = () => {
  upload.value.submit();
};
// 取消修改
const doCancel = async () => {
  editVisible.value = false;
  editForm.value = {};
  upload.value.clearFiles();
  await offerStore.getOfferInfo(query.value);
  tableData.value = offerStore.offerInfo.results;
};

/*------------ 通知书删除 --------------------*/
const handleDelete = async (row) => {
  ElMessageBox.confirm("确认删除所选通知书？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      const flag = await offerStore.deleteOffer(row.id);
      if (flag) {
        ElMessage.success(`通知书${row.id}号删除成功`);
      } else {
        ElMessage.error("删除失败,请刷新后重试");
      }
      await offerStore.getOfferInfo(query.value);
      tableData.value = offerStore.offerInfo.results;
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "已取消删除",
      });
    });
};

/*------------ 通知书添加 --------------------*/
const addVisible = ref(false);
const addFormRef = ref(null);
// 添加表单
const addForm = ref({
  text: "",
  is_using: true,
  upload: false,
  school: "",
  type: "",
  time: "",
  web_path: "",
});

// 表单验证
const formRules = {
  text: [
    {
      required: true,
      message: "通知书内容不能为空",
      trigger: "blur",
    },
  ],
  type: [
    {
      required: true,
      message: "通知书类型不能为空",
      trigger: "blur",
    },
  ],
  school: [
    {
      required: true,
      message: "落款学校不能为空",
      trigger: "blur",
    },
  ],
  time: [
    {
      required: true,
      message: "发放时间不能为空",
      trigger: "blur",
    },
  ],
  web_path: [
    {
      required: true,
      message: "服务器地址不能为空",
      trigger: "blur",
    },
  ],
};

const handleAdd = () => {
  addVisible.value = true;
};
const uploadadd = ref(null);
// 检查图片格式
const beforeUploadAdd = (file) => {
  if (file.type !== "image/jpeg") {
    ElMessage.error("上传图片只能是 JPG 格式!");
    return false;
  }
  return true;
};
// 检查是否上传图片
const onChangeAdd = (file, fileList) => {
  if (fileList.length > 0) {
    addForm.value.upload = true;
  } else {
    addForm.value.upload = false;
  }
};
// 移除图片时修改标记
const onRemoveAdd = (file, fileList) => {
  addForm.value.upload = false;
};
// 限制上传一张图片，超出则替换
const onExceedAdd = (files) => {
  uploadadd.value.clearFiles();
  const file = files[0];
  uploadadd.value.handleStart(file);
};
// 上传图片逻辑
const uploadAdd = (item) => {
  addFormRef.value.validate(async (valid) => {
    if (valid) {
      addForm.value.is_using = true;
      let formData = new FormData();
      formData.append("background_pic", item.file);
      formData.append("text", addForm.value.text);
      formData.append("is_using", addForm.value.is_using);
      formData.append("school", addForm.value.school);
      formData.append("type", addForm.value.type);
      formData.append("time", addForm.value.time);
      formData.append("web_path", addForm.value.web_path);

      const res = await offerStore.addOffer(formData);
      if (res.flag) {
        ElMessage.success("通知书添加成功");
        addVisible.value = false;
        await offerStore.getOfferInfo(query.value);
        tableData.value = offerStore.offerInfo.results;
        addForm.value = {};
        uploadadd.value.clearFiles();
      } else {
        ElMessage.error("通知书添加失败");
        uploadadd.value.clearFiles();
      }
    }
  });
};
// 点击确认后执行添加
const doAdd = () => {
  console.log(addForm.value.upload);
  if (addForm.value.upload) {
    uploadadd.value.submit();
  } else {
    ElMessage.error("请添加图片");
  }
};
</script>

<template>
  <div>
    <div class="container">
      <!-- 顶部按钮区 -->
      <el-button
        type="primary"
        style="float: right; margin-bottom: 8px"
        @click="handleAdd"
        >新增</el-button
      >

      <!-- 顶部类型选择 -->
      <el-select
        class="type-sel"
        placeholder="类型选择"
        v-model="offerType"
        @change="handleTypeChange"
        style="border: 1px skyblue solid"
      >
        <el-option
          v-for="item in typeStore.typeList"
          :key="item.id"
          :label="item.name"
          :value="item.name"
        ></el-option>
      </el-select>

      <!-- 表格 -->
      <el-table
        :data="tableData"
        :border="true"
        height="774"
        class="table"
        ref="multipleTable"
        header-cell-class-name="table-header"
      >
        <el-table-column
          prop="id"
          label="编号"
          width="70"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="type"
          label="通知书类型"
          width="100"
          align="center"
        ></el-table-column>
        <el-table-column label="背景图片" align="center" width="300">
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
          width="400"
          header-align="center"
        ></el-table-column>
        <el-table-column
          prop="school"
          label="落款学校"
          width="150"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="time"
          label="发放时间"
          width="150"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="web_path"
          label="服务器地址"
          width="150"
          align="center"
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

        <el-table-column label="操作" width="150" align="center">
          <template #default="scope">
            <el-button v-show="false" type="primary">编辑</el-button>
            <el-button
              type="success"
              @click="handlePreview(scope.row)"
              v-loading="loading[scope.row.id]"
              >预览</el-button
            >
            <el-button
              type="primary"
              @click="handleEdit(scope.row)"
              style="margin-top: 10px"
              >编辑</el-button
            >
            <el-button
              type="danger"
              @click="handleDelete(scope.row)"
              style="margin-top: 10px"
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
      <el-dialog
        title="编辑"
        v-model="editVisible"
        width="35%"
        @close="doCancel"
      >
        <el-form label-width="90px" label-position="left">
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
              list-type="picture"
              :auto-upload="false"
              accept="image/jpeg"
            >
              <img v-if="imageUrl" :src="imageUrl" class="editImg" />
              <el-button type="info">上传图片</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item label="通知书类型">
            <el-select v-model="editForm.type" placeholder="选择类型">
              <el-option
                v-for="item in typeStore.typeList"
                :key="item.id"
                :label="item.name"
                :value="item.name"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="通知书内容">
            <el-input
              v-model="editForm.text"
              type="textarea"
              autosize
            ></el-input>
          </el-form-item>
          <el-form-item label="落款学校">
            <el-input
              v-model="editForm.school"
              placeholder="落款学校"
            ></el-input>
          </el-form-item>
          <el-form-item label="发放日期">
            <el-config-provider :locale="local">
              <el-date-picker
                v-model="editForm.time"
                type="date"
                :placeholder="editForm.time"
                size="default"
                format="YYYY 年 MM 月 DD 日"
                value-format="YYYY-MM-DD"
                :clearable="false"
              />
            </el-config-provider>
          </el-form-item>
          <el-form-item label="服务器地址">
            <el-input
              v-model="editForm.web_path"
              placeholder="服务器地址"
            ></el-input>
          </el-form-item>
          <el-alert
            title="通知书内容格式"
            type="info"
            show-icon
            style="width: 400px"
            description="可变参数:姓名、身份证号、考号、班级、入学时间、性别；当使用可变参数时，请用{}将参数包裹起来，如:{姓名}"
            :closable="false"
          />
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="doCancel">取 消</el-button>
            <el-button
              type="primary"
              @click="
                doUpload();
                doEdit();
              "
              >确 定</el-button
            >
          </span>
        </template>
      </el-dialog>

      <!-- 新增弹出框 -->
      <el-dialog title="新增通知书" v-model="addVisible" width="35%">
        <el-form
          label-width="120px"
          label-position="left"
          :rules="formRules"
          :model="addForm"
          ref="addFormRef"
        >
          <el-form-item label="背景图片">
            <el-upload
              action="#"
              :limit="1"
              :on-exceed="onExceedAdd"
              :on-change="onChangeAdd"
              :on-remove="onRemoveAdd"
              :show-file-list="true"
              list-type="picture"
              :http-request="uploadAdd"
              :before-upload="beforeUploadAdd"
              ref="uploadadd"
              accept="image/jpeg"
              :auto-upload="false"
            >
              <el-button type="info">上传图片</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item label="通知书类型" prop="type">
            <el-select v-model="addForm.type" placeholder="选择类型">
              <el-option
                v-for="item in typeStore.typeList"
                :key="item.id"
                :label="item.name"
                :value="item.name"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="通知书内容" prop="text">
            <el-input
              v-model="addForm.text"
              type="textarea"
              autosize
              placeholder="通知书内容"
            ></el-input>
          </el-form-item>
          <el-form-item label="落款学校" prop="school">
            <el-input
              v-model="addForm.school"
              placeholder="落款学校"
            ></el-input>
          </el-form-item>
          <el-form-item label="发放日期" prop="time">
            <el-config-provider :locale="local">
              <el-date-picker
                v-model="addForm.time"
                type="date"
                placeholder="发放日期"
                size="default"
                format="YYYY 年 MM 月 DD 日"
                value-format="YYYY-MM-DD"
              />
            </el-config-provider>
          </el-form-item>
          <el-form-item label="服务器地址" prop="web_path">
            <el-input
              v-model="addForm.web_path"
              placeholder="服务器地址"
            ></el-input>
          </el-form-item>
          <el-alert
            title="通知书内容格式"
            type="info"
            show-icon
            style="width: 400px"
            description="可变参数:姓名、身份证号、考号、班级、入学时间、性别；当使用可变参数时，请用{}将参数包裹起来，如:{姓名}"
            :closable="false"
          />
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="addVisible = false">取 消</el-button>
            <el-button type="primary" @click="doAdd">确 定</el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<style scoped>
.type-sel {
  float: left;
}
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
