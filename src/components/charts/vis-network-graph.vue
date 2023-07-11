<template>
  <div id="visualization" />

</template>

<script>

const vis = require('vis-network/dist/vis-network.min.js')
require('vis-network/dist/vis-network.min.css')

export default {
  name: 'VisNetworkGraph',
  props: {
    value: {
      type: Object,
      default: null
    },
    loadingBar: {
      type: Boolean,
      default: false
    },
    groups: {
      type: Object,
      default: () => { }
    },
    toolTipFunc: {
      type: Function,
      default: (params) => {
        return params.name + ': ' + params.value
      }
    }
  },
  data() {
    return {
      network: null,
      nodes: null,
      edges: null
    }
  },
  mounted() {
    // const that = this
    // window.onresize = () => {
    //   return (() => {
    //     window.screenHeight = document.body.clientHeight
    //     that.screenHeight = window.screenHeight
    //   })()
    // }
  },
  methods: {
    reset() {
      if (this.network !== null) {
        this.network.destroy()
        this.network = null
      }
    },

    reload(val) {
      this.reset()

      const that = this

      // create an array with nodes
      this.nodes = new vis.DataSet()

      // create an array with edges
      this.edges = new vis.DataSet()

      const nodes = val.nodes.map((node, index) => {
        const r = {
          label: node.label,
          id: node.name,
          group: node.group,
          title: that.toolTipFunc(node)
        }
        if (node.sponsor) {
          r.shape = 'star'
          r.borderWidth = 2
          // r.borderWidthSelected = 4
          r.font = { size: 15 }
          // r.shapeProperties = { borderDashes: [2, 2] }
          r.size = 30
        } else {
          r.shape = 'box'
        }
        return r
      })

      const edges = val.edges.map((edge) => {
        return {
          from: edge.source,
          to: edge.target,
          arrows: {
            to: { enabled: true, scaleFactor: 1 }
          }
        }
      })

      this.nodes.add(nodes)
      this.edges.add(edges)

      // create a network
      var container = document.querySelector('#visualization')

      // provide the data in the vis format
      var data = {
        nodes: this.nodes,
        edges: this.edges
      }
      var options = {
        groups: this.groups,
        interaction: { hover: true },
        physics: {
          forceAtlas2Based: {
            gravitationalConstant: -26,
            centralGravity: 0.005,
            springLength: 200,
            springConstant: 0.18
          },
          maxVelocity: 146,
          solver: 'forceAtlas2Based',
          timestep: 0.35,
          stabilization: {
            enabled: true,
            iterations: 2000,
            updateInterval: 25
          }
        }
      }

      // initialize your network!
      this.network = new vis.Network(container, data, options)

      this.network.on('click', (params) => {
        that.$emit('nodeClick', params)
      })

      if (this.loadingBar) {
        // 开始布局调整
        this.network.on('startStabilizing', () => {
          that.$emit('startStabilizing')
        })

        // 布局调整进度
        this.network.on('stabilizationProgress', (params) => {
          that.$emit('stabilizationProgress', params)
        })

        // 布局调整结束
        this.network.on('stabilizationIterationsDone', () => {
          that.$emit('stabilizationIterationsDone')
        })

        // 布局终止
        this.network.on('stabilized', (params) => {
          that.$emit('stabilized', params)
        })
      }
    }
  }
}
</script>
