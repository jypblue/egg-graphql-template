<template>
  <div class="yit-suspect yit-suspect-blacklist">
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
      :data="suspectBlack"
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
          <el-button type="primary" size="small">取消订单</el-button>
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
// import '@/assets/file/riskControlData.getRiskBlackUserList';

export default {
  name: 'yit-suspect-blacklist',
  data() {
    return {
      offset: 0,
      limit: 10,
      currentPage: 1,
      total: 0,
      suspectBlack: [],
      searchForm: {
        userId: '',
      }
    };
  },
  watch: {
    $route: {
      immediate: true,
      handler(to, from) {
        if (to.name === 'RiskSuspectBlacklist') {
          // this.getRiskBlackUserList();
        }
      }
    }
  },
  methods: {
    async getRiskBlackUserList() {
      try {
        const params = {
          mt: 'riskControlData.getRiskBlackUserList',
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
          this.suspectBlack = data.rows;
          this.total = data.total;
          console.log('result:', data);

        } else {
          this.fnShowErrorMessage(result[0].state.message);
        }

      } catch (error) {
        console.error('error:', error);
      }
    },
    handleSubmit() {
      this.getRiskBlackUserList();
    },
    handleCurrentChange(val) {
      const offset = val > 1 ? (val - 1) * this.limit : 0;
      this.currentPage = val;
      this.offset = offset;
      this.getRiskBlackUserList();
    },
  }
};
</script>

<style lang="scss">
  @import './suspect.scss';
</style>
