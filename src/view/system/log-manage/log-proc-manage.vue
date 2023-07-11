<template>
  <div>
    <Card>
      <tables ref="tables"
              v-model="tableData"
              :columns="columns"
              :searchcolumns="searchcolumns"
              toolbar-enable
              searchable
              editable
              operation-enable
              stripe
              toolbar-place="top"
              @on-search="handleSearch"
              @on-clear="handleClear">
        <div slot="operation">
          <Tooltip style="margin-right:10px"
                   content="调用存储过程"
                   placement="top">
            <Button shape="circle"
                    type="success"
                    icon="ios-add"
                    @click="handleCallProc" />
          </Tooltip>
        </div>
        <div slot="footer"
             style="float: right;margin-right:10px">
          <Page :total="totalNum"
                :current="currentPage"
                :page-size="pageSize"
                :transfer="true"
                show-elevator
                show-sizer
                show-total
                @on-change="handlePageChange"
                @on-page-size-change="handlePageSizeChange" />
        </div>
      </tables>
    </Card>
  </div>
</template>

<script>
import Tables from '_c/tables'
import { getLogProcListPage } from '@/api/log-proc-manage'
import { getDate } from '@/libs/tools'

export default {
  name: 'LogProcManager',
  components: {
    Tables
  },
  data() {
    return {
      columns: [
        {
          title: '序号', align: 'center', key: 'logId',
          render: (h, params) => {
            return h('span', (this.currentPage - 1) * this.pageSize + params.row._index + 1)
          }
        },
        { title: '日志信息', align: 'center', key: 'logInfo' },
        { title: '存储过程', align: 'center', key: 'procName' },
        {
          key: 'logTime',
          render: (h, params) => {
            return h('span', getDate(params.row.updateTime / 1000, 'year'))
          }
        }
      ],
      searchcolumns: ['procName'],
      tableData: [],
      query: {},
      totalNum: 0,
      currentPage: 1,
      pageSize: 10,
      addPermissionModal: false,
      editPermissionModal: false,
      permissionInfo: {}
    }
  },
  mounted() {
    this.updateTableData()
  },
  methods: {
    handleClear(val) {
      if (val === '') {
        this.query = {}
        this.updateTableData()
      }
    },
    handleSearch(val) {
      this.query = val
      this.currentPage = 1
      this.updateTableData()
    },
    handlePageChange(pageNum) {
      this.currentPage = pageNum
      this.updateTableData()
    },
    handlePageSizeChange(pageSize) {
      this.pageSize = pageSize
      this.updateTableData()
    },
    editPermissionOk() {
      this.$refs.editPermission.editPermissionOk().then(() => {
        this.updateTableData()
        this.editPermissionModal = false
      })
    },
    editPermissionCancel() {
      this.$refs.editPermission.reset()
      this.editPermissionModal = false
    },
    handleAddPermission() {
      this.$refs.addPermission.reset()
      this.addPermissionModal = true
    },
    addPermissionOk() {
      this.$refs.addPermission.addPermissionOk().then(() => {
        this.updateTableData()
        this.addPermissionModal = false
      })
    },
    addPermissionCancel() {
      this.$refs.addPermission.reset()
      this.addPermissionModal = false
    },
    updateTableData() {
      getLogProcListPage(this.currentPage, this.pageSize, this.query).then(res => {
        if (res) {
          this.tableData = res.data.records
          this.totalNum = res.data.total
        }
      })
    }
  }
}
</script>
