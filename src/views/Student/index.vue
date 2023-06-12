<script setup>
import { useOfferStore } from "@/stores/offer";
import PicCode from "@/components/PicCode/PicCode2.vue";
import { ElMessage } from "element-plus";

// 当前正确验证码
const Code = ref(1);
const codeRef = ref(null);
// 验证验证码是否正确
function validateCode(inputCode, generatedCode) {
  return inputCode.toLowerCase() === generatedCode.toLowerCase();
}

// 提交表单
const formRef = ref(null);
const form = ref({
  id: "",
  name: "",
  student_id: "",
});
const rules = {
  id: [{ required: true, message: "请输入身份证号", trigger: "blur" }],
  student_id: [{ required: true, message: "请输入准考证号", trigger: "blur" }],
  name: [{ required: true, message: "请输入学生姓名", trigger: "blur" }],
  code: [{ required: true, message: "请输入验证码", trigger: "blur" }],
};

// 去掉首尾空格
const trimmedObj = computed(() => {
    const obj = form.value;
    const trimmedObj = {};
    for (const key in obj) {
        if (Object.hasOwnProperty.call(obj, key)) {
        trimmedObj[key] = obj[key].trim();
        }
    }
    return trimmedObj;
})

// 提交表单
const offerStore = useOfferStore();
const doSearch = () => {
  const { id, student_id, name, code } = trimmedObj.value;
  formRef.value.validate(async (valid) => {
    if (valid) {
      // 验证验证码是否正确
      console.log(Code.value);
      if (validateCode(code, Code.value)) {
        const res = await offerStore.downloadOffer({ id, student_id, name });
        if (res.flag) {
          ElMessage.success("查询成功，即将开始下载");
          const url = window.URL.createObjectURL(new Blob([res.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "file.pdf");
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } else {
          ElMessage.error(res.eMsg);
          codeRef.value.OnRefresh();
        }
      } else {
        ElMessage.error("验证码错误");
        codeRef.value.OnRefresh();
      }
    } else {
      ElMessage.error("请将信息填写完整");
    }
  });
};
</script>

<template>
  <div class="container">
    <section class="login-section">
      <div class="wrapper">
        <nav>
          <span>电子录取通知书查询</span>
        </nav>
        <div class="account-box">
          <div class="form">
            <el-form
              :model="form"
              :rules="rules"
              label-position="left"
              label-width="100px"
              status-icon
              ref="formRef"
            >
              <el-form-item prop="id" label="身份证号码">
                <el-input v-model="form.id" />
              </el-form-item>
              <el-form-item prop="student_id" label="准考证号">
                <el-input v-model="form.student_id" />
              </el-form-item>
              <el-form-item prop="name" label="学生姓名">
                <el-input v-model="form.name" />
              </el-form-item>
              <el-row>
                <el-col :span="12">
                  <el-form-item prop="code" label="验证码">
                    <el-input v-model="form.code" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <PicCode
                    :width="150"
                    :height="30"
                    v-model:Code="Code"
                    class="verifyCode"
                    ref="codeRef"
                  />
                </el-col>
              </el-row>

              <el-button size="large" class="subBtn" @click="doSearch"
                >查询</el-button
              >
            </el-form>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
$dark_gray: #889aa4;
$bg: #2d3a4b;

.container {
  height: 100%;
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

.verifyCode {
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
