<style lang="less">
@import "./user-manage.less";
</style>

<template>
  <div>
    <Card>
      <tables ref="tables"
              v-model="tableData"
              :columns="columns"
              :searchcolumns="searchcolumns"
              toolbar-enable
              editable
              searchable
              operation-enable
              stripe
              toolbar-place="top"
              @on-search="handleSearch"
              @on-clear="handleClear"
              @on-delete="handleDelete"
              @on-edit="handleEdit">
        <div slot="operation">
          <Tooltip style="margin-right:10px"
                   content="新增用户"
                   placement="top">
            <Button shape="circle"
                    type="success"
                    icon="ios-add"
                    @click="handleAddUser" />
          </Tooltip>
        </div>
        <div slot="footer"
             style="float: right;margin-right:10px">
          <Page :total="totalNum"
                :current="currentPage"
                :page-size="pageSize"
                :transfer="true"
                show-elevator
                show-sizer
                show-total
                @on-change="handlePageChange"
                @on-page-size-change="handlePageSizeChange" />
        </div>
      </tables>
    </Card>
    <Modal v-model="changeUserModal"
           :title="modelTitle">
      <div slot="footer">
        <Button type="text"
                size="large"
                @click="changeUserCancel">取消</Button>
        <Button type="primary"
                size="large"
                @click="changeUserOk">确定</Button>
      </div>
      <Form ref="formCustom"
            :model="formCustom"
            :rules="ruleValidate"
            :label-width="80">
        <FormItem label="账户名:"
                  prop="userName">
          <Input v-model="formCustom.userName"
                 :disabled="isEditModel"
                 placeholder="请输入账户名"></Input>
        </FormItem>
        <FormItem label="昵称:"
                  prop="nickName">
          <Input v-model="formCustom.nickName"
                 placeholder="请输入昵称"></Input>
        </FormItem>
        <FormItem :class="{hide:isEditModel}"
                  label="账户密码:"
                  prop="password">
          <Input v-model="formCustom.password"
                 type="password"
                 placeholder="请输入账户密码"></Input>
        </FormItem>
        <FormItem :class="{hide:isEditModel}"
                  label="确认密码:"
                  prop="passwordCheck">
          <Input v-model="formCustom.passwordCheck"
                 type="password"
                 placeholder="请输入确认密码"></Input>
        </FormItem>
        <FormItem label="账户状态:"
                  prop="status">
          <Select v-model="formCustom.status">
            <Option value="1">有效</Option>
            <Option value="2">无效</Option>
          </Select>
        </FormItem>
        <FormItem label="用户角色:"
                  prop="roles">
          <Select v-model="formCustom.roles"
                  multiple
                  filterable>
            <Option v-for="item in roleList"
                    :value="item.roleId"
                    :key="item.roleName">{{ item.roleDesc }}</Option>
          </Select>
        </FormItem>
      </Form>
    </Modal>

    <Modal v-model="changePasswordModal"
           title="修改用户密码">
      <div slot="footer">
        <Button type="text"
                size="large"
                @click="changePasswordCancel">取消</Button>
        <Button type="primary"
                size="large"
                @click="changePasswordOk">确定</Button>
      </div>
      <Form ref="changePasswordForm"
            :model="changePasswordForm"
            :rules="changePasswordRuleValidate"
            :label-width="120">
        <FormItem label="账户名:"
                  prop="userNameInChangePass">
          <Input v-model="changePasswordForm.userNameInChangePass"
                 :disabled="true"></Input>
        </FormItem>
        <FormItem label="账户密码:"
                  prop="passwordInChangePass">
          <Input v-model="changePasswordForm.passwordInChangePass"
                 type="password"
                 placeholder="请输入账户密码"></Input>
        </FormItem>
        <FormItem label="确认密码:"
                  prop="passwordCheckInChangePass">
          <Input v-model="changePasswordForm.passwordCheckInChangePass"
                 type="password"
                 placeholder="请输入确认密码"></Input>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
import Tables from '_c/tables'
import {
  getUserList,
  addUser,
  delUser,
  updateUser,
  resetUserPass
} from '@/api/user-manage'
import { getRoleList } from '@/api/role-manage'
import { getDate } from '@/libs/tools'

export default {
  name: 'UserManage',
  components: {
    Tables
  },
  data() {
    const validatePass = (rule, value, callback) => {
      if (!this.isEditModel) {
        if (value === '') {
          callback(new Error('请输入密码'))
        } else {
          if (this.formCustom.passwordCheck !== '') {
            // 对第二个密码框单独验证
            this.$refs.formCustom.validateField('passwordCheck')
          }
          callback()
        }
      } else {
        callback()
      }
    }
    const validatePassCheck = (rule, value, callback) => {
      if (!this.isEditModel) {
        if (value === '') {
          callback(new Error('请再次输入密码'))
        } else if (value !== this.formCustom.password) {
          callback(new Error('两次密码不一致!'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }

    const validateRoles = (rule, value, callback) => {
      if (value.length === 0) {
        callback(new Error('请至少选择一个用户角色!'))
      } else {
        callback()
      }
    }

    const validatePassInChangePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.changePasswordForm.passwordCheckInChangePass !== '') {
          // 对第二个密码框单独验证
          this.$refs.changePasswordForm.validateField(
            'passwordCheckInChangePass'
          )
        }
        callback()
      }
    }
    const validatePassCheckInChangePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.changePasswordForm.passwordInChangePass) {
        callback(new Error('两次密码不一致!'))
      } else {
        callback()
      }
    }

    return {
      columns: [
        {
          title: '序号', align: 'center', key: 'userId', render: (h, params) => {
            return h('span', (this.currentPage - 1) * this.pageSize + params.row._index + 1)
          }
        },
        { title: '用户名', align: 'center', key: 'userName', sortable: true },
        { title: '昵称', align: 'center', key: 'nickName' },
        {
          title: '角色',
          align: 'center',
          key: 'roles',
          render: (h, params) => {
            const arr = []
            for (var item of params.row.roles) {
              arr.push(h('span', item.roleName))
            }
            return h('div', arr)
          }
        },
        {
          title: '角色描述',
          align: 'center',
          key: 'rolesDesc',
          render: (h, params) => {
            const arr = []
            for (var item of params.row.roles) {
              arr.push(h('span', item.roleDesc))
            }
            return h('div', arr)
          }
        },
        {
          title: '注册时间',
          align: 'center',
          key: 'regTime',
          render: (h, params) => {
            return h('span', getDate(params.row.regTime / 1000, 'year'))
          }
        },
        {
          title: '最近更新时间',
          align: 'center',
          key: 'updateTime',
          render: (h, params) => {
            return h('span', getDate(params.row.updateTime / 1000, 'year'))
          }
        },
        {
          title: '在线状态',
          align: 'center',
          key: 'sessionStatus',
          render: (h, params) => {
            if (params.row.sessionStatus) {
              return h('Tag', '在线')
            } else {
              return h('Tag', '离线')
            }
          }
        },
        {
          title: '账户状态',
          align: 'center',
          key: 'statusDesc',
          render: (h, params) => {
            return h('Tag', params.row.statusDesc)
          }
        },
        {
          title: '操作',
          align: 'center',
          key: 'handle',
          minWidth: 90,
          options: ['edit', 'delete'],
          button: [
            (h, params, vm) => {
              return h(
                'Tooltip',
                {
                  props: {
                    content: '修改密码',
                    placement: 'top'
                  }
                },
                [
                  h(
                    'span',
                    {
                      style: {
                        marginLeft: '12px',
                        cursor: 'pointer'
                      },
                      on: {
                        click: () => {
                          this.handleChangePassword(params)
                        }
                      }
                    },
                    [
                      h('Icon', {
                        props: {
                          type: 'ios-lock',
                          size: 18
                        }
                      })
                    ]
                  )
                ]
              )
            }
          ]
        }
      ],
      searchcolumns: ['userName', 'nickName'],
      tableData: [],
      roleList: [],
      totalNum: 0,
      currentPage: 1,
      pageSize: 10,
      query: {},
      changeUserModal: false,
      formCustom: {
        userId: '',
        userName: '',
        nickName: '',
        password: '',
        passwordCheck: '',
        status: '',
        roles: []
      },
      changePasswordModal: false,
      changePasswordForm: {
        userId: '',
        userNameInChangePass: '',
        passwordInChangePass: '',
        passwordCheckInChangePass: ''
      },
      isEditModel: false,
      modelTitle: '添加用户',
      ruleValidate: {
        userName: [
          { required: true, message: '账户名不能为空', trigger: 'blur' },
          {
            type: 'string',
            max: 20,
            message: '不能超过20个字符',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, validator: validatePass, trigger: 'blur' },
          { min: 6, message: '请输入最少6位' }
        ],
        passwordCheck: [
          { required: true, validator: validatePassCheck, trigger: 'blur' },
          { min: 6, message: '请输入最少6位' }
        ],
        status: [
          { required: true, message: '请选择账户状态', trigger: 'blur' }
        ],
        roles: [{ required: true, validator: validateRoles, trigger: 'change' }]
      },
      changePasswordRuleValidate: {
        passwordInChangePass: [
          {
            required: true,
            validator: validatePassInChangePass,
            trigger: 'blur'
          },
          { min: 6, message: '请输入最少6位' }
        ],
        passwordCheckInChangePass: [
          {
            required: true,
            validator: validatePassCheckInChangePass,
            trigger: 'blur'
          },
          { min: 6, message: '请输入最少6位' }
        ]
      }
    }
  },
  mounted() {
    this.updateUserTableData()
  },
  methods: {
    handleClear(val) {
      if (val === '') {
        this.query = {}
        this.updateUserTableData()
      }
    },
    handleSearch(val) {
      this.query = val
      this.currentPage = 1
      this.updateUserTableData()
    },
    handleAddUser() {
      this.$refs['formCustom'].resetFields()
      this.updateRoleList()
      this.modelTitle = '添加用户'
      this.isEditModel = false
      this.changeUserModal = true
    },
    handleDelete(params) {
      const userIds = []
      userIds.push(params.row.userId)
      delUser(userIds).then(res => {
        if (res) {
          if (res.code !== '200') {
            this.$Message.error(res.data.msg)
          } else {
            this.currentPage = 1
            this.$Message.success('删除成功')
            this.updateUserTableData()
          }
        }
      })
    },
    handleEdit(params) {
      this.$refs['formCustom'].resetFields()
      this.updateRoleList()
      const data = params.row
      this.formCustom.userId = data.userId
      this.formCustom.userName = data.userName
      this.formCustom.nickName = data.nickName
      this.formCustom.status = data.status + ''
      const roleIds = data.roles.map(v => {
        return v.roleId
      })
      this.formCustom.roles = roleIds
      this.isEditModel = true
      this.modelTitle = '更新用户'
      this.changeUserModal = true
    },
    changeUserOk() {
      if (this.isEditModel) {
        // 更新用户信息
        this.$refs['formCustom'].validate(valid => {
          if (valid) {
            updateUser(this.formCustom).then(res => {
              if (res) {
                this.changeUserModal = false
                this.$Message.success('更新用户信息成功!')
                this.updateUserTableData()
              }
            })
          } else {
            this.$Message.error('请检查用户信息是否填写正确!')
          }
        })
      } else {
        // 新增用户
        this.$refs['formCustom'].validate(valid => {
          if (valid) {
            addUser(this.formCustom).then(res => {
              if (res) {
                this.changeUserModal = false
                this.$Message.success('添加用户信息成功!')
                this.updateUserTableData()
              }
            })
          } else {
            this.$Message.error('请检查用户信息是否填写正确!')
          }
        })
      }
    },
    changeUserCancel() {
      this.changeUserModal = false
      this.$refs['formCustom'].resetFields()
    },
    handlePageChange(pageNum) {
      this.currentPage = pageNum
      this.updateUserTableData()
    },
    handlePageSizeChange(pageSize) {
      this.pageSize = pageSize
      this.updateUserTableData()
    },
    updateUserTableData() {
      getUserList(this.currentPage, this.pageSize, this.query).then(res => {
        if (res) {
          this.tableData = res.data.records
          this.totalNum = res.data.total
        }
      })
    },
    handleChangePassword(params) {
      this.$refs['changePasswordForm'].resetFields()
      const data = params.row
      this.changePasswordForm.userId = data.userId
      this.changePasswordForm.userNameInChangePass = data.userName
      this.changePasswordModal = true
    },
    changePasswordCancel() {
      this.$refs['changePasswordForm'].resetFields()
      this.changePasswordModal = false
    },
    // 修改用户密码
    changePasswordOk() {
      this.$refs['changePasswordForm'].validate(valid => {
        if (valid) {
          resetUserPass(this.changePasswordForm).then(res => {
            if (res) {
              this.changePasswordModal = false
              this.$Message.success('修改用户密码成功!')
            }
          })
        } else {
          this.$Message.error('请检查用户密码是否填写正确!')
        }
      })
    },
    updateRoleList() {
      getRoleList().then(res => {
        this.roleList = res.data
      })
    }
  }
}
</script>
