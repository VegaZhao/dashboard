<template>
  <div class="header-bar">
    <div class="system-name"> 系统风险画像 </div>
    <div class="custom-content-con">
      <user :user-avator="userAvator" />
      <fullscreen v-model="isFullscreen"
                  style="margin-right: 10px;" />
    </div>
    <menu-nav :menu-list="menuList"
              :active-name="$route.name"
              class="header-menu"
              @on-select="turnToPage" />
  </div>
</template>
<script>
import menuNav from './menu-nav'
import './header-bar.less'
import User from '../user'
import Fullscreen from '../fullscreen'

export default {
  name: 'HeaderBar',
  components: {
    menuNav,
    Fullscreen,
    User
  },
  props: {

  },
  data() {
    return {
      isFullscreen: false
    }
  },
  computed: {
    userAvator() {
      return this.$store.state.user.nickName
    },
    menuList() { // 左侧导航列表
      return this.$store.getters.menuList
    }
  },
  watch: {

  },
  methods: {
    handleCategoryChange(name) {
      this.$emit('on-category-change', name)
    },
    turnToPage(route) {
      let { name, params, query } = {}
      if (typeof route === 'string') name = route
      else {
        name = route.name
        params = route.params
        query = route.query
      }
      if (name.indexOf('isTurnByHref_') > -1) {
        window.open(name.split('_')[1])
        return
      }
      this.$router.push({
        name,
        params,
        query
      })
    }
  }
}
</script>
