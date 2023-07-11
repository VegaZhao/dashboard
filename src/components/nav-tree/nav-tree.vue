<template>
  <div>
    <Input v-if="searchInput"
           :placeholder="placeholder"
           v-model="searchValue"
           style="margin-bottom:10px"
           clearable
           @on-change="onChange"></Input>
    <tree :setting="setting"
          :nodes="nodes"
          @onClick="onClick"
          @onDblClick="onDblClick"
          @onCreated="onCreated"
          @onExpand="onExpand" />
  </div>
</template>

<script>
import tree from 'vue-giant-tree'

export default {
  name: 'NavTree',
  components: {
    tree
  },
  props: {
    searchInput: {
      type: Boolean,
      default: true
    },
    aysncUrl: {
      type: String,
      default: ''
    },
    nodes: {
      type: Array,
      default: () => { return [] }
    },
    treeDataFilter: {
      type: Function,
      default: null
    },
    viewAddDiyDom: {
      type: Function,
      default: null
    },
    diyDombtn: {
      type: Array,
      default: () => ['add', 'edit', 'del'] // add edit del
    }
  },
  data() {
    return {
      ztreeObj: null,
      selectedNode: null,
      searchValue: '',
      selectedNodeChildren: [],
      setting: {
        check: {
          enable: false
        },
        async: {
          autoParam: ['id'],
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'X-Requested-With': 'XMLHttpRequest' // 跨域
            // 'X-URL-PATH': location.pathname
          },
          contentType: 'application/json',
          xhrFields: {
            withCredentials: true // 携带凭证
          },
          dataFilter: this.treeDataFilter,
          enable: true,
          type: 'post',
          dataType: 'json',
          url: this.aysncUrl
        },
        data: {
          simpleData: {
            enable: true,
            pIdKey: 'pid'
          }
        },
        view: {
          showIcon: false,
          addDiyDom: this.viewAddDiyDom || this.addDiyDom
        }
      }
    }
  },
  computed: {
    placeholder() {
      if (this.selectedNode !== null) {
        return '在 [' + this.selectedNode.name + '] 范围内搜索'
      }
      return ''
    }
  },
  methods: {
    onClick(event, treeId, treeNode) {
      this.selectedNode = treeNode
      this.$emit('on-click', { event, treeId, treeNode })
      // if (treeNode.isParent) {
      //   this.ztreeObj.reAsyncChildNodesPromise(treeNode, 'refresh').then(() => {
      //     this.selectedNodeChildren = this.ztreeObj.transformToArray(this.selectedNode.children)
      //   })
      // }
    },
    onDblClick(event, treeId, treeNode) {
      this.selectedNode = treeNode
      this.$emit('on-dbl-click', { event, treeId, treeNode })
    },
    onExpand(event, treeId, treeNode) {
      this.$emit('on-expand', { event, treeId, treeNode })
    },
    onCreated(ztreeObj) {
      this.ztreeObj = ztreeObj
      // 选中第一个节点
      if (ztreeObj.getNodes().length > 0) {
        ztreeObj.selectNode(ztreeObj.getNodes()[0])
        this.selectedNode = ztreeObj.getNodes()[0]
        this.ztreeObj.reAsyncChildNodesPromise(this.selectedNode, 'refresh').then(() => {
          this.selectedNodeChildren = this.ztreeObj.transformToArray(this.selectedNode.children)
        })
      }
    },
    onChange(event) {
      if (this.searchValue === undefined || this.searchValue === '') {
        this.ztreeObj.reAsyncChildNodesPromise(this.selectedNode, 'refresh')
      } else {
        this.ztreeObj.removeChildNodes(this.selectedNode)
        this.ztreeObj.addNodes(this.selectedNode, this.searchChildren())
      }
    },
    refrshNodeChildren(treeNode) {
      this.ztreeObj.reAsyncChildNodesPromise(treeNode, 'refresh').then(() => {
        this.selectedNodeChildren = this.ztreeObj.transformToArray(treeNode.children)
      })
    },
    refrshNode(treeNode) {
      this.ztreeObj.reAsyncChildNodesPromise(treeNode, 'refresh').then(() => {
        this.ztreeObj.updateNode(treeNode)
      })
    },
    addDiyDom(treeId, treeNode) {
      const item = document.getElementById(`${treeNode.tId}_a`)
      if (item && !item.querySelector('.tree_extra_btn_group')) {
        const btnGroup = document.createElement('span')
        btnGroup.classList.add('tree_extra_btn_group')
        item.appendChild(btnGroup)

        if (treeNode.operates && treeNode.operates.indexOf('add') >= 0) {
          const btnAdd = document.createElement('span')
          btnAdd.id = `${treeId}_${treeNode.id}_add_btn`
          btnAdd.classList.add('tree_extra_btn')
          btnAdd.innerText = '新增'
          btnAdd.addEventListener('click', (e) => {
            e.stopPropagation()
            this.$emit('on-add-extra-btn', { treeId, treeNode, e })
            // this.clickRemove(treeNode)
          })
          btnGroup.appendChild(btnAdd)
        }
        if (treeNode.operates && treeNode.operates.indexOf('edit') >= 0) {
          const btnEdit = document.createElement('span')
          btnEdit.id = `${treeId}_${treeNode.id}_edit_btn`
          btnEdit.classList.add('tree_extra_btn')
          btnEdit.innerText = '编辑'
          btnEdit.addEventListener('click', (e) => {
            e.stopPropagation()
            this.$emit('on-edit-extra-btn', { treeId, treeNode, e })
            // this.clickRemove(treeNode)
          })
          btnGroup.appendChild(btnEdit)
        }
        if (treeNode.pid !== null && treeNode.operates && treeNode.operates.indexOf('del') >= 0) {
          const btnDel = document.createElement('span')
          btnDel.id = `${treeId}_${treeNode.id}_del_btn`
          btnDel.classList.add('tree_extra_btn')
          btnDel.innerText = '删除'
          btnDel.addEventListener('click', (e) => {
            e.stopPropagation()
            this.$emit('on-del-extra-btn', { treeId, treeNode, e })
            // this.clickRemove(treeNode)
          })
          btnGroup.appendChild(btnDel)
        }
      }
    },
    searchChildren() {
      return this.selectedNodeChildren.filter((item, i) => {
        if (item.name.toLowerCase().indexOf(this.searchValue.toLowerCase()) !== -1) return item
      })
    }
  }
}
</script>

<style lang="less">
@import "./index.less";
</style>
