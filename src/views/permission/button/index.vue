<template>
  <div>
    <el-table :data="data" style="width: 100%">
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
      <el-table-column prop="tel" label="用户电话" align="center" width="150" />
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
      <el-table-column prop="money" label="交易金额" align="center" sortable />
      <el-table-column
        prop="createtime"
        label="交易时间"
        align="center"
        sortable
        width="200px"
      />
      <el-table-column prop="address" label="操作" align="center" fixed="right">
        <template #default="scoped">
          <el-button
            link
            type="primary"
            size="small"
            @click="xinzeng(scoped.row)"
            >更多</el-button
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
import { ElMessage, ElMessageBox } from "element-plus";
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
const loading2 = ref(false);
const self_call = () => {
  axios({
    url: "https://c2c.kuxia.top/pcapi/user/trading"
  }).then(src => {
    data.value = [];
    data_length.value = src.data.data.length;
    tableData.value = src.data.data;
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

const beforeChange2 = data => {
  // console.log(data);.
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
      self_call();
    });
  } else {
    data.status = true;
    ElMessage.error("操作失败，已通过审核");
    // data.status == true;
  }
};
const xinzeng = id => {
  console.log(id);
  if (id != 1) {
    ElMessageBox.confirm("是否通过", {
      confirmButtonText: "是",
      cancelButtonText: "否",
      type: "warning"
    })
      .then(() => {
        axios({
          url: "https://c2c.kuxia.top/pcapi/user/examine",
          params: {
            id: id
          }
        }).then(src => {
          if (src.data.code == 1) {
            ElMessage({
              type: "success",
              message: "审核成功"
            });
            self_call();
          } else {
            ElMessage({
              type: "info",
              message: "审核失败请刷新后重试"
            });
          }
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
.example-showcase .el-dropdown-link {
  cursor: pointer;
  display: flex;
  align-items: center;
}
</style>
