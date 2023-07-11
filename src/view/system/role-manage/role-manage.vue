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
              @on-delete="handleDeleteRole"
              @on-edit="handleEditRole">
        <div slot="operation">
          <Tooltip style="margin-right:10px"
                   content="新增角色"
                   placement="top">
            <Button shape="circle"
                    type="success"
                    icon="ios-add"
                    @click="handleAddRole" />
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
    <Modal v-model="addRoleModal"
           title="增加角色">
      <div slot="footer">
        <Button type="text"
                size="large"
                @click="addRoleCancel">取消</Button>
        <Button type="primary"
                size="large"
                @click="addRoleOk">确定</Button>
      </div>
      <add-role ref="addRole" />
    </Modal>

    <Modal v-model="editRoleModal"
           title="编辑角色">
      <div slot="footer">
        <Button type="text"
                size="large"
                @click="editRoleCancel">取消</Button>
        <Button type="primary"
                size="large"
                @click="editRoleOk">确定</Button>
      </div>
      <edit-role ref="editRole"
                 :role-info="roleInfo" />
    </Modal>
  </div>
</template>

<script>
import Tables from '_c/tables'
import { getRoleListPage, delRole } from '@/api/role-manage'
import AddRole from './add-role'
import EditRole from './edit-role'

export default {
  name: 'RoleManager',
  components: {
    Tables,
    AddRole,
    EditRole
  },
  data() {
    return {
      columns: [
        {
          title: '序号', align: 'center', key: 'roleId',
          render: (h, params) => {
            return h('span', (this.currentPage - 1) * this.pageSize + params.row._index + 1)
          }
        },
        { title: '角色名', align: 'center', key: 'roleName' },
        { title: '角色描述', align: 'center', key: 'roleDesc' },
        {
          title: '账户状态',
          align: 'center',
          key: 'statusDesc',
          render: (h, params) => {
            return h('Tag', params.row.statusDesc)
          }
        },
        {
          title: '操作',
          align: 'center',
          key: 'handle',
          options: ['edit', 'delete']
        }
      ],
      searchcolumns: ['roleName'],
      tableData: [],
      totalNum: 0,
      currentPage: 1,
      pageSize: 10,
      query: {},
      addRoleModal: false,
      editRoleModal: false,
      roleInfo: {}
    }
  },
  mounted() {
    this.updateRoleTableData()
  },
  methods: {
    handleClear(val) {
      if (val === '') {
        this.query = {}
        this.updateRoleTableData()
      }
    },
    handleSearch(val) {
      this.query = val
      this.currentPage = 1
      this.updateRoleTableData()
    },
    handlePageChange(pageNum) {
      this.currentPage = pageNum
      this.updateRoleTableData()
    },
    handlePageSizeChange(pageSize) {
      this.pageSize = pageSize
      this.updateRoleTableData()
    },
    handleDeleteRole(params) {
      const ids = []
      ids.push(params.row.roleId)
      delRole(ids).then(res => {
        if (res) {
          this.$Message.success('删除角色成功')
          this.updateRoleTableData()
        }
      })
    },
    handleEditRole(params) {
      const tmp = {}
      tmp.roleId = params.row.roleId
      tmp.roleName = params.row.roleName
      tmp.roleDesc = params.row.roleDesc
      const permissionIds = params.row.permissions.map(v => {
        return v.permissionId
      })
      tmp.permissions = permissionIds
      this.roleInfo = tmp
      this.editRoleModal = true
    },
    editRoleOk() {
      this.$refs.editRole.editRoleOk().then(() => {
        this.updateRoleTableData()
        this.editRoleModal = false
      })
    },
    editRoleCancel() {
      this.$refs.editRole.reset()
      this.editRoleModal = false
    },
    handleAddRole() {
      this.$refs.addRole.reset()
      this.addRoleModal = true
    },
    addRoleOk() {
      this.$refs.addRole.addRoleOk().then(() => {
        this.updateRoleTableData()
        this.addRoleModal = false
      })
    },
    addRoleCancel() {
      this.$refs.addRole.reset()
      this.addRoleModal = false
    },
    updateRoleTableData() {
      getRoleListPage(this.currentPage, this.pageSize, this.query).then(res => {
        if (res) {
          this.tableData = res.data.records
          this.totalNum = res.data.total
        }
      })
    }
  }
}
</script>
