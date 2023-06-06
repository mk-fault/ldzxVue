<script setup>
import { ref, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useStudentStore } from "@/stores/student";


const studentdata = ref([
  {
    id: "513322200003140011",
    student_id: "18041817",
    name: "张三",
    class_num: 1,
    sex: 1,
    admission_date: 2023,
    create_time: "2023-05-11T15:27:31.796421",
    update_time: "2023-06-02T21:38:45.944248",
    access_count: 56,
  },
  {
    id: "513323197501303516",
    student_id: "18041818",
    name: "张四",
    class_num: 1,
    sex: 0,
    admission_date: 2023,
    create_time: "2023-05-11T15:53:16.192572",
    update_time: "2023-05-11T15:53:16.192600",
    access_count: 0,
  },
  {
    id: "513323197501303517",
    student_id: "18041819",
    name: "张五",
    class_num: 1,
    sex: 1,
    admission_date: 2000,
    create_time: "2023-05-12T10:02:28.006249",
    update_time: "2023-05-12T10:02:28.006278",
    access_count: 0,
  },
  {
    id: "513323197501303518",
    student_id: "18041820",
    name: "张六",
    class_num: 1,
    sex: 0,
    admission_date: 2018,
    create_time: "2023-05-12T10:04:01.206830",
    update_time: "2023-05-12T10:04:01.206851",
    access_count: 0,
  },
  {
    id: "513323197501303519",
    student_id: "18041821",
    name: "张八",
    class_num: 5,
    sex: 1,
    admission_date: 2023,
    create_time: "2023-05-12T10:04:13.445381",
    update_time: "2023-05-15T15:22:28.333694",
    access_count: 0,
  },
  {
    id: "513323197501303520",
    student_id: "18041822",
    name: "李一",
    class_num: 1,
    sex: 1,
    admission_date: 2080,
    create_time: "2023-06-05T15:39:05.519721",
    update_time: "2023-06-05T15:39:05.519746",
    access_count: 0,
  },
  {
    id: "513323197501303521",
    student_id: "18041823",
    name: "李二",
    class_num: 2,
    sex: 0,
    admission_date: 2080,
    create_time: "2023-06-05T15:39:05.527427",
    update_time: "2023-06-05T15:39:05.527449",
    access_count: 0,
  },
  {
    id: "513323197501303522",
    student_id: "18041824",
    name: "李三",
    class_num: 3,
    sex: 1,
    admission_date: 2080,
    create_time: "2023-06-05T15:39:05.534207",
    update_time: "2023-06-05T15:39:05.534230",
    access_count: 0,
  },
  {
    id: "513323197501303523",
    student_id: "18041825",
    name: "李四",
    class_num: 4,
    sex: 1,
    admission_date: 2080,
    create_time: "2023-06-05T15:39:05.540520",
    update_time: "2023-06-05T15:39:05.540542",
    access_count: 0,
  },
  {
    id: "513323197501303524",
    student_id: "18041826",
    name: "李五",
    class_num: 5,
    sex: 0,
    admission_date: 2080,
    create_time: "2023-06-05T15:39:05.543948",
    update_time: "2023-06-05T15:39:05.543972",
    access_count: 0,
  },
  {
    id: "513323197501303523",
    student_id: "18041825",
    name: "李四",
    class_num: 4,
    sex: 1,
    admission_date: 2080,
    create_time: "2023-06-05T15:39:05.540520",
    update_time: "2023-06-05T15:39:05.540542",
    access_count: 0,
  },
  {
    id: "513323197501303524",
    student_id: "18041826",
    name: "李五",
    class_num: 5,
    sex: 0,
    admission_date: 2080,
    create_time: "2023-06-05T15:39:05.543948",
    update_time: "2023-06-05T15:39:05.543972",
    access_count: 0,
  },
  {
    id: "513323197501303523",
    student_id: "18041825",
    name: "李四",
    class_num: 4,
    sex: 1,
    admission_date: 2080,
    create_time: "2023-06-05T15:39:05.540520",
    update_time: "2023-06-05T15:39:05.540542",
    access_count: 0,
  },
]);
const total = ref(80);

const editVisible = ref(false);
const handelEdit = () => {
  editVisible.value = true;
};

const editForm = ref({
  id: "513322200003140011",
  student_id: "18041817",
  name: "张三",
  class_num: 1,
  sex: 1,
  admission_date: 2023,
});

// 筛选字段
const filterField = ref({
  id: "身份证号",
  sex: "性别",
  admission_date: "入学年份",
  max_admission_date: "最大入学年份",
  min_admission_date: "最小入学年份",
  max_student_id: "最大学号",
  min_student_id: "最小学号",
  student_id: "学号",
  class_num: "班级",
  name: "姓名",
});
// 排序字段
const orderField = ref({
  id: "身份证号",
  sex: "性别",
  admission_date: "入学年份",
  student_id: "学号",
  class_num: "班级",
  name: "姓名",
  create_time: "创建时间",
  update_time: "更新时间",
});
const orderMethod = ref({
  "-": "降序",
  "+": "升序",
});
const order1 = ref("");
const order2 = ref("");
const orderby = computed(() => {
    return order2.value + order1.value;
})

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
        <el-button type="primary" style="float: right">新增</el-button>
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
          <template #default>
            <el-button type="primary" @click="handelEdit">编辑</el-button>
            <el-button type="danger">删除</el-button>
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
          <el-input v-model="editForm.id"></el-input>
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
          <el-button type="primary" @click="editVisible = false"
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
