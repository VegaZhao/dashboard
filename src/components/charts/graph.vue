<template>
  <div ref="dom"
       class="charts" />
</template>

<script>
import echarts from 'echarts'
import tdTheme from './theme.json'
import { on, off } from '@/libs/tools'
echarts.registerTheme('tdTheme', tdTheme)
export default {
  name: 'ChartGraph',
  props: {
    value: {
      type: Object,
      default: () => { }
    },
    text: {
      type: String,
      default: ''
    },
    subtext: {
      type: String,
      default: ''
    },
    depth: {
      type: Number,
      default: 0
    },
    chooseStyle: {
      type: Boolean,
      default: true
    },
    layout: {
      type: String,
      default: 'none'
    },
    categories: {
      type: Array,
      default: () => []
    },
    toolTipFunc: {
      type: Function,
      default: (params) => {
        return params.name + ': ' + params.value
      }
    },
    labelFunc: {
      type: Function,
      default: (params) => {
        return params.name
      }
    }
  },
  data() {
    return {
      dom: null,
      addIcon: '',
      addIconHover: '',
      clickedNode: {},
      option: {
        tooltip: {
          trigger: 'item',
          triggerOn: 'mousemove'
        },
        title: {
          text: this.text,
          subtext: this.subtext,
          // x: 'center',
          textAlign: 'left'
        },
        legend: [{
          // selectedMode: 'single',
          data: this.categories.map((a) => {
            return a.name
          })
        }],
        animationDurationUpdate: 1500,
        animationEasingUpdate: 'quinticInOut',
        // toolbox: {
        //   feature: {
        //     myTool1: {
        //       show: true,
        //       title: '新增',
        //       icon: 'path://M512.006144 63.997952C264.568832 63.997952 64 264.57088 64 511.987712c0 247.433216 200.568832 448.014336 448.006144 448.014336 247.425024 0 447.993856-200.58112 447.993856-448.014336 0-247.416832-200.568832-447.98976-447.993856-447.98976z m0 855.303168c-224.958464 0-407.297024-182.35904-407.297024-407.313408 0-224.946176 182.33856-407.297024 407.297024-407.297024 224.950272 0 407.30112 182.350848 407.30112 407.297024 0 224.954368-182.350848 407.313408-407.30112 407.313408zM552.96 308.224h-81.92v162.816H308.224v81.92h162.816v162.816h81.92V552.96h162.816v-81.92H552.96V308.224z',
        //       iconStyle:
        //       {
        //         color: '#2c2c2c'
        //       },
        //       onclick: () => {
        //         this.addNode()
        //       }
        //     }
        //   },
        //   itemSize: 24
        // },
        series: [
          {
            type: 'graph',
            layout: this.layout,
            nodes: [],
            edges: [],
            roam: true,
            focusNodeAdjacency: true,
            edgeSymbol: ['circle', 'arrow'],
            edgeSymbolSize: [2, 5],
            categories: this.categories,
            tooltip: {
              formatter: (params) => {
                return this.toolTipFunc(params)
              }
            },
            force: {
              repulsion: 20 // 斥力
            },
            label: {
              normal: {
                show: true,
                position: 'bottom',
                formatter: (params) => {
                  return this.labelFunc(params)
                }
              }
            },
            lineStyle: {
              normal: {
                width: 0.5,
                opacity: 0.7
              }
            }
          }]
      }
    }
  },
  watch: {
    value: {
      handler(newValue, oldValue) {
        this.graphElementRefresh(newValue)
      }
    },
    categories: {
      handler(newValue, oldValue) {
        this.categories = newValue
        this.dom.setOption(this.option)
      }
    }
  },
  mounted() {
    const self = this
    this.$nextTick(() => {
      this.dom = echarts.init(this.$refs.dom, 'tdTheme')
      this.dom.setOption(this.option)
      on(window, 'resize', this.resize)
      this.dom.on('click', (params) => {
        self.nodeClick(params.data)
      })
      this.dom.on('dblclick', (params) => {
        self.nodeDbClick(params.data)
      })
    })
  },
  beforeDestroy() {
    off(window, 'resize', this.resize)
  },
  methods: {
    resize() {
      this.dom.resize()
    },
    addNode() {
      this.$emit('addNode')
    },
    nodeClick(node) {
      if (this.chooseStyle) {
        this.clickedNode = node
      }
      this.graphElementRefresh(this.value)
      this.$emit('nodeClick', node)
    },
    nodeDbClick(node) {
      this.$emit('nodeDbClick', node)
    },
    refresh() {
      this.dom.setOption(this.option)
    },
    graphElementRefresh(val) {
      const data = val.nodes.map((node) => {
        let itemStyle = {
          normal: {
            color: node.color
          }
        }
        let size = 15 // node.size
        let clicked = false

        if (this.chooseStyle && node.name === this.clickedNode.name && !this.clickedNode.clicked) {
          itemStyle = {
            normal: {
              color: node.color,
              borderColor: '#fff',
              borderWidth: 1,
              shadowBlur: 10,
              shadowColor: 'rgba(0, 0, 0, 0.3)'
            }
          }
          size = 40
          clicked = true
        }

        return {
          x: node.x,
          y: node.y,
          name: node.name,
          nodeId: node.id,
          label: node.label,
          symbolSize: size,
          category: node.category,
          symbol: node.symbol,
          itemStyle: itemStyle,
          attrs: node.attrs,
          clicked: clicked
        }
      })

      const edges = val.edges.map((edge) => {
        return {
          source: edge.source,
          target: edge.target
        }
      })
      this.option.series[0].nodes = data
      this.option.series[0].edges = edges
      this.dom.setOption(this.option)
    }
  }
}
</script>
