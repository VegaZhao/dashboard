<template>
  <div>
    <div v-if="toolbarEnable && toolbarPlace === 'top'">
      <TableToolbar :searchable="searchable"
                    :operation-enable="operationEnable"
                    :columns="insideSearchColumns"
                    @on-clear="handleClear"
                    @on-search="handleSearch">
        <slot slot="operation"
              name="operation" />
      </TableToolbar>
    </div>
    <Table ref="tablesMain"
           :data="insideTableData"
           :columns="insideColumns"
           :stripe="stripe"
           :border="border"
           :show-header="showHeader"
           :width="width"
           :height="height"
           :loading="loading"
           :disabled-hover="disabledHover"
           :highlight-row="highlightRow"
           :row-class-name="rowClassName"
           :size="size"
           :no-data-text="noDataText"
           :no-filtered-data-text="noFilteredDataText"
           @on-current-change="onCurrentChange"
           @on-select="onSelect"
           @on-select-cancel="onSelectCancel"
           @on-select-all="onSelectAll"
           @on-selection-change="onSelectionChange"
           @on-sort-change="onSortChange"
           @on-filter-change="onFilterChange"
           @on-row-click="onRowClick"
           @on-row-dblclick="onRowDblclick"
           @on-expand="onExpand">
      <slot slot="header"
            name="header" />
      <slot slot="footer"
            name="footer" />
      <slot slot="loading"
            name="loading" />
    </Table>
    <!-- <div v-if="searchable && searchPlace === 'bottom'" class="search-con search-con-top">
      <Select v-model="searchKey" class="search-col">
        <Option v-for="item in columns" v-if="item.key !== 'handle'" :value="item.key" :key="`search-col-${item.key}`">{{ item.title }}</Option>
      </Select>
      <Input placeholder="输入关键字搜索" class="search-input" v-model="searchValue"/>
      <Button class="search-btn" type="primary"><Icon type="search"/>&nbsp;&nbsp;搜索</Button>
    </div> -->
    <a id="hrefToExportTable"
       style="display: none;width: 0px;height: 0px;" />
  </div>
</template>

<script>
import TablesEdit from './edit.vue'
import handleBtns from './handle-btns'
import TableToolbar from './toolbar.vue'
import './index.less'
export default {
  name: 'Tables',
  components: {
    TableToolbar
  },
  props: {
    value: {
      type: Array,
      default() {
        return []
      }
    },
    /**
     * @description 是否创建toolbar
     */
    toolbarEnable: {
      type: Boolean,
      default: false
    },
    /**
     * @description 搜索控件所在位置，'top' / 'bottom'
     */
    toolbarPlace: {
      type: String,
      default: 'top'
    },
    columns: {
      type: Array,
      default() {
        return []
      }
    },
    /**
     *@description 用于查找的列，key字段
     */
    searchcolumns: {
      type: Array,
      default() {
        return []
      }
    },
    size: {
      type: String,
      default: 'default'
    },
    width: {
      type: Number | String,
      default: 0
    },
    height: {
      type: Number | String,
      default: 0
    },
    stripe: {
      type: Boolean,
      default: false
    },
    border: {
      type: Boolean,
      default: false
    },
    showHeader: {
      type: Boolean,
      default: true
    },
    highlightRow: {
      type: Boolean,
      default: false
    },
    rowClassName: {
      type: Function,
      default() {
        return ''
      }
    },
    context: {
      type: Object,
      default: null
    },
    noDataText: {
      type: String,
      default: ''
    },
    noFilteredDataText: {
      type: String,
      default: ''
    },
    disabledHover: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    /**
     * @description 全局设置是否可编辑
     */
    editable: {
      type: Boolean,
      default: false
    },
    /**
     * @description 是否可搜索
     */
    searchable: {
      type: Boolean,
      default: false
    },
    /**
     * @description  是否有工具栏
     */
    operationEnable: {
      type: Boolean,
      default: false
    }
  },
  /**
   * Events
   * @on-start-edit 返回值 {Object} ：同iview中render函数中的params对象 { row, index, column }
   * @on-cancel-edit 返回值 {Object} 同上
   * @on-save-edit 返回值 {Object} ：除上面三个参数外，还有一个value: 修改后的数据
   */
  data() {
    return {
      insideColumns: [],
      insideTableData: [],
      insideSearchColumns: [],
      edittingCellId: '',
      edittingText: '',
      searchValue: '',
      searchKey: ''
    }
  },
  watch: {
    columns(columns) {
      this.handleColumns(columns)
      this.handleSearchColumns(this.searchcolumns)
    },
    value(val) {
      this.handleTableData()
      this.handleSearch()
    },
    searchcolumns(val) {
      this.handleSearchColumns(val)
    }
  },
  mounted() {
    this.handleColumns(this.columns)
    this.handleSearchColumns(this.searchcolumns)
    this.handleTableData()
  },
  methods: {
    suportEdit(item, index) {
      item.render = (h, params) => {
        return h(TablesEdit, {
          props: {
            params: params,
            value: this.insideTableData[params.index][params.column.key],
            edittingCellId: this.edittingCellId,
            editable: this.editable
          },
          on: {
            'input': val => {
              this.edittingText = val
            },
            'on-start-edit': (params) => {
              this.edittingCellId = `editting-${params.index}-${params.column.key}`
              this.$emit('on-start-edit', params)
            },
            'on-cancel-edit': (params) => {
              this.edittingCellId = ''
              this.$emit('on-cancel-edit', params)
            },
            'on-save-edit': (params) => {
              this.value[params.index][params.column.key] = this.edittingText
              this.$emit('input', this.value)
              this.$emit('on-save-edit', Object.assign(params, { value: this.edittingText }))
              this.edittingCellId = ''
            }
          }
        })
      }
      return item
    },
    surportHandle(item) {
      const options = item.options || []
      const insideBtns = []
      options.forEach(item => {
        if (handleBtns[item]) insideBtns.push(handleBtns[item])
      })
      const btns = item.button ? [].concat(insideBtns, item.button) : insideBtns
      item.render = (h, params) => {
        params.tableData = this.value
        return h('div', btns.map(item => item(h, params, this)))
      }
      return item
    },
    handleColumns(columns) {
      this.insideColumns = columns.map((item, index) => {
        let res = item
        if (res.editable) res = this.suportEdit(res, index)
        if (res.key === 'handle') res = this.surportHandle(res)
        return res
      })
    },
    handleSearchColumns(searchcolumns) {
      this.insideSearchColumns = this.columns.filter((item, index) => {
        const res = item
        if (res.key !== 'handle' && searchcolumns.indexOf(res.key) >= 0) { return true }
        return false
      })
    },
    handleClear(val) {
      this.$emit('on-clear', val)
    },
    handleSearch(val) {
      if (!val) return
      this.$emit('on-search', val)
    },
    handleTableData() {
      this.insideTableData = this.value.map((item, index) => {
        const res = item
        res.initRowIndex = index
        return res
      })
    },
    exportCsv(params) {
      this.$refs.tablesMain.exportCsv(params)
    },
    clearCurrentRow() {
      this.$refs.talbesMain.clearCurrentRow()
    },
    onCurrentChange(currentRow, oldCurrentRow) {
      this.$emit('on-current-change', currentRow, oldCurrentRow)
    },
    onSelect(selection, row) {
      this.$emit('on-select', selection, row)
    },
    onSelectCancel(selection, row) {
      this.$emit('on-select-cancel', selection, row)
    },
    onSelectAll(selection) {
      this.$emit('on-select-all', selection)
    },
    onSelectionChange(selection) {
      this.$emit('on-selection-change', selection)
    },
    onSortChange(column, key, order) {
      this.$emit('on-sort-change', column, key, order)
    },
    onFilterChange(row) {
      this.$emit('on-filter-change', row)
    },
    onRowClick(row, index) {
      this.$emit('on-row-click', row, index)
    },
    onRowDblclick(row, index) {
      this.$emit('on-row-dblclick', row, index)
    },
    onExpand(row, status) {
      this.$emit('on-expand', row, status)
    }
  }
}
</script>
