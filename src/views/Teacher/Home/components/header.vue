<template>
  <div class="header">
    <div class="logo">通知书后台管理系统</div>
    <div class="header-right">
      <div class="header-user-con">
        <!-- 用户名下拉菜单 -->
        <el-dropdown class="user-name" trigger="click" @command="handleCommand">
          <span class="el-dropdown-link">
            <!-- 用户头像 -->
            <i class="iconfont icon-touxiang"></i>
            <span style="margin-left: 5px">{{ username }}</span>
            <i class="iconfont icon-xiala" id="xiala"></i>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>用户组：{{ role }}</el-dropdown-item>
              <el-dropdown-item command="reset">修改密码</el-dropdown-item>
              <el-dropdown-item divided command="loginout"
                >退出登录</el-dropdown-item
              >
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </div>

  <!-- 修改密码弹窗 -->
  <el-dialog v-model="dialogFormVisible" title="修改密码" width="25%">
    <el-form :model="form">
      <el-form-item label="教师姓名" :label-width="formLabelWidth">
        <el-input v-model="editForm.username" autocomplete="off" disabled/>
      </el-form-item>
      <el-form-item label="重置密码" :label-width="formLabelWidth">
        <el-input v-model="editForm.password" placeholder="请输入新的密码"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="doReset">
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/user";
import { ElMessageBox } from "element-plus";

// 定义store
const userStore = useUserStore();

const username = userStore.userInfo.username;
const role = userStore.userInfo.is_admin ? "管理员" : "教师";

const dialogFormVisible = ref(false);

const editForm = ref({
  id: userStore.userInfo.id,
  username: username,
  password: "",
})

// // 用户名下拉菜单选择事件
const router = useRouter();
const handleCommand = (command) => {
  if (command == "loginout") {
    userStore.clearUserInfo();
    router.push("/teacher/login");
  } else if (command == "reset") {
    dialogFormVisible.value = true;
  }
};

// 修改密码
const doReset = async() => {
  const res = await userStore.resetPassword(editForm.value)
  if (res.flag) {
    router.push('/teacher/login')
    ElMessage.success('修改成功,请重新登录');
  } else {
    ElMessage.error("修改失败")
    ElMessageBox.alert(res.eMsg,"提示")
  }
}
</script>


<style scoped lang="scss">
i {
  font-size: 30px;
  vertical-align: middle;
  margin-right: 10px;
  font-weight: 100;
}

#xiala {
  font-size: 20px;
  vertical-align: middle;
  margin-right: 10px;
  font-weight: 100;
}

.logo {
  margin-left: 20px;
}
.header {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 70px;
  font-size: 22px;
  color: #fff;
  background-color: #242f42;
}
.header .logo {
  float: left;
  width: 250px;
  line-height: 70px;
}
.header-right {
  float: right;
  padding-right: 50px;
}
.header-user-con {
  display: flex;
  height: 70px;
  align-items: center;
}
.btn-fullscreen {
  transform: rotate(45deg);
  margin-right: 5px;
  font-size: 24px;
}
.btn-bell,
.btn-fullscreen {
  position: relative;
  width: 30px;
  height: 30px;
  text-align: center;
  border-radius: 15px;
  cursor: pointer;
  display: flex;
  align-items: center;
}
.btn-bell-badge {
  position: absolute;
  right: 4px;
  top: 0px;
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background: #f56c6c;
  color: #fff;
}
.btn-bell .el-icon-lx-notice {
  color: #fff;
}
.user-name {
  margin-left: 10px;
  font-size: 18px;
}
.el-dropdown-link {
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
}
.el-dropdown-menu__item {
  text-align: center;
}
</style>
