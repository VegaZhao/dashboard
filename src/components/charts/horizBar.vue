<template>
  <div ref="dom"
       class="charts chart-bar" />
</template>

<script>
import echarts from 'echarts'
import tdTheme from './theme.json'
import { on, off } from '@/libs/tools'
echarts.registerTheme('tdTheme', tdTheme)
require('./dark.js')

export default {
  name: 'ChartHorizBar',
  props: {
    value: {
      type: Array,
      default: null
    },
    text: {
      type: String,
      default: ''
    },
    subtext: {
      type: String,
      default: ''
    },
    grid:{
      type: Array,
      default:()=>[{left: 150,right: 80,bottom: 85}]
    },
    formatter:{
      type: String,
      default:'{b} : {c} 万元'
    },
    xName:{
      type: String,
      default: '金额（万元）'
    }
  },
  data() {
    return {
      dom: null,
      option: {},
      // categories: [],
      barData: []
      // used: []
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.dom = echarts.init(this.$refs.dom, 'tdTheme')
      on(window, 'resize', this.resize)
    })
  },
  beforeDestroy() {
    off(window, 'resize', this.resize)
  },
  methods: {
    resize() {
      this.dom.resize()
    },
    refresh(bardata) {
      this.barData = bardata.sort(function (a, b) { return a.value - b.value; })
      const category = this.barData.map(_ => _.name)
      const value = this.barData.map(_ => _.value)
      const left = this.grid.map((_) => _.left)
      const right = this.grid.map((_) => _.right)
      const bottom = this.grid.map((_) => _.bottom)
      this.option = {
        title: {
          text: this.text,
          subtext: this.subtext,
          x: 'center'
        },
        grid: {
          // left: 150,
          // right: 30,
          // bottom: 85
          left: left,
          right: right,
          bottom: bottom,
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter: this.formatter
        },
        xAxis: [
          {
            name: this.xName,
            type: 'value'
        }
        ],
        yAxis: {
          type: 'category',
          data: category,
          axisLabel:{
                    interval:0,
                    rotate:15,
                    },
        },
        series: [
          {
            data: value,
            type: 'bar'
          }
        ]
      }
      this.dom.setOption(this.option)
    }
  }
}
</script>
