<script setup>
import { useUserStore } from "@/stores/user";
import { ElMessage } from "element-plus";
import "element-plus/theme-chalk/el-message.css";
const userStore = useUserStore();

/*------------ 教师数据渲染 --------------------*/
onMounted(() => {
  userStore.getTeacherInfo();
});

const query = ref({
  page: 1,
});

/*------------ 失活or激活教师账号 --------------------*/
const handleStatusChange = async (row) => {
  if (row.is_active) {
    const res = await userStore.reactiveTeacher(row.id);
    if (res.flag) {
      ElMessage.success("激活教师账号成功");
    } else {
      ElMessage.error("激活教师账号失败");
      ElMessageBox.alert(res.eMsg, "错误提示");
    }
  } else {
    const res = await userStore.deactiveTeacher(row.id);
    if (res.flag) {
      ElMessage.success("失活教师账号成功");
    } else {
      ElMessage.error("失活教师账号失败");
      ElMessageBox.alert(res.eMsg, "错误提示");
    }
  }
};

/*------------ 删除教师账号 --------------------*/
const handleDelete = async (row) => {
  ElMessageBox.confirm("确认删除所选教师账号？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      const flag = await userStore.deleteTeacher(row.id);
      if (flag) {
        ElMessage.success("删除教师账号成功");
        await userStore.getTeacherInfo();
      } else {
        ElMessage.error("删除教师账号失败");
        ElMessageBox.alert("删除失败，请刷新后重试", "错误提示");
      }
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "已取消删除",
      });
    });
};

/*------------ 新增教师账号 --------------------*/
const addVisible = ref(false);
const addForm = ref({
  username: "",
});
const formRef = ref(null);
const formRules = {
  username: [{ required: true, message: "请输入教师姓名", trigger: "blur" }],
};
const handleAdd = () => {
  addVisible.value = true;
};
const doCancel = () => {
  addVisible.value = false;
  addForm.value.username = "";
};
const doAdd = () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      const res = await userStore.addTeacher(addForm.value);
      if (res.flag) {
        ElMessage.success("新增教师账号成功");
        addVisible.value = false;
        addForm.value.username = "";
        await userStore.getTeacherInfo();
      } else {
        ElMessage.error("新增教师账号失败");
        ElMessageBox.alert(res.eMsg, "错误提示");
      }
    }
  });
};
</script>

<template>
  <div class="container">
    <div class="handle-box">
      <el-button
        type="primary"
        style="float: right; margin-bottom: 20px"
        @click="handleAdd"
        >新增</el-button
      >
    </div>
    <!-- 表格 -->
    <el-table
      :data="userStore.teacherInfo.results"
      border
      height="740"
      class="table"
      ref="multipleTable"
      header-cell-class-name="table-header"
    >
      <el-table-column
        prop="id"
        label="教师ID"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="username"
        label="教师姓名"
        align="center"
      ></el-table-column>
      <el-table-column prop="is_active" label="状态" align="center">
        <template #default="scope">
          <el-switch
            size="large"
            v-model="scope.row.is_active"
            @change="handleStatusChange(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column prop="last_login" label="最后登录时间"></el-table-column>
      <el-table-column label="操作" width="200" align="center">
        <template #default="scope">
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
        :total="userStore.teacherInfo.count"
        @current-change="handlePageChange"
      ></el-pagination>
    </div>
  </div>

  <!-- 新增弹出框 -->
  <el-dialog
    title="新增教师账号"
    v-model="addVisible"
    width="25%"
  >
    <el-form label-width="90px" :rules="formRules" :model="addForm" ref="formRef">
      <el-form-item label="教师姓名" prop="username">
        <el-input v-model="addForm.username"></el-input>
      </el-form-item>
    </el-form>
    <el-alert
      title="添加教师账号时，会将密码设置为123456，请通知教师及时修改密码。"
      type="info"
      show-icon
      style=""
      :closable="false"
    />
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="doCancel">取 消</el-button>
        <el-button type="primary" @click="doAdd">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
.ordersel {
  float: left;
}
.container {
  padding: 25px;
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
  width: 40px;
  height: 40px;
}

.pagination {
  margin-top: 10px;
  text-align: right;
}

.multidel {
  margin-top: 5px;
  width: 100%;
  height: 32px;
  .el-button {
    background-color: #f6faff;
    width: 55px;
  }
}
</style>
