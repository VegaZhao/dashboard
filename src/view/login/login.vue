<style lang="less">
@import "./login.less";
</style>

<template>
  <div class="login"
       @keydown.enter="handleLogin">
    <div class="login-title">
      <p style="font-size:60px; letter-spacing: 10px;">系统风险画像</p>
      <p style="font-size:xx-large">System Risk Profile</p>
    </div>
    <div class="login-con">
      <Card :bordered="false"
            icon="log-in"
            title="登录"
            style="height:320px">
        <div class="form-con">
          <login-form @on-success-valid="handleSubmit" />
          <div style="display:block">
            <span>推荐使用chrome浏览器</span>
            <span @click="handleDownload">
              <Avatar :src="chromeLogo"
                      style="margin-left:20px;cursor: pointer;" />
            </span>
          </div>

          <!-- <p class="login-tip">用户名密码最多错误5次</p> -->
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
import LoginForm from '_c/login-form'
import { mapActions } from 'vuex'
import chromeLogo from '@/assets/images/login/chrome.jpg'
import { fileDownload } from '@/libs/util'
import { getFileDownload } from '@/api/file'
export default {
  components: {
    LoginForm
  },
  data() {
    return {
      chromeLogo
    }
  },
  methods: {
    ...mapActions(['handleLogin', 'getUserInfo']),
    handleSubmit({ userName, password }) {
      this.handleLogin({ userName, password }).then(res => {
        if (res) {
          this.getUserInfo().then(res => {
            if (res) {
              this.$router.push({
                name: 'home_stat'
              })
            }
          })
        }
      })
    },
    handleDownload() {
      getFileDownload('chrome').then(res => {
        if (res) {
          fileDownload(res.data, res.headers)
        }
      })
    }
  }
}
</script>

<style>
</style>
