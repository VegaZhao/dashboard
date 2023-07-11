<template>
  <Layout style="height: 100%"
          class="main">
    <Layout>
      <Header class="header-con">
        <header-bar />
      </Header>
      <Content class="main-content-con">
        <Layout class="main-layout-con">
          <Content class="content-wrapper">
            <router-view />
          </Content>
        </Layout>
      </Content>
    </Layout>
  </Layout>
</template>
<script>
import HeaderBar from './components/header-bar'

import './main.less'
export default {
  name: 'Main',
  components: {
    HeaderBar
  },
  data() {
    return {

    }
  },
  computed: {

  },
  watch: {

  },
  mounted() {
    /**
     * @description 初始化设置面包屑导航和标签导航
     */
  },
  methods: {

  }
}
</script>

<style lang="less">
.logoClass {
  cursor: pointer;
}
</style>
