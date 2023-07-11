const PADDING = 18 // 内容区边框
const ADJUST = 0 // 调整

import {
  debounce
} from '@/libs/util'

export default {
  data() {
    return {
      $_resizeHandler: null,
      clientHeight: 0,
      headerHeight: 0,
      contentHeight: 0
    }
  },
  mounted() {
    this.initListener()
    this.resize()
  },
  activated() {
    if (!this.$_resizeHandler) {
      // avoid duplication init
      this.initListener()
    }
    this.resize()
  },
  beforeDestroy() {
    this.destroyListener()
  },
  deactivated() {
    this.destroyListener()
  },
  methods: {
    // use $_ for mixins properties
    initListener() {
      this.$_resizeHandler = debounce(() => {
        this.resize()
      }, 100)
      window.addEventListener('resize', this.$_resizeHandler)
    },
    destroyListener() {
      window.removeEventListener('resize', this.$_resizeHandler)
      this.$_resizeHandler = null
    },
    resize() {
      this.clientHeight = document.documentElement.clientHeight
      this.headerHeight = document.getElementsByClassName('header-con')[0].clientHeight
      this.contentHeight = this.clientHeight - this.headerHeight - PADDING * 2 - ADJUST
    }
  }
}
