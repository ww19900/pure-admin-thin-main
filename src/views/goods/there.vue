<template>
  <div>
    <div id="shop_but">
      <el-button type="primary" style="margin-left: 15px" @click="xinzeng"
        >新增</el-button
      >
    </div>
    <el-table :data="data">
      <el-table-column type="selection" align="center" />
      <el-table-column prop="id" label="商品轮播ID" sortable align="center" />
      <el-table-column prop="gname" label="商品名称" align="center" />
      <el-table-column prop="name" label="商品轮播名称" align="center" />
      <el-table-column prop="img" label="商品轮播图片" align="center">
        <template #default="scope">
          <el-image
            style="width: 60px; height: 60px"
            :src="scope.row.imgs"
            fixed
          />
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template #default="scopes">
          <el-button
            link
            type="primary"
            size="small"
            @click="compile(scopes.row)"
            >编辑</el-button
          >
          <el-button
            link
            type="primary"
            size="small"
            style="color: red"
            @click="delet(scopes.row.id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
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
    <!-- 表单 -->
    <el-dialog v-model="dialogTableVisible" :title="title">
      <!-- 表单 -->
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
          prop="gid"
          label="商品ID"
          style="display: flex; align-items: center"
        >
          <el-select v-model="rule.gid" class="m-2" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="rule.name" />
        </el-form-item>
        <el-form-item label="分类图标" prop="img">
          <el-upload
            :action="'https://c2c.kuxia.top/pcapi/index/upload'"
            list-type="picture-card"
            multiple
            v-model:file-list="fileList"
            :on-preview="handlePictureCardPreview"
            limit:string="1"
            name="file"
            :on-success="succ"
          >
            <el-icon><Plus /></el-icon>
          </el-upload>
          <el-dialog v-model="dialog">
            <img w-full :src="dialogImageUrl" alt="Preview Image" />
          </el-dialog>
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
import { ref, reactive } from "vue";
import { ElTable } from "element-plus";
import type { FormInstance, FormRules } from "element-plus";
import { Plus } from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";
import axios from "axios";
const tableData = ref();
const data_length = ref();
const data = ref([]);
const pageSize4 = ref(10);
const age = ref(1);
const small = ref(false);
const background = ref(false);

// 表单
const dialogTableVisible = ref(false);
const ruleFormRef = ref<FormInstance>();
const fileList = ref([]);
const dialogImageUrl = ref("");
const dialog = ref(false);
const title = ref("新增");
const userid = ref();
const options = ref([]);
axios({
  url: "https://c2c.kuxia.top/pcapi/goods/index"
}).then(src => {
  console.log(src);
  for (let i = 0; i < src.data.data.length; i++) {
    options.value.push({
      label: src.data.data[i].name,
      value: src.data.data[i].id
    });
  }
});
const self_call = () => {
  axios({
    url: "https://c2c.kuxia.top/pcapi/banner/index"
  }).then(src => {
    console.log(src);
    data.value = [];
    if (src.data.code == 1) {
      data_length.value = src.data.data.length;
      tableData.value = src.data.data;
      for (
        let b = (age.value - 1) * pageSize4.value;
        b < age.value * pageSize4.value;
        b++
      ) {
        if (tableData.value[b]) {
          data.value.push(tableData.value[b]);
        }
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

// 新增表单

const rule = reactive({
  name: "",
  img: "",
  gid: ""
});
const rules = reactive<FormRules>({
  name: [{ required: true, message: "请输入名称", trigger: "blur" }],
  img: [{ required: true, message: "请输入轮播图片", trigger: "blur" }],
  gid: [{ required: true, message: "请选择商品ID", trigger: "blur" }]
});

// 上传图片
const handlePictureCardPreview = file => {
  console.log(file);
  dialog.value = true;
  dialogImageUrl.value = file.url;
};
const succ = () => {
  rule.img = fileList.value[0].response.url;
};
const xinzeng = () => {
  title.value = "新增";
  dialogTableVisible.value = true;
};
const submitForm = async (formEl: FormInstance | undefined) => {
  if (fileList.value.length <= 0) {
    rule.img = "";
  }
  if (!formEl) return;
  await formEl.validate(valid => {
    if (valid) {
      if (title.value == "新增") {
        axios({
          url: "https://c2c.kuxia.top/pcapi/banner/add",
          params: {
            name: rule.name,
            img: rule.img,
            gid: rule.gid
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
          dialogTableVisible.value = false;
          formEl.resetFields();
          fileList.value = [];
        });
      } else {
        axios({
          url: "https://c2c.kuxia.top/pcapi/banner/update",
          params: {
            id: userid.value,
            name: rule.name,
            img: rule.img,
            gid: rule.gid
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
          dialogTableVisible.value = false;
          formEl.resetFields();
          fileList.value = [];
        });
      }
    } else {
      ElMessage({
        message: "请填写完整",
        type: "warning"
      });
    }
  });
};

const resetForm = (formEl: FormInstance | undefined) => {
  dialogTableVisible.value = false;
  if (!formEl) return;
  formEl.resetFields();
  fileList.value = [];
  rule.gid = "";
  rule.name = "";
};
// 编辑
const compile = data => {
  dialogTableVisible.value = true;
  title.value = "编辑";
  rule.gid = data.gid;
  userid.value = data.id;
  rule.name = data.name;
  rule.img = data.img;
  fileList.value.push({
    url: data.imgs
  });
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
          url: "https://c2c.kuxia.top/pcapi/banner/del",
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
