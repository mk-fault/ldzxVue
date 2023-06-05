<script setup>
import { defineComponent, reactive, ref } from "vue";
import PicCode from "@/components/PicCode/PicCode.vue";
import { useUserStore } from "@/stores/user";
import { ElMessage } from "element-plus";
import 'element-plus/theme-chalk/el-message.css' 
import { useRouter } from "vue-router";

// 当前正确验证码
const Code = ref(1)

// 表单数据
const form = ref({
  username: '',
  password: '',
  code:''
})

// 表单验证规则
const rules = ref({
  username: [
    {
      required: true,
      message: '用户名不能为空',
      trigger: 'blur'
    }
  ],
  password: [
    {
      required: true,
      message: '密码不能为空',
      trigger: 'blur'
    }
  ],
  code: [
    {
      required: true,
      message: '验证码不能为空',
      trigger: 'blur'
    }
  ]
})
const formRef = ref(null)

// 验证验证码是否正确
function validateCode(inputCode, generatedCode) {
  return inputCode.toLowerCase() === generatedCode.toLowerCase();
}

// 定义
const userStore = useUserStore()
const router = useRouter();

// 登录逻辑
const doLogin = () => {
  const { username, password, code } = form.value
  formRef.value.validate(async(valid) => {
    if (valid) {
      // 验证验证码是否正确
      if (validateCode(code,Code.value)) {
        await userStore.getUserInfo({ username, password })
        ElMessage.success('登录成功')
        router.replace('/teacher/home')
      }

    } else {
      ElMessage.error('请将信息填写完整')
    }
  })
}
</script>

<template>
  <div class="container">
  <section class="login-section">
      <div class="wrapper">
        <nav>
          <span>教师登录</span>
        </nav>
        <div class="account-box">
          <div class="form">
            <el-form
              :model="form"
              :rules="rules"
              label-position="left"
              label-width="80px"
              status-icon
              ref="formRef"
            >
              <el-form-item prop="username" label="用户名">
                <el-input v-model="form.username" />
              </el-form-item>
              <el-form-item prop="password" label="密码">
                <el-input v-model="form.password" />
              </el-form-item>
              <el-row>
                <el-col :span="12">
                  <el-form-item prop="code" label="验证码">
                    <el-input v-model="form.code" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <PicCode :width="150" :height="36" v-model:Code="Code" class="verifyCode"/>
                </el-col>
              </el-row>
  
              <el-button size="large" class="subBtn" @click="doLogin">点击登录</el-button>
            </el-form>
          </div>
        </div>
      </div>
    </section>
  </div>
<!-- {{ Code }}
<PicCode :width="150" :height="30" v-model:Code="Code" /> -->
</template>

<style scoped lang="scss">
$dark_gray: #889aa4;
$bg: #2d3a4b;

.container {
  height:100%;
  width: 100%;
}
.login-section {
  height: 488px;
  position: relative;

  .wrapper {
    width: 450px;
    background: #fff;
    position: absolute;
    left: 35%;
    top: 50%;
    transform: translate3d(100px, 0, 0);
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);

    nav {
      font-size: 25px;
      height: 55px;
      margin-bottom: 20px;
      border-bottom: 1px solid #f5f5f5;
      display: flex;
      padding: 0 40px;
      text-align: right;
      align-items: center;

      span {
        flex: 1;
        line-height: 1;
        display: inline-block;
        font-size: 18px;
        position: relative;
        text-align: center;
      }
    }
  }
}

.account-box {
  .toggle {
    padding: 15px 40px;
    text-align: right;

    a {
      color: $dark_gray;

      i {
        font-size: 14px;
      }
    }
  }

  .form {
    padding: 0 20px 20px 20px;

    &-item {
      margin-bottom: 28px;

      .input {
        position: relative;
        height: 36px;

        > i {
          width: 34px;
          height: 34px;
          background: #cfcdcd;
          color: #fff;
          position: absolute;
          left: 1px;
          top: 1px;
          text-align: center;
          line-height: 34px;
          font-size: 18px;
        }

        input {
          padding-left: 44px;
          border: 1px solid #cfcdcd;
          height: 36px;
          line-height: 36px;
          width: 100%;

          &.error {
            border-color: $dark_gray;
          }

          &.active,
          &:focus {
            border-color: $dark_gray;
          }
        }

        .code {
          position: absolute;
          right: 1px;
          top: 1px;
          text-align: center;
          line-height: 34px;
          font-size: 14px;
          background: #f5f5f5;
          color: #666;
          width: 90px;
          height: 34px;
          cursor: pointer;
        }
      }

      > .error {
        position: absolute;
        font-size: 12px;
        line-height: 28px;
        color: $dark_gray;

        i {
          font-size: 14px;
          margin-right: 2px;
        }
      }
    }

    .agree {
      a {
        color: #069;
      }
    }

    .btn {
      display: block;
      width: 100%;
      height: 40px;
      color: #fff;
      text-align: center;
      line-height: 40px;
      background: $dark_gray;

      &.disabled {
        background: #cfcdcd;
      }
    }
  }

  .action {
    padding: 20px 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .url {
      a {
        color: #999;
        margin-left: 10px;
      }
    }
  }
}

.verifyCode{
  width: 100%;
  height: 100%;
  margin-left: 52px;
  border: 1px solid #cfcdcd;
  border-radius: 4px;
  cursor: pointer;
}
.subBtn {
  background: $dark_gray;
  width: 100%;
  color: #fff;
}
</style>