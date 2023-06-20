<template>
  <div>
    <el-table :data="data" style="width: 100%">
      <el-table-column type="selection" align="center" />
      <el-table-column
        fixed
        prop="name"
        label="用户名称"
        width="150"
        align="center"
        sortable
      />
      <el-table-column prop="money" label="金额" align="center" />
      <el-table-column prop="title" label="说明" align="center" />
      <el-table-column prop="createtime" label="时间" align="center" sortable />
    </el-table>
    <div
      class="demo-pagination-block"
      style="
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 10px;
      "
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
    <el-drawer v-model="table" :title="title" direction="rtl" size="50%">
      <el-table :data="datas">
        <el-table-column property="avatar" label="头像">
          <template #default="scope">
            <el-image
              style="width: 60px; height: 60px"
              :src="scope.row.avatar"
              fixed
            />
          </template>
        </el-table-column>
        <el-table-column property="name" label="用户名称" />
        <el-table-column property="tel" label="电话" />
      </el-table>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import axios from "axios";
import { ref } from "vue";
// import { ElMessage, ElMessageBox } from "element-plus";
const loading1 = ref(true);
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
const self_call = () => {
  axios({
    url: "https://c2c.kuxia.top/pcapi/user/profit"
  }).then(src => {
    data.value = [];
    data_length.value = src.data.data.length;
    tableData.value = src.data.data;
    console.log(src);

    for (let i = 0; i < src.data.data.length; i++) {
      if (src.data.data[i].status == 0) {
        src.data.data[i].status = false;
        src.data.data[i].state = "";
        loading1.value = false;
      } else {
        src.data.data[i].status = true;
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
</script>

<style scoped>
.example-showcase .el-dropdown-link {
  cursor: pointer;
  display: flex;
  align-items: center;
}
</style>
