<template>
  <div>
    <div id="shop_but">
      <el-button type="primary" style="margin-left: 15px" @click="xinzeng"
        >新增</el-button
      >
    </div>
    <el-table :data="data">
      <el-table-column prop="id" label="账户ID" sortable align="center" />
      <el-table-column prop="account" label="账户名称" align="center" />
      <el-table-column prop="name" label="角色名称" align="center" />
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button
            link
            type="primary"
            size="small"
            @click="compile(scope.row)"
            >编辑</el-button
          >
          <el-button
            link
            type="primary"
            size="small"
            style="color: red"
            @click="delet(scope.row.id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div
      class="demo-pagination-block"
      style="display: flex; align-items: center; justify-content: center"
    >
      <el-pagination
        v-model:page-size="pageSize4"
        :page-sizes="[5, 10, 20, 30]"
        :small="small"
        :background="background"
        layout="total, sizes, prev, pager, next, jumper"
        :total="data_length"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <el-dialog v-model="dialogFormVisible" :title="status">
      <el-form
        label-position="left"
        ref="ruleFormRef"
        :model="rule"
        :rules="rules"
        label-width="120px"
        class="demo-ruleForm"
        status-icon
      >
        <el-form-item
          label="商品类型"
          prop="rid"
          style="display: flex; align-items: center"
        >
          <el-select v-model="rule.rid" class="m-2" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="账户名称" prop="name">
          <el-input v-model="rule.name" />
        </el-form-item>
        <el-form-item label="账户密码" prop="pass">
          <el-input v-model="rule.pass" type="password" show-password />
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="resetForm(ruleFormRef)">取消</el-button>
          <el-button type="primary" @click="submitForm(ruleFormRef)">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import axios from "axios";
import { ref, reactive } from "vue";
import { ElMessage, FormInstance, FormRules, ElMessageBox } from "element-plus";
const data_length = ref();
const pageSize4 = ref(10);
const small = ref(false);
const background = ref(false);
const dialogFormVisible = ref(false);
const ruleFormRef = ref<FormInstance>();
const status = ref("新增");
const tableData = ref();
const data = ref([]);
const age = ref(1);
const options = ref([]);
const uid = ref();
axios({
  url: "https://c2c.kuxia.top/pcapi/power/role_list"
}).then(src => {
  console.log(src);
  for (let i = 0; i < src.data.data.length; i++) {
    options.value.push({
      label: src.data.data[i].name,
      value: src.data.data[i].id
    });
  }
});

const xinzeng = () => {
  dialogFormVisible.value = true;
  status.value = "新增";
};
const self_call = () => {
  axios({
    url: "https://c2c.kuxia.top/pcapi/power/account_list"
  }).then(src => {
    data_length.value = src.data.data.length;
    tableData.value = src.data.data;
    data.value = [];
    for (
      let b = (age.value - 1) * pageSize4.value;
      b < age.value * pageSize4.value;
      b++
    ) {
      if (tableData.value[b]) {
        data.value.push(tableData.value[b]);
      }
    }
  });
};
self_call();
// 分页功能
const handleSizeChange = (val: number) => {
  pageSize4.value = val;
  data.value = [];
  for (
    let b = (age.value - 1) * pageSize4.value;
    b < age.value * pageSize4.value;
    b++
  ) {
    if (tableData.value[b]) {
      data.value.push(tableData.value[b]);
    }
  }
};

const handleCurrentChange = (val: number) => {
  age.value = val;
  data.value = [];
  for (
    let b = (age.value - 1) * pageSize4.value;
    b < age.value * pageSize4.value;
    b++
  ) {
    if (tableData.value[b]) {
      data.value.push(tableData.value[b]);
    }
  }
};
const rule = reactive({
  name: "",
  pass: "",
  rid: ""
});
const rules = reactive<FormRules>({
  name: [{ required: true, message: "请输入页面名称", trigger: "blur" }],
  pass: [{ required: true, message: "请输入页面名称", trigger: "blur" }],
  rid: [{ required: true, message: "请输入页面名称", trigger: "blur" }]
});
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(valid => {
    if (valid) {
      if (status.value == "新增") {
        axios({
          url: "https://c2c.kuxia.top/pcapi/power/account_add",
          params: {
            account: rule.name,
            pass: rule.pass,
            rid: rule.rid
          }
        }).then(src => {
          if (src.data.code == 1) {
            ElMessage({
              message: src.data.msg,
              type: "success"
            });
          } else {
            ElMessage.error(src.data.msg);
          }
          self_call();
        });
      } else {
        axios({
          url: "https://c2c.kuxia.top/pcapi/power/account_update",
          params: {
            id: uid.value,
            account: rule.name,
            pass: rule.pass,
            rid: rule.rid
          }
        }).then(src => {
          if (src.data.code == 1) {
            ElMessage({
              message: src.data.msg,
              type: "success"
            });
          } else {
            ElMessage.error(src.data.msg);
          }
          self_call();
          formEl.resetFields();
        });
      }
      dialogFormVisible.value = false;
    } else {
      console.log();
    }
  });
};

const compile = data => {
  console.log(data);
  status.value = "编辑";
  uid.value = data.id;
  rule.name = data.account;
  rule.pass = data.pass;
  rule.rid = data.rid;
  dialogFormVisible.value = true;
};

const resetForm = (formEl: FormInstance | undefined) => {
  dialogFormVisible.value = false;
  if (!formEl) return;
  formEl.resetFields();
};

// 删除
const delet = id => {
  if (id == 1) return;
  ElMessageBox.confirm("是否确认删除", {
    confirmButtonText: "是",
    cancelButtonText: "否",
    type: "warning"
  })
    .then(() => {
      axios({
        url: "https://c2c.kuxia.top/pcapi/power/account_del",
        params: {
          id: id
        }
      }).then(src => {
        if (src.data.code == 1) {
          ElMessage({
            type: "success",
            message: "删除成功"
          });
        } else {
          ElMessage({
            type: "info",
            message: "删除失败请刷新后重试"
          });
        }
        self_call();
      });
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "取消操作"
      });
    });
};
</script>

<style scoped>
#shop_but {
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  background-color: #ffffff;
}

.avatar-uploader .avatar {
  width: 100px;
  height: 100px;
  display: block;
}
</style>
