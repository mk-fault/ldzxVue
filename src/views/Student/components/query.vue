<script setup>
import { useOfferStore } from "@/stores/offer";
import PicCode from "@/components/PicCode/PicCode2.vue";
import PicCodeMobile from "@/components/PicCode/PicCodeMobile.vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRouter } from "vue-router";

// 检测设备类型
const isMobile =
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );

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
});

const dialogVisible = ref(false);

// 提交表单
const router = useRouter();
const offerStore = useOfferStore();
const studentInfo = ref({
  name: "张三",
});
const doSearch = () => {
  //   dialogVisible.value = true;

  const { id, student_id, name, code } = trimmedObj.value;
  formRef.value.validate(async (valid) => {
    if (valid) {
      // 验证验证码是否正确
      console.log(Code.value);
      if (validateCode(code, Code.value)) {
        const res = await offerStore.downloadOffer({ id, student_id, name });
        if (res.flag) {
          ElMessage.success("成功查询到录取学生信息");
          studentInfo.value = res.data;
          dialogVisible.value = true;
          //   router.replace("offer");

          //   const url = window.URL.createObjectURL(new Blob([res.data]));
          //   const link = document.createElement("a");
          //   link.href = url;
          //   link.setAttribute("download", "录取通知书.pdf");
          //   document.body.appendChild(link);
          //   link.click();
          //   document.body.removeChild(link);
          // let blob = new Blob([res.data], { type: 'application/pdf' })
          // FileSaver.saveAs(blob, '录取通知书.pdf')
        } else {
          if (isMobile) {
            ElMessageBox.alert(res.eMsg, "提示", {
                type: "error",
              confirmButtonText: "确定",
            });
          } else {
            ElMessage.error(res.eMsg);
          }
          form.value.code = "";
          codeRef.value.OnRefresh();
        }
      } else {
        ElMessage.error("验证码错误");
        form.value.code = "";
        codeRef.value.OnRefresh();
      }
    } else {
      ElMessage.error("请将考生信息填写完整");
      form.value.code = "";
      codeRef.value.OnRefresh();
    }
  });
};

// 下载通知书
// const ori_url = "http://127.0.0.1:8000";
const ori_url = "http://192.168.31.113:8000";
const offer_path = computed(() => {
  return ori_url + studentInfo.value["offer"];
});
const download = () => {
  window.open(offer_path.value);
  dialogVisible.value = false;
  form.value = {
    id: "",
    name: "",
    student_id: "",
  };
};
</script>

<template>
  <!-- PC端模板 -->
  <template v-if="!isMobile">
    <div id="pc">
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

                  <el-button
                    size="large"
                    class="subBtn"
                    @click="doSearch"
                    v-loading="downloading"
                    >查询</el-button
                  >
                </el-form>
              </div>
            </div>
          </div>
        </section>
      </div>

      <el-dialog
        v-model="dialogVisible"
        width="25%"
        :before-close="handleClose"
        title="提示"
      >
        <h2>{{ studentInfo.name }}同学：</h2>
        <h3>恭喜你被我校录取！</h3>
        <h3>请点击按钮下载电子录取通知书!</h3>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="download"> 下载通知书 </el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </template>

  <!-- 移动端模板 -->
  <template v-else>
    <div id="mobile">
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
                  label-position="top"
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
                  <el-form-item prop="code" label="验证码">
                    <el-input v-model="form.code" />
                  </el-form-item>
                  <el-form-item style="margin-top: 10%;">
                    <el-row :gutter="20">
                      <el-col :span="12">
                        <PicCodeMobile
                          :width="150"
                          :height="5"
                          v-model:Code="Code"
                          ref="codeRef"
                        />
                      </el-col>
                      <el-col :span="12">
                        <div style="height:60px;float: right; display: flex; justify-content: center; align-items: center;">
                            <span>点击图片刷新验证码</span>
                        </div>
                        
                      </el-col>
                    </el-row>
                  </el-form-item>

                  <el-button size="large" class="subBtn" @click="doSearch"
                    >查询</el-button
                  >
                </el-form>
              </div>
            </div>
          </div>
        </section>
      </div>

      <el-dialog
        v-model="dialogVisible"
        width="80%"
        :show-close="false"
      >
        <h2>{{ studentInfo.name }}同学：</h2>
        <h3>恭喜你被我校录取！</h3>
        <h3>请点击按钮下载电子录取通知书!</h3>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="download"> 下载通知书 </el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </template>
</template>

<style scoped lang="scss">
$dark_gray: #889aa4;
$bg: #2d3a4b;

#pc {
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
      left: 32%;
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
    .form {
      padding: 0 20px 20px 20px;

      &-item {
        margin-bottom: 28px;
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
}

#mobile {
  .container {
    height: 100%;
    width: 100%;
  }
  .login-section {
    height: 100%;
    position: relative;
  }
  .wrapper {
    width: 90%;
    height: 90%;
    background: #fff;
    position: absolute;
    left: 5%;
    right: 5%;

    nav {
      font-size: 25px;
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
        font-size: 25px;
        padding-top: 15%;
        padding-bottom: 15%;
        position: relative;
        text-align: center;
      }
    }
  }
  .account-box {
    .form {
      padding: 0 20px 20px 20px;
    }
  }
  .verifyCode {
    width: 100%;
    height: 100%;
    margin-top: 20%;
    border: 1px solid #cfcdcd;
    border-radius: 4px;
    cursor: pointer;
  }
  .subBtn {
    background: $dark_gray;
    width: 100%;
    color: #fff;
    margin-top: 10%;
  }
}
</style>
