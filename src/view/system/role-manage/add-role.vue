<template>
  <div>
    <Form ref="formCustom"
          :model="formCustom"
          :rules="ruleValidate"
          :label-width="120">
      <FormItem label="角色名:"
                prop="roleName">
        <Input v-model="formCustom.roleName"
               placeholder="请输入角色名"></Input>
      </FormItem>
      <FormItem label="角色描述:"
                prop="roleDesc">
        <Input v-model="formCustom.roleDesc"
               placeholder="请输入角色描述"></Input>
      </FormItem>
      <FormItem label="角色状态:"
                prop="status">
        <Select v-model="formCustom.status">
          <Option value="1">有效</Option>
          <Option value="2">无效</Option>
        </Select>
      </FormItem>
      <FormItem label="角色权限:"
                prop="permissions">
        <Select v-model="formCustom.permissions"
                multiple
                filterable>
          <Option v-for="item in permissionList"
                  :value="item.permissionId"
                  :key="item.actionCode">{{ item.actionName }}</Option>
        </Select>
      </FormItem>
    </Form>
  </div>
</template>

<script>
import { getPermissionList } from '@/api/permission-manage'
import { addRole } from '@/api/role-manage'

export default {
  name: 'AddRole',
  data () {
    const validatePermissions = (rule, value, callback) => {
      if (value.length === 0) {
        callback(new Error('请至少选择一个角色权限!'))
      } else {
        callback()
      }
    }
    return {
      formCustom: {
        roleName: '',
        roleDesc: '',
        status: '1',
        permissions: []
      },
      permissionList: [],
      ruleValidate: {
        roleName: [
          { required: true, message: '角色名不能为空', trigger: 'blur' },
          {
            type: 'string',
            max: 50,
            message: '不能超过50个字符',
            trigger: 'blur'
          }
        ],
        roleDesc: [
          {
            type: 'string',
            max: 50,
            message: '不能超过50个字符',
            trigger: 'blur'
          }
        ],
        status: [
          { required: true, message: '请选择角色状态', trigger: 'blur' }
        ],
        permissions: [{ required: true, validator: validatePermissions, trigger: 'change' }]
      }
    }
  },
  methods: {
    reset () {
      this.$refs.formCustom.resetFields()
    },
    addRoleOk () {
      return new Promise((resolve, reject) => {
        this.$refs.formCustom.validate(valid => {
          if (valid) {
            addRole(this.formCustom).then(res => {
              if (res) {
                resolve()
                this.$Message.success('添加角色信息成功!')
              }
            })
          } else {
            this.$Message.error('请检查角色信息是否填写正确!')
          }
        })
      })
    }
  },
  mounted () {
    getPermissionList().then(res => {
      if (res) {
        this.permissionList = res.data
      }
    })
  }
}
</script>
