<template>
<div v-html="html" class="center" v-highlight>
</div>
</template>

<script>
import showdown from 'showdown'

export default {
  name: 'Showdown',
  components: {
    showdown
  },
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      html: ''
    }
  },
  mounted () {
    let converter = new showdown.Converter()
    let text = this.value.toString()
    this.html = converter.makeHtml(text)
  }
}
</script>
