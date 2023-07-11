<template>
  <div ref="dom" class="charts chart-bar" />
</template>

<script>
import echarts from "echarts";
import tdTheme from "./theme.json";
import { on, off } from "@/libs/tools";
echarts.registerTheme("tdTheme", tdTheme);
require("./dark.js");

export default {
  name: "ChartBar",
  props: {
    value: {
      type: Array,
      default: null,
    },
    text: {
      type: String,
      default: "",
    },
    subtext: {
      type: String,
      default: "",
    },
    grid:{
      type: Array,
      default:()=>[{left: 100,right: 30,bottom: 100}]
    }
  },
  data() {
    return {
      dom: null,
      option: {},
      // categories: [],
      barData: [],
      // unused: []
    };
  },
  watch: {
    value: {
      handler(newValue, oldValue) {},
      // {
      //   this.categories = []
      //   newValue.forEach((item, index) => {
      //     this.categories.push(item.system)
      //     // this.unused.push(item.total - item.used)
      //     this.used.push(item.used)
      //   })
      //   this.refresh()
      // }
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.dom = echarts.init(this.$refs.dom, "tdTheme");
      // this.refresh()
      on(window, "resize", this.resize);
    });
  },
  beforeDestroy() {
    off(window, "resize", this.resize);
  },
  methods: {
    resize() {
      this.dom.resize();
    },
    refresh(bardata) {
      //this.barData = bardata.sort(function (a, b) { return b.value - a.value; });
      this.barData = bardata;
      const category = this.barData.map((_) => _.name);
      const value = this.barData.map((_) => _.value);
      const left = this.grid.map((_) => _.left)
      const right = this.grid.map((_) => _.right)
      const bottom = this.grid.map((_) => _.bottom)
      // console.log('bar')
      this.option = {
        title: {
          text: this.text,
          subtext: this.subtext,
          x: "center",
        },
        legend: {},
        grid: {
          // left: 100,
          // right: 30,
          // bottom: 200,
          left: left,
          right: right,
          bottom: bottom,
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter: '{b} : {c} 万元'
        },
        xAxis: {
          type: "category",
          data: category,
          axisLabel: {
            interval: 0,
            rotate: 45,
          },
        },
        yAxis: [
          {
            name:'贷款金额（万元）',
            type: "value",
          //   axisLabel: {
          //   interval: 0,
          //   rotate: 45,
          // }
          }
        ],
        series: [
          {
            name: "",
            type: "bar",
            stack: "总量",
            data: value.slice(0,25),
          },
        ],
      };
      this.dom.setOption(this.option);
    },
  },
};
</script>
