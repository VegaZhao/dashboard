<template>
  <div class="user-avator-dropdown">
    <Dropdown @on-click="handleClick">
      <Avatar style="background:#00a2ae;padding-top: 5px"
              shape="square"
              size="40"> {{ userAvator }}</Avatar>
      <Icon :size="18"
            type="md-arrow-dropdown" />
      <DropdownMenu slot="list">
        <DropdownItem name="changePass">修改密码</DropdownItem>
        <DropdownItem name="logout">退出登录</DropdownItem>
      </DropdownMenu>
    </Dropdown>

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
            :label-width="130">
        <FormItem label="账户密码:"
                  prop="password">
          <Input v-model="changePasswordForm.password"
                 type="password"
                 placeholder="请输入账户密码"></Input>
        </FormItem>
        <FormItem label="新密码:"
                  prop="passwordInChangePass">
          <Input v-model="changePasswordForm.passwordInChangePass"
                 type="password"
                 placeholder="请输入确认密码"></Input>
        </FormItem>
        <FormItem label="确认新密码:"
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
import './user.less'
import { mapActions } from 'vuex'
export default {
  name: 'User',
  props: {
    userAvator: {
      type: String,
      default: ''
    }
  },
  data() {
    const validatePass = (rule, value, callback) => {
      if (!this.isEditModel) {
        if (value === '') {
          callback(new Error('请输入原密码'))
        }
      }
      callback()
    }
    const validatePassInChangePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入新密码'))
      } else {
        if (this.changePasswordForm.passwordInChangePass !== '') {
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
        callback(new Error('请再次输入新密码'))
      } else if (value !== this.changePasswordForm.passwordInChangePass) {
        callback(new Error('两次新密码输入不一致!'))
      } else {
        callback()
      }
    }

    return {
      changePasswordModal: false,
      changePasswordForm: {
        password: '',
        passwordInChangePass: '',
        passwordCheckInChangePass: ''
      },
      changePasswordRuleValidate: {
        password: [
          { required: true, validator: validatePass, trigger: 'blur' },
          { min: 6, message: '请输入最少6位' }
        ],
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
  methods: {
    ...mapActions([
      'handleLogOut',
      'changeUserPass'
    ]),
    handleClick(name) {
      switch (name) {
        case 'logout':
          this.handleLogOut().then(() => {
            this.$router.push({
              name: 'login'
            })
          })
          break
        case 'changePass':
          this.$refs['changePasswordForm'].resetFields()
          this.changePasswordModal = true
          break
      }
    },
    changePasswordOk() {
      this.$refs['changePasswordForm'].validate(valid => {
        if (valid) {
          const password = this.changePasswordForm.password
          const passwordInChangePass = this.changePasswordForm.passwordInChangePass
          const passwordCheckInChangePass = this.changePasswordForm.passwordCheckInChangePass
          this.changeUserPass({ password, passwordInChangePass, passwordCheckInChangePass }).then((res) => {
            if (res) {
              this.changePasswordModal = false
              this.$Message.success(
                {
                  content: '修改密码成功!',
                  duration: 10,
                  closable: true
                }
              )
            } else {
              this.$Message.error({
                content: '修改密码失败!',
                duration: 15,
                closable: true
              })
            }
          })
        } else {
          this.$Message.error('请检查密码信息是否填写正确!')
        }
      })
    },
    changePasswordCancel() {
      this.changePasswordModal = false
    }
  }
}
</script>
