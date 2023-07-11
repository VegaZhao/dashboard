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
              @on-clear="handleClear"
              @on-delete="handleDeletePermission"
              @on-edit="handleEditPermission">
        <div slot="operation">
          <Tooltip style="margin-right:10px"
                   content="新增权限"
                   placement="top">
            <Button shape="circle"
                    type="success"
                    icon="ios-add"
                    @click="handleAddPermission" />
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
    <Modal v-model="addPermissionModal"
           title="增加权限">
      <div slot="footer">
        <Button type="text"
                size="large"
                @click="addPermissionCancel">取消</Button>
        <Button type="primary"
                size="large"
                @click="addPermissionOk">确定</Button>
      </div>
      <add-permission ref="addPermission" />
    </Modal>

    <Modal v-model="editPermissionModal"
           title="编辑权限">
      <div slot="footer">
        <Button type="text"
                size="large"
                @click="editPermissionCancel">取消</Button>
        <Button type="primary"
                size="large"
                @click="editPermissionOk">确定</Button>
      </div>
      <edit-permission ref="editPermission"
                       :permission-info="permissionInfo" />
    </Modal>
  </div>
</template>

<script>
import Tables from '_c/tables'
import { getPermissionListPage, delPermission } from '@/api/permission-manage'
import AddPermission from './add-permission'
import EditPermission from './edit-permission'

export default {
  name: 'PermissionManager',
  components: {
    Tables,
    AddPermission,
    EditPermission
  },
  data() {
    return {
      columns: [
        {
          title: '序号', align: 'center', key: 'permissionId',
          render: (h, params) => {
            return h('span', (this.currentPage - 1) * this.pageSize + params.row._index + 1)
          }
        },
        { title: '权限名称', align: 'center', key: 'permissionName' },
        { title: '角色代码', align: 'center', key: 'permissionCode' },
        { title: '操作名称', align: 'center', key: 'actionName' },
        { title: '操作代码', align: 'center', key: 'actionCode' },
        {
          title: '操作',
          align: 'center',
          key: 'handle',
          options: ['edit', 'delete']
        }
      ],
      searchcolumns: ['permissionName', 'actionName'],
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
    handleDeletePermission(params) {
      const ids = []
      ids.push(params.row.permissionId)
      delPermission(ids).then(res => {
        if (res) {
          this.$Message.success('删除权限成功')
          this.updateTableData()
        }
      })
    },
    handleEditPermission(params) {
      const tmp = {}
      tmp.permissionId = params.row.permissionId
      tmp.permissionName = params.row.permissionName
      tmp.permissionCode = params.row.permissionCode
      tmp.actionName = params.row.actionName
      tmp.actionCode = params.row.actionCode
      this.permissionInfo = tmp
      this.editPermissionModal = true
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
      getPermissionListPage(this.currentPage, this.pageSize, this.query).then(res => {
        if (res) {
          this.tableData = res.data.records
          this.totalNum = res.data.total
        }
      })
    }
  }
}
</script>
