import * as s1 from '@/services/s1.js';
import * as api from '@/services/api';
import * as user from '@/services/user';
import * as role from '@/services/role';

export default {
  //记录需要权控制的接口，不需要控制的接口不必记录
  role_auth: {
    title: '操作角色信息',
    depend: [role.roleList, role.getRole],
  },
};
