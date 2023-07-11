<template>
  <div ref="dom" class="charts chart-pie" />
</template>

<script>
import echarts from "echarts";
import tdTheme from "./theme.json";
// import { registerTheme } from './dark'
import { on, off } from "@/libs/tools";
echarts.registerTheme("tdTheme", tdTheme);
export default {
  name: "ChartPie",
  props: {
    value: {
      type: Array,
      default: () => [],
    },
    text: {
      type: String,
      default: "",
    },
    subtext: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      dom: null,
      pieData: [],
    };
  },
  watch: {
    value: {
      handler(newValue, oldValue) {},
    },
  },
  mounted() {
    // registerTheme(echarts)
    this.$nextTick(() => {
      // this.dom = echarts.init(this.$refs.dom, "tdTheme");
      // this.dom.on('click', (params) => {
      //   console.log(params)
      //   this.$emit('pieClick', params.name)
      // })
      // this.refresh()
    });
  },
  beforeDestroy() {
    off(window, "resize", this.resize);
  },
  methods: {
    resize() {
      this.dom.resize();
    },
    refresh(piedata) {
      this.pieData = piedata
      const legend = this.pieData.map((_) => _.name);
      const option = {
        title: {
          text: this.text,
          subtext: this.subtext,
          x: "center",
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} 万元 ({d}%)",
        },
        // legend: {
        //   orient: 'vertical',
        //   left: 'left',
        //   data: legend
        // },
        series: [
          {
            name: "",
            type: "pie",
            radius: "55%",
            center: ["50%", "60%"],
            data: this.pieData,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
              // normal: {
              //   color: function (params) {
              //     // build a color map as your need.
              //     var colorList = [
              //       "#2ec7c9",
              //       "#b6a2de",
              //       "#5ab1ef",
              //       "#ffb980",
              //       "#d87a80",
              //       "#8d98b3",
              //       "#e5cf0d",
              //       "#97b552",
              //       "#95706d",
              //       "#dc69aa",
              //       "#07a2a4",
              //       "#9a7fd1",
              //       "#588dd5",
              //       "#f5994e",
              //       "#c05050",
              //       "#59678c",
              //       "#c9ab00",
              //       "#7eb00a",
              //       "#6f5553",
              //       "#c14089",
              //     ];
              //     return colorList[params.dataIndex];
              //   },
              // },
            },
          },
        ],
      };
      this.dom = echarts.init(this.$refs.dom, "tdTheme");
      this.dom.setOption(option);
      on(window, "resize", this.resize);
    },
  },
};
</script>
