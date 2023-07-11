<template>
    <div>
        <Form ref="formCustom" :model="formCustom" :rules="ruleValidate" :label-width="80">
        <FormItem label="权限名称:" prop="permissionName">
            <Input v-model="formCustom.permissionName" placeholder="请输入权限名称"></Input>
        </FormItem>
        <FormItem label="权限代码:" prop="permissionCode">
            <Input v-model="formCustom.permissionCode" placeholder="请输入权限代码"></Input>
        </FormItem>
        <FormItem label="操作名称:" prop="actionName">
            <Input v-model="formCustom.actionName" placeholder="请输入操作名称"></Input>
        </FormItem>
        <FormItem label="操作代码:" prop="actionCode">
            <Input v-model="formCustom.actionCode" placeholder="请输入操作代码"></Input>
        </FormItem>
        </Form>
    </div>
</template>

<script>
import { editPermission } from '@/api/permission-manage'

export default {
  name: 'EditPermission',
  props: {
    permissionInfo: {
      type: Object
    }
  },
  data () {
    return {
      formCustom: {
        permissionId: '',
        permissionName: '',
        permissionCode: '',
        actionName: '',
        actionCode: ''
      },
      ruleValidate: {
        permissionName: [
          { permissionName: true, message: '权限名称不能为空', trigger: 'blur' },
          {
            type: 'string',
            max: 50,
            message: '不能超过50个字符',
            trigger: 'blur'
          }
        ],
        permissionCode: [
          { permissionCode: true, message: '权限代码不能为空', trigger: 'blur' },
          {
            type: 'string',
            max: 50,
            message: '不能超过50个字符',
            trigger: 'blur'
          }
        ],
        actionName: [
          { actionName: true, message: '操作名称不能为空', trigger: 'blur' },
          {
            type: 'string',
            max: 50,
            message: '不能超过50个字符',
            trigger: 'blur'
          }
        ],
        actionCode: [
          { actionCode: true, message: '操作代码不能为空', trigger: 'blur' },
          {
            type: 'string',
            max: 50,
            message: '不能超过50个字符',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    reset () {
      this.$refs.formCustom.resetFields()
    },
    editPermissionOk () {
      return new Promise((resolve, reject) => {
        this.$refs.formCustom.validate(valid => {
          if (valid) {
            editPermission(this.formCustom).then(res => {
              if (res) {
                resolve()
                this.$Message.success('更新权限信息成功!')
              }
            })
          } else {
            this.$Message.error('请检查权限信息是否填写正确!')
          }
        })
      })
    }
  },
  watch: {
    permissionInfo (val) {
      this.formCustom.permissionId = val.permissionId
      this.formCustom.permissionName = val.permissionName
      this.formCustom.permissionCode = val.permissionCode
      this.formCustom.actionName = val.actionName
      this.formCustom.actionCode = val.actionCode
    }
  }
}
</script>
