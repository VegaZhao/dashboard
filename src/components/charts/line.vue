<template>
  <div ref="dom"
       class="charts chart-line" />
</template>

<script>
import echarts from 'echarts'
import tdTheme from './theme.json'
import { on, off } from '@/libs/tools'
echarts.registerTheme('tdTheme', tdTheme)
require('./dark.js')

export default {
  name: 'ChartLine',
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
    }
  },
  data() {
    return {
      dom: null,
      option: {},
      lineData: []
    }
  },
  watch: {
    value: {
      handler(newValue, oldValue) {}
      // {
      //   this.categories = []
      //   newValue.forEach((item, index) => {
      //     this.categories.push(item.system)
      //     // this.unused.push(item.total - item.used)
      //     this.used.push(item.used)
      //   })
      //   this.refresh()
      // }
    }
  },
  mounted() {
    this.$nextTick(() => {
        this.dom = echarts.init(this.$refs.dom, "tdTheme");
      this.dom.on('click', (params) => {
        // console.log(params)
        this.$emit('lineClick', params.name)
      })
      // this.refresh()
      // this.dom = echarts.init(this.$refs.dom, 'tdTheme')
      // this.refresh()
      // on(window, 'resize', this.resize)
    })
  },
  beforeDestroy() {
    off(window, 'resize', this.resize)
  },
  methods: {
    resize() {
      this.dom.resize()
    },
    refresh(linedata) {
      this.lineData = linedata
      const category = this.lineData.map((_) => _.time);
      const value = this.lineData.map((_) => _.value);
      const money = this.lineData.map((_) => _.money);
      this.option = {
        title: {
          text: this.text,
          subtext: this.subtext,
          x: 'center'
        },
        color : ["#37a2da","#fb7293"],
        legend: {
          data:['贷款笔数','贷款金额'],
          left:20
        },
        grid: {
          left: 80,
          right: 50,
          bottom: 85
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter: '{a0}: {c0}笔<br />{a1}: {c1}万元'
        },
        xAxis: {
          axisLabel: {
            interval: 0,
            rotate: 30
          },
          type: 'category',
          data:category
        },
        yAxis: [
          {
            name:'贷款笔数（笔）',
            type: 'value'
          },
          {
            name:'贷款金额（万元）',
            type: 'value',
            position:'right'
          }
        ],
        series: [
          {
            name: '贷款笔数',
            type: 'line',
            stack: '总量',
            // label: {
            //   show: true,
            //   position: 'inside'
            // },
            data: value
          },
          {
            name: '贷款金额',
            type: 'line',
            yAxisIndex: 1,
            stack: '总量',
            // label: {
            //   show: true,
            //   position: 'inside'
            // },
            data: money
          }
        ]
      }
      this.dom.setOption(this.option)
    }
  }
}
</script>
