<template>
  <div ref="dom"
       class="charts chart-tree" />
</template>

<script>
import echarts from 'echarts'
import tdTheme from './theme.json'
import { on, off } from '@/libs/tools'
echarts.registerTheme('tdTheme', tdTheme)
export default {
  name: 'ChartTree',
  props: {
    value: {
      type: Object,
      default: null
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
      option: {
        tooltip: {
          trigger: 'item',
          triggerOn: 'mousemove'
        },
        title: {
          text: this.text,
          subtext: this.subtext,
          x: 'center'
        },
        series: [
          {
            type: 'tree',
            data: [this.value],
            symbol: 'roundRect',
            symbolSize: [50, 30],
            itemStyle: {
              borderWidth: 0
            },
            label: {
              normal: {
                position: 'left',
                verticalAlign: 'middle',
                align: 'right',
                fontSize: 9
              }
            },
            leaves: {
              label: {
                normal: {
                  position: 'right',
                  verticalAlign: 'middle',
                  align: 'left'
                }
              }
            },

            expandAndCollapse: true,
            animationDuration: 550,
            animationDurationUpdate: 750
          }]
      }
    }
  },
  watch: {
    value: {
      handler(newValue, oldValue) {
        this.option.series[0].data = [newValue]
        this.dom.setOption(this.option)
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.dom = echarts.init(this.$refs.dom, 'tdTheme')
      this.dom.setOption(this.option)
      on(window, 'resize', this.resize)
    })
  },
  beforeDestroy() {
    off(window, 'resize', this.resize)
  },
  methods: {
    resize() {
      this.dom.resize()
    }
  }
}
</script>
