<template>
  <div>
    <div id="shop_but">
      <el-button type="primary" style="margin-left: 15px" @click="xinzeng(0)"
        >新增一级</el-button
      >
    </div>
    <el-table
      :data="data"
      style="width: 100%; margin-bottom: 20px"
      row-key="id"
    >
      <el-table-column prop="pid" label="上级ID" sortable />
      <el-table-column prop="id" label="ID" sortable />
      <el-table-column prop="name" label="页面名称" align="center" />
      <el-table-column prop="address" label="操作" align="center">
        <template #default="scoped">
          <el-button
            link
            type="primary"
            size="small"
            @click="xinzeng(scoped.row.id)"
            >新增</el-button
          >
          <el-button
            link
            type="primary"
            size="small"
            @click="compile(scoped.row)"
            >编辑</el-button
          >
          <el-button
            link
            type="primary"
            size="small"
            style="color: red"
            @click="delet(scoped.row.id)"
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
    <el-dialog v-model="dial" :title="status">
      <el-form
        label-position="left"
        ref="ruleFormRef"
        :model="rule"
        :rules="rules"
        label-width="120px"
        class="demo-ruleForm"
        status-icon
      >
        <el-form-item label="页面名称" prop="name">
          <el-input v-model="rule.name" />
        </el-form-item>
        <el-form-item label="上级ID" prop="id">
          <el-input v-model="rule.id" disabled />
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

<script setup lang="ts">
import axios from "axios";
import { ref, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import type { FormInstance, FormRules } from "element-plus";
// 分页功能
const pageSize4 = ref(10);
const small = ref(false);
const data_length = ref();
const background = ref(false);
const dial = ref(false);
const ruleFormRef = ref<FormInstance>();
const tableData = ref();
const status = ref("新增");
const userid = ref();
const data = ref([]);
const age = ref(1);
const datas = ref([]);
const self_call = () => {
  axios({
    url: "https://c2c.kuxia.top/pcapi/power/rule_list"
  }).then(src => {
    data.value = [];
    tableData.value = src.data.data;
    datas.value = transListDataToTreeData(tableData.value, 0);
    data_length.value = datas.value.length;
    for (
      let b = (age.value - 1) * pageSize4.value;
      b < age.value * pageSize4.value;
      b++
    ) {
      if (datas.value[b]) {
        data.value.push(datas.value[b]);
      }
    }
  });
};
self_call();
const transListDataToTreeData = (list, i) => {
  const arr = [];
  // 1.遍历
  list.forEach(item => {
    // 2.首次传入空字符串  判断list的pid是否为空 如果为空就是一级节点
    if (item.pid === i) {
      // 找到之后就要去找item下面有没有子节点  以 item.id 作为 父 id, 接着往下找
      const children = transListDataToTreeData(list, item.id);
      if (children.length > 0) {
        // 如果children的长度大于0,说明找到了子节点
        item.children = children;
      }
      // 将item项, 追加到arr数组中
      arr.push(item);
    }
  });
  return arr;
};
const xinzeng = id => {
  dial.value = true;
  rule.id = id;
  status.value = "新增";
};
// 分页功能
const handleSizeChange = (val: number) => {
  pageSize4.value = val;
  data.value = [];
  for (
    let b = (age.value - 1) * pageSize4.value;
    b < age.value * pageSize4.value;
    b++
  ) {
    if (datas.value[b]) {
      data.value.push(datas.value[b]);
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
    if (datas.value[b]) {
      data.value.push(datas.value[b]);
    }
  }
};

const rule = reactive({
  name: "",
  id: ""
});
const rules = reactive<FormRules>({
  name: [{ required: true, message: "请输入页面名称", trigger: "blur" }],
  id: [{ required: true, message: "请输入上级ID", trigger: "blur" }]
});

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(valid => {
    if (valid) {
      if (status.value == "新增") {
        console.log(rule);
        axios({
          url: "https://c2c.kuxia.top/pcapi/power/rule_add",
          params: {
            name: rule.name,
            pid: rule.id
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
          console.log(src);
        });
      } else {
        axios({
          url: "https://c2c.kuxia.top/pcapi/power/rule_update",
          params: {
            id: userid.value,
            pid: rule.id,
            name: rule.name
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
          console.log(src);
        });
      }
      dial.value = false;
      kong();
      // console.log("submit!");
    } else {
      ElMessage({
        message: "请填写完整",
        type: "warning"
      });
      // console.log("error submit!", fields);
    }
  });
};

const resetForm = (formEl: FormInstance | undefined) => {
  dial.value = false;
  if (!formEl) return;
  formEl.resetFields();
  kong();
};

const compile = data => {
  status.value = "编辑";
  dial.value = true;
  userid.value = data.id;
  rule.name = data.name;
  rule.id = data.id;
};
const kong = () => {
  rule.name = "";
  rule.id = "";
};
// 删除
const delet = id => {
  if (id != 1) {
    ElMessageBox.confirm("是否确认删除", {
      confirmButtonText: "是",
      cancelButtonText: "否",
      type: "warning"
    })
      .then(() => {
        axios({
          url: "https://c2c.kuxia.top/pcapi/power/rule_del",
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
  }
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
