<template>
  <div>
    <el-table :data="data" style="width: 100%">
      <el-table-column type="selection" align="center" />
      <el-table-column
        fixed
        prop="id"
        label="用户ID"
        width="150"
        align="center"
      />
      <el-table-column
        prop="name"
        label="用户名称"
        align="center"
        width="150"
      />
      <el-table-column prop="avatar" label="用户头像" align="center">
        <template #default="scope">
          <el-image
            style="width: 60px; height: 60px"
            :src="scope.row.avatar"
            fixed
          />
        </template>
      </el-table-column>

      <el-table-column prop="tel" label="用户电话" align="center" width="150" />
      <el-table-column prop="gender" label="性别" align="center" />
      <el-table-column prop="trading" label="余额" align="center" />
      <el-table-column fixed="right" label="操作" width="200" align="center">
        <template #default="scope">
          <el-button link type="primary" size="small" @click="xiangq(scope.row)"
            >详情</el-button
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
    <!-- 抽屉 -->
    <el-dialog v-model="table" title="用户详情" />

    <!-- 抽屉 -->
    <el-drawer v-model="tables" title="用户详情" direction="rtl" size="75%">
      <!-- 页头 -->
      <div
        style="
          display: flex;
          justify-content: space-around;
          align-items: center;
        "
      >
        <span
          class="text-large font-600 mr-3"
          style="width: 100%; height: 40px; display: flex; align-items: center"
        >
          {{ title }}
        </span>
        <el-button type="primary" @click="chong">充值</el-button>
      </div>
      <el-tabs v-model="activeName" class="demo-tabs" type="card">
        <el-tab-pane label="一级用户" name="first">
          <el-table :data="datas.first" style="border: 1px solid #ccc">
            <el-table-column property="avatar" label="头像" align="center">
              <template #default="scope">
                <el-image
                  style="width: 60px; height: 60px"
                  :src="scope.row.avatar"
                  fixed
                />
              </template>
            </el-table-column>
            <el-table-column property="name" label="用户名称" align="center" />
            <el-table-column property="tel" label="电话" align="center" />
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="二级用户" name="second">
          <el-table :data="datas.second" style="border: 1px solid #ccc">
            <el-table-column property="avatar" label="头像" align="center">
              <template #default="scope">
                <el-image
                  style="width: 60px; height: 60px"
                  :src="scope.row.avatar"
                  fixed
                />
              </template>
            </el-table-column>
            <el-table-column property="name" label="用户名称" align="center" />
            <el-table-column property="tel" label="电话" align="center" />
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="交易记录" name="jiaoyi">
          <el-table :data="jiaoyi_datas" style="width: 100%">
            <el-table-column type="selection" align="center" />
            <el-table-column
              fixed
              prop="id"
              label="交易ID"
              width="150"
              align="center"
              sortable
            />
            <el-table-column prop="title" label="交易名称" align="center" />
            <el-table-column
              prop="name"
              label="用户名称"
              align="center"
              width="150"
            />
            <el-table-column
              prop="tel"
              label="用户电话"
              align="center"
              width="150"
            />
            <el-table-column prop="status" label="审核状态" align="center">
              <template #default="scope">
                <el-switch
                  class="ml-2"
                  :loading="loading2"
                  @change="beforeChange2(scope.row)"
                  active-text="是"
                  inactive-text="否"
                  v-model="scope.row.status"
                  inline-prompt
                />
              </template>
            </el-table-column>
            <el-table-column
              prop="money"
              label="交易金额"
              align="center"
              sortable
              width="200px"
            />
            <el-table-column
              prop="createtime"
              label="交易时间"
              align="center"
              sortable
              width="200px"
            />
            <el-table-column
              prop="address"
              label="操作"
              align="center"
              fixed="right"
            >
              <template #default>
                <el-button link type="primary" size="small">更多</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div
            class="demo-pagination-block"
            style="display: flex; align-items: center; justify-content: center"
          >
            <el-pagination
              v-model:page-size="jiaoyi_page"
              :page-sizes="[5, 10, 20, 30]"
              :small="small"
              :background="background"
              layout="total, sizes, prev, pager, next, jumper"
              :total="jiaoyi_length"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-drawer>
    <!-- 充值 -->
    <el-dialog v-model="dialog" title="充值">
      <el-form
        ref="formRef"
        :model="numberValidateForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item
          label="金额"
          prop="age"
          :rules="[
            { required: true, message: '请输入要充值的金额' },
            { type: 'number', message: 'age must be a number' }
          ]"
        >
          <el-input
            v-model.number="numberValidateForm.age"
            type="number"
            autocomplete="off"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="resetForm(formRef)">取消</el-button>
          <el-button type="primary" @click="submitForm(formRef)">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import axios from "axios";
import { reactive, ref } from "vue";
import type { FormInstance } from "element-plus";
import { ElMessage } from "element-plus";

const tableData = ref([]);
// 分页
const pageSize4 = ref(10);
const small = ref(false);
const data_length = ref();
const background = ref(false);
const age = ref(1);
const data = ref([]);
const datas = ref();
// 弹窗
const table = ref(false);
const title = ref();
// 抽屉
const tables = ref(false);
const activeName = ref("first");

// 交易记录
const jiaoyi_data = ref(); //总数据
const jiaoyi_datas = ref([]);
const jiaoyi_length = ref(); //数据长度
const jiaoyi_age = ref(1);
const jiaoyi_page = ref(10);
const jiaoyi_id = ref();
const loading2 = ref(false);
const dialog = ref(false);
const formRef = ref<FormInstance>();
const chong = () => {
  dialog.value = true;
};
const jiaoyi_call = () => {
  axios({
    url: "https://c2c.kuxia.top/pcapi/user/trading",
    params: {
      uid: jiaoyi_id.value
    }
  }).then(src => {
    jiaoyi_length.value = src.data.data.length;
    jiaoyi_data.value = src.data.data;
    for (let i = 0; i < src.data.data.length; i++) {
      if (src.data.data[i].status == 0) {
        src.data.data[i].status = false;
      } else {
        src.data.data[i].status = true;
      }
    }
    for (
      let b = (jiaoyi_age.value - 1) * jiaoyi_page.value;
      b < jiaoyi_age.value * jiaoyi_page.value;
      b++
    ) {
      if (jiaoyi_data.value[b]) {
        jiaoyi_datas.value.push(jiaoyi_data.value[b]);
      }
    }
  });
};

const self_call = () => {
  axios({
    url: "https://c2c.kuxia.top/pcapi/user/index"
  }).then(src => {
    data_length.value = src.data.data.length;
    tableData.value = src.data.data;
    for (let i = 0; i < src.data.data.length; i++) {
      if (src.data.data[i].gender == 0) {
        src.data.data[i].gender = "男";
      } else if (src.data.data[i].gender == 1) {
        src.data.data[i].gender = "女";
      } else if (src.data.data[i].gender == 2) {
        src.data.data[i].gender = "保密";
      }
    }
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

// 弹窗
const xiangq = data => {
  jiaoyi_id.value = data.id;
  jiaoyi_call();
  title.value = data.name;
  tables.value = true;
  // dialog.value = true;
  datas.value = data;
};

// 交易记录
const beforeChange2 = data => {
  if (data.status == true) {
    axios({
      url: "https://c2c.kuxia.top/pcapi/user/examine",
      params: {
        id: data.id
      }
    }).then(src => {
      console.log(src);
      if (src.data.code == 1) {
        ElMessage({
          message: "审核通过",
          type: "success"
        });
      } else {
        ElMessage({
          message: "请刷新后重试",
          type: "warning"
        });
      }
      jiaoyi_call();
    });
  } else {
    data.status = true;
    ElMessage.error("操作失败，已通过审核");
    // data.status == true;
  }
};

// 充值
const numberValidateForm = reactive({
  age: 0
});

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate(valid => {
    if (valid) {
      if (numberValidateForm.age > 0) {
        axios({
          url: "https://c2c.kuxia.top/pcapi/user/recharge",
          params: {
            money: numberValidateForm.age,
            uid: jiaoyi_id.value
          }
        }).then(src => {
          if (src.data.code == 1) {
            ElMessage({
              message: src.data.msg,
              type: "success"
            });
          } else {
            ElMessage({
              message: src.data.msg,
              type: "warning"
            });
          }
          dialog.value = false;
          formEl.resetFields();
        });
      } else {
        ElMessage({
          message: "不能为负或0",
          type: "warning"
        });
      }
    } else {
      return false;
    }
  });
};

const resetForm = (formEl: FormInstance | undefined) => {
  dialog.value = false;
  if (!formEl) return;
  formEl.resetFields();
};
</script>

<style scoped>
.example-showcase .el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
}
</style>
