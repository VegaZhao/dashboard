<template>
  <div ref="dom" class="charts" />
</template>

<script>
import echarts from "echarts";
import tdTheme from "./theme.json";
import { on, off } from "@/libs/tools";
echarts.registerTheme("tdTheme", tdTheme);
require("./dark.js");

export default {
  name: "TreeMap",
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
    // visibleMin: {
    //   type: Number,
    //   default: 400,
    // }
  },
  data() {
    return {
      totalLoanTitle: ""
    };
  },
  watch: {},
  mounted() {
    this.$nextTick(() => {
      this.dom = echarts.init(this.$refs.dom, "tdTheme");
      this.dom.on("click", (params) => {
        console.log(params);
        this.$emit('mapClick', params)
        //self.nodeDbClick(params.data)
      });
      this.refresh();
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
    refresh(treedata) {
      // this.totalLoanTitle = "新发贷款总金额: " + totalAmt + " 万元",
      // this.visibleMin = visMin,
      this.option = {
        // title: {
        //   text: "Disk Usage",
        //   left: "center",
        // },

        tooltip: {
          formatter: (info) => {
            var value = info.value;
            var treePathInfo = info.treePathInfo;
            var treePath = [];

            for (var i = 1; i < treePathInfo.length; i++) {
              treePath.push(treePathInfo[i].name);
            }

            return [
              '<div class="tooltip-title">' +
                echarts.format.encodeHTML(treePath.join("/")) +
                "</div>",
              "发放贷款金额: " + echarts.format.addCommas(value) + " 万元",
            ].join("");
          },
        },
        series: [
          {
            name: '机构大类',
            type: "treemap",
            visibleMin: this.visibleMin,
            breadcrumb: {
              show: true,
            },
            roam: false,
            leafDepth: 1,
            width: "100%",
            //higth: '80%',
            top: "0%",
            bottom: "5%",
            zoomToNodeRatio: false,
            label: {
              show: true,
              formatter: "{b} : {c} 万元",
            },
            upperLabel: {
              show: true,
              height: 30,
              formatter: "{b} : {c} 万元",
            },
            itemStyle: {
              borderColor: "#3399CC",
            },
            levels: this.getLevelOption(),
            data: treedata,
          },
        ],
      };
      this.dom.setOption(this.option);
    },
    getLevelOption() {
      return [
        {
          itemStyle: {
            borderColor: "#777",
            borderWidth: 0,
            gapWidth: 1,
          },
          upperLabel: {
            show: false,
          },
        },
        {
          itemStyle: {
            borderColor: "#555",
            borderWidth: 5,
            gapWidth: 1,
          },
          emphasis: {
            itemStyle: {
              borderColor: "#ddd",
            },
          },
        },
        {
          colorSaturation: [0.35, 0.5],
          itemStyle: {
            borderWidth: 5,
            gapWidth: 1,
            borderColorSaturation: 0.6,
          },
        },
      ];
    },
    treeData() {
      return [
        {
          value: 40,
          name: "Accessibility",
          path: "Accessibility",
        },
        {
          value: 180,
          name: "Accounts",
          path: "Accounts",
          children: [
            {
              value: 76,
              name: "Access",
              path: "Accounts/Access",
              children: [
                {
                  value: 12,
                  name: "DefaultAccessPlugin.bundle",
                  path: "Accounts/Access/DefaultAccessPlugin.bundle",
                },
                {
                  value: 28,
                  name: "FacebookAccessPlugin.bundle",
                  path: "Accounts/Access/FacebookAccessPlugin.bundle",
                },
                {
                  value: 20,
                  name: "LinkedInAccessPlugin.bundle",
                  path: "Accounts/Access/LinkedInAccessPlugin.bundle",
                },
                {
                  value: 16,
                  name: "TencentWeiboAccessPlugin.bundle",
                  path: "Accounts/Access/TencentWeiboAccessPlugin.bundle",
                },
              ],
            },
            {
              value: 92,
              name: "Authentication",
              path: "Accounts/Authentication",
              children: [
                {
                  value: 24,
                  name: "FacebookAuthenticationPlugin.bundle",
                  path:
                    "Accounts/Authentication/FacebookAuthenticationPlugin.bundle",
                },
                {
                  value: 16,
                  name: "LinkedInAuthenticationPlugin.bundle",
                  path:
                    "Accounts/Authentication/LinkedInAuthenticationPlugin.bundle",
                },
                {
                  value: 20,
                  name: "TencentWeiboAuthenticationPlugin.bundle",
                  path:
                    "Accounts/Authentication/TencentWeiboAuthenticationPlugin.bundle",
                },
                {
                  value: 16,
                  name: "TwitterAuthenticationPlugin.bundle",
                  path:
                    "Accounts/Authentication/TwitterAuthenticationPlugin.bundle",
                },
                {
                  value: 16,
                  name: "WeiboAuthenticationPlugin.bundle",
                  path:
                    "Accounts/Authentication/WeiboAuthenticationPlugin.bundle",
                },
              ],
            },
            {
              value: 12,
              name: "Notification",
              path: "Accounts/Notification",
            },
          ],
        },
      ];
    },
  },
};
</script>
