<template>
  <div>
    <div id="shop_but">
      <el-button
        type="primary"
        :icon="Plus"
        style="margin-left: 15px"
        @click="dialogFormVisible = true"
        >新增</el-button
      >
    </div>
    <el-table :data="data" style="width: 100%">
      <el-table-column type="selection" align="center" fixed height="60px" />
      <el-table-column
        prop="id"
        label="ID"
        width="100"
        align="center"
        fixed
        sortable
      />
      <el-table-column
        prop="name"
        label="商品名称"
        width="180"
        align="center"
      />
      <el-table-column prop="imgs" label="商品图片" align="center">
        <template #default="scope">
          <el-image
            style="width: 60px; height: 60px"
            :src="scope.row.imgs"
            fixed
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="tname"
        label="商品类型"
        width="180"
        align="center"
      />
      <el-table-column prop="imgs" label="商品图片" align="center">
        <template #default="scope">
          <el-image
            style="width: 60px; height: 60px"
            :src="scope.row.banners"
            fixed
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="price"
        label="商品单价"
        width="180"
        align="center"
        sortable
      />
      <el-table-column
        prop="stock"
        label="商品库存"
        width="180"
        align="center"
        sortable
      />
      <el-table-column prop="stock" label="商品推荐" width="180" align="center">
        <template #default="scope">
          <el-switch
            disabled
            inline-prompt
            active-text="是"
            inactive-text="否"
            v-model="scope.row.status"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" align="center" fixed="right">
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
      style="display: flex; align-items: center; justify-content: center"
    >
      <el-pagination
        v-model:page-size="pageSize4"
        :page-sizes="[5, 10, 20, 30]"
        :small="small"
        :disabled="disabled"
        :background="background"
        layout="total, sizes, prev, pager, next, jumper"
        :total="data_length"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <!-- 新增表单 -->
    <el-dialog v-model="dialogFormVisible" :title="status">
      <el-form
        label-position="right"
        ref="ruleFormRef"
        :model="rule"
        :rules="rules"
        label-width="120px"
        class="demo-ruleForm"
        status-icon
      >
        <el-form-item
          label="商品类型"
          prop="tid"
          style="display: flex; align-items: center"
        >
          <el-select v-model="rule.tid" class="m-2" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="rule.name" />
        </el-form-item>
        <el-form-item label="商品价格" prop="price">
          <el-input v-model="rule.price" type="number" />
        </el-form-item>
        <el-form-item label="商品数量" prop="num">
          <el-input v-model="rule.num" type="number" />
        </el-form-item>
        <el-form-item label="商品图片" prop="img">
          <el-upload
            :action="'https://c2c.kuxia.top/pcapi/index/upload'"
            list-type="picture-card"
            multiple
            :file-list="fileList"
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
        <el-form-item label="商品轮播图片" prop="image">
          <el-upload
            :action="'https://c2c.kuxia.top/pcapi/index/upload'"
            list-type="picture-card"
            :file-list="fileLists"
            multiple
            limit:string="1"
            :on-change="handleChanges"
            :before-remove="beforeRemove"
            name="file"
            :on-success="succs"
          >
            <el-icon><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        <!-- <el-form-item label="商品轮播图片" prop="image">
          <el-upload
            :action="'https://c2c.kuxia.top/pcapi/index/upload'"
            list-type="picture-card"
            :file-list="fileLists"
            multiple
            limit:string="1"
            name="file"
            :on-success="succs"
          >
            <el-icon><Plus /></el-icon>
          </el-upload>
        </el-form-item> -->
        <el-form-item label="商品介绍" prop="content">
          <div style="border: 1px solid #ccc">
            <Toolbar
              style="border-bottom: 1px solid #ccc"
              :editor="editorRef"
              :defaultConfig="toolbarConfig"
            />
            <Editor
              style="height: 200px; overflow-y: hidden"
              v-model="rule.content"
              :defaultConfig="editorConfig"
              @onCreated="handleCreated"
            />
          </div>
        </el-form-item>
        <el-form-item label="商品首页推荐" prop="state">
          <el-switch
            inline-prompt
            active-text="是"
            inactive-text="否"
            v-model="rule.state"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="resetForm(ruleFormRef)">取消</el-button>
          <el-button
            type="primary"
            @click="submitForm(ruleFormRef)"
            v-show="status == '新增'"
          >
            确定
          </el-button>
          <el-button
            type="primary"
            @click="submitForm(ruleFormRef)"
            v-show="status == '编辑'"
          >
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { Base64 } from "js-base64";
import { ElMessage, ElMessageBox } from "element-plus";
import { Plus } from "@element-plus/icons-vue";
import { reactive, ref } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import axios from "axios";
import "@wangeditor/editor/dist/css/style.css"; // 引入 css
import { onBeforeUnmount, shallowRef } from "vue";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";

//新增表单
const dialogFormVisible = ref(false);
const options = ref([]);
const dialog = ref(false);
const status = ref("新增");
// 上传图片
const fileLists = ref([]);
const fileList = ref([]);
const userid = ref();
//*******************请求接口**************
const tableData = ref();
const data_length = ref();
const data = ref([]);
// ***************结束************************

// ******************分页********************
// const currentPage4 = ref(1);
const age = ref(1);
const pageSize4 = ref(5);
const small = ref(false);
const background = ref(true);
const disabled = ref(false);
// ******************结束*******************
axios({
  url: "https://c2c.kuxia.top/pcapi/goods/type_list"
}).then(src => {
  for (let i = 0; i < src.data.data.length; i++) {
    options.value.push({
      label: src.data.data[i].name,
      value: src.data.data[i].id
    });
  }
});

const self_call = () => {
  axios({
    url: "https://c2c.kuxia.top/pcapi/goods/index",
    params: {}
  }).then(src => {
    data.value = [];
    tableData.value = src.data.data;
    data_length.value = src.data.data.length;
    for (let i = 0; i < src.data.data.length; i++) {
      if (src.data.data[i].status == 0) {
        src.data.data[i].status = false;
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
  console.log(val);
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
const ruleFormRef = ref<FormInstance>();
interface Person {
  tid: string;
  name: string;
  price: string;
  num: number | string;
  img: string;
  image: string;
  content: string;
  state: boolean | number;
}
const rule: Person = reactive({
  tid: "",
  name: "",
  price: "",
  num: "",
  img: "",
  image: "",
  content: "",
  state: false
});
const rules = reactive<FormRules>({
  tid: [{ required: true, message: "请选择商品类型", trigger: "blur" }],
  name: [{ required: true, message: "请输入商品名称", trigger: "blur" }],
  price: [{ required: true, message: "请输入商品价格", trigger: "blur" }],
  num: [{ required: true, message: "请输入商品数量", trigger: "blur" }],
  img: [{ required: true, message: "请填入商品图片", trigger: "blur" }],
  image: [{ required: true, message: "请填入商品图片", trigger: "blur" }],
  content: [{ required: true, message: "请输入商品介绍", trigger: "blur" }],
  state: [{ required: true, message: "请输入商品介绍", trigger: "blur" }]
});

const submitForm = async (formEl: FormInstance | undefined) => {
  console.log(fileLists.value, rule.image);
  // if (fileLists.value.length <= 0) {
  //   rule.image = "";
  // }
  // if (fileList.value.length <= 0) {
  //   rule.img = "";
  // }
  const encodePwd = Base64.encode(rule.content); //加密
  if (!formEl) return;
  await formEl.validate(valid => {
    if (valid) {
      if (rule.state == false) {
        rule.state = 0;
      } else {
        rule.state = 1;
      }
      if (status.value == "新增") {
        axios({
          url: "https://c2c.kuxia.top/pcapi/goods/add",
          params: {
            name: rule.name,
            img: rule.img,
            tid: rule.tid,
            price: rule.price,
            stock: rule.num,
            introduce: encodePwd,
            banner: rule.image,
            status: rule.state
          }
        }).then(src => {
          if (src.data.code == 1) {
            self_call();
            ElMessage({
              message: src.data.msg,
              type: "success"
            });
            dialogFormVisible.value = false;
            formEl.resetFields();
            // 空
            fileList.value = [];
            fileLists.value = [];
            rule.tid = "";
            rule.name = "";
            rule.price = "";
            rule.num = "";
            rule.img = "";
            rule.image = "";
            rule.content = "";
            rule.state = false;
          } else {
            ElMessage.error(src.data.msg);
          }
        });
      } else {
        console.log(rule);
        axios({
          url: "https://c2c.kuxia.top/pcapi/goods/update",
          params: {
            id: userid.value,
            name: rule.name,
            img: fileLists.value[0].response.url,
            tid: rule.tid,
            price: rule.price,
            stock: rule.num,
            introduce: encodePwd,
            banner: fileLists.value[0].response.url,
            status: rule.state
          }
        }).then(src => {
          console.log(src);
          if (src.data.code == 1) {
            self_call();
            ElMessage({
              message: src.data.msg,
              type: "success"
            });
            dialogFormVisible.value = false;
            formEl.resetFields();
            // 空
            fileList.value = [];
            fileLists.value = [];
            rule.tid = "";
            rule.name = "";
            rule.price = "";
            rule.num = "";
            rule.img = "";
            rule.image = "";
            rule.content = "";
            rule.state = false;
          } else {
            ElMessage.error(src.data.msg);
          }
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
  dialogFormVisible.value = false;
  if (!formEl) return;
  formEl.resetFields();
  // 空
  fileList.value = [];
  fileLists.value = [];
  rule.tid = "";
  rule.name = "";
  rule.price = "";
  rule.num = "";
  rule.img = "";
  rule.image = "";
  rule.content = "";
  rule.state = false;
};

// const qingkong = () => {};
//编辑
const compile = data => {
  console.log(data);
  status.value = "编辑";
  userid.value = data.id;
  dialogFormVisible.value = true;
  rule.tid = data.tid;
  rule.name = data.name;
  rule.price = data.price;
  rule.num = data.stock;
  rule.img = data.img;
  rule.image = data.banner;
  rule.content = data.introduce;
  rule.state = data.status;
  fileList.value.push({
    url: "https://c2c.kuxia.top" + data.img
  });
  fileLists.value.push({
    url: data.banners[0]
  });
};

// 删除
const delet = id => {
  ElMessageBox.confirm("是否确认删除", {
    confirmButtonText: "是",
    cancelButtonText: "否",
    type: "warning"
  })
    .then(() => {
      axios({
        url: "https://c2c.kuxia.top/pcapi/goods/del",
        params: {
          id: id
        }
      }).then(src => {
        if (src.data.code == 1) {
          self_call();
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
      });
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "取消操作"
      });
    });
};
// 富文本编译器
// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef();
const toolbarConfig = {};
const editorConfig = { placeholder: "请输入内容..." };

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor == null) return;
  editor.destroy();
});

const handleCreated = editor => {
  editorRef.value = editor; // 记录 editor 实例，重要！
};

// 上传图片
const dialogImageUrl = ref("");
const handlePictureCardPreview = file => {
  console.log(file);
  dialog.value = true;
  dialogImageUrl.value = file.url;
};

const succ = src => {
  rule.img = src.url;
  console.log(src.url);
};
const succs = src => {
  rule.image = src.url;
  console.log(fileLists.value);
};
</script>

<style scoped>
#shop_but {
  width: 100%;
  height: 80px;
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
