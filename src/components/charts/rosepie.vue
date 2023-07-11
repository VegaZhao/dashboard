<template>
  <div ref="dom"
       class="charts chart-pie" />
</template>

<script>
import echarts from 'echarts'
import tdTheme from './theme.json'
// import { registerTheme } from './dark'
import { on, off } from '@/libs/tools'
echarts.registerTheme('tdTheme', tdTheme)
export default {
  name: 'RosePie',
  props: {
    value: {
      type: Array,
      default: () => []
    },
    text: {
      type: String,
      default: ''
    },
    subtext: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      dom: null,
      pieData: []
    }
  },
  watch: {
    value: {
      handler(newValue, oldValue) {
      }
    }
  },
  mounted() {
    // registerTheme(echarts)
    this.$nextTick(() => {
      this.dom = echarts.init(this.$refs.dom, 'tdTheme')
    })
  },
  beforeDestroy() {
    off(window, 'resize', this.resize)
  },
  methods: {
    resize() {
      this.dom.resize()
    },
    refresh(piedata) {
      this.pieData = piedata.sort(function (a, b) { return a.value - b.value; })
      const legend = this.pieData.map(_ => _.name)
      const option = {
        title: {
          text: this.text,
          subtext: this.subtext,
          x: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} 万元 ({d}%)'
        },
        // legend: {
        //   orient: 'vertical',
        //   left: 'left',
        //   data: legend
        // },
        series: [
          {
            name: '',
            type: 'pie',
            radius: '55%',
            // center: ['50%', '60%'],
            data: this.pieData,
            roseType: 'angle',
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
      this.dom = echarts.init(this.$refs.dom, 'tdTheme')
      this.dom.setOption(option)
      on(window, 'resize', this.resize)
    }
  }
}
</script>
