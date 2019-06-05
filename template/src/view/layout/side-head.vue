<template>
   <div class="yit-sidehead">
      <div class="yit-sidehead-avatar">
        <img :src="agentData.avatarUrl" alt="" class="yit-sidehead-avatar__pic">
        <span class="yit-sidehead__avatar-name" v-if="!agentData.avatarUrl">头像</span>
        <span class="yit-sidehead__avatar-status yit-login-status" :class="[`is-bg-${formatUserStatus(agentData.status)}`]">
          <i></i>
        </span>
      </div>
      <div class="yit-sidehead__status-words">
        <el-dropdown
        @command="handleCommand"
        >
          <div class="yit-dropdown-link" >
            <div class="yit-sidehead__nickname" :class="[`is-color-${formatUserStatus(agentData.status)}`]">{{agentData.nickname}}</div>
            <div class="text-center" style="color:#fff">
              <i class="el-icon-arrow-down el-icon--right"></i>
            </div>

          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
            v-for="item in statusList"
            :key="item.status"
            :command="item"
            >
            <span class="yit-login-status yit-dropdown__item-status" :class="[`is-bg-${formatUserStatus(item.status)}`]">
              <i></i>
            </span>\{{item.name}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
</template>

<script>
import '@/assets/signed/callCenterAgent/getAgentInfo';
import '@/assets/signed/callCenterAgent/changeStatus';

import request from '@/http';
import {
  mapMutations,
  mapState
} from 'vuex';

export default {
  name: 'yit-side-head',
  data() {
    return {
      statusList: [{
        name: '空闲',
        status: 10
      }, {
        name: '培训',
        status: 20
      }, {
        name: '吃饭',
        status: 30
      }, {
        name: '小休',
        status: 40
      }, {
        name: '忙碌',
        status: 50
      }],
      agentData: {
        avatarUrl: '',
      },
    };
  },
  computed: {
    ...mapState({
      isAgentChange: state => state.user.isAgentChange
    })
  },
  watch: {
    isAgentChange(val) {
      if (val) {
        this.fnGetAgentInfo();
      }
    },
    $route(val) {
      this.fnGetAgentInfo();
    }
  },
  created() {
    // 获取user agent info
    this.fnGetAgentInfo();
  },
  methods: {
    ...mapMutations({
      fnSetAgentInfo: 'SET_AGENT_INFO',
    }),
    // 获取当前状态
    async fnGetAgentInfo() {
      try {
        const params = {
          mt: 'callCenterAgent.getAgentInfo',
        };

        const result = await request.get(params);
        this.agentData = result[0].data;
        // 设置全局数据状态
        this.fnSetAgentInfo(this.agentData);

      } catch (error) {
        console.log('userAgentInfo error: ', error);
      }
    },
    // 切换状态
    async fnChangeStatus(status) {
      try {
        const params = {
          mt: 'callCenterAgent.changeStatus',
          data: {
            status: status,
          }
        };

        const result = await request.post(params);
        // 重新获取当前状态值
        if (result[0].state.code === 0) {
          this.fnGetAgentInfo();
        }
      } catch (error) {
        console.log('change status error: ', error);
      }
    },
    formatUserStatus(status) {
      switch (status) {
        case 10:
          return 'online';
        case 20:
          return 'leave';
        case 30:
          return 'eating';
        case 40:
          return 'rest';
        case 50:
          return 'busy';
        default:
          return 'offline';
      }
    },
    handleCommand(val) {
      this.fnChangeStatus(val.status);
    }
  }
};
</script>

