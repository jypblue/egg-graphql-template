<template>
  <div class="yit-suspect">
    <!-- search form -->
    <el-form :inline="true" :model="searchForm" class="demo-form-inline">
      <el-form-item label="用户Id">
        <el-input v-model="searchForm.userId" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSubmit">查询</el-button>
      </el-form-item>
    </el-form>
    <!-- table -->
     <el-table
      :data="suspect"
      style="width: 100%">
      <el-table-column
        prop="id"
        label="用户Id"
        width="180">
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="用户手机号"
        width="180">
      </el-table-column>
      <el-table-column
        prop="nick"
        label="用户昵称">
      </el-table-column>
      <el-table-column
        prop="createdTime"
        label="用户注册时间">
      </el-table-column>
      <el-table-column
        label="操作">
        <template>
          <el-button type="primary" size="small">转为黑名单</el-button>
      </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="yit-pager" v-if="total">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="limit"
        layout="total, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
// 引入延签文件
// import '@/assets/file/riskControlData.getRiskWatchUserList';

export default {
  name: 'yit-suspect-list',
  data() {
    return {
      offset: 0,
      limit: 20,
      currentPage: 1,
      total: 0,
      suspect: [],
      searchForm: {
        userId: '',
      }
    };
  },
  watch: {
    $route: {
      immediate: true,
      handler(to, from) {
        console.log(to);
        if (to.name === 'RiskSuspectList') {
          // this.getEffectWatchList();
        }
      }
    }
  },
  methods: {
    async getEffectWatchList() {
      try {
        const params = {
          mt: 'riskControlData.getRiskWatchUserList',
          data: {
            searchParam: {
              userId: this.searchForm.userId || 0
            },
            page: {
              offset: this.offset,
              limit: this.limit
            }
          },
          isLoading: true
        };

        const result = await this.$axios.post(params);
        if (result[0].state.code === 0) {
          const data = result[0].data;
          this.total = data.total;
          this.suspect = data.rows;
          console.log('result:', data);
        } else {
          this.fnShowErrorMessage(result[0].state.message);
        }

      } catch (error) {
        console.error('error:', error);
      }
    },
    handleSubmit() {
      this.getEffectWatchList();
    },
    handleCurrentChange(val) {
      const offset = val > 1 ? (val - 1) * this.limit : 0;
      this.currentPage = val;
      this.offset = offset;
      this.getEffectWatchList();
    },
  }
};
</script>

<style lang="scss">
  @import './suspect.scss';
</style>
