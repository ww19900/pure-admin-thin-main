<template>
  <div>
    <el-button type="primary" @click="hhh(0)">全部订单</el-button>
    <el-button type="primary" @click="hhh(1)">未付款</el-button>
    <el-button type="primary" @click="hhh(2)">已付款</el-button>
    <el-button type="primary" @click="hhh(3)">已发货</el-button>
    <el-button type="primary" @click="hhh(4)">已收货</el-button>
    <el-button type="primary" @click="hhh(5)">已评价</el-button>
    <el-button type="primary" @click="hhh(6)">退款中</el-button>
    <el-button type="primary" @click="hhh(7)">已退款</el-button>
    <el-button type="primary" @click="hhh(8)">已取消</el-button>
    <el-table :data="data" style="width: 100%">
      <el-table-column type="selection" align="center" />
      <el-table-column
        fixed
        prop="id"
        label="订单ID"
        width="150"
        align="center"
        sortable
      />
      <el-table-column
        prop="total"
        label="商品总价"
        width="150"
        align="center"
        sortable
      />
      <el-table-column
        prop="uname"
        label="用户名称"
        align="center"
        width="200px"
      />
      <el-table-column
        prop="aname"
        label="收件人名称"
        align="center"
        width="200px"
      />
      <el-table-column
        prop="tel"
        label="收件人电话"
        align="center"
        width="200px"
      />
      <el-table-column
        prop="address"
        label="收件人地址"
        align="center"
        width="200px"
      />
      <el-table-column
        prop="status"
        label="订单状态"
        align="center"
        width="200px"
      >
        <template #default="scope">
          <el-tag :type="scope.row.color" disable-transitions>{{
            scope.row.status
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="order_sn"
        label="订单编号"
        align="center"
        width="200px"
      />
      <el-table-column
        prop="createtime"
        label="创建时间"
        align="center"
        width="200px"
      />
      <el-table-column
        prop="updatetime"
        label="付款时间"
        align="center"
        width="200px"
      >
        <template #default="scope">
          <el-tag
            :type="
              scope.row.updatetime === '暂无付款时间' ? 'warning' : 'success'
            "
            disable-transitions
            >{{ scope.row.updatetime }}</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column prop="address" label="操作" align="center" width="100px">
        <template #default="scoped">
          <el-button
            link
            type="primary"
            size="small"
            @click="fah(scoped.row.id)"
            >发货</el-button
          >
          <el-button
            link
            type="primary"
            size="small"
            @click="tuikuan(scoped.row.id)"
            >退款</el-button
          >
        </template>
      </el-table-column>
      <el-table-column
        prop="status"
        label="商品 筛选"
        align="center"
        fixed="right"
        width="150px"
      >
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
    <el-dialog v-model="dialogTableVisible" :title="title">
      <el-table :data="datas">
        <el-table-column
          property="name"
          label="商品名称"
          width="150"
          align="center"
        />
        <el-table-column
          property="price"
          label="商品单价"
          width="200"
          align="center"
        />
        <el-table-column property="num" label="购买数量" align="center" />
        <el-table-column property="evaluate" label="评价" align="center" />
      </el-table>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import axios from "axios";
import { ref } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
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
const dialogTableVisible = ref(false);
const title = ref();
const self_call = () => {
  axios({
    url: "https://c2c.kuxia.top/pcapi/user/order_list"
  }).then(src => {
    data.value = [];
    data_length.value = src.data.data.length;
    tableData.value = src.data.data;
    for (let i = 0; i < src.data.data.length; i++) {
      if (src.data.data[i].updatetime == null) {
        src.data.data[i].updatetime = "暂无付款时间";
      }
      if (src.data.data[i].status == 1) {
        src.data.data[i].status = "未付款";
        src.data.data[i].color = "warning";
      } else if (src.data.data[i].status == 2) {
        src.data.data[i].status = "已付款";
        src.data.data[i].color = "success";
      } else if (src.data.data[i].status == 3) {
        src.data.data[i].status = "已发货";
        src.data.data[i].color = "";
      } else if (src.data.data[i].status == 4) {
        src.data.data[i].status = "已收货";
        src.data.data[i].color = "success";
      } else if (src.data.data[i].status == 5) {
        src.data.data[i].status = "已评价";
        src.data.data[i].color = "success";
      } else if (src.data.data[i].status == 6) {
        src.data.data[i].status = "退款中";
        src.data.data[i].color = "warning";
      } else if (src.data.data[i].status == 7) {
        src.data.data[i].status = "已退款";
        src.data.data[i].color = "info";
      } else if (src.data.data[i].status == 8) {
        src.data.data[i].status = "已取消";
        src.data.data[i].color = "info";
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
const hhh = id => {
  if (id == 0) return self_call();
  axios({
    url: "https://c2c.kuxia.top/pcapi/user/order_list",
    params: {
      status: id
    }
  }).then(src => {
    data.value = [];
    data_length.value = src.data.data.length;
    tableData.value = src.data.data;
    console.log(src);
    for (let i = 0; i < src.data.data.length; i++) {
      if (src.data.data[i].updatetime == null) {
        src.data.data[i].updatetime = "暂无付款时间";
      }
      if (src.data.data[i].status == 1) {
        src.data.data[i].status = "未付款";
        src.data.data[i].color = "warning";
      } else if (src.data.data[i].status == 2) {
        src.data.data[i].status = "已付款";
        src.data.data[i].color = "success";
      } else if (src.data.data[i].status == 3) {
        src.data.data[i].status = "已发货";
        src.data.data[i].color = "";
      } else if (src.data.data[i].status == 4) {
        src.data.data[i].status = "已收货";
        src.data.data[i].color = "success";
      } else if (src.data.data[i].status == 5) {
        src.data.data[i].status = "已评价";
        src.data.data[i].color = "success";
      } else if (src.data.data[i].status == 6) {
        src.data.data[i].status = "退款中";
        src.data.data[i].color = "warning";
      } else if (src.data.data[i].status == 7) {
        src.data.data[i].status = "已退款";
        src.data.data[i].color = "info";
      } else if (src.data.data[i].status == 8) {
        src.data.data[i].status = "已取消";
        src.data.data[i].color = "info";
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

const xiangq = data => {
  console.log(data);
  for (let i = 0; i < data?.list?.length; i++) {
    if (data.list[i].evaluate == null) {
      data.list[i].evaluate = "无";
    }
  }
  dialogTableVisible.value = true;
  title.value = data.uname;
  datas.value = data.list;
};
// 发货
const fah = id => {
  ElMessageBox.confirm("是否确认发货", {
    confirmButtonText: "是",
    cancelButtonText: "否",
    type: "warning"
  })
    .then(() => {
      axios({
        url: "https://c2c.kuxia.top/pcapi/user/hair",
        params: {
          id: id
        }
      }).then(src => {
        if (src.data.code == 1) {
          ElMessage({
            type: "success",
            message: "发货成功"
          });
          self_call();
        } else {
          ElMessage({
            type: "info",
            message: "发货失败请刷新后重试"
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
};
const tuikuan = id => {
  ElMessageBox.confirm("是否确认退款", {
    confirmButtonText: "是",
    cancelButtonText: "否",
    type: "warning"
  })
    .then(() => {
      axios({
        url: "https://c2c.kuxia.top/pcapi/user/refund",
        params: {
          id: id
        }
      }).then(src => {
        if (src.data.code == 1) {
          ElMessage({
            type: "success",
            message: "退款成功"
          });
          self_call();
        } else {
          ElMessage({
            type: "info",
            message: "退款失败请刷新后重试"
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
};
</script>

<style scoped>
.example-showcase .el-dropdown-link {
  cursor: pointer;
  display: flex;
  align-items: center;
}
.item {
  margin-top: 10px;
  margin-right: 40px;
}
</style>
