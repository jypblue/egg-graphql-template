import {
  handleJump2SsoSystem
} from '@/utils';
import {
  uuid,
} from '@/utils/tool';
import {
  formatCents2Yuan,
  formatToFixed2
} from '@/utils/filter';
export default {
  methods: {
    uuid,
    fnShowErrorMessage(msg) {
      this.$message({
        type: 'error',
        message: msg
      });
    },
    fnReplaceEmoji(val) {
      if (!val) {
        return val;
      }
      return val.replace(/[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/ig, '');
    },
    // 分格式化成元
    formatCents2Yuan,
    // 保留两位小数
    formatToFixed2,
    clipboardSuccess(val) {
      const orderNum = val.text;
      if (orderNum) {
        this.$message({
          type: 'success',
          message: `复制成功`
        });
      }
    },
    fnGetRootUrl() {
      const protocol = window.location.protocol;
      const host = window.location.host;
      return protocol + '//' + host;
    },
    // 封装请求函数
    async fnFetch(options) {
      const { method = 'get', mt, data = {}, isLoading = true, _domPermissionStr = '' } = options;
      try {
        const params = {
          mt,
          data,
          isLoading,
          _domPermissionStr
        };
        const result = await this.$axios[method](params);
        if (result[0].state.code !== 0) {
          this.fnShowErrorMessage(result[0].state.msg);
          console.log('result:', result[0].data);
          return false;
        }
        return result;
      } catch (error) {
        console.error('error:', error);
        this.fnShowErrorMessage(error);
      }
    },
    // 跳转到sso权限管理系统
    handleJump2SsoSystem,
  },
};