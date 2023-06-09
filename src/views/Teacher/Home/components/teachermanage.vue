<script setup>
import { useUserStore } from "@/stores/user";
const userStore = useUserStore();
onMounted(() => {
  userStore.getTeacherInfo();
});

const query = ref({
  page: 1,
});
</script>

<template>
  <div class="container">
    <div class="handle-box">
      <el-button type="primary" style="float: right;margin-bottom: 20px;" @click="handleAdd"
        >新增</el-button
      >
    </div>
    <!-- 表格 -->
    <el-table
      :data="userStore.teacherInfo.results"
      border
      height="790"
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
