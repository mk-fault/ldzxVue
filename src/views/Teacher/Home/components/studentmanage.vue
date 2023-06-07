<script setup>
import { ref, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useStudentStore } from "@/stores/student";
import 'element-plus/theme-chalk/el-message.css' 

/*------------ 字段定义 --------------------*/
// 筛选字段
const filterField = ref({
  id: "身份证号",
  sex: "性别",
  admission_date: "入学年份",
  max_admission_date: "最大入学年份",
  min_admission_date: "最小入学年份",
  max_student_id: "最大学号",
  min_student_id: "最小学号",
  student_id: "准考证号",
  class_num: "班级",
  name: "姓名",
});

// 排序字段
const orderField = ref({
  id: "身份证号",
  sex: "性别",
  admission_date: "入学年份",
  student_id: "准考证号",
  class_num: "班级",
  name: "姓名",
  create_time: "创建时间",
  update_time: "更新时间",
});

//排序方法
const orderMethod = ref({
  "-": "降序",
  "+": "升序",
});
const order1 = ref("");
const order2 = ref("");
const orderby = computed(() => {
    return order2.value + order1.value;
})

// 转换错误信息格式
function convertErrorMsgToStringWithField(eMsg, Field) {
  let errorMsg = '';

  for (let key in eMsg) {
    if (eMsg.hasOwnProperty(key)) {
      const messages = eMsg[key];
      const fieldLabel = Field[key] || key; // 获取字段的说明，若不存在说明则使用字段名作为默认值

      for (let i = 0; i < messages.length; i++) {
        errorMsg += fieldLabel + ': ' + messages[i] + '<br>';
      }
    }
  }
  return errorMsg.trim();
}

// 字段说明
const Field = {
  id: "身份证号",
  sex: "性别",
  admission_date: "入学年份",
  student_id: "准考证号",
  class_num: "班级",
  name: "姓名"
};


/*------------ 编辑学生 --------------------*/
// 编辑学生信息
const editVisible = ref(false);
const handleEdit = (row) => {
    editForm.value = row;
    editVisible.value = true;
};
// 编辑学生信息表单
const editForm = ref({
  id: "",
  student_id: "",
  name: "",
  class_num: "",
  sex: "",
  admission_date: "",
});

// 修改学生信息
const doEdit = () => {
    ElMessageBox.confirm("确认修改学生信息？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
    }).then(async() => {
        const res = await studentStore.updateStudent(editForm.value)
        if (res.flag) {
            ElMessage.success("修改成功");
            editVisible.value = false;
        } else {
            const errorMsg = convertErrorMsgToStringWithField(res.eMsg,Field)
            ElMessageBox.alert(errorMsg, '提示', {
                dangerouslyUseHTMLString: true
            }) 
            ElMessage.error("修改失败");
            console.log(errorMsg)
            await studentStore.getStudentInfo(transformQuery(query.value))
        }
        
    }).catch(() => {
        ElMessage({
            type: "info",
            message: "已取消修改",
        });
    })
}


/*------------ 删除学生 --------------------*/
// 删除学生信息
const handleDelete = (row) => {
    ElMessageBox.confirm("确认删除学生信息？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
    }).then(async() => {
        const flag = await studentStore.deleteStudent(row.id)
        if (flag) {
            ElMessage.success("删除成功");
        } else {
            ElMessage.error("删除失败,请刷新后重试");
        }
        await studentStore.getStudentInfo(transformQuery(query.value))
    }).catch(() => {
        ElMessage({
            type: "info",
            message: "已取消删除",
        });
    })
}


/*------------ 新增学生 --------------------*/
/* 新增一个学生 */
const addVisible = ref(false)
const handleAdd = () => {
    addVisible.value = true;
}
const addForm = ref({
  id: "",
  student_id: "",
  name: "",
  class_num: '',
  sex: '',
  admission_date: '',
});
const doAdd = () => {
    ElMessageBox.confirm("确认新增学生？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
    }).then(async() => {
        const res = await studentStore.addStudent(addForm.value)
        if (res.flag) {
            ElMessage.success("新增成功");
            addVisible.value = false;
            // 清空表单
            addForm.value = {}
            await studentStore.getStudentInfo(transformQuery(query.value))
        } else {
            const errorMsg = convertErrorMsgToStringWithField(res.eMsg,Field)
            ElMessageBox.alert(errorMsg, '提示' , {
                dangerouslyUseHTMLString: true
            })
            ElMessage.error("新增失败");   
        }  
    }).catch(() => {
        ElMessage({
            type: "info",
            message: "已取消新增",
        });
    })
}


/*------------ PARAMA定义 --------------------*/
// 查询参数
const query = ref({
  type: "",
  parama: "",
  orderby: orderby.value,
  page: 1,
});
watch(() =>{
    query.value.orderby = orderby.value;
})

// 转换query格式
function transformQuery(query) {
  return {
    [query.type]: query.parama,
    ordering: query.orderby,
    page: query.page,
  };
}

/*------------ 信息获取 --------------------*/
// 获取学生列表
const studentStore = useStudentStore()

onMounted(() => {
    studentStore.getStudentInfo()
})

// 过滤和排序
const doFilter = async() => {
  await studentStore.getStudentInfo(transformQuery(query.value))
};

// 重置过滤和排序
const doFilterReset = async() => {
    query.value = {
        type: "",
        parama: "",
        orderby: orderby.value,
        page: 1,
    };
    order1.value = "";
    order2.value = "";
    await studentStore.getStudentInfo()
    console.log(studentStore.studentInfo.count)
}

// 翻页
const handlePageChange = async(cp) => {
    query.value.page = cp;
    await studentStore.getStudentInfo(transformQuery(query.value))
}

</script>

<template>
  <div>
    <div class="container">
      <div class="handle-box">
        <el-select
          v-model="query.type"
          placeholder="筛选类型"
          class="handle-select mr10"
        >
          <el-option
            v-for="(v, k) in filterField"
            :key="k"
            :label="v"
            :value="k"
          ></el-option>
        </el-select>
        <el-input
          v-model="query.parama"
          :placeholder="filterField[query.type]"
          class="handle-input mr10"
        ></el-input>
        <el-button type="primary" @click="doFilter">搜索</el-button>
        <el-button type="primary" @click="doFilterReset">重置</el-button>

        <!-- 右侧 -->
        <el-button type="success" style="float: right">从Excel导入</el-button>
        <el-button type="primary" style="float: right" @click="handleAdd">新增</el-button>
        <div class="ordersel">
          <el-select
            v-model="order1"
            placeholder="排序字段"
            class="handle-select mr10"
          >
            <el-option
              v-for="(v, k) in orderField"
              :key="k"
              :label="v"
              :value="k"
            ></el-option>
          </el-select>
          <el-select
            v-model="order2"
            placeholder="排序方式"
            class="handle-select mr10"
          >
            <el-option
              v-for="(v, k) in orderMethod"
              :key="k"
              :label="v"
              :value="k"
            ></el-option>
          </el-select>
        </div>
      </div>
      
      <!-- 表格 -->
      <el-table
        :data="studentStore.studentInfo.results"
        border
        class="table"
        ref="multipleTable"
        header-cell-class-name="table-header"
      >
        <el-table-column prop="name" label="学生姓名"></el-table-column>
        <el-table-column
          prop="id"
          label="身份证号"
          width="200"
        ></el-table-column>
        <el-table-column
          prop="student_id"
          label="准考证号"
          width="200"
        ></el-table-column>
        <el-table-column prop="sex" label="性别" width="100"></el-table-column>
        <el-table-column
          prop="class_num"
          label="班级"
          width="100"
        ></el-table-column>
        <el-table-column
          prop="admission_date"
          label="入学时间"
        ></el-table-column>
        <el-table-column
          prop="create_time"
          label="创建时间"
          width="230"
        ></el-table-column>
        <el-table-column
          prop="update_time"
          label="更新时间"
          width="230"
        ></el-table-column>
        <el-table-column
          prop="access_count"
          label="下载次数"
          width="100"
        ></el-table-column>
        <el-table-column label="操作" width="220" align="center">
          <template #default="scope">
            <el-button type="primary" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="danger" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          background
          layout="prev, pager, next"
          :current-page="query.page"
          :total="studentStore.studentInfo.count"
          @current-change="handlePageChange"
        ></el-pagination>
      </div>
    </div>

    <!-- 编辑弹出框 -->
    <el-dialog title="编辑" v-model="editVisible" width="25%">
      <el-form label-width="70px">
        <el-form-item label="学生姓名">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="身份证号">
          <el-input v-model="editForm.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="准考证号">
          <el-input v-model="editForm.student_id"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-input v-model="editForm.sex"></el-input>
        </el-form-item>
        <el-form-item label="班级">
          <el-input v-model="editForm.class_num"></el-input>
        </el-form-item>
        <el-form-item label="入学时间">
          <el-input v-model="editForm.admission_date"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editVisible = false">取 消</el-button>
          <el-button type="primary" @click="doEdit"
            >确 定</el-button
          >
        </span>
      </template>
    </el-dialog>

    <!-- 新增弹出框 -->
    <el-dialog title="新增学生" v-model="addVisible" width="25%">
      <el-form label-width="70px">
        <el-form-item label="学生姓名">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="身份证号">
          <el-input v-model="addForm.id"></el-input>
        </el-form-item>
        <el-form-item label="准考证号">
          <el-input v-model="addForm.student_id"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-input v-model="addForm.sex"></el-input>
        </el-form-item>
        <el-form-item label="班级">
          <el-input v-model="addForm.class_num"></el-input>
        </el-form-item>
        <el-form-item label="入学时间">
          <el-input v-model="addForm.admission_date"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addVisible = false">取 消</el-button>
          <el-button type="primary" @click="doAdd"
            >确 定</el-button
          >
        </span>
      </template>
    </el-dialog>

  </div>
</template>

<style scoped>

.ordersel {
    float :left;
}
.container {
  padding: 30px;
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
</style>
