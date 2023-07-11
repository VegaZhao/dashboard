<template>
    <div class="error-page">
    <div class="content-con">
      <img :src="src" alt="404">
      <div class="text-con">
        <h5>账户已失效!</h5>
      </div>
    <div>
        <Button size="large" type="text">返回上一页({{ second }}s)</Button>
    </div>
    </div>
  </div>
</template>

<script>
import './error.less'
import error20013 from '@/assets/images/error-page/error-500.svg'
import errorContent from './error-content.vue'
export default {
  name: 'error_20013',
  components: {
    errorContent
  },
  data () {
    return {
      src: error20013,
      second: 5,
      timer: null
    }
  },
  mounted () {
    this.timer = setInterval(() => {
      if (this.second === 0) this.backPrev()
      else this.second--
    }, 1000)
  }
}
</script>
