<script setup>
function convertErrorMsgToStringWithField(eMsg, Field) {
  let errorMsg = '';

  for (let key in eMsg) {
    if (eMsg.hasOwnProperty(key)) {
      const messages = eMsg[key];
      const fieldLabel = Field[key] || key; // 获取字段的说明，若不存在说明则使用字段名作为默认值

      for (let i = 0; i < messages.length; i++) {
        errorMsg += fieldLabel + ': ' + messages[i] + '\n';
      }
    }
  }

  return errorMsg.trim();
}

const Field = {
  id: "身份证号",
  sex: "性别",
  admission_date: "入学年份",
  student_id: "准考证号",
  class_num: "班级",
  name: "姓名",
  create_time: "创建时间",
  update_time: "更新时间",
};

const eMsg = {
    student_id: ['考号[18041829]已存在'],
};

const errorMsgString = convertErrorMsgToStringWithField(eMsg, Field);
console.log(errorMsgString);

</script>

<template>
    我是通知书信息管理
</template>